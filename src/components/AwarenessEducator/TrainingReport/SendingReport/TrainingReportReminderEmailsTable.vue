<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    rowKey="targetUserResourceId"
    selectable
    filterable
    options
    is-server-side-selection
    is-server-side
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :select-event="tableOptions.selectEvent"
    :extended-view-options="extendedViewOptions"
    :extended-view-loading="extendedViewLoading"
    :extended-view-value="extendedViewValue"
    :is-show-extended-view-with-external-value.sync="isShowExtendedView"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @downloadEvent="exportTrainingReportSendingReportTable"
    @refreshAction="callForData"
    @on-details="handleOnDetail"
  >
    <template #datatable-custom-column="{ scope, col }">
      <v-btn style="display: none;" />
      <v-tooltip
        v-if="col.property === 'lastSendingStatus'"
        bottom
        nudgeLeft="40"
        :disabled="!scope.row.hasTooltip"
      >
        <template #activator="{ on }">
          <Badge
            v-if="scope.row && scope.row[col.property]"
            :listeners="on"
            :color="getBtnStatusColor(scope.row[col.property])"
            :text="scope.row[col.property]"
            :col="col"
            size="medium"
          />
        </template>
        <span>{{ scope.row.tooltipText }}</span>
      </v-tooltip>
    </template>
    <template #extended-view-slot>
      <div
        style="
          font-weight: 600;
          font-size: 14px;
          line-height: 21px;
          color: #383b41;
          margin-bottom: 8px;
        "
      >
        Event History
      </div>
      <div v-for="(event, index) in getEvents" :key="index">
        <TrainingReportSendingReportExtendedView
          :item="{
            title: `Received By ${
              event.mxServer ? event.mxServer : extendedViewValue[0].serviceProvider
            }`,
            ...event
          }"
        />
      </div>
      <div
        v-if="!getEvents.length"
        style="
          background-color: #f5f7fa;
          padding: 8px;
          border-radius: 8px;
          font-weight: normal;
          font-size: 12px;
          line-height: 18px;
          color: #383b41;
        "
      >
        {{ getNoEventMessage }}
      </div>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import TrainingReportSendingReportExtendedView from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReportExtendedView'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload, getBtnStatusColor } from '@/utils/functions'
import AwarenessEducatorService from '@/api/awarenessEducator'

const ENUMS = {
  SEND_GRID: 'Sendgrid'
}

export default {
  name: 'TrainingReportReminderEmailsTable',
  components: {
    DataTable,
    Badge,
    TrainingReportSendingReportExtendedView
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    lastSendingStatusItems: {
      type: Array
    },
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      selectedRow: null,
      isShowInteractionsModal: false,
      CONSTANTS: {
        id: 'training-report-users-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          clipboard: true
        },
        columns: [
          {
            property: 'email',
            align: 'left',
            editable: false,
            label: 'Email',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'firstSendDate',
            align: 'left',
            editable: false,
            label: 'Date First Sent',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          },
          {
            property: 'lastSendDate',
            align: 'left',
            editable: false,
            label: 'Date Last Sent',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 180
          },
          {
            property: 'lastSendingStatus',
            align: 'center',
            editable: false,
            fixed: false,
            label: 'Last Sending Status',
            sortable: true,
            show: true,
            type: 'slot',
            minWidth: 220,
            props: {
              style: {
                maxWidth: '110px !important'
              }
            },
            overrideWidth: true,
            filterableType: 'select',
            filterableItems:
              this?.formDetails?.emailStatusEnum.map((status) => ({
                text: status.displayName || status.name,
                value: status.name
              })) || []
          },
          {
            property: 'smtpName',
            align: 'left',
            editable: false,
            label: 'SMTP',
            hideSort: true,
            filterable: false,
            sortable: false,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          }
          /*
          {
            property: 'emailType',
            align: 'left',
            editable: false,
            label: 'Email Type',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 150
          }
           */
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: `No reminder has been enabled for this campaign yet`
        },
        rowActions: [
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-sending-report',
            icon: '$custom-details',
            action: 'on-details'
          }
        ]
      },
      isShowExtendedView: false,
      extendedViewOptions: {
        title: 'Reminder Email Details',
        col: [
          {
            property: 'subject',
            label: labels.Subject,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: 'to',
            label: labels.To,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: 'from',
            label: labels.From,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: 'messageId',
            label: labels.MessageID,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: 'senderIp',
            label: labels.SenderIP,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: 'serviceProvider',
            label: labels.ServiceProvider,
            isEditable: false,
            type: 'text',
            show: true
          }
        ],
        isEditable: false,
        showFooter: false
      },
      extendedViewValue: [],
      extendedViewLoading: false,
      tableData: []
    }
  },
  computed: {
    getEvents() {
      const { events = [] } = this.extendedViewValue[0] || { events: [] }
      return events
        ? events.map((event) => ({
            status: event?.event?.substring(0, 1)?.toUpperCase() + event?.event?.substring(1),
            date: event.timestamp,
            reason: this.getEventReason(event),
            mxServer: event.mxServer
          }))
        : []
    },
    getNoEventMessage() {
      const provider = this.extendedViewValue[0]?.serviceProvider || ''
      if (provider === ENUMS.SEND_GRID) {
        return 'Activity details will be available in a few minutes...'
      }
      return `Event history is only available for ${provider}`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getEventReason(event = {}) {
      const { reason, event: eventName } = event
      if (reason) return reason

      if (eventName === 'processed') {
        return `We sent the email using the shared IP address ${
          this.extendedViewValue[0]?.originatingIP || ''
        }.`
      }

      if (eventName === 'delivered') {
        return 'This email was delivered'
      }

      return ''
    },
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.searchSendingReportReminderEmails(this.axiosPayload, this.id)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    exportTrainingReportSendingReportTable(downloadTypes) {
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
        AwarenessEducatorService.exportSendingReport(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Training-Sending-Report-Reminder-Emails.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleOnDetail(row) {
      this.extendedViewLoading = true
      this.isShowExtendedView = true
      AwarenessEducatorService.getTrainingReportReminderEmailDetails(this.id, row.userEmailId)
        .then((response) => {
          const { data: { data = [] } = {} } = response || { data: { data: [] } }
          this.extendedViewValue = [data]
        })
        .catch(() => {
          this.isShowExtendedView = false
        })
        .finally(() => {
          this.extendedViewLoading = false
        })
    }
  }
}
</script>
