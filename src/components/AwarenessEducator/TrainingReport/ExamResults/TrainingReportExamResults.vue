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
    <CampaignManagerReportHeader class="mb-6" title="Exam Results" subtitle="Users’ exam results" />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      rowKey="targetUserResourceId"
      selectable
      filterable
      options
      is-server-side-selection
      is-server-side
      isReportWithExam
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
    >
      <template #addUsers>
        <v-menu
          v-model="isExamStatusFilterMenuActive"
          :offset-y="true"
          bottom
          left
          nudge-right="4"
          nudge-bottom="4"
        >
          <template #activator="{ on: menu }">
            <v-btn v-on="menu" style="margin-right: 10px;" rounded outlined color="#2196f3">
              <span style="font-weight: 600;">show by exam status</span>
              <v-icon class="ml-1" style="font-size: 20px; margin-top: 1px;">{{
                isExamStatusFilterMenuActive ? 'mdi-menu-up' : 'mdi-menu-down'
              }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <VRadioGroup v-model="selectedExamStatusFilter" hide-details class="mt-0">
              <v-list-item v-for="filterItem in examStatusFilters" :key="filterItem.value">
                <VRadio
                  class="mb-0 mr-auto"
                  color="#2196f3"
                  :label="filterItem.text"
                  :value="filterItem.value"
                />
                <div class="d-flex justify-items-end">
                  <VTooltip bottom>
                    <template #activator="{ on }">
                      <v-icon v-on="on" class="ml-2" color="#757575">mdi-information</v-icon>
                    </template>
                    <span>{{ filterItem.tooltipText }}</span>
                  </VTooltip>
                </div>
              </v-list-item>
            </VRadioGroup>
          </v-list>
        </v-menu>
      </template>
      <template #datatable-custom-column="{ scope, col }">
        <div
          v-if="col.property === 'examScore'"
          class="training-report-exam-results__exam-score-column"
        >
          <v-icon
            v-if="scope.row.examScore !== undefined && scope.row.isMainScore"
            color="#0198AC"
            class="mr-1"
            >mdi-sync</v-icon
          >
          <span>{{ scope.row.examScore }}</span>
        </div>
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
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import TrainingReportExamResultsDetails from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResultsDetails'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useExamStatusFilter from '@/hooks/awareness-educator/useExamStatusFilter'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
export default {
  name: 'TrainingReportExamResults',
  components: {
    TrainingReportResendDialog,
    DataTable,
    CampaignManagerReportHeader,
    TrainingReportExamResultsDetails
  },
  mixins: [useLoading, useDefaultTableFunctions, useExamStatusFilter],
  props: {
    id: {
      type: String
    },
    formDetails: {
      type: Object
    },
    isScormProxy: {
      type: Boolean
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      resendItemCount: 0,
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
            label: 'Exam Status',
            sortable: true,
            fixed: false,
            show: true,
            type: 'badge',
            width: 300,
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
            type: 'slot',
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
          },
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
  mounted() {
    this.callForData()
  },
  watch: {
    customFields: {
      deep: true,
      immediate: true,
      handler(val) {
        const fields = createCustomFieldColumns(val, false)
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'department'
        )
        if (departmentIndex) {
          this.tableOptions.columns.splice(departmentIndex + 1, 0, ...fields)
        }
      }
    },
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
    handleSearchChange(searchFilter = {}) {
      const customFieldNames = this.customFields?.map?.((field) => field.name)
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems.filter(
          (field) => !customFieldNames.includes(field.FieldName)
        )
      ]
      this.resetPageNumber()
      this.callForData()
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
          this.$refs?.refTable?.resetSelectableParams?.()
          this.callForData()
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
          this.tableData = results.map((row) => {
            let customFields = {}
            row?.customFieldValues?.forEach?.((field) => {
              customFields[`${field.name}`] = field?.value
            })
            return { ...row, ...customFields, examStatus: row.examStatus || row.examStatusName }
          })
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
            link.href = globalThis.URL.createObjectURL(data)
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
