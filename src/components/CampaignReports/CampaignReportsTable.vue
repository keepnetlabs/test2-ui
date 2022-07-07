<template>
  <DataTable
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :id="CONSTANTS.id"
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :select-event="tableOptions.selectEvent"
    :chart-options="tableOptions.chartOptions"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @downloadEvent="exportCampaignManagerReportClickedTable"
    @refreshAction="callForData"
    @on-view-report="handleViewReport"
    @on-delete="handleDelete"
  >
    <template v-slot:datatable-custom-column="{ scope, col }">
      <template v-if="scope.column.property === columns.USER_STATS.property">
        <DataTableChart
          :scope="scope"
          :col="col"
          :chartOptions="getChartOptionsForRow(scope.row)"
        />
      </template>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from './utils'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import { mapGetters } from 'vuex'
import DataTableChart from '@/components/DataTableComponents/DataTableChart'

import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { callForCampaignReports, exportCampaignReports } from '@/api/phishingsimulator'
export default {
  name: 'CampaignReportsTable',
  components: { DataTable, DataTableChart },
  mixins: [useLoading],
  props: {
    justShowReportAction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'campaign-manager-clicked-data-table',
        ascending: 'ascending'
      },
      columns: COLUMNS,
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'StartDate' }),
      serverSideProps: new ServerSideProps(),
      serverSideEvents: { pagination: true, search: true, sort: true },
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORTS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORTS_TABLE,
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
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C', '#F56C6C'],
          labels: [
            labels.NoResponse,
            labels.Clicked,
            labels.Opened,
            labels.Submitted,
            labels.OpenedAttachment
          ],
          showTooltipLine: true
        },
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignReport
        },
        rowActions: this.justShowReportAction
          ? [
              {
                name: labels.ViewReport,
                id: 'btn-view-report-row-actions-campaign-reports',
                icon: 'mdi-text-box',
                action: 'on-view-report',
                disabled: !this.$store.getters['permissions/getCampaignReportsGetPermissions']
              }
            ]
          : [
              {
                name: labels.ViewReport,
                id: 'btn-view-report-row-actions-campaign-reports',
                icon: 'mdi-text-box',
                action: 'on-view-report',
                disabled: !this.$store.getters['permissions/getCampaignReportsGetPermissions']
              },
              {
                id: 'btn-delete--campaign-reports',
                name: 'Delete',
                icon: 'mdi-delete',
                action: 'on-delete',
                disabled: !this.$store.getters['permissions/getCampaignReportsDeletePermissions']
              }
            ],
        selectEvent: {
          clipboard: true
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getCampaignReportsSearchPermissions: 'permissions/getCampaignReportsSearchPermissions'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    getChartOptionsForRow(row) {
      if (row.method === 'Attachment') {
        return {
          backgroundColor: ['#67C23A', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Opened, labels.OpenedAttachment],
          showTooltipLine: true
        }
      } else {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Clicked, labels.Opened, labels.Submitted],
          showTooltipLine: true
        }
      }
    },
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
          this.tableData = results.map((row) => {
            const campaignStatus = [row['totalNoResponseCount'], row['totalOpenedCount']]
            if (row.method === 'Attachment') {
              campaignStatus.push(row['totalAttachmentOpenedCount'])
            } else {
              campaignStatus.splice(1, 0, row['totalClickedCount'])
              campaignStatus.push(row['totalSubmittedCount'])
            }
            return {
              ...row,
              campaignStatus,
              progress:
                Math.round((row['emailDeliveredUserCount'] / row['totalTargetUserCount']) * 100) ||
                0
            }
          })
        })
        .finally(this.setLoading)
    },
    columnFilterChanged(filter) {
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
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })

      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
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
      this.$emit('on-view-report', row)
    },
    handleDelete(row) {
      this.$emit('on-delete', row)
    }
  }
}
</script>
