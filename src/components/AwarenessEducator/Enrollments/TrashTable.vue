<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    row-key="enrollmentId"
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
    @on-delete="handleDelete"
    @on-view-report="handleViewReport"
    @on-restore="handleRestore"
  >
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { COLUMNS } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrashTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions, useAwarenessColumnBindsFromApi],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-enrollments-trash-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRASH_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRASH_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.ENROLLMENT_NAME,
          COLUMNS.TRAINING_NAME_UNFIXED,
          COLUMNS.CATEGORY,
          COLUMNS.AUDIENCE,
          COLUMNS.LANGUAGES,
          COLUMNS.TYPE,
          COLUMNS.ENROLLED_BY,
          COLUMNS.START_DATE,
          COLUMNS.DELIVERY,
          COLUMNS.TARGET_USERS,
          COLUMNS.TAGS
        ],
        iEmpty: {
          message: labels.EmptyEnrollments
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: false
        },
        rowActions: [
          {
            name: labels.ViewReport,
            icon: 'mdi-text-box',
            action: 'on-view-report',
            isNotShow: true
          },
          {
            name: labels.Restore,
            icon: '$refresh-left',
            action: 'on-restore'
          },
          {
            name: labels.DeletePermanently,
            icon: 'mdi-delete',
            action: 'on-delete'
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
      AwarenessEducatorService.searchTrash(this.axiosPayload)
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
    handleDelete(row) {
      this.$emit('on-delete', row)
    },
    handleViewReport(row) {
      this.$router.push({
        name: 'Training Report',
        params: {
          id: row.enrollmentId
        }
      })
    },
    handleRestore(row) {
      this.$emit('on-restore', row)
    }
  }
}
</script>
