<template>
  <div>
    <CommonReportViewTargetGroupsModal
      v-if="isGroupsDialogOpen"
      :status="isGroupsDialogOpen"
      title="Groups"
      subtitle="Groups the user has been added to"
      :target-groups="selectedGroups"
      @on-close="handleGroupsDialogClose"
    />
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
        :id="tableOptions.rowActions[0].id"
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="
          tableOptions.rowActions[0].disabled ||
          scope.row.status === 'In Queue' ||
          campaignDurationExpired()
        "
        :checkIsOwnerProperty="false"
        :disabledTooltipText="
          scope.row.status === 'In Queue'
            ? 'Can not resend when the status is In Queue.'
            : campaignDurationExpired()
            ? 'You cannot resend this campaign because its lifetime has expired'
            : 'Resend'
        "
        @on-click="handleOnResend(scope.row)"
      />
      <DefaultButtonRowAction
        :id="tableOptions.rowActions[1].id"
        :icon="tableOptions.rowActions[1].icon"
        :text="tableOptions.rowActions[1].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[1].disabled"
        :checkIsOwnerProperty="false"
        @on-click="handleOnDetail(scope.row)"
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
      <CampaignManagerReportGroupsColumn
        v-if="col.property === COLUMNS.GROUPS.property"
        :value="scope.row?.targetGroups"
        @click="handleGroupsClick"
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
      <div
        v-if="!getEvents.length && !extendedViewOptions.isErrorState"
        class="training-report-no-event-message"
      >
        {{ getNoEventMessage }}
      </div>
    </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS, getStatusBadgeProps } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  exportCampaignJobUserSendingReport,
  getCampaignJobEmailActivity,
  searchCampaignJobUserSendingReport
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportSendingReportEvent from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportEvent'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn.vue'
import CampaignManagerReportGroupsColumn from '@/components/CampaignManagerReport/CampaignManagerReportGroupsColumn.vue'
import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'

import Badge from '@/components/Badge'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
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
    CampaignManagerReportGroupsColumn,
    CommonReportViewTargetGroupsModal,
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
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_SENDING_REPORT_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_SENDING_REPORT_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.FIRST_NAME,
          COLUMNS.LAST_NAME,
          COLUMNS.EMAIL,
          COLUMNS.DEPARTMENT,
          COLUMNS.GROUPS,
          COLUMNS.PREFERREDLANGUAGE,
          COLUMNS.PHISHING_SCENARIO_NAME,
          COLUMNS.EMAIL_TEMPLATE_LANGUAGE,
          COLUMNS.EMAIL_DELIVERY,
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
            action: 'on-resend'
          },
          {
            name: labels.Details,
            id: 'btn-details--row-actions-campaign-manager-report-sending-report',
            icon: '$custom-details',
            action: 'on-detail',
            disabled: !this.$store.getters[
              'permissions/getCampaignReportsSendingReportDetailsPermissions'
            ]
          }
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
        showFooter: false,
        errorStateText: `Email delivery information cannot be accessed.`,
        isErrorState: false
      },
      extendedViewValue: [],
      extendedViewLoading: false,
      languageOptions: [],
      isGroupsDialogOpen: false,
      selectedGroups: []
    }
  },
  computed: {
    getEvents() {
      const { events = [] } = this.extendedViewValue[0] || { events: [] }
      return events
        ? events.map((event) => ({
            status: event?.event?.substring(0, 1)?.toUpperCase() + event?.event?.substring(1),
            date: event.timestamp,
            localTime: event?.timestamptolocaluser,
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
      return `Event history is only available for SMTP`
    }
  },
  watch: {
    lastSendingStatusItems: {
      immediate: true,
      handler() {
        this.setLastSendingStatusItems()
      }
    },
    customFields: {
      deep: true,
      immediate: true,
      handler(val) {
        const fields = createCustomFieldColumns(val)
        const groupIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === COLUMNS.GROUPS.property
        )
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'department'
        )
        const insertIndex = groupIndex === -1 ? departmentIndex : groupIndex
        if (insertIndex !== -1) {
          this.tableOptions.columns.splice(insertIndex + 1, 0, ...fields)
        }
      }
    }
  },
  created() {
    this.callForLanguages()
  },
  mounted() {
    // DataTable component'i mount edildikten sonra filtreler localStorage'dan okunup axiosPayload'a uygulanır
    // Bu nedenle callForData'yı nextTick içinde çağırıyoruz
    this.$nextTick(() => {
      this.callForData()
    })
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId
          })) || []
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'preferredLanguage'),
          'filterableItems',
          this.languageOptions || []
        )
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'emailTemplateLanguage'),
          'filterableItems',
          this.languageOptions.map((option) => ({ text: option.text, value: option.text })) || []
        )
        this?.$refs?.refTable?.reRenderFilters()
      })
    },
    handleSelectionChange(selectionCount) {
      this.$emit('on-selection-text-change', selectionCount)
    },
    handleGroupsClick(groups) {
      this.selectedGroups = (groups || []).map((name) => ({ name }))
      this.isGroupsDialogOpen = true
    },
    handleGroupsDialogClose() {
      this.isGroupsDialogOpen = false
      this.selectedGroups = []
    },
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserSendingReport(this.axiosPayload, this.id, this.instanceGroup)
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
            return {
              ...row,
              ...customFields,
              preferredLanguage:
                this.languageOptions.find(
                  (option) => option.languageTypeName === row.preferredLanguage
                )?.text || row.preferredLanguage
            }
          })
        })
        .finally(this.setLoading)
    },
    setLastSendingStatusItems() {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'status'),
        'filterableItems',
        this.lastSendingStatusItems.map((item) => ({
          ...item,
          value: item.text
        }))
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
        exportCampaignJobUserSendingReport(payload, this.id, this.instanceGroup).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = globalThis.URL.createObjectURL(data)
            link.download = `Campaign-Report-Sending.${
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
      this.extendedViewOptions.isErrorState = false
      this.extendedViewLoading = true
      this.isShowExtendedView = true
      getCampaignJobEmailActivity(row.resourceId)
        .then((response) => {
          const { data: { data = [] } = {} } = response || {
            data: { data: [] }
          }
          this.extendedViewValue = [data]
        })
        .catch(() => {
          this.extendedViewValue = [{}]
          this.extendedViewOptions.isErrorState = true
        })
        .finally(() => {
          this.extendedViewLoading = false
        })
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
