<template>
  <DataTable
    ref="refTable"
    selectable
    filterable
    options
    row-key="customKey"
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
    <template #datatable-custom-column="{ scope, col }">
      <template v-if="scope.column.property === columns.USER_STATS.property">
        <DataTableChart
          :scope="scope"
          :col="col"
          :chartOptions="getChartOptionsForRow(scope.row)"
        />
      </template>
      <template v-if="scope.column.property === 'status'">
        <div class="enrollments__status-column">
          <v-tooltip bottom :disabled="getTooltipDisabilityStatus(scope.row)">
            <template v-slot:activator="{ on }">
              <v-btn style="display: none;" />
              <Badge
                v-bind="getStatusBadgeProps(scope.row.status)"
                :listeners="on"
                size="medium"
                :col="col"
              />
            </template>
            <span>{{ getErrorMessage(scope.row) }}</span>
          </v-tooltip>
        </div>
      </template>
      <template v-if="scope.column.property === 'method'">
        <VTooltip v-if="scope.row[col.property] === METHOD_TYPES.MULTIPLE_METHOD" bottom>
          <template #activator="{ on }">
            <span v-on="on">
              {{ scope.row[col.property] }}
            </span>
          </template>
          <div
            v-for="(methodWrapper, index) in getMethodDetail(scope.row.methodDetail)"
            :key="index"
          >
            {{ methodWrapper.method }} ({{ methodWrapper.count }})
          </div>
        </VTooltip>
        <span v-else> {{ scope.row[col.property] }}</span>
      </template>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  getDefaultAxiosPayload,
  getDataTableFieldLabel,
  createRandomCryptStringNumber
} from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS, getStatusBadgeProps } from './utils'
import { METHOD_TYPES } from '@/components/CampaignManager/utils'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import { mapGetters } from 'vuex'
import DataTableChart from '@/components/DataTableComponents/DataTableChart'
import Badge from '@/components/Badge'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { callForCampaignReports, exportCampaignReports } from '@/api/phishingsimulator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'CampaignReportsTable',
  components: { DataTable, DataTableChart, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
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
      METHOD_TYPES,
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'CreatedDate' }),
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
          COLUMNS.METHOD,
          COLUMNS.EMAIL_DELIVERY,
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
    getMethodDetail(methodDetail = {}) {
      if (!methodDetail) return {}
      try {
        return JSON.parse(methodDetail)
      } catch (e) {
        return {}
      }
    },
    getChartOptionsForRow(row) {
      if (row.method === 'Click-Only') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280'],
          labels: [labels.NoResponse, labels.Clicked, labels.Opened],
          showTooltipLine: true
        }
      } else if (row.method === 'Attachment') {
        return {
          backgroundColor: ['#67C23A', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Opened, labels.OpenedAttachment],
          showTooltipLine: true
        }
      } else if (row.method === 'Data Submission') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C'],
          labels: [labels.NoResponse, labels.Clicked, labels.Opened, labels.Submitted],
          showTooltipLine: true
        }
      } else if (row.method === 'MFA') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C', '#F56C6C'],
          labels: [
            labels.NoResponse,
            labels.Clicked,
            labels.Opened,
            labels.Submitted,
            labels.SubmittedMFACode
          ],
          showTooltipLine: true
        }
      } else if (row.method === 'Multiple Method') {
        return {
          backgroundColor: ['#67C23A', '#E6A23C', '#FBF280', '#F56C6C', '#F56C6C'],
          labels: [
            labels.NoResponse,
            labels.Clicked,
            labels.Opened,
            labels.Submitted,
            labels.OpenedAttachment
          ],
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
            const campaignStatus = [row['totalNoResponseCount']]
            if (row.method === 'Multiple Method') {
              campaignStatus.push(
                row['totalClickedCount'],
                row['totalOpenedCount'],
                row['totalSubmittedCount'],
                row['totalAttachmentOpenedCount']
              )
            }
            if (row.method === 'Click-Only') {
              campaignStatus.push(row['totalClickedCount'], row['totalOpenedCount'])
            }
            if (row.method === 'Attachment') {
              campaignStatus.push(row['totalOpenedCount'], row['totalAttachmentOpenedCount'])
            }

            if (row.method === 'Data Submission') {
              campaignStatus.push(
                row['totalClickedCount'],
                row['totalOpenedCount'],
                row['totalSubmittedCount']
              )
            } else if (row.method === 'MFA') {
              campaignStatus.push(
                row['totalClickedCount'],
                row['totalOpenedCount'],
                row['totalSubmittedCount'],
                row['totalSubmittedMFACount']
              )
            }
            return {
              ...row,
              campaignStatus,
              customKey: `key-${createRandomCryptStringNumber()}`,
              progress:
                Math.round((row['emailDeliveredUserCount'] / row['totalTargetUserCount']) * 100) ||
                0
            }
          })
        })
        .finally(this.setLoading)
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
          link.href = globalThis.URL.createObjectURL(data)
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
    },
    getErrorMessage(row = {}) {
      if (row.status === 'Error') {
        return row?.jobResultMessage || ''
      }
      return ''
    },
    getStatusBadgeProps(status = '') {
      return getStatusBadgeProps(status)
    },
    getDataTableFieldLabel(status = '') {
      return getDataTableFieldLabel(status)
    },
    getTooltipDisabilityStatus(row = {}) {
      return row?.status !== 'Error' || !row?.jobResultMessage
    }
  }
}
</script>
