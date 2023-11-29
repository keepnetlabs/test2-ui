<template>
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
  >
    <template #datatable-custom-column="{ scope, col }">
      <div class="training-report-progress__progress-column">
        <v-btn style="display: none;" />
        <Badge v-bind="getStatusBadgeProps(scope.row.progress)" :col="col" size="medium" />
      </div>
    </template>
  </DataTable>
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

export default {
  name: 'TrainingReportNonTargetUsersProgress',
  components: { DataTable, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      tab: 'target-users',
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false,
      selectedRow: null,
      isShowDetailsModal: false,
      CONSTANTS: {
        id: 'training-report-non-target-users-progress-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
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
        columns: [
          {
            property: 'firstName',
            align: 'left',
            editable: false,
            label: 'Non-Target Users ID',
            fixed: 'left',
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
  methods: {
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
          this.tableData = results || []
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
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    handleDetails(row) {
      this.selectedRow = row
    }
  }
}
</script>
