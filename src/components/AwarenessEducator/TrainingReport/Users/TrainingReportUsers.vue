<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :title="getResendDialogTitle"
      :body-training-type="getBodyTrainingType"
      :resendItemCount="resendItemCount"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <TrainingReportUserInteractionsModal
      v-if="isShowInteractionsModal"
      :status="isShowInteractionsModal"
      :item="selectedRow"
      :is-add-training-type-key-to-payload="isAddTrainingTypeKeyToPayload"
      :training-summary="trainingSummary"
      @on-close="toggleIsShowInteractionsModal"
    />
    <CampaignManagerReportHeader class="mb-6" title="Users" :subtitle="getHeaderSubtitle" />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      rowKey="targetUserResourceId"
      selectable
      filterable
      options
      is-server-side-selection
      is-server-side
      :isReportWithExam="canRenderExamStatusFilter"
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
      @downloadEvent="exportTrainingReportUsersTable"
      @refreshAction="callForData"
      @on-interactions="handleInteractions"
      @on-resend="handleOnResend"
      @on-selection-text-change="handleSelectionChange"
    >
      <template v-if="canRenderExamStatusFilter" #addUsers>
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
        <div v-if="col.property === 'status'" class="training-report-users__status-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.status)" :col="col" size="medium" />
        </div>
        <div v-if="col.property === 'examStatus'" class="training-report-users__exam-status-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.examStatus)" :col="col" size="medium" />
        </div>
        <div v-if="col.property === 'examScore'" class="training-report-users__exam-score-column">
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
import useExamStatusFilter from '@/hooks/awareness-educator/useExamStatusFilter'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import Badge from '@/components/Badge'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import TrainingReportUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUserInteractionsModal'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
export default {
  name: 'TrainingReportUsers',
  components: {
    TrainingReportResendDialog,
    DataTable,
    Badge,
    TrainingReportUserInteractionsModal,
    CampaignManagerReportHeader
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
    trainingSummary: {
      type: Object
    },
    trainingType: {
      type: String
    },
    isAddTrainingTypeKeyToPayload: {
      type: Boolean,
      default: false
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const columns = [
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
        width: 180
      },
      {
        property: 'phoneNumber',
        align: 'left',
        editable: false,
        label: 'Phone Number',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'text',
        width: 180
      },
      {
        property: 'department',
        align: 'left',
        fixed: false,
        editable: false,
        label: 'Department',
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'text',
        width: 180
      },
      {
        property: 'status',
        align: 'center',
        editable: false,
        label: 'Status',
        sortable: true,
        show: true,
        type: 'slot',
        width: 200,
        props: {
          style: {
            maxWidth: '110px !important'
          }
        },
        overrideWidth: true,
        filterableType: 'select',
        filterableItems: []
      },
      ...(this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
        ? [
            {
              property: 'examStatus',
              align: 'center',
              editable: false,
              label: 'Exam Status',
              sortable: false,
              hideSort: true,
              show: true,
              type: 'slot',
              width: 275,
              props: {
                style: {
                  maxWidth: '110px !important'
                }
              },
              overrideWidth: true,
              filterableType: 'select',
              filterableItems: ['Failed', 'Passed', 'Incomplete']
            },
            {
              property: 'examScore',
              align: 'right',
              editable: false,
              label: 'Exam Score',
              fixed: false,
              sortable: true,
              show: true,
              type: 'slot',
              width: 160,
              filterableType: 'text'
            }
          ]
        : []),
      {
        property: 'firstCompletionDate',
        align: 'left',
        editable: false,
        label: 'First Completion',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 180,
        filterableType: 'date'
      },
      {
        property: 'lastInteractionDate',
        align: 'left',
        editable: false,
        label: 'Last Interaction',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 180,
        filterableType: 'date'
      },
      {
        property: 'deliveryType',
        align: 'left',
        editable: false,
        label: 'Delivery Method',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 180,
        filterableType: 'select',
        filterableItems: ['Email', 'Email & SMS', 'Email & Teams']
      }
    ]
    if (
      this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
      this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
    ) {
      columns.splice(4, 0, {
        property: 'currentStep',
        align: 'left',
        fixed: false,
        editable: false,
        label: 'Current Step',
        sortable: false,
        hideSort: true,
        show: false,
        type: 'text',
        width: 180
      })
    }
    return {
      resendItemCount: 0,
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false,
      selectedRow: null,
      isShowInteractionsModal: false,
      CONSTANTS: {
        id: 'training-report-users-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_USERS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_USERS_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true,
          clipboard: true
        },
        columns,
        addButton: {
          show: false
        },
        iEmpty: {
          message: this.getEmptyTableTextMessage()
        },
        rowActions: [
          {
            name: `Resend Training`,
            id: 'btn-resend--row-actions-training-report-users',
            icon: '$custom-resend',
            action: 'on-resend'
          },
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-details',
            action: 'on-interactions'
          }
          /*
          {
            name: labels.ReSend,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.ExcludeFromThisReport,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: 'mdi-circle-off-outline',
            action: 'on-exclude'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.IncludeToThisReport,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: 'mdi-plus-circle',
            action: 'on-include'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          }

           */
        ]
      },
      tableData: []
    }
  },
  computed: {
    getHeaderSubtitle() {
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return 'All target users enrolled to this poster'
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return 'All target users enrolled to this infographic'
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return 'All target users enrolled to this learning path'
      return 'All target users enrolled to this training'
    },
    getResendDialogTitle() {
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.ResendPoster
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.ResendInfographic
      return labels.ResendTraining
    },
    getBodyTrainingType() {
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.Poster.toLowerCase()
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.Infographic.toLowerCase()
      return labels.Training.toLowerCase()
    }
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
    formDetails: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        let filterableItems = []
        if (
          this.trainingSummary?.trainingDetails?.trainingTypeName ===
          TRAINING_LIBRARY_TYPES.LEARNING_PATH
        ) {
          const learningPathIndex = this?.formDetails?.targetUserEnrollmentStatusEnum.findIndex(
            (type) => type.displayName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
          )
          if (learningPathIndex === -1) return
          filterableItems =
            this?.formDetails?.targetUserEnrollmentStatusEnum?.[learningPathIndex]?.enumResults
              ?.filter((item) => {
                return !['OpenedEmail', 'ClickedLink', 'Downloaded'].includes(item.name)
              })
              ?.map((item) => {
                return {
                  text: item.displayName || item.name,
                  value: item.name
                }
              }) || []
        }
        if (
          this.trainingSummary?.trainingDetails?.trainingTypeName ===
            TRAINING_LIBRARY_TYPES.TRAINING ||
          this.trainingSummary?.trainingDetails?.trainingTypeName === 'SCORM'
        ) {
          const trainingIndex = this?.formDetails?.targetUserEnrollmentStatusEnum.findIndex(
            (type) =>
              type.displayName === TRAINING_LIBRARY_TYPES.TRAINING || type.displayName === 'SCORM'
          )
          if (trainingIndex === -1) return
          filterableItems =
            this?.formDetails?.targetUserEnrollmentStatusEnum?.[trainingIndex]?.enumResults?.map(
              (item) => ({
                text: item.displayName || item.name,
                value: item.name
              })
            ) || []
        }
        if (
          this.trainingSummary?.trainingDetails?.trainingTypeName === TRAINING_LIBRARY_TYPES.POSTER
        ) {
          const posterIndex = this?.formDetails?.targetUserEnrollmentStatusEnum.findIndex(
            (type) => type.displayName === TRAINING_LIBRARY_TYPES.POSTER
          )
          if (posterIndex === -1) return
          filterableItems =
            this?.formDetails?.targetUserEnrollmentStatusEnum?.[posterIndex]?.enumResults?.map(
              (item) => ({
                text: item.displayName || item.name,
                value: item.name
              })
            ) || []
        }
        if (
          this.trainingSummary?.trainingDetails?.trainingTypeName ===
          TRAINING_LIBRARY_TYPES.INFOGRAPHIC
        ) {
          const infographicIndex = this?.formDetails?.targetUserEnrollmentStatusEnum.findIndex(
            (type) => type.displayName === TRAINING_LIBRARY_TYPES.INFOGRAPHIC
          )
          if (infographicIndex === -1) return
          filterableItems =
            this?.formDetails?.targetUserEnrollmentStatusEnum?.[infographicIndex]?.enumResults?.map(
              (item) => ({
                text: item.displayName || item.name,
                value: item.name
              })
            ) || []
        }
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'status'),
          'filterableItems',
          filterableItems
        )
        this?.$refs?.refTable?.reRenderFilters()
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
  mounted() {
    if (!this.canRenderExamStatusFilter) this.callForData()
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
    getEmptyTableTextMessage() {
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.EmptyTrainingReportTrainingPosters
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.EmptyTrainingReportTrainingInfographics
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      ) {
        return labels.EmptyTrainingReportUserLearningPaths
      }
      return labels.EmptyTrainingReportTrainingUsers
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
      AwarenessEducatorService.resendTrainingToUserList(this.resendPayload, this.id)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.resetSelectableParams()
          this.callForData()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
          this.isShowResendDialog = false
        })
    },
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    callForData() {
      this.setLoading(true)
      let textType = this.isAddTrainingTypeKeyToPayload
        ? this.trainingSummary.trainingTypeName.replaceAll(' ', '')
        : null
      AwarenessEducatorService.searchTrainingReportUsers(this.axiosPayload, this.id, textType)
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
            return {
              ...row,
              ...customFields,
              examStatus: row.examStatus || row.examStatusName
            }
          })
        })
        .finally(this.setLoading)
    },
    exportTrainingReportUsersTable(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {}
        if (this.canRenderExamStatusFilter) {
          payload = {
            pageNumber: downloadTypes.pageNumber,
            pageSize: downloadTypes.pageSize,
            orderBy: this.axiosPayload.orderBy,
            ascending: this.axiosPayload.ascending,
            reportAllPages: downloadTypes.reportAllPages,
            exportType: item === 'XLS' ? 'Excel' : item,
            filter: this.axiosPayload.filter,
            showByExamStatus: this.selectedExamStatusFilter,
            trainingType: this.isAddTrainingTypeKeyToPayload
              ? this.trainingSummary.trainingTypeName.replaceAll(' ', '')
              : null
          }
        } else {
          payload = {
            pageNumber: downloadTypes.pageNumber,
            pageSize: downloadTypes.pageSize,
            orderBy: this.axiosPayload.orderBy,
            ascending: this.axiosPayload.ascending,
            reportAllPages: downloadTypes.reportAllPages,
            exportType: item === 'XLS' ? 'Excel' : item,
            filter: this.axiosPayload.filter,
            trainingType: this.isAddTrainingTypeKeyToPayload
              ? this.trainingSummary.trainingTypeName.replaceAll(' ', '')
              : null
          }
        }
        AwarenessEducatorService.exportTrainingReportUsers(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Training-Users.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleResend(row) {
      this.selectedRow = row
      this.toggleIsShowResendDialog()
    },
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    handleExclude(row) {},
    handleInclude(row) {},
    confirmResend() {},
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
    },
    toggleIsShowInteractionsModal() {
      if (this.isShowInteractionsModal) {
        this.selectedRow = null
      }
      this.isShowInteractionsModal = !this.isShowInteractionsModal
    }
  }
}
</script>
