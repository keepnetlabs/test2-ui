<template>
  <AppDialog
    title-id="text--job-log-details-popup-title"
    subtitle-id="text--job-log-details-popup-subtitle"
    class="job-log-details"
    maxHeightSize="665"
    :custom-size="'1000'"
    icon="mdi-text-box-multiple"
    title="Job Details"
    :subtitle="selectedRow.name"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div v-if="tableData && tableData.length" class="job-log-details__progress">
        <span class="job-log-details__progress-header">Progress</span>
        <span :class="{ 'ml-1': progress !== 100, 'job-log-details__progress-value-text': true }">
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
      />
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
import { getDefaultAxiosPayload } from '@/utils/functions'
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

export default {
  name: 'JobLogDetailsTable',
  components: { DataTable, AppDialog },
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
            label: 'E-mail',
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
            fixed: 'right',
            hideSort: true,
            show: true,
            type: 'text',
            filterableType: false
          }
          // {
          //   property: 'Priority',
          //   align: 'left',
          //   editable: false,
          //   label: 'Priority',
          //   fixed: false,
          //   hideSort: true,
          //   show: true,
          //   type: 'priority',
          //   width: 150,
          //   filterableType: false
          // },
          // {
          //   property: 'Status',
          //   align: 'center',
          //   editable: false,
          //   label: 'Status',
          //   fixed: 'right',
          //   hideSort: true,
          //   show: true,
          //   type: 'status',
          //   isEditable: true,
          //   isWithTooltip: true,
          //   filterableType: false
          //   // filterableType: 'select',
          //   // filterableItems: ['Running', 'Failed', 'Completed']
          // }
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
    callForData() {
      this.setLoading(true)
      getJobDetail(this.selectedRow.resourceId)
        .then((response) => {
          const {
            data: { data }
          } = response
          const processResults = data.processResults.map((result) => result.processErrors)
          const resultArray = []
          for (let i = 0; i < processResults.length; i++) {
            const results = processResults[i]
              .map((result) => JSON.parse(result.inputData || null))
              .filter(Boolean)
            resultArray.push(...results)
          }
          this.tableData = resultArray
          this.progress = data.progress
        })
        .finally(this.setLoading)
    },
    handleClose() {
      this.$emit('onClose')
    }
  }
}
</script>
