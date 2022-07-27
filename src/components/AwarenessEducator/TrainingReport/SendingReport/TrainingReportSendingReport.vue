<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="confirmResend"
    />
    <CampaignManagerReportHeader
      class="mb-6"
      title="Sending Report"
      subtitle="Training email delivery details"
    />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
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
      @on-resend="handleOnResend"
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
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload, getBtnStatusColor } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import Badge from '@/components/Badge'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSendingReportEvent from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportEvent'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingReportSendingReport',
  components: {
    TrainingReportResendDialog,
    DataTable,
    Badge,
    CampaignManagerReportHeader,
    CampaignManagerReportSendingReportEvent
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      selectedRow: null,
      isShowResendDialog: false,
      isShowInteractionsModal: false,
      isResendActionButtonDisabled: false,
      CONSTANTS: {
        id: 'training-report-users-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload(),
      resendPayload: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_SENDING_REPORT_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true
        },
        columns: [
          {
            property: 'firstName',
            align: 'left',
            editable: false,
            label: 'First Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'lastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
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
            property: 'department',
            align: 'left',
            editable: false,
            label: 'Department',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'dateFirstSent',
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
            property: 'dateLastSent',
            align: 'left',
            editable: false,
            label: 'Date Last Sent',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          },
          {
            property: 'lastSendingStatus',
            align: 'left',
            editable: false,
            label: 'Last Sending Status',
            sortable: true,
            show: true,
            type: 'slot',
            width: 200,
            filterableType: 'select',
            filterableItems: [
              'Not Delivered',
              'In Queue',
              'Error',
              'Cancelled',
              'Successful',
              'Processing'
            ]
          },
          {
            property: 'smtp',
            align: 'left',
            editable: false,
            label: 'SMTP',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'emailType',
            align: 'left',
            editable: false,
            label: 'Email Type',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyTrainingReportUsers
        },
        rowActions: [
          /*
          {
            name: labels.Resend,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
           */
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-details',
            action: 'on-details'
            // disabled: !this.$store.getters['permissions/getCampaignReportsResendPermissions']
          }
        ]
      },
      isShowExtendedView: false,
      extendedViewOptions: {
        title: labels.EmailInformation,
        col: [
          {
            property: PROPERTY_STORE.SUBJECT,
            label: labels.Subject,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.TOEMAIL,
            label: labels.To,
            isEditable: false,
            type: 'text',
            show: true
          },
          {
            property: PROPERTY_STORE.FROMEMAIL,
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
            property: 'originatingIP',
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
  created() {
    this.callForData()
  },
  methods: {
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.sendingReportTrainingReport(this.axiosPayload, this.id)
        .then((response) => {
          debugger
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
      // downloadTypes.exportTypes.forEach((item) => {
      //   let payload = {
      //     pageNumber: downloadTypes.pageNumber,
      //     pageSize: downloadTypes.pageSize,
      //     orderBy: this.axiosPayload.orderBy,
      //     ascending: this.axiosPayload.ascending,
      //     reportAllPages: downloadTypes.reportAllPages,
      //     exportType: item === 'XLS' ? 'Excel' : item,
      //     filter: this.axiosPayload.filter
      //   }
      //   exportCampaignJobUserEmailOpened(payload, this.id).then((response) => {
      //     const { data } = response
      //     const link = document.createElement('a')
      //     link.href = window.URL.createObjectURL(data)
      //     link.download = `Campaign-Report-Opened.${
      //       item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
      //     }`
      //     link.click()
      //   })
      // })
    },
    handleOnDetail(row) {
      // this.extendedViewLoading = true
      // this.isShowExtendedView = true
      // getCampaignJobEmailActivity(row.resourceId)
      //   .then((response) => {
      //     const { data: { data = [] } = {} } = response || { data: { data: [] } }
      //     this.extendedViewValue = [data]
      //   })
      //   .catch(() => {
      //     this.isShowExtendedView = false
      //   })
      //   .finally(() => {
      //     this.extendedViewLoading = false
      //   })
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [2],
        items: Array.isArray(items) ? items.map((item) => item.resourceId) : [items.resourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.resendPayload = payload
      this.toggleIsShowResendDialog()
    },
    confirmResend() {},
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
    }
  }
}
</script>
