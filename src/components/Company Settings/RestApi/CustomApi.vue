<template>
  <div class="custom-api">
    <div class="custom-apis__container">
      <new-custom-api
        v-if="showNewCustomApi"
        ref="newCustomApi"
        :selectedRow="selectedRow"
        :status="showNewCustomApi"
        @closeOverlay="toggleNewCustomApiStatus"
        @closeOverlayWithUpdate="closeNewCustomApiWithUpdate"
      />
      <delete-custom-api
        v-if="showDeleteCustomApi"
        :selected-row="selectedRow"
        :status="showDeleteCustomApi"
        :save-disable="saveDisableDelete"
        @closeDialog="toggleShowDeleteCustomApi"
        @handleDelete="handleDeleteCustomApi"
      />
      <company-settings-header
        title="Rest API"
        sub-title="Create API Key to your customers for integration"
      />
      <data-table
        id="company-settings-rest-api-data-table"
        ref="refCustomApiList"
        filterable
        options
        selectable
        is-server-side
        :refName="'smtpSettingsList'"
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :row-actions="tableOptions.rowActions"
        :stored-table-settings="storedTableSettings"
        :table="tableData"
        :select-event="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @editAction="handleEdit"
        @downloadEvent="exportRestApi"
        @deleteAction="handleDelete"
        @onEmptyBtnClicked="toggleNewCustomApiStatus"
        @handleAddNewCustomApi="toggleNewCustomApiStatus"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @on-table-settings-change="handleSetRenderedColumns"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import NewCustomApi from '@/components/Company Settings/RestApi/NewCustomApi'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { deleteRestApi, exportRestApi, searchRestApi } from '@/api/restApi'
import DeleteCustomApi from '@/components/Company Settings/RestApi/DeleteCustomApi'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
export default {
  name: 'CustomApi',
  data() {
    return {
      storedTableSettings: null,
      isRestoredOrClearedFilters: false,
      axiosPayload: getDefaultAxiosPayload(),
      defaultAxiosPayload: getDefaultAxiosPayload(),
      loading: false,
      selectedRow: null,
      saveDisableDelete: false,
      showNewCustomApi: false,
      showDeleteCustomApi: false,
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.CLIENTNAME,
            align: 'left',
            editable: false,
            label: labels.ClientName,
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            filterableType: 'text',
            width: 260
          },
          {
            property: PROPERTY_STORE.CLIENTID,
            align: 'left',
            editable: false,
            label: labels.ApiKey,
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 280
          },
          {
            property: PROPERTY_STORE.STATUSNAME,
            align: 'center',
            editable: false,
            label: labels.Status,
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            width: 150,
            filterableType: 'select',
            filterableCustomFieldName: 'StatusId',
            filterableItems: [
              { text: labels.Active, value: '1' },
              { text: labels.InActive, value: '0' }
            ]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: labels.CreateTime,
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'date'
          }
        ],
        pageSizes: [5, 10, 25],
        isColumnFilterActive: false,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            id: 'btn-edit--rest-api-row-actions',
            action: 'editAction'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            id: 'btn-delete--rest-api-row-actions',
            action: 'deleteAction'
          }
        ],
        empty: {
          message: labels.EmptyCustomApiMessage,
          subMes: labels.SubMesCustomApiMessage,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--rest-api'
        },
        addButton: {
          show: true,
          action: 'handleAddNewCustomApi',
          tooltip: labels.NewCustomApiBtnTooltip,
          id: 'btn-add--rest-api'
        }
      },
      serverSideProps: new ServerSideProps()
    }
  },
  components: {
    DeleteCustomApi,
    CompanySettingsHeader,
    DataTable,
    NewCustomApi
  },
  created() {
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.REST_API))
    this.getDefaultFilterAndSearch()
  },
  methods: {
    handleSearchChange(searchFilter = {}) {
      //generic
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'StatusId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.checkIsColumnFilterActive()
      this.callForSearch()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.axiosPayload.pageNumber = pageNumber
      this.callForSearch()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop === 'statusName' ? 'StatusId' : prop
      this.callForSearch()
    },
    resetPageNumber() {
      //generic
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearch()
    },
    callForSearch() {
      this.loading = true
      searchRestApi(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          const { results = [] } = data
          this.tableData = results
        })
        .finally(() => {
          this.loading = false
          this.isRestoredOrClearedFilters = false
        })
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.REST_API, JSON.stringify(tableSettings))
    },
    exportRestApi({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.axiosPayload.filter)),
        this.$refs.refCustomApiList,
        'CreateTime'
      )
      if (this.$refs.refCustomApiList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
        clientTableExportHelper.filter.FilterGroups[1].FilterItems.find(
          (item) => item.FieldName === 'StatusName'
        ).FieldName = 'StatusId'
      }
      if (this.$refs.refCustomApiList.sortProps && this.$refs.refCustomApiList.sortProps.order) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper
      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportRestApi(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Rest Api.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    closeNewCustomApiWithUpdate() {
      this.callForSearch()
      this.toggleNewCustomApiStatus()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForSearch()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.checkIsColumnFilterActive()
      this.callForSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.REST_API,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleEdit(row = {}) {
      this.selectedRow = row
      this.toggleNewCustomApiStatus()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.axiosPayload = JSON.parse(JSON.stringify(this.defaultAxiosPayload))
      this.$refs.refCustomApiList.filterValues = {}
      this.$refs.refCustomApiList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.callForSearch()
    },
    handleDelete(row = {}) {
      this.selectedRow = row
      this.toggleShowDeleteCustomApi()
    },
    handleDeleteCustomApi(resourceId = '') {
      this.saveDisableDelete = true
      deleteRestApi(resourceId)
        .then(() => {
          this.$refs.refCustomApiList.unSelectRow(this.selectedRow)
          this.toggleShowDeleteCustomApi()
          this.callForSearch()
        })
        .finally(() => {
          this.saveDisableDelete = false
        })
    },
    checkIfCanCloseCustomApiModal() {
      if (this.$refs.newCustomApi) {
        this.$refs.newCustomApi.closeOverlay()
      }
    },
    toggleNewCustomApiStatus() {
      if (this.showNewCustomApi) {
        this.selectedRow = null
      }
      this.showNewCustomApi = !this.showNewCustomApi
    },
    toggleShowDeleteCustomApi() {
      if (this.showDeleteCustomApi) {
        this.selectedRow = null
      }
      this.showDeleteCustomApi = !this.showDeleteCustomApi
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.REST_API))
      if (savedFilter) {
        this.axiosPayload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refCustomApiList.filterValues = savedFilter.filterValues
          this.$refs.refCustomApiList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForSearch()
    },
    checkIsColumnFilterActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.axiosPayload)
    }
  }
}
</script>
