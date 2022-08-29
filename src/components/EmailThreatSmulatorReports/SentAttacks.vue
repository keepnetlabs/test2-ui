<template>
  <div class="ets-report-page" id="ets-report-page">
    <div class="report-title mb-6">
      <p>Sent Attacks</p>
      Details of sent attack emails and their results
    </div>
    <data-table
      v-if="getEtsQuickScanReportPermissionSearch"
      id="quick-scan-data-table"
      class="sent-attacks"
      ref="refQuickScanSendAttackList"
      is-server-side
      selectable
      filterable
      options
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="bodyData"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      row-key="quickScanItemResourceId"
      @downloadEvent="exportTableData"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span
          v-if="scope.column.property === 'result'"
          :id="`text--send-attack-result-${scope.$index}`"
          class="datatable-link"
        >
          <div class="report-result-btn py-1" :class="scope.row.result.toLowerCase()">
            {{ scope.row.result }}
          </div>
        </span>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  getQuickScanReportList,
  exportQuickScanReportList,
  getLookupNameList
} from '@/api/emailThreatSimlator'
import { getLookupListByTypeId } from '@/api/common'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'

export default {
  name: 'SentAttacks',
  components: {
    DataTable
  },
  mixins: [useCallForLanguagesForTableFilter],
  data() {
    return {
      loading: true,
      labels,
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ETS_REPORT_SENT_ATTACK_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ETS_REPORT_SENT_ATTACK_TABLE,
        columns: [
          {
            property: 'pluginName',
            align: 'left',
            editable: false,
            label: 'Attack Vector',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 180
          },
          {
            property: 'categoryName',
            align: 'left',
            label: 'Category',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [],
            width: 180
          },
          {
            property: 'deliveryStatus',
            align: 'left',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'badge',
            filterableType: 'select',
            filterableItems: ['Success', 'Error', 'InProgress'],
            width: 140
          },
          {
            property: 'result',
            align: 'left',
            editable: false,
            label: 'Result',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'select',
            filterableItems: ['Secure', 'Insecure', 'Unchecked']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getEtsQuickScanReportPermissionExport']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_SENT_ATTACK
        },
        addButton: {
          show: false
        }
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      qcsResourceId: ''
    }
  },
  computed: {
    ...mapGetters({
      getEtsQuickScanReportPermissionSearch: 'permissions/getEtsQuickScanReportPermissionSearch'
    })
  },
  methods: {
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
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
      this.bodyData = {
        ...this.bodyData,
        orderBy: prop,
        ascending: order === 'ascending'
      }
      this.getDatatableList()
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
    exportTableData({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }
        exportQuickScanReportList(payload, this.qcsResourceId).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `SentAttacks.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getDatatableList() {
      this.loading = true
      if (this.getEtsQuickScanReportPermissionSearch) {
        getQuickScanReportList(this.bodyData, this.qcsResourceId)
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
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      } else {
        this.$router.push('/')
      }
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
    getLookupNameList().then((lookupNameList) => {
      const lookups = lookupNameList.data.data.find((x) => x.name == 'PluginCategory')
      getLookupListByTypeId(lookups.id).then((categories) => {
        const categoryList = categories.data.data
        const categoryColumn = this.tableOptions.columns.find((x) => x.property == 'categoryName')
        const categoryColumnFilters = categoryList.map((x) => {
          return { text: x.name, value: x.name }
        })
        categoryColumn.filterableItems = categoryColumnFilters
        this?.$refs?.refQuickScanSendAttackList?.reRenderFilters()

        this.qcsResourceId = this.$route.params.id
        this.callForLanguages('refQuickScanSendAttackList')
        this.getDatatableList()
      })
    })
  }
}
</script>
<style lang="scss">
.sent-attacks {
  .report-result-btn {
    border-radius: 4px;
    color: white;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    background-color: #217124;
    width: 80px;
    text-align: center;
    &.unchecked {
      background-color: #e0e0e0;
      color: #383b41;
    }
    &.secure {
      background-color: #217124;
    }
    &.insecure {
      background-color: #f56c6c;
    }
  }
}
</style>
