<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
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
  >
    <template #datatable-row-actions="{ scope }">
      <EnrollmentsTableRowActions :scope="scope" :row-actions="tableOptions.rowActions" />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { EMITS, COLUMNS } from '../utils'
import EnrollmentsTableRowActions from '@/components/AwarenessEducator/Enrollments/EnrollmentsTableRowActions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
export default {
  name: 'EnrollmentsTable',
  components: {
    EnrollmentsTableRowActions,
    DataTable
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-enrollments-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ENROLLMENTS_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ENROLLMENTS_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        columns: [
          COLUMNS.NAME,
          COLUMNS.CATEGORY,
          COLUMNS.AUDIENCE,
          COLUMNS.LANGUAGES,
          COLUMNS.TYPE,
          COLUMNS.ENROLLED_BY,
          COLUMNS.TAGS
        ],
        iEmpty: {
          message: labels.EmptyEnrollments
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: true
        },
        rowActions: [
          {
            name: labels.SendTraining,
            icon: 'mdi-send'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil'
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete'
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {}
  }
}
</script>
