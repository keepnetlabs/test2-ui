<template>
  <AppDialog
    title-id="text--campaign-manager-opened-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-detail-popup-subtitle"
    :custom-size="'1300'"
    maxHeightSize="665"
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
            :icon="tableOptions.rowActions[0].icon"
            :text="tableOptions.rowActions[0].name"
            :scope="scope"
            :disabled="scope.row.activityType === ACTIVITY_TYPES.HUMAN"
            @on-click="handleMarkAsActivity(scope)"
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
import { ACTIVITY_TYPES, COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import DataTable from '@/components/DataTable'
import { searchCampaignJobUserEmailClickedDetails } from '@/api/phishingsimulator'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CampaignManagerReportUserAgentColumn from '@/components/CampaignManagerReport/CampaignManagerReportUserAgentColumn.vue'
import CampaignManagerReportIPColumn from '@/components/CampaignManagerReport/CampaignManagerReportIPColumn'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import SandboxDetailDialogAlerts from '@/components/CampaignManagerReport/SandboxDetailDialogAlerts.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'

export default {
  name: 'CampaignManagerReportClickedItemDetailDialog',
  components: {
    CampaignManagerReportActivityColumn,
    DefaultButtonRowAction,
    SandboxDetailDialogAlerts,
    AppDialogFooterWithClose,
    CampaignManagerReportUserAgentColumn,
    CampaignManagerReportIPColumn,
    DataTable,
    AppDialog
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
      ACTIVITY_TYPES,
      COLUMNS,
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
          COLUMNS.ACTIVITY_TYPE
        ],
        addButton: {
          show: false
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
      return `Clicked Link ${this.item?.['clickedCount'] || 0} Time(s)`
    },
    getSubtitle() {
      return `${this.item?.firstName} ${this.item?.lastName}`
    }
  },
  created() {
    this.serverSideProps.pageSize = 5
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserEmailClickedDetails(this.axiosPayload, this.item?.resourceId)
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
    handleMarkAsActivity(scope) {},
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
