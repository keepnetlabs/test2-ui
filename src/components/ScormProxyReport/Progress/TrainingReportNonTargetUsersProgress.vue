<template>
  <div>
    <TrainingReportNonUserInteractionsModal
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
          <Badge v-bind="getStatusBadgeProps(scope.row.status)" :col="col" size="medium" />
        </div>
      </template>
    </DataTable>
  </div>
</template>
<script>
import Badge from '@/components/Badge.vue'
import DataTable from '@/components/DataTable.vue'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import TrainingReportNonUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportNonUserInteractionsModal.vue'

export default {
  name: 'TrainingReportNonTargetUsersProgress',
  components: { TrainingReportNonUserInteractionsModal, DataTable, Badge },
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
      isShowInteractionsModal: false,
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false,
      selectedRow: null,
      isShowDetailsModal: false,
      CONSTANTS: {
        id: 'training-report-non-target-users-progress-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'enrollmentDate' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_NON_TARGET_USERS_PROGRESS_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.TRAINING_REPORT_NON_TARGET_USERS_PROGRESS_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true,
          clipboard: true
        },
        downloadButton: {
          show: false
        },
        columns: [
          {
            property: 'targetUserResultId',
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
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Progress',
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
            property: 'enrollmentDate',
            align: 'left',
            editable: false,
            label: 'Enrollment Date',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
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
            width: 180,
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
            width: 180,
            filterableType: 'date'
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
            width: 180,
            filterableType: 'Number'
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
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-progress',
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
      AwarenessEducatorService.progressNonTargetUsersTrainingReportEmails(
        this.axiosPayload,
        this.id
      )
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
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    toggleIsShowInteractionsModal() {
      this.isShowInteractionsModal = !this.isShowInteractionsModal
    }
  }
}
</script>
