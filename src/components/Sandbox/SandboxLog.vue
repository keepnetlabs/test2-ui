<template>
  <div class="mt-4 pa-2">
    <v-card>
      <div class="header">
        <div class="title">
          <h2>
            Logs
          </h2>
          <p class="">
            All actions and results from client requests
          </p>
        </div>
      </div>
      <div id="sandbox">
        <data-table
          id="sandbox-data-table-log"
          ref="refSandboxLogTable"
          is-server-side
          filterable
          options
          :no-padding-bottom="!!tableData.length"
          :loading="loading"
          :selectable="false"
          :table="tableData"
          :columns="tableOptions.columns"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :row-actions="tableOptions.rowActions"
          :addButton="tableOptions.addButton"
          :isShowDownloadModal="isSandboxLogDownloadModal"
          :download-button="tableOptions.downloadButton"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          :axios-payload.sync="axiosPayload"
          :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
          :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
          @deleteAction="showDeleteModal = true"
          @onEmptyBtnClicked="modalStatus = true"
          @downloadEvent="exportSandboxLog"
          @handleDownloadButtonClick="handleSandboxLogDownloadButtonClick"
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
import { exportSandboxLog, getSandboxLog } from '@/api/sandbox'
import {
  createAxiosPayloadForSandboxLogs,
  integrationTypesEnum,
  scanTypesEnum
} from '@/components/Sandbox/utils'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'sandbox',
  components: {
    DataTable
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      isSandboxLogDownloadModal: false,
      integrationTypesEnum,
      scanTypesEnum,
      integrationTypes: [],
      loading: true,
      labels,
      tableData: [],
      showDeleteModal: false,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.sandbox,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SANDBOX,
        columns: [
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: labels.CompanyName,
            sortable: true,
            show: true,
            type: 'text',
            width: 240
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
            filterableItems: scanTypesEnum.map((item) => ({
              text: item.name,
              value: item.value
            }))
          },
          {
            property: 'details',
            align: 'left',
            editable: false,
            label: 'Details',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            filterableCustomFieldName: 'details'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Undetected', 'Malicious', 'Phishing']
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
          message: 'No logs available'
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      getSandboxLog(this.axiosPayload)
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
    handleSandboxLogDownloadButtonClick() {
      this.isSandboxLogDownloadModal = true
    },
    getDatatableListWhenFilterChange(company, integration, date) {
      this.axiosPayload = createAxiosPayloadForSandboxLogs(company, integration, date)
      this.$refs.refSandboxLogTable.reRenderFilters({})
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
    exportSandboxLog({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CompanyName',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportSandboxLog(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `sandboxLog.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
          this.isSandboxLogDownloadModal = false
        })
      })
    }
  }
}
</script>
