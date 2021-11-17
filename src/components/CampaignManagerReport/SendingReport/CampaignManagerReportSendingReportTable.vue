<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
    :refName="'campaignManagerOpenedTable'"
    :loading="isLoading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :stored-table-settings="storedTableSettings"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :select-event="tableOptions.selectEvent"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @set-default-search="handleSetDefaultSearch"
    @restore-default-search="handleRestoreDefaultSearch"
    @clear-filters="handleClearFilters"
    @on-table-settings-change="handleSetRenderedColumns"
    @downloadEvent="exportCampaignManagerReportSendingReportTable"
    @refreshAction="callForData"
    @on-resend="handleOnResend"
    @on-detail="handleOnDetail"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import QueryHelperForTable from '@/helper-classes/query-helper'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { getDefaultAxiosPayload, getDefaultFilter } from '@/utils/functions'
import {
  exportCampaignJobUserEmailOpened,
  searchCampaignJobUserSendingReport
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'CampaignManagerReportSendingReportTable',
  components: { DataTable },
  mixins: [useLoading],
  props: {
    id: {
      type: String
    },
    lastSendingStatusItems: {
      type: Array
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'campaign-manager-sending-report-data-table',
        ascending: 'ascending'
      },
      axiosPayload: JSON.parse(JSON.stringify(getDefaultAxiosPayload({ orderBy: 'FirstName' }))),
      isLoading: false,
      tableData: [],
      storedTableSettings: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        isColumnFilterActive: false,
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.FIRST_NAME,
          COLUMNS.LAST_NAME,
          COLUMNS.EMAIL,
          COLUMNS.DEPARTMENT,
          COLUMNS.SENDING_REPORT_LAST_SENDING_DATE,
          COLUMNS.LAST_SENDING_STATUS
        ],
        addButton: {
          show: false
        },
        selectEvent: {
          resend: true
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportSendingReport
        },
        rowActions: [
          {
            name: labels.Resend,
            id: 'btn-resend--row-actions-campaign-manager-report-opened',
            icon: 'mdi-refresh',
            action: 'on-resend'
          }
        ]
      }
    }
  },
  watch: {
    lastSendingStatusItems() {
      this.setLastSendingStatusItems()
    }
  },
  created() {
    this.getStoredTableSettings()
    this.setQueryValues()
    this.setDefaultFilter()
    this.callForData()
    this.setLastSendingStatusItems()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserSendingReport(this.axiosPayload, this.id)
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
        .finally(this.setLoading)
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
    setLastSendingStatusItems() {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'status'),
        'filterableItems',
        this.lastSendingStatusItems.map((item) => ({ ...item, value: item.text }))
      )
      this.$nextTick(() => {
        this.$refs.refTable.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      })
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_SENDING_REPORT_TABLE
        )
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
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_SENDING_REPORT_TABLE)
      )
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
      this.checkIsColumnFilterActive()
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.axiosPayload.orderBy = prop
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
      this.serverSideProps.pageNumber = 1
    },
    checkIsColumnFilterActive() {
      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })

      const statusItem = filterItems.find((item) => item.FieldName === 'Status')
      if (statusItem) {
        statusItem.FieldName = 'LastSendingStatus'
      }

      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.callForData()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      this.axiosPayload.filter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_SENDING_REPORT_TABLE,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.setDefaultFilter()
      this.callForData()
    },
    handleClearFilters() {
      this.$refs.refTable.reRenderColumns({})
      this.callForData()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_SENDING_REPORT_TABLE,
        JSON.stringify(tableSettings)
      )
    },
    exportCampaignManagerReportSendingReportTable(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        exportCampaignJobUserEmailOpened(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Campaign-Report-Sending.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [0],
        items: Array.isArray(items) ? items.map((item) => item.resourceId) : [items.resourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.$emit('on-resend', payload)
    },
    handleOnDetail(row) {
      this.$emit('on-detail', row)
    }
  }
}
</script>
