<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
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
    :is-show-extended-view-with-external-value.sync="isShowExtendedView"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    :extended-view-value="extendedViewValue"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @downloadEvent="exportCampaignManagerReportSendingReportTable"
    @refreshAction="callForData"
    @on-resend="handleOnResend"
    @on-detail="handleOnDetail"
    @on-selection-text-change="handleSelectionChange"
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[0].icon"
        :id="tableOptions.rowActions[0].id"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled || campaignDurationExpired()"
        :disabledTooltipText="
          campaignDurationExpired()
            ? 'You cannot resend this campaign because its lifetime has expired'
            : 'Resend'
        "
        @on-click="handleOnResend(scope.row)"
      />
    </template>
    <template #datatable-custom-column="{ scope, col }">
      <div
        v-if="col.property === COLUMNS.DELIVERY_STATUS.property"
        class="campaign-report-sending-report-table__status-column"
      >
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
      <CampaignManagerReportTimeZoneColumn
        v-if="col.property === COLUMNS.DATE_SENT.property"
        :scope="scope"
        :timeKey="COLUMNS.DATE_SENT.property"
        :isToBeSent="['In Queue'].includes(scope.row.status)"
        localTimeKey="lastSendingTimeToLocalUser"
      />
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
        Event history
      </div>
      <div v-for="(event, index) in getEvents" :key="index">
        <CampaignManagerReportSendingReportEvent
          :item="{
            title: `Received By ${
              event.mxServer ? event.mxServer : extendedViewValue[0].serviceProvider
            }`,
            ...event
          }"
        />
      </div>
      <div v-if="!getEvents.length" class="training-report-no-event-message">
        {{ getNoEventMessage }}
      </div>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS, getStatusBadgeProps } from '@/components/SmishingReport/Opened/utils'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { getCampaignJobEmailActivity } from '@/api/phishingsimulator'
import SmishingService from '@/api/smishing'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportSendingReportEvent from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReportEvent'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import Badge from '@/components/Badge'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'

const ENUMS = {
  SEND_GRID: 'Sendgrid'
}
export default {
  name: 'CampaignManagerReportSendingReportTable',
  components: {
    CampaignManagerReportSendingReportEvent,
    DataTable,
    Badge,
    CampaignManagerReportTimeZoneColumn,
    DefaultButtonRowAction
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    lastSendingStatusItems: {
      type: Array
    },
    instanceGroup: {
      type: [String, Number]
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  inject: {
    campaignDurationExpired: {
      type: Function
    }
  },
  data() {
    return {
      COLUMNS,
      CONSTANTS: {
        id: 'campaign-manager-sending-report-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'lastSendingTime' }),
      isLoading: false,
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.SMISHING_REPORT_SENDING_REPORT_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.SMISHING_REPORT_SENDING_REPORT_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.FIRST_NAME,
          COLUMNS.LAST_NAME,
          COLUMNS.PHONENUMBER,
          COLUMNS.DEPARTMENT,
          COLUMNS.SMISHING_SCENARIO_NAME,
          COLUMNS.SENDER_PHONE_NUMBER,
          COLUMNS.DATE_SENT,
          COLUMNS.DELIVERY_STATUS
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
            id: 'btn-resend--row-actions-campaign-manager-report-sending-report',
            icon: '$custom-resend',
            action: 'on-resend',
            disabled: false
          }
          // {
          //   name: labels.Details,
          //   id: 'btn-details--row-actions-campaign-manager-report-sending-report',
          //   icon: '$custom-details',
          //   action: 'on-detail',
          //   disabled: !this.$store.getters[
          //     'permissions/getCampaignReportsSendingReportDetailsPermissions'
          //   ]
          // }
        ]
      },
      isShowExtendedView: false,
      extendedViewOptions: {
        title: labels.EmailInformation,
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
      extendedViewLoading: false
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
      return `Event history is only available when using the platform’s default SMTP.`
    }
  },
  watch: {
    lastSendingStatusItems: {
      immediate: true,
      deep: true,
      handler() {
        this.setLastSendingStatusItems()
      }
    },
    customFields: {
      deep: true,
      immediate: true,
      handler(val) {
        const fields = createCustomFieldColumns(val)
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'department'
        )
        if (departmentIndex) {
          this.tableOptions.columns.splice(departmentIndex + 1, 0, ...fields)
        }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.$emit('on-selection-text-change', selectionCount)
    },
    callForData() {
      this.setLoading(true)
      SmishingService.searchCampaignJobType('all', this.axiosPayload, this.id, this.instanceGroup)
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
            let customFields = {}
            row.customFieldValues.forEach((field) => {
              customFields[`${field.name}`] = field?.value
            })
            return { ...row, ...customFields }
          })
        })
        .finally(this.setLoading)
    },
    setLastSendingStatusItems() {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'status'),
        'filterableItems',
        this.lastSendingStatusItems.map((item) => ({ ...item, value: item.text }))
      )
      this?.$refs?.refTable?.reRenderFilters()
    },
    getEventReason(event = {}) {
      const { reason, eventName } = event
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
        SmishingService.exportCampaignJobType('all', payload, this.id, this.instanceGroup).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Smishing-Report-Sending.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        )
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
      this.extendedViewLoading = true
      this.isShowExtendedView = true
      getCampaignJobEmailActivity(row.resourceId)
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
    },
    getErrorMessage(row = {}) {
      if (row.status === 'Error' || row.status === 'Not Delivered') {
        return row?.jobResultMessage || ''
      }
      return ''
    },
    getStatusBadgeProps(status = '') {
      return getStatusBadgeProps(status)
    },
    getTooltipDisabilityStatus(row = {}) {
      if (row.status === 'Error' || row.status === 'Not Delivered') {
        return !row?.jobResultMessage
      }
      return true
    }
  }
}
</script>
