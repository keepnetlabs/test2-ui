<template>
  <DataTable
    id="siem-integrations-data-table"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :loading="isLoading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.empty"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :addButton="tableOptions.addButton"
    :stored-table-settings="storedTableSettings"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :download-button="tableOptions.downloadButton"
    @deleteAction="handleDeleteRowClick"
    @handleEdit="handleEdit"
    @onEmptyBtnClicked="toggleAddOrEditModal"
    @addAction="toggleAddOrEditModal"
    @downloadEvent="exportIntegrationList"
    @handlePaginationChange="handlePaginationChange"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForData"
    @set-default-search="handleSetDefaultSearch"
    @restore-default-search="handleRestoreDefaultSearch"
    @clear-filters="handleClearFilters"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @on-table-settings-change="handleSetRenderedColumns"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload, getDefaultFilter } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { useLoading } from '@/hooks/useLoading'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
import { exportSIEMIntegrations, searchSIEMIntegrations } from '@/api/siemIntegrations'
export default {
  name: 'SIEMIntegrationsTable',
  components: { DataTable },
  mixins: [useLoading],
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      tableData: [],
      storedTableSettings: null,
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: labels.SIEMSettingName,
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
            property: 'apiUrl',
            align: 'left',
            editable: false,
            label: labels.ApiURL,
            sortable: true,
            show: true,
            type: 'text',
            width: 260,
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
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this?.PERMISSIONS?.update
          },
          {
            name: labels.Delete,
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
          message: LABEL_STORE.NO_INTEGRATIONS,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--siem-integrations',
          disabled: !this?.PERMISSIONS?.create
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add an integration',
          id: 'btn-add--integrations',
          disabled: !this?.PERMISSIONS?.create
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      defaultAxiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.SIEMIntegration))
    this.setDefaultFilter()
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
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.SIEM_INTEGRATION)
      )
      if (!savedFilter || !savedFilter.filter.FilterGroups[0].FilterItems.length) return
      const {
        filter = JSON.parse(JSON.stringify(getDefaultFilter().filter)),
        filterValues
      } = savedFilter
      this.axiosPayload.filter = filter
      this.tableOptions.isColumnFilterActive = true
      this.$nextTick(() => {
        this?.$refs?.refTable?.reRenderColumns(filterValues)
      })
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SIEMIntegration, JSON.stringify(tableSettings))
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })

      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive =
        this.axiosPayload?.filter?.FilterGroups[0]?.FilterItems?.length >= 1 || columnFilterActive

      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    handleClearFilters() {
      this.axiosPayload = JSON.parse(JSON.stringify(this.defaultAxiosPayload))
      this.$refs.refTable.reRenderColumns({})
      this.callForData()
    },
    handleRestoreDefaultSearch() {
      this.setDefaultFilter()
      this.callForData()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.SIEM_INTEGRATION,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    handleSortChange({ prop, order }) {
      this.axiosPayload = { ...this.axiosPayload, orderBy: prop, ascending: order === 'ascending' }
      this.callForData()
    },
    handlePaginationChange({ pageSize, pageNumber }) {
      this.axiosPayload = {
        ...this.axiosPayload,
        pageSize: pageSize,
        pageNumber: pageNumber
      }
      this.callForData()
    },
    handleDeleteRowClick(row) {
      this.$emit('on-delete', row)
    },
    handleEdit(row) {
      this.$emit('on-open-add-or-edit-modal', row)
    },
    checkIfCanCloseNewIntegrationModal() {
      if (this.$refs.newIntegration) {
        this.$refs.newIntegration.closeOverlay()
      }
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
          link.href = window.URL.createObjectURL(data)
          link.download = `SIEM-Integrations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.calculateIsFilterColumnActive()
      this.callForData()
    },
    calculateIsFilterColumnActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.axiosPayload)
    }
  }
}
</script>
