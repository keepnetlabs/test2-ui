<template>
  <DataTable
    class="campaign-manager-summary-scenario-info-table"
    :id="CONSTANTS.id"
    ref="refTable"
    options
    is-server-side
    no-padding-bottom
    is-custom-overflowed-column
    :show-filter-options="false"
    :is-settings-popup="false"
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    :count-row="tableOptions.countRow"
    :cell-padding="32"
    :showRefreshButton="false"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @refreshAction="callForData"
  >
    <template #table-search-left-side> </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { searchScenarioInfo } from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'CampaignManagerSummaryScenarioInfoTable',
  components: {
    DataTable
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    axiosPayload: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'campaign-manager-summary-scenario-info-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'category',
            align: 'left',
            editable: false,
            label: 'Category',
            sortable: false,
            showFilter: false,
            hideSort: true,
            hideFilter: true,
            filterable: false,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 200
          },
          {
            property: 'method',
            align: 'left',
            editable: false,
            label: 'Method',
            sortable: false,
            hideSort: true,
            hideFilter: true,
            show: true,
            type: 'text',
            width: 150
          },
          {
            property: 'language',
            align: 'left',
            editable: false,
            label: 'Language',
            sortable: false,
            hideSort: true,
            hideFilter: true,
            show: true,
            type: 'text',
            width: 100
          },
          {
            property: 'difficulty',
            align: 'center',
            editable: false,
            label: 'Difficulty',
            sortable: false,
            hideSort: true,
            hideFilter: true,
            show: true,
            type: 'status',
            width: 150
          },
          {
            property: 'numberOfScenarios',
            align: 'left',
            label: 'Number of Scenarios',
            sortable: false,
            hideSort: true,
            hideFilter: true,
            show: true,
            type: 'text',
            fixed: 'right'
          }
        ],
        addButton: {
          show: false
        },
        rowActions: [],
        downloadButton: {
          show: false
        },
        iEmpty: {
          message: ''
        },
        countRow: 5
      },
      tableData: []
    }
  },
  created() {
    if (!!this.axiosPayload) this.callForData()
  },
  watch: {
    axiosPayload: {
      deep: true,
      handler(val) {
        if (val) this.callForData()
      }
    }
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchScenarioInfo(this.axiosPayload)
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
    }
  }
}
</script>
