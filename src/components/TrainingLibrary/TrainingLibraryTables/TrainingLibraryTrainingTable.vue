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
    @onEmptyBtnClicked="handleAddTraining"
    @add-training="handleAddTraining"
  >
    <template #datatable-row-actions="{ scope }">
      <TrainingLibraryTrainingRowActions :scope="scope" @on-force-update="callForData" />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_COLUMNS } from '@/components/TrainingLibrary/utils'
import TrainingLibraryTrainingRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryTrainingRowActions.vue'
import { mapActions, mapGetters } from 'vuex'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingLibraryTrainingTable',
  components: {
    TrainingLibraryTrainingRowActions,
    DataTable
  },
  mixins: [useDefaultTableFunctions, useAwarenessColumnBindsFromApi],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-training-library-training-data-table'
      },
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_LIBRARY_TRAINING_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_LIBRARY_TRAINING_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          TRAINING_LIBRARY_COLUMNS.TRAINING_NAME,
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
          id: 'btn-empty--training-library-training-table'
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
  computed: {
    ...mapGetters({
      tableData: 'trainingLibrary/getTableData',
      serverSideProps: 'trainingLibrary/getServerSideProps',
      axiosPayload: 'trainingLibrary/getAxiosPayload',
      isLoading: 'trainingLibrary/getIsLoading',
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent'
    })
  },
  watch: {
    selectedTrainingContent(tabValue) {
      if (tabValue === TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU) {
        this.$set(this.tableOptions, 'iEmpty', {
          ...this.tableOptions.iEmpty,
          message: labels.EmptyTrainingCreatedByYouSubtitle
        })
      } else {
        this.$set(this.tableOptions, 'iEmpty', {
          ...this.tableOptions.iEmpty,
          message: ''
        })
      }
    }
  },
  methods: {
    ...mapActions({
      callForData: 'trainingLibrary/callForTableData',
      setNewTrainingModal: 'trainingLibrary/setNewTrainingModal'
    }),
    handleAddTraining() {
      this.setNewTrainingModal({
        status: true,
        isEdit: false,
        isDuplicate: false,
        selectedRow: null
      })
    }
  }
}
</script>
