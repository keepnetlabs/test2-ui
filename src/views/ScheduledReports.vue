<template>
  <KContainer id="executive-reports" tabless>
    <ScheduledReportsDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteDialog"
    />
    <ExecutiveReportScheduleReportDialog
      v-if="isShowScheduleReportDialog"
      is-scheduled-page
      :status="isShowScheduleReportDialog"
      :selected-row="selectedRow"
      :is-duplicate="isDuplicate"
      :is-edit="isEdit"
      @on-close="toggleShowScheduleReportDialog"
      @on-save-close="toggleShowScheduleReportDialog(null, true)"
    />
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
      @add-scheduled-report="toggleShowScheduleReportDialog"
      @downloadEvent="exportScheduledReportList"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :id="tableOptions.rowActions[0].id"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          @on-click="handleViewReport(scope.row)"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :icon="tableOptions.rowActions[1].icon"
            :id="tableOptions.rowActions[1].id"
            :text="tableOptions.rowActions[1].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            @on-click="handleEdit(scope.row)"
          />
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleEdit(scope.row, true)"
          />
          <DefaultMenuRowAction
            :icon="!scope.row.status ? 'mdi-check-circle' : tableOptions.rowActions[3].icon"
            :id="tableOptions.rowActions[3].id"
            :text="!scope.row.status ? labels.SetAsActive : tableOptions.rowActions[3].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[3].disabled"
            @on-click="handleActiveStatus(scope.row)"
          />
          <DefaultMenuRowAction
            :icon="tableOptions.rowActions[4].icon"
            :id="tableOptions.rowActions[4].id"
            :text="tableOptions.rowActions[4].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[4].disabled"
            @on-click="handleDelete(scope.row)"
          />
        </RowActionsMenu>
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
import {
  exportReportScheduling,
  searchReportScheduling,
  setSchedulingReportStatus
} from '@/api/reports'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
import ScheduledReportsDeleteDialog from '@/components/ScheduledReports/ScheduledReportsDeleteDialog.vue'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
export default {
  name: 'ScheduledReports',
  components: {
    ExecutiveReportScheduleReportDialog,
    ScheduledReportsDeleteDialog,
    RowActionsMenu,
    DefaultMenuRowAction,
    DefaultButtonRowAction,
    DataTable,
    KContainer
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      labels,
      CONSTANTS: {
        id: 'awareness-educator-scheduled-list-data-table'
      },
      isShowDeleteDialog: false,
      isDuplicate: false,
      isEdit: false,
      selectedRow: null,
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      isShowScheduleReportDialog: false,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SCHEDULED_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SCHEDULED_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.SCHEDULE_NAME,
          COLUMNS.REPORT_NAME,
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
          show: true,
          action: 'add-scheduled-report',
          tooltip: labels.AddScheduledReport,
          id: 'btn-add--scheduled-reports'
        },
        downloadButton: {
          show: true
        },
        rowActions: [
          {
            name: labels.ViewReport,
            icon: 'mdi-text-box',
            id: 'btn-view-report--row-actions-scheduled-list'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit'
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'duplicate',
            id: 'btn-duplicate--row-actions-scheduled-list'
          },
          {
            name: labels.SetAsInactive,
            icon: 'mdi-close-circle',
            action: 'close',
            id: 'btn-cancel--row-actions-scheduled-list'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            id: 'btn-delete--row-actions-scheduled-list'
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
    handleViewReport(row) {
      this.$router.push({
        name: 'Preview Executive Report',
        params: {
          id: row.reportResourceId,
          isFromScheduledReport: true
        }
      })
    },
    handleEdit(row, isDuplicate = false) {
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.toggleShowScheduleReportDialog(row)
    },
    handleDelete(row) {
      this.toggleShowDeleteDialog(row, false)
    },
    handleActiveStatus(row) {
      setSchedulingReportStatus(row.resourceId, Number(!row.status)).then(() => {
        this.callForData()
      })
    },
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
        exportReportScheduling(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Scheduled-Reports-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    toggleShowDeleteDialog(row, forceUpdate = false) {
      if (forceUpdate) this.callForData()
      this.isShowDeleteDialog = !this.isShowDeleteDialog
      this.selectedRow = row
    },
    toggleShowScheduleReportDialog(row, forceUpdate = false) {
      if (forceUpdate) this.callForData()
      if (this.isShowScheduleReportDialog) {
        this.isEdit = false
        this.isDuplicate = false
      }
      this.isShowScheduleReportDialog = !this.isShowScheduleReportDialog
      this.selectedRow = row
    }
  }
}
</script>
