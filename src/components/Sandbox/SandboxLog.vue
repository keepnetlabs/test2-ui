<template>
  <div id="sandbox">
    <data-table
      id="sandbox-data-table-log"
      ref="refsandboxList"
      is-server-side
      filterable
      options
      :loading="loading"
      :selectable="false"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :refName="'sandboxList'"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :isShowDownloadModal="isSandboxLogDownloadModal"
      :stored-table-settings="storedTableSettings"
      :download-button="tableOptions.downloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @downloadEvent="exportSandboxLog"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @handleDownloadButtonClick="handleSandboxLogDownloadButtonClick"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-table-settings-change="handleSetRenderedColumns"
    ></data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  getStoreValue,
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { exportSandboxLog, getSandboxLog } from '@/api/sandbox'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
export default {
  name: 'sandbox',
  components: {
    DataTable
  },
  data() {
    return {
      isSandboxLogDownloadModal: false,
      integrationTypesEnum: [
        { name: 'VirusTotal', value: 1 },
        { name: 'FortiNet', value: 2 },
        { name: 'Vmray', value: 3 },
        { name: 'Ibm X-Force', value: 4 },
        { name: 'SpamHouseZen', value: 5 },
        { name: 'GoogleSafeBrowser', value: 6 },
        { name: 'CustomIntegration', value: 7 }
      ],
      scanTypesEnum: [
        { name: 'Url', value: 1 },
        { name: 'Attachment', value: 2 },
        { name: 'Ip', value: 3 },
        { name: 'Hash', value: 4 }
      ],
      integrationTypes: [],
      loading: true,
      labels,
      tableData: [],
      showDeleteModal: false,
      storedTableSettings: null,
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: labels.CompanyName,
            sortable: true,
            show: true,
            type: 'text',
            width: 240
          },
          {
            property: 'analysisEngineTypeId',
            align: 'left',
            editable: false,
            label: labels.IntegrationType,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240
          },
          {
            property: 'scanType',
            align: 'left',
            editable: false,
            label: 'Scan Type',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [
              { text: 'Url', value: 1 },
              { text: 'Attachment', value: 2 },
              { text: 'Ip', value: 3 },
              { text: 'Hash', value: 4 }
            ]
          },
          {
            property: 'details',
            align: 'left',
            editable: false,
            label: 'Details',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            filterableCustomFieldName: 'details'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Undetected', 'Malicious', 'Phishing']
          }
        ],
        downloadButton: {
          show: true
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: 'No logs available'
        }
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    handleSandboxLogDownloadButtonClick() {
      this.isSandboxLogDownloadModal = true
    },
    getDatatableListWhenFilterChange(company, integration, date) {
      const isArray = Array.isArray(date)
      this.bodyData = {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  Value: integration,
                  FieldName: 'AnalysisEngineTypeId',
                  Operator: integration ? 'Include' : 'Contains'
                },
                {
                  Value: company,
                  FieldName: 'CompanyName',
                  Operator: company ? 'Include' : 'Contains'
                },
                {
                  Value: company,
                  FieldName: 'ClientResourceId',
                  Operator: company ? 'Include' : 'Contains'
                },
                {
                  FieldName: 'CreateTime',
                  Operator: isArray ? date[0].Operator : date ? date.Operator : 'Contains',
                  Value: isArray ? date[0].Value : date ? date.Value : ''
                },
                {
                  FieldName: 'ScanType',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  Value: '',
                  FieldName: 'Details',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'Status',
                  Operator: 'Contains'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [
                {
                  Value: '',
                  FieldName: 'AnalysisEngineTypeId',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'CompanyName',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'ClientResourceId',
                  Operator: 'Contains'
                },
                {
                  FieldName: 'CreateTime',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'ScanType',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  Value: '',
                  FieldName: 'Details',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'Status',
                  Operator: 'Contains'
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      if (isArray)
        this.bodyData.filter.FilterGroups[0].FilterItems.push({
          Value: date[1].Value,
          FieldName: 'CreateTime',
          Operator: date[1].Operator
        })
      this.defaultRequestBody = JSON.parse(JSON.stringify(this.bodyData))
      this.loading = true

      getSandboxLog(this.bodyData)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber

          let { results = [] } = data
          results = results.map((resultItem) => {
            return {
              ...resultItem,
              analysisEngineTypeId: this.integrationTypesEnum.find(
                (item) => resultItem.analysisEngineTypeId === item.value
              ).name,
              scanType: this.scanTypesEnum.find((item) => item.value === resultItem.scanType).name
            }
          })
          this.tableData = results
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SANDBOX, JSON.stringify(tableSettings))
    },
    resetPageNumber() {
      //generic
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      //generic
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyData.filter.FilterGroups[1].FilterItems = this.bodyData.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.calculateIsFilterColumnActive()
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.sandbox))
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refsandboxList.filterValues = savedFilter.filterValues
          this.$refs.refsandboxList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refsandboxList.filterValues = {}
      this.$refs.refsandboxList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      this.getDatatableList()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.sandbox,
        JSON.stringify({
          filter: this.bodyData.filter,
          filterValues
        })
      )
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      this.getDatatableList()
    },
    handleDeleteMultiple(selections) {
      selections.forEach((item) => {
        this.handleDelete(item)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    handleAdd() {},
    exportSandboxLog({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CompanyName',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }
        exportSandboxLog(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `sandboxLog.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
          this.isSandboxLogDownloadModal = false
        })
      })
    },
    getDatatableList() {
      this.loading = true
      getSandboxLog(this.bodyData)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber

          let { results = [] } = data
          results = results.map((resultItem) => {
            return {
              ...resultItem,
              analysisEngineTypeId: this.integrationTypesEnum.find(
                (item) => resultItem.analysisEngineTypeId === item.value
              ).name,
              scanType: this.scanTypesEnum.find((item) => item.value === resultItem.scanType).name
            }
          })
          this.tableData = results
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.calculateIsFilterColumnActive()
      this.getDatatableList()
    },
    calculateIsFilterColumnActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.bodyData)
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.SANDBOX))
  },
  mounted() {
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss">
.sandbox {
  min-height: 90vh;
}
.sandbox__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
