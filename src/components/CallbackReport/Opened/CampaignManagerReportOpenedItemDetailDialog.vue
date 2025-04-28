<template>
  <AppDialog
    title-id="text--campaign-manager-opened-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-detail-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'1300'"
    :icon="CONSTANTS.icon"
    :title="getTitle"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <CampaignManagerReportHumanActivityDialog
        v-if="isShowMarkAsHumanActivityDialog"
        :status="isShowMarkAsHumanActivityDialog"
        :selected-row="selectedRow"
        @on-close="toggleShowMarkAsActivityDialog"
      />
      <CampaignManagerReportSandboxActivityDialog
        v-if="isShowMarkAsSandboxActivityDialog"
        :status="isShowMarkAsSandboxActivityDialog"
        :selected-row="selectedRow"
        @on-close="toggleShowSandboxActivityDialog"
      />
      <SandboxDetailDialogAlerts :is-show-v4-rule="false" />
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        selectable
        filterable
        options
        is-server-side
        no-padding-bottom
        is-custom-overflowed-column
        :show-filter-options="false"
        :is-settings-popup="false"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :server-side-props="serverSideProps"
        :server-side-events="tableOptions.serverSideEvents"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        :count-row="tableOptions.countRow"
        :cell-padding="32"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
        @on-activity="handleActivity"
      >
        <template #datatable-custom-column="{ scope, col }">
          <CampaignManagerReportUserAgentColumn
            v-if="col.property === COLUMNS.USER_AGENT_SLOT.property"
            :scope="scope"
          />
          <CampaignManagerReportIPColumn
            v-if="col.property === COLUMNS.IP_SLOT.property"
            :scope="scope"
          />
          <CampaignManagerReportActivityColumn
            v-if="col.property === COLUMNS.ACTIVITY_TYPE.property"
            :scope="scope"
          />
        </template>
        <template #datatable-row-actions="{ scope }">
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[0].id"
            :icon="getRowActionIcon(scope.row)"
            :text="getRowActionText(scope.row)"
            :scope="scope"
            :disabled="getRowActionDisabledStatus(scope.row)"
            @on-click="toggleShowMarkAsDialog(scope.row)"
          />
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose
        id="btn--close-campaign-manager-opened-email-detail-popup"
        @on-close="handleClose"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { ACTIVITY_TYPES, COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CampaignManagerReportUserAgentColumn from '@/components/CampaignManagerReport/CampaignManagerReportUserAgentColumn.vue'
import CallbackService from '@/api/callback'
import CampaignManagerReportIPColumn from '@/components/CampaignManagerReport/CampaignManagerReportIPColumn'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
import SandboxDetailDialogAlerts from '@/components/CampaignManagerReport/SandboxDetailDialogAlerts.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import CampaignManagerReportHumanActivityDialog from '@/components/CampaignManagerReport/CampaignManagerReportHumanActivityDialog.vue'
import CampaignManagerReportSandboxActivityDialog from '@/components/CampaignManagerReport/CampaignManagerReportSandboxActivityDialog.vue'
import useSandboxTableActionLabel from '@/hooks/useSandboxTableActionLabel'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export default {
  name: 'CampaignManagerReportOpenedItemDetailDialog',
  components: {
    CampaignManagerReportUserAgentColumn,
    DataTable,
    AppDialog,
    CampaignManagerReportIPColumn,
    AppDialogFooterWithClose,
    CampaignManagerReportActivityColumn,
    SandboxDetailDialogAlerts,
    DefaultButtonRowAction,
    CampaignManagerReportHumanActivityDialog,
    CampaignManagerReportSandboxActivityDialog
  },
  mixins: [useLoading, useDefaultTableFunctions, useSandboxTableActionLabel],
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    },
    isShowSandboxFromParent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const sandboxText = this.isShowSandboxFromParent ? 'HIDE BOT ACTIVITY' : 'SHOW BOT ACTIVITY'
    return {
      COLUMNS,
      ACTIVITY_TYPES,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      isShowSandbox: this.isShowSandboxFromParent,
      tableActionLabel: sandboxText,
      selectedRow: null,
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'campaign-manager-opened-detail-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({
        orderBy: 'OpenedTime',
        pageSize: 5
      }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.DATE_OPENED,
          COLUMNS.USER_AGENT_SLOT,
          COLUMNS.BROWSER,
          COLUMNS.GEOLOCATION,
          COLUMNS.IP_SLOT_NON_FIXED,
          { ...COLUMNS.ACTIVITY_TYPE }
        ],
        addButton: {
          show: true,
          icon: null,
          label: sandboxText,
          action: 'on-activity',
          tooltip: sandboxText,
          hideTooltip: true,
          type: 'outlined',
          id: 'btn-select--hide-sandbox-activity'
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportOpenedDetail
        },
        rowActions: [
          {
            name: 'Mark as human activity',
            id: 'btn-mark-as--row-actions-campaign-manager-report-clicked',
            icon: 'mdi-account-check',
            action: 'on-mark-as'
          }
        ],
        downloadButton: {
          show: false
        },
        countRow: 5
      },
      tableData: []
    }
  },
  computed: {
    getTitle() {
      return `Opened Email ${this.item?.['openedCount'] || 0} Time(s)`
    },
    getSubtitle() {
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
    }
  },
  created() {
    this.serverSideProps.pageSize = 5
    const index = this.tableOptions.columns.findIndex(
      (c) => c.property === PROPERTY_STORE.ACTIVITYTYPE
    )
    if (index !== -1) {
      this.$set(
        this.tableOptions.columns[index],
        'filterableItems',
        this.isShowSandboxFromParent
          ? [
              { text: 'Human Activity', value: '0' },
              { text: 'Bot Activity', value: '1' }
            ]
          : [{ text: 'Human Activity', value: '0' }]
      )
    }
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      if (typeof this.axiosPayload.activityType === 'undefined')
        this.axiosPayload.activityType = this.isShowSandboxFromParent ? 2 : 0
      CallbackService.getEmailOpenedUserDetails(this.item?.resourceId, this.axiosPayload)
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
    toggleShowMarkAsActivityDialog(row, forceUpdate = false) {
      if (forceUpdate) this.callForData()
      this.selectedRow = row
      this.isShowMarkAsHumanActivityDialog = !this.isShowMarkAsHumanActivityDialog
    },
    toggleShowSandboxActivityDialog(row, forceUpdate = false) {
      if (forceUpdate) this.callForData()
      this.selectedRow = row
      this.isShowMarkAsSandboxActivityDialog = !this.isShowMarkAsSandboxActivityDialog
    },
    toggleShowMarkAsDialog(row, forceUpdate = false) {
      if (row.isChangedActivity && row.activityType === ACTIVITY_TYPES.HUMAN)
        this.toggleShowSandboxActivityDialog(row, forceUpdate)
      else this.toggleShowMarkAsActivityDialog(row, forceUpdate)
    },
    getRowActionDisabledStatus(row) {
      return row.activityType === ACTIVITY_TYPES.HUMAN && !row.isChangedActivity
    },
    getRowActionIcon(row) {
      if (row.isChangedActivity && row.activityType === ACTIVITY_TYPES.HUMAN)
        return 'mdi-account-cancel'
      return this.tableOptions.rowActions[0].icon
    },
    getRowActionText(row) {
      if (row?.activityType === ACTIVITY_TYPES.HUMAN && row.isChangedActivity)
        return 'Mark as bot activity'
      return this.tableOptions.rowActions[0].name
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
