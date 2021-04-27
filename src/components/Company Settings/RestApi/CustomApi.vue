<template>
  <div class="custom-api">
    <div class="custom-apis__container">
      <new-custom-api
        v-if="showNewCustomApi"
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
        :refName="'smtpSettingsList'"
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :filterable="true"
        :show-all-records="showAllRecords"
        :total-number-of-records="totalNumberOfRecords"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :row-actions="tableOptions.rowActions"
        :stored-table-settings="storedTableSettings"
        :selectable="true"
        :sizeable="true"
        :table="tableData"
        @editAction="handleEdit"
        @downloadEvent="exportRestApi"
        @deleteAction="handleDelete"
        @onEmptyBtnClicked="toggleNewCustomApiStatus"
        @handleAddNewCustomApi="toggleNewCustomApiStatus"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
        @on-all-records-button-click="handleAllRecordsClick"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @on-table-settings-change="handleSetRenderedColumns"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        :isServerSide="true"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
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
import QueryHelperForTable from '@/helper-classes/query-helper'
export default {
  name: 'CustomApi',
  data() {
    return {
      showAllRecords: false,
      storedTableSettings: null,
      totalNumberOfRecords: 0,
      isRestoredOrClearedFilters: false,
      axiosPayload: {
        pageNumber: 1,
        pageSize: 1000,
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
        pageSize: 1000,
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
          btn: labels.NewCustomApiBtnMessage,
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
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.setQueryValuesToPayload(this.$route.query)
    this.tableOptions.pageSize = size
    this.tableOptions.pageNumber = page
    this.serverSideProps.pageSize = size
    this.getDefaultFilterAndSearch()
  },
  methods: {
    handleSearchChange(searchFilter = {}, filterActive = false) {
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
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForSearch()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.axiosPayload.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.axiosPayload.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.axiosPayload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
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
      this.tableOptions.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.tableOptions.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
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
          this.totalNumberOfRecords = totalNumberOfRecords
          this.totalNumberOfRecords = totalNumberOfRecords
          if (this.axiosPayload.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }
          if (totalNumberOfRecords <= 1000 && this.axiosPayload.pageSize === 1000) {
            this.showAllRecords = false
          }
          this.tableData = data.results || []
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
      let items = []
      let requestBody = this.axiosPayload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.axiosPayload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForSearch()
    },
    columnFilterCleared(fieldName) {
      if (this.isRestoredOrClearedFilters) {
        return
      }

      let items = []
      let filterPayload = this.axiosPayload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForSearch()

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
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
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.REST_API)
      this.callForSearch()
    },
    handleAllRecordsClick() {
      this.axiosPayload.pageSize = 75000
      this.showAllRecords = false
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
          this.toggleShowDeleteCustomApi()
          this.callForSearch()
        })
        .finally(() => {
          this.saveDisableDelete = false
        })
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
    }
  }
}
</script>

<style></style>
