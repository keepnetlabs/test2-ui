<template>
  <div id="training-report-exam-results" class="training-report-exam-results">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="confirmResend"
    />
    <TrainingReportExamResultsDetails
      v-if="isShowDetailsModal"
      :status="isShowDetailsModal"
      :item="selectedRow"
      @on-close="toggleIsShowDetailsModal"
    />
    <CampaignManagerReportHeader class="mb-6" title="Exam Results" subtitle="Users’ exam results" />
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
      @downloadEvent="exportTrainingReportExamResultsTable"
      @refreshAction="callForData"
      @on-resend="handleOnResend"
      @on-details="handleOnDetail"
    />
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
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import TrainingReportExamResultsDetails from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResultsDetails'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingReportExamResults',
  components: {
    TrainingReportResendDialog,
    DataTable,
    CampaignManagerReportHeader,
    TrainingReportExamResultsDetails
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      selectedRow: null,
      isShowResendDialog: false,
      isShowDetailsModal: false,
      isResendActionButtonDisabled: false,
      CONSTANTS: {
        id: 'training-report-exam-results-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      resendPayload: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_EXAM_RESULTS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_EXAM_RESULTS_TABLE,
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
            fixed: false,
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
            property: 'examResultDate',
            align: 'left',
            editable: false,
            label: 'Date',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'date'
          },
          {
            property: 'examStatus',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: true,
            fixed: false,
            show: true,
            type: 'badge',
            width: 200,
            filterableType: 'select',
            filterableItems:
              this?.formDetails?.examStatusEnum?.map((item) => ({
                text: item.displayName || item.name,
                value: item.name
              })) || []
          },
          {
            property: 'examScore',
            align: 'left',
            editable: false,
            label: 'Score',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 120,
            filterableType: 'text'
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyTrainingReportExamResults
        },
        rowActions: [
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
        ]
      },
      tableData: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(status) {
      if (status === 'Failed')
        return {
          color: '#B83A3A',
          text: 'Failed'
        }

      if (status === 'Success')
        return {
          color: '#217124',
          text: 'Success'
        }
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.examTrainingReportResults(this.axiosPayload, this.id)
        .then((response) => {
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
    exportTrainingReportExamResultsTable(downloadTypes) {
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
        AwarenessEducatorService.exportExamTrainingReportResults(payload, this.id).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Training-Exam-Results.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        )
      })
    },
    handleOnDetail(row) {
      this.selectedRow = row
      this.toggleIsShowDetailsModal()
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
