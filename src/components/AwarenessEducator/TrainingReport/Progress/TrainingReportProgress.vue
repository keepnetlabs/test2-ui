<template>
  <div id="training-report-progress" class="training-report-progress">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="confirmResend"
    />
    <TrainingReportProgressDetails
      v-if="isShowDetailsModal"
      :status="isShowDetailsModal"
      :item="selectedRow"
      @on-close="toggleIsShowDetailsModal"
    />
    <CampaignManagerReportHeader
      class="mb-6"
      title="Progress"
      subtitle="List of training progress details of users"
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
      @downloadEvent="exportTrainingReportOpenedTrainingEmailTable"
      @refreshAction="callForData"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <div class="training-report-progress__progress-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.progress)" size="medium" />
        </div>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click="handleResend(scope.row)"
        />
        <DefaultButtonRowAction
          v-if="false"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          :checkIsOwnerProperty="false"
          @on-click="handleDetails(scope.row)"
        />
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import Badge from '@/components/Badge'
import TrainingReportProgressDetails from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgressDetails'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingReportClickedTrainingLink',
  components: {
    TrainingReportResendDialog,
    DataTable,
    DefaultButtonRowAction,
    CampaignManagerReportHeader,
    Badge,
    TrainingReportProgressDetails
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
      isShowDetailsModal: false,
      isResendActionButtonDisabled: false,
      CONSTANTS: {
        id: 'training-report-progress-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_PROGRESS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_PROGRESS_TABLE,
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
            width: 100
          },
          {
            property: 'lastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 100
          },
          {
            property: 'email',
            align: 'left',
            editable: false,
            label: 'Email',
            fixed: false,
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
            property: 'progress',
            align: 'center',
            editable: false,
            label: 'Progress',
            sortable: true,
            show: true,
            type: 'badge',
            width: 200,
            filterableType: 'select',
            filterableItems: ['In Progress', 'Completed']
          },
          {
            property: 'enrollmentDate',
            align: 'left',
            editable: false,
            label: 'Enrollment Date',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'date'
          },
          {
            property: 'sessionStartDate',
            align: 'left',
            editable: false,
            label: 'Session Started',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'date'
          },
          {
            property: 'sessionEndDate',
            align: 'left',
            editable: false,
            label: 'Session Ended',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'date'
          },
          {
            property: 'sessionCount',
            align: 'right',
            editable: false,
            label: 'Sessions',
            fixed: 'right',
            sortable: true,
            show: true,
            type: 'text',
            width: 130,
            filterableType: 'number'
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


          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-details',
            action: 'on-details'
            // disabled: !this.$store.getters['permissions/getCampaignReportsResendPermissions']
          }

           */
        ]
      },
      tableData: [
        {
          progress: 'InProgress',
          enrollmentDate: '21/07/2022 16:40',
          sessionStartDate: '21/07/2022 16:40',
          sessionEndDate: '22/07/2022 12:22',
          sessionCount: 1,
          enrollmentId: '1',
          userEmailId: '2',
          resourceId: 'aaaaaaaaaaaa',
          firstName: 'Burak',
          lastName: 'Ozen',
          email: 'burak9514test5187@keepnetlabs.com',
          department: 'US'
        }
      ]
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(progress) {
      if (progress === 'In Progress')
        return {
          color: '#B6791D',
          text: 'In Progress'
        }

      if (progress === 'Completed')
        return {
          color: '#217124',
          text: 'Completed'
        }
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.progressTrainingReportEmails(this.axiosPayload, this.id)
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
          //this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    exportTrainingReportOpenedTrainingEmailTable(downloadTypes) {
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
    handleResend(row) {
      this.selectedRow = row
      this.toggleIsShowResendDialog()
    },
    handleDetails(row) {
      this.selectedRow = row
      this.toggleIsShowDetailsModal()
    },
    confirmResend() {},
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
    },
    toggleIsShowDetailsModal() {
      if (this.isShowDetailsModal) {
        this.selectedRow = null
      }
      this.isShowDetailsModal = !this.isShowDetailsModal
    }
  }
}
</script>
