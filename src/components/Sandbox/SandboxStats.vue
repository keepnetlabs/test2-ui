<template>
  <div id="sandboxStats">
    <data-table
      id="sandbox-stats-data-table"
      ref="refsandboxStatsList"
      is-server-side
      filterable
      options
      no-padding-bottom
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :selectable="false"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :download-button="tableOptions.downloadButton"
      :is-show-download-modal="isSandboxStatsDownloadModal"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="bodyData"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @downloadEvent="exportSandboxStats"
      @handleDownloadButtonClick="handleSandboxStatsDownloadButtonClick"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
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
import { exportSandboxStats, getSandboxStats } from '@/api/sandbox'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
export default {
  name: 'sandboxStats',
  components: {
    DataTable
  },
  data() {
    return {
      isSandboxStatsDownloadModal: false,
      integrationTypesEnum: [
        { name: 'VirusTotal', value: 1 },
        { name: 'FortiSandbox', value: 2 },
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
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SANDBOXSTATS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SANDBOXSTATS,
        columns: [
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: true,
            type: 'text'
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
            filterableCustomFieldName: 'scanType',
            filterableItems: [
              { text: 'Url', value: 1 },
              { text: 'Attachment', value: 2 },
              { text: 'Ip', value: 3 },
              { text: 'Hash', value: 4 }
            ]
          },
          {
            property: 'totalRequest',
            align: 'right',
            editable: false,
            label: 'Requests',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number',
            filterableCustomFieldName: 'totalRequest'
          },
          {
            property: 'harmfulRequest',
            align: 'right',
            editable: false,
            label: 'Found Harmful',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number',
            filterableCustomFieldName: 'harmfulRequest'
          },
          {
            property: 'undetectedRequest',
            align: 'right',
            editable: false,
            label: 'Undetected',
            fixed: false,
            sortable: true,
            show: true,
            hasTooltip: true,
            type: 'text',
            filterableType: 'number'
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
          message: 'No stats available'
        }
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload({ orderBy: 'TotalRequest' }),
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    handleSandboxStatsDownloadButtonClick() {
      this.isSandboxStatsDownloadModal = true
    },
    getDatatableListWhenFilterChange(company, integration, date) {
      const isArray = Array.isArray(date)
      this.bodyData = {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'TotalRequest',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  Value: '',
                  FieldName: 'AnalysisEngineTypeId',
                  Operator: 'Contains'
                },
                {
                  Value: '',
                  FieldName: 'ClientResourceId',
                  Operator: 'Contains'
                },
                {
                  FieldName: 'ScanType',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  Value: '',
                  FieldName: 'TotalRequest',
                  Operator: '>'
                },
                {
                  Value: '',
                  FieldName: 'HarmfulRequest',
                  Operator: '='
                },
                {
                  Value: '',
                  FieldName: 'UndetectedRequest',
                  Operator: '='
                }
              ],
              FilterGroups: []
            }
          ]
        },
        FilterSummary: {
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
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      if (isArray)
        this.bodyData.FilterSummary.FilterGroups[0].FilterItems.push({
          Value: date[1].Value,
          FieldName: 'CreateTime',
          Operator: date[1].Operator
        })
      this.loading = true
      getSandboxStats(this.bodyData)
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
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
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
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
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
    exportSandboxStats({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'TotalRequest',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }
        exportSandboxStats(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `sandboxStats.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
          this.isSandboxStatsDownloadModal = false
        })
      })
    },
    getDatatableList() {
      this.loading = true
      getSandboxStats(this.bodyData)
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
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.getDatatableList()
    }
  },
  created() {
    this.getDatatableList()
  }
}
</script>
