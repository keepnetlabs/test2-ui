<template>
  <AppDialog
    title-id="text--campaign-manager-opened-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-detail-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    title="Training Reports"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
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
      />
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
import AppDialog from '@/components/AppDialog.vue'
import DataTable from '@/components/DataTable.vue'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { useLoading } from '@/hooks/useLoading'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'

export default {
  name: 'CampaignManagerReportTrainingReportsDialog',
  components: {
    AppDialogFooterWithClose,
    DataTable,
    AppDialog
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'campaign-manager-training-reports-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'OpenedTime', pageSize: 5 }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [COLUMNS.PHISHING_SCENARIO_NAME, COLUMNS.TRAINING_NAME],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerTrainingReport
        },
        rowActions: [
          {
            name: labels.ViewReport,
            icon: 'mdi-text-box',
            action: 'on-view-report',
            isNotShow: true
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
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    callForData() {}
  }
}
</script>
