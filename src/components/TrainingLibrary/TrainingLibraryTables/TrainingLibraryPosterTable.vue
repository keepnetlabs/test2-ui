<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    is-server-side
    row-key="trainingId"
    :filterable="false"
    :options="false"
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
    @onEmptyBtnClicked="handleAddPoster"
    @add-training="handleAddPoster"
  >
    <template #datatable-row-actions="{ scope }">
      <TrainingLibraryPosterRowActions :scope="scope" />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_COLUMNS } from '@/components/TrainingLibrary/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingLibraryPosterRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryPosterRowActions.vue'
export default {
  name: 'TrainingLibraryPosterTable',
  components: {
    TrainingLibraryPosterRowActions,
    DataTable
  },
  mixins: [useLoading, useDefaultTableFunctions, useAwarenessColumnBindsFromApi],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-training-library-poster-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_LIBRARY_POSTER_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_LIBRARY_POSTER_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          TRAINING_LIBRARY_COLUMNS.POSTER_NAME,
          TRAINING_LIBRARY_COLUMNS.CATEGORY,
          TRAINING_LIBRARY_COLUMNS.TARGET_AUDIENCE,
          TRAINING_LIBRARY_COLUMNS.LANGUAGES,
          TRAINING_LIBRARY_COLUMNS.CREATED_BY,
          TRAINING_LIBRARY_COLUMNS.COMPLIANCE,
          TRAINING_LIBRARY_COLUMNS.TAGS
        ],
        iEmpty: {
          btn: labels.CreateNewTraining,
          message: labels.EmptyTraining,
          icon: 'mdi-plus',
          id: 'btn-empty--training-library-poster-table'
          //todo disabled: !this.$store.getters['permissions/getCreateTrainingPermission']
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: false
        },
        //todo rowActions
        rowActions: ['', '', ''],
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
      AwarenessEducatorService.searchTraining(this.axiosPayload)
        .then((response) => {
          const {
            data: { data = {} }
          } = response
          const {
            results = [],
            totalNumberOfRecords = 0,
            totalNumberOfPages = 0,
            pageNumber = 1
          } = data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(this.setLoading)
    },
    handleAddPoster() {}
  }
}
</script>
