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
      <SandboxDetailDialogAlerts />
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
            :tooltip-text="
              scope.row.sandboxType === 1 || scope.row.sandoxType === 2
                ? 'Sandbox Activity Rules: A1'
                : 'Sandbox Activity Rules: A2'
            "
          />
        </template>
        <template #datatable-row-actions="{ scope }">
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[0].id"
            :icon="getRowActionIcon(scope.row)"
            :text="tableOptions.rowActions[0].name"
            :scope="scope"
            :disabled="getRowActionDisabledStatus(scope.row)"
            @on-click="toggleShowMarkAsActivityDialog(scope.row)"
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
import { searchCampaignJobUserEmailOpenedDetails } from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CampaignManagerReportUserAgentColumn from '@/components/CampaignManagerReport/CampaignManagerReportUserAgentColumn.vue'
import CampaignManagerReportIPColumn from '@/components/CampaignManagerReport/CampaignManagerReportIPColumn'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
import SandboxDetailDialogAlerts from '@/components/CampaignManagerReport/SandboxDetailDialogAlerts.vue'
import { columnFilterChanged } from '@/utils/helperFunctions'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
export default {
  name: 'CampaignManagerReportOpenedItemDetailDialog',
  components: {
    DefaultButtonRowAction,
    SandboxDetailDialogAlerts,
    CampaignManagerReportActivityColumn,
    AppDialogFooterWithClose,
    CampaignManagerReportUserAgentColumn,
    DataTable,
    AppDialog,
    CampaignManagerReportIPColumn
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      COLUMNS,
      ACTIVITY_TYPES,
      isShowMarkAsHumanActivityDialog: false,
      tableActionLabel: 'SHOW SANDBOX ACTIVITY',
      selectedRow: null,
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'campaign-manager-opened-detail-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'OpenedTime', pageSize: 5 }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.DATE_OPENED,
          COLUMNS.USER_AGENT_SLOT,
          COLUMNS.BROWSER,
          COLUMNS.GEOLOCATION,
          COLUMNS.IP_SLOT_NON_FIXED,
          COLUMNS.ACTIVITY_TYPE
        ],
        addButton: {
          show: true,
          icon: null,
          label: 'SHOW SANDBOX ACTIVITY',
          action: 'on-activity',
          tooltip: 'SHOW SANDBOX ACTIVITY',
          type: 'secondary',
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
      return `${this.item?.firstName} ${this.item?.lastName}`
    }
  },
  watch: {
    tableActionLabel(val) {
      this.$set(this.tableOptions.addButton, 'label', val)
      this.$set(this.tableOptions.addButton, 'tooltip', val)
      this.axiosPayload.activityType = this.isShowSandbox ? 2 : 0
      this.callForData()
    }
  },
  created() {
    this.serverSideProps.pageSize = 5
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      if (!this.axiosPayload.activityType) this.axiosPayload.activityType = 0
      searchCampaignJobUserEmailOpenedDetails(this.axiosPayload, this.item?.resourceId)
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
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'activityType'
      )
      if (index !== -1) {
        const value = this.axiosPayload.filter.FilterGroups[0].FilterItems[index].Value
        if (value === '0,1' || value === '1,0') {
          this.axiosPayload.activityType = 2
          this.isShowSandbox = true
        } else if (value === '1') {
          this.axiosPayload.activityType = 1
          this.isShowSandbox = true
        } else {
          this.axiosPayload.activityType = 0
          this.isShowSandbox = false
        }
        this.setTableActionLabel()
      }
      this.callForData()
    },
    handleActivity() {
      this.isShowSandbox = !this.isShowSandbox
      this.setTableActionLabel()
    },
    setTableActionLabel() {
      this.tableActionLabel = this.isShowSandbox ? `HIDE SANDBOX ACTIVITY` : `SHOW SANDBOX ACTIVITY`
    },
    toggleShowMarkAsActivityDialog(row, forceUpdate = false) {
      if (forceUpdate) this.callForData()
      this.selectedRow = row
      this.isShowMarkAsHumanActivityDialog = !this.isShowMarkAsHumanActivityDialog
    },
    getRowActionDisabledStatus(row) {
      return row.activityType === ACTIVITY_TYPES.HUMAN && !row.isChangedActivity
    },
    getRowActionIcon(row) {
      if (row.isChangedActivity && row.activityType === ACTIVITY_TYPES.HUMAN)
        return 'mdi-account-cancel'
      return this.tableOptions.rowActions[0].icon
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
