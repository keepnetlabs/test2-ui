<template>
  <div id="training-report-progress" class="training-report-progress">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :resendItemCount="resendItemCount"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
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
      subtitle="Training progress details of users"
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
      @downloadEvent="exportTrainingProgressEmailTable"
      @refreshAction="callForData"
      @on-details="handleDetails"
      @on-resend="handleOnResend"
      @on-selection-text-change="handleSelectionChange"
    >
      <template v-slot:datatable-custom-column="{ scope, col }">
        <div class="training-report-progress__progress-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.progress)" :col="col" size="medium" />
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
import Badge from '@/components/Badge'
import TrainingReportProgressDetails from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgressDetails'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
export default {
  name: 'TrainingReportClickedTrainingLink',
  components: {
    TrainingReportResendDialog,
    DataTable,
    CampaignManagerReportHeader,
    Badge,
    TrainingReportProgressDetails
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
            type: 'slot',
            minWidth: 200,
            props: {
              style: {
                maxWidth: '110px !important'
              }
            },
            filterableType: 'select',
            filterableItems:
              this?.formDetails?.progressType?.map((item) => ({
                text: item.displayName || item.name,
                value: item.name
              })) || []
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
            fixed: false,
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
          message: labels.EmptyTrainingReportProgress
        },
        rowActions: [
          {
            name: `Resend Training`,
            id: 'btn-interactions--row-actions-training-report-progress',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-progress',
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
      AwarenessEducatorService.resendTrainingToProgressList(this.resendPayload, this.id)
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
    getStatusBadgeProps(progress) {
      if (progress === 'Not Completed')
        return {
          color: '#B83A3A',
          text: 'Not Completed'
        }

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
            return { ...row, ...customFields, examStatus: row.examStatusName }
          })
        })
        .finally(this.setLoading)
    },
    exportTrainingProgressEmailTable(downloadTypes) {
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
        AwarenessEducatorService.exportProgressTrainingReportEmails(payload, this.id).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Training-Progress.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        )
      })
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
