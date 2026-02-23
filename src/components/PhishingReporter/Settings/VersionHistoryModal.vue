<template>
  <app-dialog
    :status="status"
    icon="mdi-timer-sand-full"
    title="Download History"
    subtitle="Download past versions of the add-in"
    :custom-size="'800'"
    maxHeightSize="665"
    title-id="text--phishing-reporters-download-history-title"
    subtitle-id="text--phishing-reporters-download-history-subtitle"
    class-name="matching-modal version-history"
    @changeStatus="$emit('changeVersionHistoryModalStatus', false)"
  >
    <template v-slot:app-dialog-body>
      <v-card light>
        <data-table
          ref="refPhishingReporterDownloadHistory"
          :loading="isLoading"
          :refName="'versionHistory'"
          :table="tableData"
          :columns="table.columns"
          :show-filter-options="false"
          :showHeader="true"
          :selectable="false"
          :pageSizes="[5, 10, 25, 50, 100]"
          :filterable="true"
          :options="true"
          :count-row="5"
          :rowActions="table.rowActions"
          :empty="table.iEmpty"
          @downloadEvent="exportDownloadHistoryList"
          @handleDetails="handleDetails"
          @handleDownload="handleDownload"
          @refreshAction="callForTableData"
        />
      </v-card>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--phishing-reporter-settings-download-history-modal"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="$emit('changeVersionHistoryModalStatus', false)"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../../AppDialog'
import DataTable from '../../DataTable'
import {
  exportPhishingReporterDownloadHistory,
  searchGeneratedApplicationHistory
} from '@/api/phishingReporter'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'

export default {
  name: 'VersionHistoryModal',
  components: {
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      table: {
        columns: [
          {
            property: 'applicationType',
            align: 'left',
            editable: false,
            label: 'Item Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            exportSearchHelper: true,
            width: 200
          },
          {
            property: 'version',
            align: 'left',
            editable: false,
            label: 'Version',
            fixed: false,
            sortable: true,
            show: true,
            exportSearchHelper: true,
            type: 'text',
            width: 200
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            exportSearchHelper: true,
            type: 'text',
            width: 250
          }
        ],
        rowActions: [
          {
            name: 'Details',
            icon: 'mdi-text-box',
            action: 'handleDetails',
            id: 'btn-details--version-history-row-actions'
          }
        ],
        iEmpty: {
          message: 'You do not have any versions, yet'
        }
      },
      isLoading: false,
      payload: {
        pageNumber: 1,
        pageSize: 75000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  created() {
    this.callForTableData()
  },
  methods: {
    exportDownloadHistoryList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        structuredClone(this.payload.filter),
        this.$refs.refPhishingReporterDownloadHistory,
        'CreateTime'
      )
      if (this.$refs.refPhishingReporterDownloadHistory.search) {
        clientTableExportHelper.addSearchItems(this.table.columns)
      }
      if (
        this.$refs.refPhishingReporterDownloadHistory.sortProps &&
        this.$refs.refPhishingReporterDownloadHistory.sortProps.order
      ) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper

      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportPhishingReporterDownloadHistory(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Phishing Reporter Download History.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleDetails(row) {
      this.$emit('handleHistoryRow', row)
    },
    handleDownload(row) {},
    callForTableData() {
      this.isLoading = true
      searchGeneratedApplicationHistory(this.payload)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.tableData = data.results
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
