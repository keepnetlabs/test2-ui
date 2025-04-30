<template>
  <DataTable
    v-if="getThreatIntelligencePermissionsSearch"
    ref="refThreatIntelligence"
    id="threat-intelligence-table"
    is-server-side
    selectable
    row-key="email"
    :showPagination="true"
    :options="true"
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
    :download-button="tableOptions.downloadButton"
    @columnFilterChanged="columnFilterChanged"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @downloadEvent="exportData"
    @refreshAction="callForData"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { useLoading } from '@/hooks/useLoading'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getThreatIntelligenceList, exportThreatIntelligence } from '@/api/threatIntelligence'
import { mapGetters } from 'vuex'

export default {
  name: 'ThreatIntelligenceList',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    justShowReportAction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'ThreatIntelligenceList',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({}, 'leakdate'),
      serverSideProps: new ServerSideProps(),
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.THREATS_INTELLIGENCE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.THREATS_INTELLIGENCE_TABLE,
        serverSideEvents: { pagination: true, search: false, sort: true },
        columns: [
          {
            property: 'email',
            editable: false,
            label: 'Breached Account',
            fixed: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 150,
            filterableType: false
          },
          {
            property: 'hashtype',
            editable: false,
            label: 'Password Type',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'text',
            width: 150,
            filterableType: false
          },
          {
            property: 'source',
            editable: false,
            label: 'Source',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'text',
            width: 150,
            filterableType: false
          },
          {
            property: 'leakdate',
            editable: false,
            label: 'Leak Date',
            fixed: false,
            hideSort: false,
            show: true,
            type: 'text',
            filterableType: false
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message:
            'We could not detect any breached and exposed accounts <br/> with email addresses of your domain names'
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getThreatIntelligencePermissionsExport']
        }
      },
      rowActions: []
    }
  },
  mounted() {
    this.callForData()
  },
  computed: {
    ...mapGetters({
      getThreatIntelligencePermissionsSearch: 'permissions/getThreatIntelligencePermissionsSearch'
    })
  },
  methods: {
    callForData() {
      this.isLoading = true
      getThreatIntelligenceList(this.axiosPayload)
        .then((response) => {
          const {
            totalNumberOfRecords = 0,
            totalNumberOfPages = 0,
            pageNumber = 1,
            results = []
          } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          for (const row of results) {
            row.isActive = row.isActive ? 'Active' : 'Passive'
          }
          this.tableData = results
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.isLoading = false))
    },
    exportData(downloadTypes) {
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
        exportThreatIntelligence(payload).then((response) => {
          const { data } = response
          if (data && data instanceof Blob) {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Threat-Intelligence.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        })
      })
    }
  }
}
</script>
