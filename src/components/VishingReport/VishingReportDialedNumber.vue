<template>
  <div>
    <CampaignManagerReportHeader
      class="mb-6"
      title="Users who dialed the number"
      subtitle="List of users who entered their credentials"
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
      @downloadEvent="exportVishingReportUsers"
      @refreshAction="callForData"
    />
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { getVishingReportDialedNumber } from '@/api/vishing'

export default {
  name: 'VishingReportDialedNumber',
  components: { DataTable, CampaignManagerReportHeader },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'vishing-report-dialed-data-table'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.VISHING_REPORT_DIALED_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.VISHING_REPORT_DIALED_TABLE,
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
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            minWidth: 200,
            overrideWidth: true
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
            fixed: false,
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
          message: labels.EmptyTrainingReportUsers
        },
        rowActions: []
      },
      tableData: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.isLoading = true
      getVishingReportDialedNumber(this.id)
        .then((response) => {
          this.tableData = response.data.data.results
          this.serverSideProps.totalNumberOfRecords = response.data.data.totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = response.data.data.totalNumberOfPages
          this.serverSideProps.pageNumber = response.data.data.pageNumber
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(this.setLoading)
    },
    exportVishingReportUsers() {}
  }
}
</script>
