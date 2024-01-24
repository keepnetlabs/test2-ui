<template>
  <div>
    <TrainingReportNonTargetExumResultsDetails
      v-if="isShowInteractionsModal"
      :status="isShowInteractionsModal"
      :item="selectedRow"
      @on-close="toggleIsShowInteractionsModal"
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
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @refreshAction="callForData"
      @on-details="handleInteractions"
    >
      <template #datatable-custom-column="{ scope, col }">
        <div class="training-report-progress__progress-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.isPassed)" :col="col" size="medium" />
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import AwarenessEducatorService from '@/api/awarenessEducator'
import Badge from '@/components/Badge.vue'
import TrainingReportNonTargetExumResultsDetails from '@/components/ScormProxyReport/ExamResults/TrainingReportNonTargetExumResultsDetails.vue'

export default {
  name: 'TrainingReportNonTargetExamResults',
  components: { TrainingReportNonTargetExumResultsDetails, Badge, DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    formDetails: {
      type: Object
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      tab: 'target-users',
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false,
      selectedRow: null,
      isShowInteractionsModal: false,
      CONSTANTS: {
        id: 'training-report-exam-results-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'lastInteractionDate' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_NON_TARGET_RESULTS_EXAM_RESULTS_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.TRAINING_REPORT_NON_TARGET_RESULTS_EXAM_RESULTS_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true,
          clipboard: true
        },
        downloadButton: { show: false },
        columns: [
          {
            property: 'targetUserResourceId',
            align: 'left',
            editable: false,
            label: 'Non-Target Users ID',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 260
          },
          {
            property: 'sessionStartDate',
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
            property: 'isPassed',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: true,
            fixed: false,
            show: true,
            type: 'slot',
            width: 200,
            filterableType: 'select',
            filterableItems: [
              { text: 'Passed', value: true },
              { text: 'Failed', value: false }
            ]
          },
          {
            property: 'score',
            align: 'right',
            editable: false,
            label: 'Score',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 140,
            filterableType: 'number'
          },
          {
            property: 'sessionCount',
            align: 'right',
            editable: false,
            label: 'Total Sessions',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'number'
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
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-exam-results',
            icon: '$custom-details',
            action: 'on-details'
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
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.examTrainingNonTargetUserReportResults(this.axiosPayload, this.id)
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
    /*
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

     */
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    getStatusBadgeProps(isPassed) {
      if (isPassed) {
        return {
          color: '#217124',
          text: 'Passed'
        }
      } else {
        return {
          color: '#B83A3A',
          text: 'Failed'
        }
      }
    },
    toggleIsShowInteractionsModal() {
      this.isShowInteractionsModal = !this.isShowInteractionsModal
    }
  }
}
</script>
