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
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :columns="tableOptions.columns"
    :empty="tableOptions.empty"
    :download-button="tableOptions.downloadButton"
    :stored-table-settings="storedTableSettings"
    :addButton="tableOptions.addButton"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    @editAction="handleEdit"
    @revokeAction="handleRevoke"
    @addNewSCIMSetting="handleAddNewSCIM"
    @onEmptyBtnClicked="handleAddNewSCIM"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForData"
    @downloadEvent="exportSCIMSettingsList"
    @set-default-search="handleSetDefaultSearch"
    @restore-default-search="handleRestoreDefaultSearch"
    @clear-filters="handleClearFilters"
    @on-table-settings-change="handleSetRenderedColumns"
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
import { getDefaultAxiosPayload, getDefaultFilter } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
import { exportSCIMSettings, searchSCIMSettings } from '@/api/scimSettings'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'SCIMSettingsTable',
  components: { DataTable },
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  mixins: [useLoading],
  data() {
    return {
      tableData: [],
      storedTableSettings: null,
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
        isColumnFilterActive: false,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        downloadButton: {
          show: true,
          disabled: !this.PERMISSIONS.EXPORT.hasPermission
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--scim-settings-row-actions',
            disabled: !this.PERMISSIONS.UPDATE.hasPermission
          },
          {
            name: labels.Revoke,
            icon: 'mdi-minus-circle-outline',
            id: 'btn-revoke--scim-settings-row-actions',
            action: 'revokeAction',
            disabled: !this.PERMISSIONS.REVOKE.hasPermission
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--scim-settings-row-actions',
            disabled: !this.PERMISSIONS.DELETE.hasPermission
          }
        ],
        empty: {
          message: labels.EmptySCIMSettings,
          subMes: labels.EmptySCIMSettingsSub,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--scim-settings',
          disabled: !this.PERMISSIONS.CREATE.hasPermission
        },
        addButton: {
          show: true,
          action: 'addNewSCIMSetting',
          tooltip: 'Add SCIM Setting',
          id: 'btn-add--scim-settings',
          disabled: !this.PERMISSIONS.CREATE.hasPermission
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      defaultAxiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.getStoredTableSettings()
    this.setDefaultFilter()
    this.callForData()
  },
  methods: {
    callForData() {
      const { SEARCH } = this.PERMISSIONS
      if (!SEARCH.hasPermission) return
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
    handleRevoke(row = {}) {
      this.$emit('on-revoke', row)
    },
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.SCIM_SETTINGS_TABLE)
      )
    },
    handleAddNewSCIM() {
      this.$emit('on-add')
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
    checkIsColumnFilterActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.axiosPayload)
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      this.axiosPayload.filter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.SCIM_SETTINGS,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.SCIM_SETTINGS)
      )
      if (!savedFilter || !savedFilter.filter.FilterGroups[0].FilterItems.length) return
      const {
        filter = JSON.parse(JSON.stringify(getDefaultFilter().filter)),
        filterValues
      } = savedFilter
      this.axiosPayload.filter = filter
      this.tableOptions.isColumnFilterActive = true
      this.$nextTick(() => {
        this.$refs.refTable.reRenderColumns(filterValues)
      })
    },
    handleRestoreDefaultSearch() {
      this.getDefaultFilterAndSearch()
      this.callForData()
    },
    handleClearFilters() {
      this.axiosPayload = getDefaultAxiosPayload()
      this.$refs.refTable.reRenderColumns({})
      this.callForData()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SCIM_SETTINGS_TABLE, JSON.stringify(tableSettings))
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.axiosPayload.orderBy = prop
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
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
      this.checkIsColumnFilterActive()
      this.callForData()
    },
    exportSCIMSettingsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const { EXPORT } = this.PERMISSIONS
      if (!EXPORT.hasPermission) return
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
          link.href = window.URL.createObjectURL(data)
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
