<template>
  <div class="saml-settings">
    <company-settings-header
      :title="labels.SamlSettings"
      :sub-title="labels.SamlSettingsSubHeader"
    />
    <delete-saml-settings
      v-if="isDeletePopupOpen"
      :status="isDeletePopupOpen"
      :selected-row="selectedRow"
      @on-close="toggleDeletePopupStatus"
      @on-delete="handleOnDelete"
    />
    <new-saml-settings
      v-if="isEditOrNewModalOpen"
      :status="isEditOrNewModalOpen"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleNewSamlSettingsModalStatus(false)"
      @on-success="handleEditOrNewFormSuccess"
    />
    <div class="smtp-settings__container">
      <data-table
        id="company-settings-saml-settings-data-table"
        ref="refSamlSettings"
        refName="samlSettingsList"
        filterable
        options
        selectable
        sizeable
        resizable
        is-server-side
        :loading="loading"
        :table="tableData"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :stored-table-settings="storedTableSettings"
        :addButton="tableOptions.addButton"
        :select-event="tableOptions.selectEvent"
        :row-actions="tableOptions.rowActions"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @addNewSamlSetting="toggleNewSamlSettingsModalStatus(false)"
        @deleteAction="toggleDeletePopupStatus"
        @editAction="handleEditAction"
        @onEmptyBtnClicked="toggleNewSamlSettingsModalStatus(false)"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSamlSettings"
        @downloadEvent="exportSamlSettings"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @on-table-settings-change="handleSetRenderedColumns"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
      >
      </data-table>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import { deleteSamlSettings, exportSamlSettings, searchSamlSettings } from '@/api/samlSettings'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import QueryHelperForTable from '@/helper-classes/query-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  columnFilterChanged,
  columnFilterCleared,
  downloadExportedFile
} from '@/utils/helperFunctions'
import DeleteSamlSettings from '@/components/Company Settings/SAML/DeleteSamlSettings'
import NewSamlSettings from '@/components/Company Settings/SAML/NewSamlSettings'
export default {
  name: 'SamlSettings',
  components: { NewSamlSettings, DeleteSamlSettings, CompanySettingsHeader, DataTable },
  data() {
    return {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      defaultAxiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      labels,
      isEditOrNewModalOpen: false,
      isEdit: false,
      isDeletePopupOpen: false,
      loading: false,
      selectedRow: {},
      tableData: [],
      storedTableSettings: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: labels.SamlName,
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text'
          },
          {
            property: 'statusName',
            align: 'center',
            editable: false,
            label: labels.SSOEnabled,
            fixed: false,
            sortable: true,
            show: true,
            width: 180,
            type: 'badge',
            filterableType: 'select',
            filterableItems: [
              { text: 'Inactive', value: 'Inactive' },
              { text: 'Active', value: 'Active' }
            ],
            filterableCustomFieldName: 'status'
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Added',
            width: 180,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          }
        ],
        isColumnFilterActive: false,
        addButton: {
          show: true,
          action: 'addNewSamlSetting',
          tooltip: labels.SamlAddButtonTooltip,
          id: 'btn-add--saml-settings'
        },
        empty: {
          message: labels.EmptySamlTable,
          subMes: labels.EmptySamlTableSub,
          btn: labels.EmptySamlTableButton,
          icon: 'mdi-plus',
          id: 'btn-empty--saml-settings'
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--saml-settings-row-actions'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--saml-settings-row-actions'
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      }
    }
  },
  created() {
    this.setStoredTableSettings()
    this.setQueryValues()
    this.getDefaultFilterAndSearch()
    this.callForSamlSettings()
  },
  methods: {
    callForSamlSettings() {
      this.loading = true
      searchSamlSettings(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(() => (this.loading = false))
    },
    columnFilterChanged(filter = {}) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForSamlSettings()
    },
    columnFilterCleared(fieldName = '') {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
      this.callForSamlSettings()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForSamlSettings()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForSamlSettings()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop.toLowerCase() === 'statusname' ? 'StatusId' : prop
      this.callForSamlSettings()
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.tableOptions.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      filterItems[1].FieldName = 'Status'
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.callForSamlSettings()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SAML_SETTINGS, JSON.stringify(tableSettings))
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.SAMLSETTINGS)
      )
      if (!savedFilter) {
        return
      }
      const { filter, filterValues } = savedFilter
      this.axiosPayload.filter = filter
      this.tableOptions.isColumnFilterActive = true
      this.$nextTick(() => {
        this.$refs.refSamlSettings.filterValues = filterValues
        this.$refs.refSamlSettings.columnKey = `column-key${Math.random()
          .toString()
          .substring(0, 5)}`
      })
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.SAMLSETTINGS,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.getDefaultFilterAndSearch()
      this.callForSamlSettings()
    },
    handleEditOrNewFormSuccess() {
      this.selectedRow = null
      this.resource = null
      this.callForSamlSettings()
      this.toggleNewSamlSettingsModalStatus()
    },
    handleClearFilters() {
      this.axiosPayload = JSON.parse(JSON.stringify(this.defaultAxiosPayload))
      this.$refs.refSamlSettings.filterValues = {}
      this.$refs.refSamlSettings.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.SAMLSETTINGS)
      this.callForSamlSettings()
    },
    setStoredTableSettings() {
      this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.SAML_SETTINGS))
    },
    setQueryValues() {
      this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
      this.queryHelper.setDefaultValues()
      this.queryHelper.controlRouteQuery()
      const { page, size } = this.queryHelper.returnQueryValues()
      this.axiosPayload.pageSize = size
      this.serverSideProps.pageSize = size
      this.axiosPayload.pageNumber = page
    },
    handleEditAction(row = {}) {
      this.selectedRow = row
      this.toggleNewSamlSettingsModalStatus(true)
    },
    toggleNewSamlSettingsModalStatus(isEdit = false) {
      this.isEdit = isEdit
      this.isEditOrNewModalOpen = !this.isEditOrNewModalOpen
    },
    exportSamlSettings(downloadTypes = {}) {
      downloadTypes.exportTypes.forEach((exportType) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportSamlSettings(payload).then((response) => {
          const { data } = response
          downloadExportedFile(data, 'SAML Settings', exportType)
        })
      })
    },
    toggleDeletePopupStatus(row = null) {
      this.selectedRow = row
      this.isDeletePopupOpen = !this.isDeletePopupOpen
    },
    handleOnDelete(selectedRow = {}) {
      this.$refs.refSamlSettings.unSelectRow(selectedRow)
      this.callForSamlSettings()
    }
  }
}
</script>

<style lang="scss"></style>
