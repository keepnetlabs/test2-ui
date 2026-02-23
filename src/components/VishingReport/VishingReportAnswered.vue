<template>
  <div>
    <CampaignManagerReportHeader
      class="mb-6"
      title="Users who answered the call"
      subtitle="List of users who answered the call but didn't submitted any of data"
    />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
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
      @downloadEvent="exportVishingReportAnsweredUsers"
      @refreshAction="callForData"
    />
  </div>
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import DataTable from '@/components/DataTable'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import { exportVishingAnsweredUsers, getVishingReportAnswered } from '@/api/vishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

export default {
  name: 'VishingReportAnswered',
  components: { DataTable, CampaignManagerReportHeader },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    formDetails: {
      type: Object
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'vishing-report-answered-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.VISHING_REPORT_ANSWERED_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.VISHING_REPORT_ANSWERED_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: false,
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
            minWidth: 200,
            overrideWidth: true
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
            minWidth: 200,
            overrideWidth: true
          },
          {
            property: 'phoneNumber',
            align: 'right',
            editable: false,
            label: 'Phone Number',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            minWidth: 200,
            overrideWidth: true
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
            minWidth: 200,
            overrideWidth: true
          },
          {
            property: 'callDate',
            align: 'right',
            editable: false,
            label: 'Call Date',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 200,
            overrideWidth: true,
            filterableType: 'date'
          },
          {
            property: 'callDuration',
            align: 'right',
            editable: false,
            label: 'Call Duration',
            fixed: 'right',
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 200,
            overrideWidth: true,
            filterableType: 'text'
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyVishingReportAnswered
        },
        rowActions: []
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
        const fields = createCustomFieldColumns(val)
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'department'
        )
        if (departmentIndex) {
          this.tableOptions.columns.splice(departmentIndex + 1, 0, ...fields)
        }
      }
    }
  },
  methods: {
    callForData() {
      this.isLoading = true
      getVishingReportAnswered(this.axiosPayload, this.id)
        .then((response) => {
          const { data: { data = {} } = {} } = response || {}
          this.serverSideProps.totalNumberOfRecords = data.totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = data.totalNumberOfPages
          this.serverSideProps.pageNumber = data.pageNumber
          this.tableData = data?.results?.map((row) => {
            let customFields = {}
            row.customFieldValues.forEach((field) => {
              customFields[`${field.name}`] = field?.value
            })
            return { ...row, ...customFields }
          })
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(this.setLoading)
    },
    exportVishingReportAnsweredUsers(downloadTypes) {
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
        exportVishingAnsweredUsers(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Vishing-Answered-Users.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
