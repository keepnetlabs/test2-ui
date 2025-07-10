<template>
  <div id="training-report-exam-results" class="training-report-exam-results">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :resendItemCount="resendItemCount"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <TrainingReportExamResultsDetails
      v-if="isShowDetailsModal"
      :status="isShowDetailsModal"
      :item="selectedRow"
      @on-close="toggleIsShowDetailsModal"
    />
    <ElTabs v-model="tab" class="k-sub-tab">
      <ElTabPane label="Target Users" name="target-users" id="training-report-target-users">
        <CampaignManagerReportHeader
          class="mb-6"
          title="Target Users Exam Results"
          subtitle="Exam results of target users"
        />
        <DataTable
          :id="CONSTANTS.id"
          ref="refTable"
          rowKey="targetUserResourceId"
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
          @on-selection-text-change="handleSelectionChange"
        />
      </ElTabPane>
      <ElTabPane
        label="Non-Target Users"
        name="non-target-users"
        id="training-report-non-target-users"
      >
        <CampaignManagerReportHeader
          class="mb-6"
          title="Non-Target Users Exam Results"
          subtitle="Exam results of non-target users"
        />
        <TrainingReportNonTargetExamResults :form-details="formDetails" :id="id" />
      </ElTabPane>
    </ElTabs>
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
import TrainingReportNonTargetExamResults from '@/components/ScormProxyReport/ExamResults/TrainingReportNonTargetExamResults.vue'

export default {
  name: 'TrainingReportExamResults',
  components: {
    TrainingReportNonTargetExamResults,
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
    },
    isScormProxy: {
      type: Boolean
    }
  },
  data() {
    return {
      resendItemCount: 0,
      tab: 'target-users',
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false,
      selectedRow: null,
      isShowDetailsModal: false,
      CONSTANTS: {
        id: 'training-report-exam-results-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_EXAM_RESULTS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_EXAM_RESULTS_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true,
          clipboard: true
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
            align: 'right',
            editable: false,
            label: 'Score',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 140,
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
            name: `Resend Training`,
            id: 'btn-interactions--row-actions-training-report-exam-results',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-exam-results',
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
  watch: {
    isScormProxy: {
      immediate: true,
      handler(val) {
        if (val) {
          const resendActionIndex = this.tableOptions.rowActions.findIndex(
            (action) => action.name === 'Resend Training'
          )
          if (resendActionIndex !== -1) {
            this.tableOptions.rowActions.splice(resendActionIndex, 1)
          }
        }
      }
    }
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.resendItemCount = selectionCount
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      this.resendPayload = {
        selectedItems: Array.isArray(items)
          ? items.map((item) => item.targetUserResourceId)
          : [items.targetUserResourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.toggleIsShowResendDialog()
    },
    resendItem() {
      this.isResendActionButtonDisabled = true
      AwarenessEducatorService.resendTrainingToExamResultList(this.resendPayload, this.id)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
          this.isShowResendDialog = false
        })
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
