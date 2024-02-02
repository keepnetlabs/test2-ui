<template>
  <DataTable
    ref="refTable"
    :showPagination="false"
    :options="false"
    :id="CONSTANTS.id"
    :loading="isLoading"
    :countRow="10"
    :table="tableData"
    :filterable="false"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="rowActions"
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
    @downloadEvent="exportJobLogData"
    @refreshAction="callForData"
    @handleDetailsClick="handleDetailsClick($event)"
  >
    <template #datatable-custom-column="{ scope, col }">
      <div class="job-log__status-column">
        <v-tooltip bottom :disabled="getTooltipDisabilityStatus(scope.row)">
          <template v-slot:activator="{ on }">
            <v-btn style="display: none;" />
            <Badge
              v-bind="getStatusBadgeProps(scope.row.status)"
              :listeners="on"
              size="medium"
              :col="col"
            />
          </template>
          <span>{{ getErrorMessage(scope.row) }}</span>
        </v-tooltip>
      </div>
    </template>
    <template v-slot:datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :id="rowActions[0].id"
        :icon="rowActions[0].icon"
        :text="rowActions[0].name"
        :scope="scope"
        :disabled="rowActions[0].disabled"
        @on-click="handleDetailsClick(scope.row)"
      />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getAllJobs } from '@/api/targetUsers'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import { getDataTableFieldLabel } from '@/utils//functions'
import Badge from '@/components/Badge'
import { getStatusBadgeProps } from './utils'

export default {
  name: 'JobLogTable',
  components: { DataTable, DefaultButtonRowAction, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    justShowReportAction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'job-log-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      serverSideEvents: { pagination: false, search: false, sort: false },
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.JOB_LOG_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.JOB_LOG_TABLE,
        serverSideEvents: { pagination: false, search: false, sort: false },
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Process',
            fixed: 'left',
            hideSort: true,
            show: true,
            type: 'text',
            width: 240,
            filterableType: false
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Launch Date',
            fixed: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: false
          },
          {
            property: 'endTime',
            align: 'left',
            editable: false,
            label: 'Finish Date',
            fixed: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: false
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            hideSort: true,
            show: true,
            type: 'slot',
            isEditable: true,
            isWithTooltip: true,
            width: 150,
            filterableType: false
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyJobLog
        },

        selectEvent: {
          clipboard: true
        }
      },
      rowActions: [
        {
          name: labels.Details,
          icon: 'mdi-text-box-multiple',
          action: 'handleDetailsClick',
          id: 'btn-details--job-log-table-row-actions'
        }
      ]
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      getAllJobs(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.tableData = data.map((item) => ({
            ...item,
            status: this.getStatusName(item.status)
          }))
        })
        .finally(this.setLoading)
    },
    getStatusName(status) {
      if (status === 0) return 'Waiting'
      if (status === 1) return 'Started'
      if (status === 2) return 'Running'
      if (status === 3) return 'Completed'
      if (status === 4) return 'Failed'
      return 'Waiting'
    },
    exportJobLogData(downloadTypes) {},
    handleDetailsClick(row = {}) {
      this.$emit('onDetails', row)
    },
    getErrorMessage(row = {}) {
      if (row.status === 'Failed') {
        return row?.errorMessage || ''
      }
      return ''
    },
    getStatusBadgeProps(status = '') {
      return getStatusBadgeProps(status)
    },
    getDataTableFieldLabel(status = '') {
      return getDataTableFieldLabel(status)
    },
    getTooltipDisabilityStatus(row = {}) {
      return row?.status !== 'Failed' || !row?.errorMessage
    }
  }
}
</script>
