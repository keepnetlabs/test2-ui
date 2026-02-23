<template>
  <AppDialog
    title-id="text--job-log-details-popup-title"
    subtitle-id="text--job-log-details-popup-subtitle"
    class="job-log-details"
    maxHeightSize="665"
    :custom-size="'800'"
    icon="mdi-text-box-multiple"
    title="Job Details"
    :subtitle="selectedRow.name"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div v-if="tableData && tableData.length" class="job-log-details__progress">
        <span class="job-log-details__progress-header">Progress</span>
        <span
          :class="{
            'ml-1': progress !== 100,
            'job-log-details__progress-value-text': true
          }"
        >
          {{ progress + '%' }}
        </span>
        <v-progress-linear
          :value="progress"
          background-color="#b3d4fc"
          color="#2196f3"
          height="4"
          reactive
          rounded
        />
      </div>
      <DataTable
        ref="refTable"
        no-padding-bottom
        :showPagination="false"
        :options="false"
        :id="CONSTANTS.id"
        :loading="isLoading"
        :countRow="5"
        :table="tableData"
        :filterable="false"
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
        @refreshAction="callForData"
      >
        <template v-slot:datatable-custom-column="{ scope, col }">
          <template v-if="scope.column.property === 'Status'">
            <div class="job-log-details-table__status-column">
              <v-tooltip bottom :disabled="getTooltipDisabilityStatus(scope.row)">
                <template v-slot:activator="{ on }">
                  <v-btn style="display: none;" />
                  <Badge
                    size="medium"
                    :listeners="on"
                    :col="col"
                    :text="scope.row.Status"
                    :color="getBtnStatusColor(scope.row.Status)"
                  />
                </template>
                <span>{{ getErrorMessage(scope.row) }}</span>
              </v-tooltip>
            </div>
          </template>
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload, getBtnStatusColor } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getJobDetail } from '@/api/targetUsers'
import AppDialog from '@/components/AppDialog'
import Badge from '@/components/Badge'

export default {
  name: 'JobLogDetailsTable',
  components: { DataTable, AppDialog, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      progress: 0,
      CONSTANTS: {
        id: 'job-log-details-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      serverSideEvents: { pagination: false, search: false, sort: false },
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.JOB_LOG_DETAILS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.JOB_LOG_DETAILS_TABLE,
        serverSideEvents: { pagination: false, search: false, sort: false },
        columns: [
          {
            property: 'FirstName',
            align: 'left',
            editable: false,
            label: 'First Name',
            fixed: 'left',
            hideSort: true,
            show: true,
            type: 'text',
            filterableType: false
          },
          {
            property: 'LastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            fixed: 'left',
            hideSort: true,
            show: true,
            type: 'text',
            filterableType: false
          },
          {
            property: 'Email',
            align: 'left',
            editable: false,
            label: 'Email',
            fixed: false,
            hideSort: true,
            show: true,
            type: 'text',
            filterableType: false
          },
          {
            property: 'Department',
            align: 'left',
            editable: false,
            label: 'Department',
            fixed: false,
            hideSort: true,
            show: true,
            type: 'text',
            filterableType: false
          },
          {
            property: 'Priority',
            align: 'center',
            editable: false,
            label: 'Priority',
            fixed: false,
            hideSort: true,
            show: true,
            type: 'badge',
            width: 150,
            filterableType: false
          },
          {
            property: 'Status',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: 'right',
            hideSort: true,
            show: true,
            type: 'slot',
            isEditable: true,
            isWithTooltip: true,
            filterableType: false
          }
        ],
        rowActions: [],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyJobDetailsLog
        },
        selectEvent: {
          clipboard: true
        }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getBtnStatusColor(status = '') {
      return getBtnStatusColor(status)
    },
    getTooltipDisabilityStatus(row = {}) {
      const message = row?.ValidationDetail ? JSON.parse(row?.ValidationDetail)?.[0]?.Message : ''
      const result = row?.Status !== 'Error' || !message
      return result
    },
    getErrorMessage(row = {}) {
      if (row?.Status === 'Error') {
        const message = row?.ValidationDetail ? JSON.parse(row?.ValidationDetail)?.[0]?.Message : ''
        return message || ''
      }
      return ''
    },
    callForData() {
      this.setLoading(true)
      getJobDetail(this.selectedRow.resourceId)
        .then((response) => {
          const {
            data: { data }
          } = response
          const processErrors =
            data?.processResults?.find((result) => result.type === 11)?.processErrors || []
          const resultArray = []
          const results = processErrors
            .map((pe) => {
              if (pe?.inputData) {
                const parsedData = JSON.parse(pe.inputData)
                parsedData['Status'] = this.getStatusName(
                  parsedData?.Status ?? ''
                )
                parsedData['Priority'] = this.getPriorityName(
                  parsedData?.Priority ?? ''
                )
                return parsedData
              }
              return undefined
            })
            .filter(Boolean)
          resultArray.push(...results)
          this.tableData = resultArray
          this.progress = data.progress
        })
        .finally(this.setLoading)
    },
    getStatusName(status) {
      if (status === 0) return 'Error'
      if (status === 1) return 'Exists'
      if (status === 2) return 'New'
      if (status === 3) return 'Delete'
      return ''
    },
    getPriorityName(priority) {
      if (priority === 1) return 'Very Low'
      if (priority === 2) return 'Low'
      if (priority === 3) return 'Medium'
      if (priority === 4) return 'High'
      if (priority === 5) return 'Very High'
      return ''
    },
    handleClose() {
      this.$emit('onClose')
    }
  }
}
</script>
