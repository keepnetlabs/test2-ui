<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
    :refName="'campaignReportTable'"
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
    :chart-options="tableOptions.chartOptions"
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
    @downloadEvent="exportCampaignManagerReportClickedTable"
    @refreshAction="callForData"
    @on-view-report="handleViewReport"
    @on-delete="handleDelete"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload, getDefaultFilter } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from './utils'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'

import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { callForCampaignReports, exportCampaignReports } from '@/api/phishingsimulator'
export default {
  name: 'CampaignReportsTable',
  components: { DataTable },
  mixins: [useLoading],
  data() {
    return {
      CONSTANTS: {
        id: 'campaign-manager-clicked-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'StartDate' }),
      storedTableSettings: null,
      serverSideProps: new ServerSideProps(),
      serverSideEvents: { pagination: true, search: true, sort: true },
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.CAMPAIGN_NAME,
          COLUMNS.LAST_LAUNCH,
          COLUMNS.TARGET_USERS,
          COLUMNS.STATUS,
          COLUMNS.CREATEDBY,
          COLUMNS.DATE_CREATED,
          COLUMNS.USER_STATS,
          COLUMNS.DELIVERY
        ],
        chartOptions: {
          backgroundColor: ['#3f51b5', '#E6A23C', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Clicked, labels.Opened, labels.Submitted],
          showTooltipLine: true
        },
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignReport
        },
        rowActions: [
          {
            name: labels.ViewReport,
            id: 'btn-view-report-row-actions-campaign-reports',
            icon: 'mdi-text-box',
            action: 'on-view-report'
          },
          {
            id: 'btn-delete--campaign-reports',
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'on-delete'
          }
        ],
        selectEvent: {
          clipboard: true
        }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      callForCampaignReports(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results.map((row) => ({
            ...row,
            campaignStatus: [
              row['totalNoResponseCount'],
              row['totalClickedCount'],
              row['totalOpenedCount'],
              row['totalSubmittedCount']
            ],
            progress: (row['emailDeliveredUserCount'] / row['totalTargetUserCount']) * 100 || 0
          }))
        })
        .finally(this.setLoading)
    },
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.CAMPAIGN_REPORTS)
      )
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_REPORTS)
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
        DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_CLICKED_TABLE,
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
        TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_CLICKED_TABLE,
        JSON.stringify(tableSettings)
      )
    },
    exportCampaignManagerReportClickedTable(downloadTypes) {
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
        exportCampaignReports(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Campaign-Manager-Report.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleViewReport(row = {}) {
      this.$router.push({
        name: 'Campaign Report',
        params: { id: row.resourceId }
      })
    },
    handleDelete(row = {}) {
      this.$emit('on-delete', row.resourceId)
    }
  }
}
</script>
