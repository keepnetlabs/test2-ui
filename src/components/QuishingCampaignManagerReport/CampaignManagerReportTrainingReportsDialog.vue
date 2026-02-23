<template>
  <AppDialog
    title-id="text--campaign-manager-opened-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-detail-popup-subtitle"
    maxHeightSize="665"
    title="Training Reports"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
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
        no-padding-bottom
        is-custom-overflowed-column
        :show-refresh-button="false"
        :show-filter-options="false"
        :is-settings-popup="false"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        :count-row="tableOptions.countRow"
        :cell-padding="32"
        @on-view-report="handleViewReport"
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
import labels from '@/model/constants/labels'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export default {
  name: 'CampaignManagerReportTrainingReportsDialog',
  components: {
    AppDialogFooterWithClose,
    DataTable,
    AppDialog
  },
  mixins: [useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    tableData: {
      type: Array,
      default: () => []
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
        columns: [
          {
            property: PROPERTY_STORE.PHISHING_SCENARIO_NAME,
            align: 'left',
            label: labels.ScenarioName,
            fixed: 'left',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 280
          },
          {
            property: 'trainingName',
            align: 'left',
            label: labels.TrainingName,
            hideSort: true,
            show: true,
            type: 'text',
            width: 280
          }
        ],
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
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleViewReport(row) {
      row = row ?? { enrollmentId: '' }
      globalThis.open(`/awareness-educator/enrollments/training-report/${row.enrollmentId}`)
    }
  }
}
</script>
