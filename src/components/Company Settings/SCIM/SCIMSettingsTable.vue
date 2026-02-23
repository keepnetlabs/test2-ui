<template>
  <DataTable
    id="company-settings-scim-settings-data-table"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.empty"
    :download-button="tableOptions.downloadButton"
    :addButton="tableOptions.addButton"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @editAction="handleEdit"
    @deleteAction="handleDelete"
    @revokeAction="handleRevoke"
    @addNewSCIMSetting="handleAddNewSCIM"
    @onEmptyBtnClicked="handleAddNewSCIM"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForData"
    @downloadEvent="exportSCIMSettingsList"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { exportSCIMSettings, searchSCIMSettings } from '@/api/scimSettings'
import { useLoading } from '@/hooks/useLoading'
import { mapGetters } from 'vuex'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'SCIMSettingsTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      tableData: [],
      isEdit: false,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'SCIM Name',
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'groupName',
            align: 'left',
            editable: false,
            label: 'Group Name',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 180
          },
          {
            property: 'groupByCustomFieldName',
            align: 'left',
            editable: false,
            label: 'Group By Field Name',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 200
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: 'right',
            sortable: true,
            show: true,
            filterableType: 'date',
            type: 'text',
            width: 180
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SCIM_SETTINGS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SCIM_SETTINGS_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        downloadButton: {
          show: false
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--scim-settings-row-actions',
            isNotShow: true,
            disabled: !this.$store.getters['permissions/getSCIMSettingsUpdatePermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--scim-settings-row-actions',
            disabled: !this.$store.getters['permissions/getSCIMSettingsDeletePermissions']
          },
          {
            name: labels.Revoke,
            icon: 'mdi-minus-circle-outline',
            id: 'btn-revoke--scim-settings-row-actions',
            action: 'revokeAction',
            disabled: !this.$store.getters['permissions/getSCIMSettingsRevokePermissions']
          }
        ],
        empty: {
          message: labels.EmptySCIMSettings,
          subMes: labels.EmptySCIMSettingsSub,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--scim-settings',
          disabled: !this.$store.getters['permissions/getSCIMSettingsCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'addNewSCIMSetting',
          tooltip: 'Add SCIM Setting',
          id: 'btn-add--scim-settings',
          disabled: !this.$store.getters['permissions/getSCIMSettingsCreatePermissions']
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getSCIMSettingsSearchPermissions: 'permissions/getSCIMSettingsSearchPermissions',
      getSCIMSettingsExportPermissions: 'permissions/getSCIMSettingsExportPermissions'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (!this.getSCIMSettingsSearchPermissions) return
      this.setLoading(true)
      searchSCIMSettings(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    handleEdit(row = {}) {
      this.$emit('on-edit', row)
    },
    handleDelete(row = {}) {
      this.$emit('on-delete', row)
    },
    handleRevoke(row = {}) {
      this.$emit('on-revoke', row)
    },
    handleAddNewSCIM() {
      this.$emit('on-add')
    },
    exportSCIMSettingsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      if (!this.getSCIMSettingsExportPermissions) return
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber,
          pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportSCIMSettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `SCIM Settings.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
