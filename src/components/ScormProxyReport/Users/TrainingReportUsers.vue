<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :resendItemCount="resendItemCount"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <TrainingReportUserInteractionsModal
      v-if="isShowInteractionsModal"
      :status="isShowInteractionsModal"
      :item="selectedRow"
      @on-close="toggleIsShowInteractionsModal"
    />
    <ElTabs v-model="tab" class="k-sub-tab">
      <ElTabPane label="Target Users" name="target-users" id="training-report-target-users">
        <CampaignManagerReportHeader
          class="mb-6"
          title="Target Users"
          subtitle="All target users enrolled in this platform"
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
          @downloadEvent="exportTrainingReportUsersTable"
          @refreshAction="callForData"
          @on-interactions="handleInteractions"
          @on-resend="handleOnResend"
          @on-selection-text-change="handleSelectionChange"
        >
          <template #datatable-custom-column="{ scope, col }">
            <div v-if="col.property === 'status'" class="training-report-users__status-column">
              <v-btn style="display: none;" />
              <Badge v-bind="getStatusBadgeProps(scope.row.status)" :col="col" size="medium" />
            </div>
            <div
              v-if="col.property === 'examStatus'"
              class="training-report-users__exam-status-column"
            >
              <v-btn style="display: none;" />
              <Badge v-bind="getStatusBadgeProps(scope.row.examStatus)" :col="col" size="medium" />
            </div>
          </template>
        </DataTable>
      </ElTabPane>
      <ElTabPane
        label="Non-Target Users"
        name="non-target-users"
        id="training-report-non-target-users"
      >
        <CampaignManagerReportHeader
          class="mb-6"
          title="Non-Target Users"
          subtitle="All non-target users enrolled in this platform"
        />
        <TrainingReportUsersNonTargetUsers :form-details="formDetails" :id="id" :is-survey="isSurvey" />
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
import Badge from '@/components/Badge'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import TrainingReportUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUserInteractionsModal'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import TrainingReportUsersNonTargetUsers from '@/components/ScormProxyReport/Users/TrainingReportUsersNonTargetUsers.vue'
export default {
  name: 'TrainingReportUsers',
  components: {
    TrainingReportUsersNonTargetUsers,
    TrainingReportResendDialog,
    DataTable,
    Badge,
    TrainingReportUserInteractionsModal,
    CampaignManagerReportHeader
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
    },
    isSurvey: {
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
            filterableItems:
              this?.formDetails?.targetUserEnrollmentStatusEnum?.map((item) => ({
                text: item.displayName || item.name,
                value: item.name
              })) || []
          },
          {
            property: 'examStatus',
            align: 'center',
            editable: false,
            label: 'Exam Status',
            sortable: false,
            hideSort: true,
            show: false,
            type: 'slot',
            width: 200,
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
            show: false,
            type: 'text',
            width: 160,
            filterableType: 'text'
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
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: this.isSurvey
            ? labels.EmptyTrainingReportSurveyUsers
            : labels.EmptyTrainingReportUsers
        },
        rowActions: [
          {
            name: `Resend ${this.isSurvey ? labels.Survey : labels.Training}`,
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
            (action) => action.name === `Resend ${this.isSurvey ? labels.Survey : labels.Training}`
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
      AwarenessEducatorService.resendTrainingToUserList(this.resendPayload, this.id)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.callForData()
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
      AwarenessEducatorService.searchTrainingReportUsers(this.axiosPayload, this.id)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData =
            results.map((row) => ({
              ...row,
              examStatus: row.examStatus || row.examStatusName
            })) || []
        })
        .finally(this.setLoading)
    },
    exportTrainingReportUsersTable(downloadTypes) {
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
        AwarenessEducatorService.exportTrainingReportUsers(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `${this.isSurvey ? 'Survey' : 'Training'}-Users.${
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
