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
        searchType="clicked"
        @on-close="toggleShowMarkAsActivityDialog"
      />
      <CampaignManagerReportSandboxActivityDialog
        v-if="isShowMarkAsSandboxActivityDialog"
        :status="isShowMarkAsSandboxActivityDialog"
        :selected-row="selectedRow"
        searchType="clicked"
        @on-close="toggleShowSandboxActivityDialog"
      />
      <SandboxDetailDialogAlerts />
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        selectable
        filterable
        options
        is-server-side
        no-padding-bottom
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
            v-if="col.property === COLUMNS.IP_SLOT_NON_FIXED.property"
            :scope="scope"
          />
          <CampaignManagerReportActivityColumn
            v-if="col.property === COLUMNS.ACTIVITY_TYPE.property"
            :scope="scope"
            :tooltip-text="getActivityTooltipText(scope.row)"
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
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { ACTIVITY_TYPES, COLUMNS } from '@/components/QuishingCampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CampaignManagerReportUserAgentColumn from '@/components/QuishingCampaignManagerReport/CampaignManagerReportUserAgentColumn.vue'
import CampaignManagerReportIPColumn from '@/components/QuishingCampaignManagerReport/CampaignManagerReportIPColumn'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import QuishingService from '@/api/quishing'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
import useSandboxTableActionLabel from '@/hooks/useSandboxTableActionLabel'
import SandboxDetailDialogAlerts from '@/components/CampaignManagerReport/SandboxDetailDialogAlerts.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'

export default {
  name: 'CampaignManagerReportClickedItemDetailDialog',
  components: {
    AppDialogFooterWithClose,
    CampaignManagerReportUserAgentColumn,
    CampaignManagerReportIPColumn,
    CampaignManagerReportActivityColumn,
    DataTable,
    AppDialog,
    SandboxDetailDialogAlerts,
    DefaultButtonRowAction
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
      default: true
    }
  },
  data() {
    const sandboxText = this.isShowSandboxFromParent
      ? 'HIDE SANDBOX ACTIVITY'
      : 'SHOW SANDBOX ACTIVITY'
    return {
      COLUMNS,
      ACTIVITY_TYPES,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      isShowSandbox: this.isShowSandboxFromParent,
      tableActionLabel: sandboxText,
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'campaign-manager-clicked-detail-item-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'ClickedTime', pageSize: 5 }),
      isLoading: false,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.DATE_CLICKED,
          COLUMNS.USER_AGENT_SLOT,
          COLUMNS.BROWSER,
          COLUMNS.GEOLOCATION,
          COLUMNS.IP_SLOT_NON_FIXED,
          Object.assign({}, COLUMNS.ACTIVITY_TYPE)
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
      return `Scanned QR Code Email ${this.item?.['clickedCount'] || 0} Time(s)`
    },
    getSubtitle() {
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
    }
  },
  created() {
    this.serverSideProps.pageSize = 5
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      if (typeof this.axiosPayload.activityType === 'undefined')
        this.axiosPayload.activityType = this.isShowSandboxFromParent ? 2 : 0
      QuishingService.searchCampaignJobUserEmailClickedDetails(
        this.axiosPayload,
        this.item?.resourceId
      )
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
        return 'Mark as sandbox activity'
      return this.tableOptions.rowActions[0].name
    },
    handleClose() {
      this.$emit('on-close')
    },
    getActivityTooltipText(row) {
      if (row?.activityType === ACTIVITY_TYPES.HUMAN && row.isChangedActivity)
        return 'Sandbox activity has been changed to human activity'
      return row.sandboxType === 1 || row.sandoxType === 2
        ? 'Sandbox Activity Rules: A1'
        : 'Sandbox Activity Rules: A2'
    }
  }
}
</script>
