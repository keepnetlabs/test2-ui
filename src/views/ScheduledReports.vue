<template>
  <KContainer id="executive-reports" tabless>
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      selectable
      filterable
      options
      is-server-side
      row-key="id"
      :loading="isLoading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      :server-side-props="serverSideProps"
      :server-side-events="tableOptions.serverSideEvents"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :add-button="tableOptions.addButton"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="axiosPayload"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @refreshAction="callForData"
      @downloadEvent="exportScheduledReportList"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :id="tableOptions.rowActions[0].id"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled || !scope.row.isEditable"
          @on-click="handleDownload(scope.row)"
        />
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[1].icon"
          :id="tableOptions.rowActions[1].id"
          :text="tableOptions.rowActions[1].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled || !scope.row.isEditable"
          @on-click="handleDelete(scope.row)"
        />
      </template>
    </DataTable>
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import DataTable from '@/components/DataTable.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { COLUMNS } from '@/components/AwarenessEducator/utils'
import labels from '@/model/constants/labels'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { searchReportScheduling } from '@/api/reports'

export default {
  name: 'ScheduledReports',
  components: {
    DefaultButtonRowAction,
    DataTable,
    KContainer
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-certificates-list-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CERTIFICATES_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CERTIFICATES_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.SCHEDULE_NAME,
          COLUMNS.FREQUENCY,
          COLUMNS.DATE_CREATED,
          COLUMNS.LAST_SEND_DATE,
          COLUMNS.NEXT_SEND_DATE
        ],
        iEmpty: {
          message: labels.EmptyScheduledReport,
          icon: 'mdi-plus',
          id: 'btn-empty--scheduled-list'
        },
        addButton: {
          show: false,
          action: 'add-certificate',
          tooltip: labels.AddCertificate,
          id: 'btn-add--certificate',
          disabled: !this.$store.getters['permissions/getCreateCertificatePermission']
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getExportCertificatePermission']
        },
        rowActions: [
          {
            name: labels.Download,
            icon: 'mdi-download',
            id: 'btn-download--row-actions-scheduled-list',
            disabled: !this.$store.getters['permissions/getEditCertificatePermission']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            id: 'btn-delete--row-actions-scheduled-list',
            disabled: !this.$store.getters['permissions/getDeleteCertificatePermission']
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  mounted() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchReportScheduling(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    handleDownload(row) {},
    handleDelete(row) {},
    exportScheduledReportList(downloadTypes) {
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
        AwarenessEducatorService.exportCertificates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Certificates-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
