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
    @downloadEvent="exportTrainingReportUsersTable"
    @refreshAction="callForData"
    @on-interactions="handleInteractions"
  >
    <template #datatable-custom-column="{ scope, col }">
      <div class="training-report-users__status-column">
        <v-btn style="display: none;" />
        <Badge v-bind="getStatusBadgeProps(scope.row.status)" :col="col" size="medium" />
      </div>
    </template>
  </DataTable>
</template>

<script>
import Badge from '@/components/Badge.vue'
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
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'

export default {
  name: 'TrainingReportUsersNonTargetUsers',
  components: { DataTable, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    formDetails: {
      type: Object
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'training-report-non-target-users-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_NON_TARGET_USERS_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.TRAINING_REPORT_NON_TARGET_USERS_TABLE,
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
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyTrainingReportNonUsers
        },
        rowActions: [
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
  methods: {
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.searchProxyTargetUsers(this.axiosPayload, this.id)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          debugger
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
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
          link.download = `Training-Users.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    }
  }
}
</script>
