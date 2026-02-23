<template>
  <DataTable
    id="siem-integrations-data-table"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.empty"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :addButton="tableOptions.addButton"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @deleteAction="handleDeleteRowClick"
    @handleEdit="handleEdit"
    @onEmptyBtnClicked="toggleAddOrEditModal"
    @addAction="toggleAddOrEditModal"
    @downloadEvent="exportIntegrationList"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForData"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { useLoading } from '@/hooks/useLoading'
import { exportSIEMIntegrations, searchSIEMIntegrations } from '@/api/siemIntegrations'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'SIEMIntegrationsTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: labels.IntegrationName,
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.TYPENAME,
            align: 'left',
            editable: false,
            label: labels.IntegrationType,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'text'
          },
          {
            property: 'statusName',
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 170,
            hasTooltip: true,
            filterableType: 'select',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SIEM_INTEGRATION,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SIEMIntegration,
        rowActions: [
          {
            name: labels.Edit,
            id: 'btn-edit--siem-integrations-row-actions',
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this?.PERMISSIONS?.update
          },
          {
            name: labels.Delete,
            id: 'btn-delete--siem-integrations-row-actions',
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this?.PERMISSIONS?.delete
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this?.PERMISSIONS?.export
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        empty: {
          message: labels.NoSiemIntegrations,
          subMes: labels.NoSiemIntegrationsSub,
          btn: labels.CreateSiemIntegration,
          icon: 'mdi-plus',
          id: 'btn-empty--siem-integrations',
          disabled: !this?.PERMISSIONS?.create
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add an integration',
          id: 'btn-add--siem-integrations',
          disabled: !this?.PERMISSIONS?.create
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchSIEMIntegrations(this.axiosPayload)
        .then((response) => {
          const {
            data: { data = [] }
          } = response
          const { results = [], totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(this.setLoading)
    },
    toggleAddOrEditModal() {
      this.$emit('on-open-add-or-edit-modal')
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })

      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    handleDeleteRowClick(row) {
      this.$emit('on-delete', row)
    },
    handleEdit(row) {
      this.$emit('on-open-add-or-edit-modal', row)
    },
    exportIntegrationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }

        exportSIEMIntegrations(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `SIEM-Integrations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
