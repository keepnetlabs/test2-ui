<template>
  <div class="mt-4 pa-2">
    <v-card>
      <div class="header">
        <div class="title">
          <h2>
            Stats
          </h2>
          <p>
            Generic statistics for client and service providers
          </p>
        </div>
      </div>
      <div id="sandboxStats">
        <data-table
          id="sandbox-stats-data-table"
          ref="refSandboxStatsTable"
          is-server-side
          filterable
          options
          :no-padding-bottom="!!tableData.length"
          :loading="loading"
          :table="tableData"
          :columns="tableOptions.columns"
          :selectable="false"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :row-actions="tableOptions.rowActions"
          :addButton="tableOptions.addButton"
          :download-button="tableOptions.downloadButton"
          :is-show-download-modal="isSandboxStatsDownloadModal"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          :axios-payload.sync="axiosPayload"
          :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
          :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
          @deleteAction="showDeleteModal = true"
          @onEmptyBtnClicked="modalStatus = true"
          @downloadEvent="exportSandboxStats"
          @handleDownloadButtonClick="handleSandboxStatsDownloadButtonClick"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @refreshAction="callForData"
          @server-side-page-number-changed="serverSidePageNumberChanged"
          @server-side-size-changed="serverSideSizeChanged"
          @sortChangedEvent="sortChanged"
          @searchChangedEvent="handleSearchChange"
        ></data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  getStoreValue,
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { exportSandboxStats, getSandboxStats } from '@/api/sandbox'
import {
  createAxiosPayloadForSandboxStats,
  integrationTypesEnum,
  scanTypesEnum
} from '@/components/Sandbox/utils'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'sandboxStats',
  components: {
    DataTable
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      isSandboxStatsDownloadModal: false,
      integrationTypesEnum,
      scanTypesEnum,
      integrationTypes: [],
      loading: true,
      labels,
      tableData: [],
      showDeleteModal: false,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SANDBOXSTATS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SANDBOXSTATS,
        columns: [
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: true,
            type: 'text'
          },
          {
            property: 'analysisEngineTypeId',
            align: 'left',
            editable: false,
            label: labels.IntegrationType,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240
          },
          {
            property: 'scanType',
            align: 'left',
            editable: false,
            label: 'Scan Type',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableCustomFieldName: 'scanType',
            filterableItems: scanTypesEnum.map((item) => ({
              text: item.name,
              value: item.value
            }))
          },
          {
            property: 'totalRequest',
            align: 'right',
            editable: false,
            label: 'Requests',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number',
            filterableCustomFieldName: 'totalRequest'
          },
          {
            property: 'harmfulRequest',
            align: 'right',
            editable: false,
            label: 'Found Harmful',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number',
            filterableCustomFieldName: 'harmfulRequest'
          },
          {
            property: 'undetectedRequest',
            align: 'right',
            editable: false,
            label: 'Undetected',
            fixed: false,
            sortable: true,
            show: true,
            hasTooltip: true,
            type: 'text',
            filterableType: 'number'
          }
        ],
        downloadButton: {
          show: true
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: 'No stats available'
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'TotalRequest' }),
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      getSandboxStats(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          let { results = [] } = data
          results = results.map((resultItem) => {
            return {
              ...resultItem,
              analysisEngineTypeId: this.integrationTypesEnum.find(
                (item) => resultItem.analysisEngineTypeId === item.value
              ).name,
              scanType: this.scanTypesEnum.find((item) => item.value === resultItem.scanType).name
            }
          })
          this.tableData = results
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    handleSandboxStatsDownloadButtonClick() {
      this.isSandboxStatsDownloadModal = true
    },
    getDatatableListWhenFilterChange(company, integration, date) {
      this.axiosPayload = createAxiosPayloadForSandboxStats(company, integration, date)
      this.$refs.refSandboxStatsTable.reRenderFilters({})
      this.callForData()
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForData()
    },
    handleDeleteMultiple(selections) {
      selections.forEach((item) => {
        this.handleDelete(item)
      })
    },
    exportSandboxStats({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'TotalRequest',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportSandboxStats(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `sandboxStats.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
          this.isSandboxStatsDownloadModal = false
        })
      })
    }
  }
}
</script>
