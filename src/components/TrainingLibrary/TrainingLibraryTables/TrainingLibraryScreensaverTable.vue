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
    @onEmptyBtnClicked="handleAddScreenSaver"
    @add-training="handleAddScreenSaver"
  >
    <template #datatable-row-actions="{ scope }">
      <TrainingLibraryScreensaverRowActions :scope="scope" @on-force-update="callForData" />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_COLUMNS } from '@/components/TrainingLibrary/utils'
import TrainingLibraryScreensaverRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryScreensaverRowActions.vue'
import { mapActions, mapGetters } from 'vuex'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingLibraryScreensaverTable',
  components: {
    TrainingLibraryScreensaverRowActions,
    DataTable
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-training-library-screensaver-data-table'
      },
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_LIBRARY_SCREENSAVER_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_LIBRARY_SCREENSAVER_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          TRAINING_LIBRARY_COLUMNS.SCREENSAVER_NAME,
          TRAINING_LIBRARY_COLUMNS.CATEGORY,
          TRAINING_LIBRARY_COLUMNS.TARGET_AUDIENCE,
          TRAINING_LIBRARY_COLUMNS.LANGUAGES,
          TRAINING_LIBRARY_COLUMNS.CREATED_BY,
          TRAINING_LIBRARY_COLUMNS.COMPLIANCE,
          TRAINING_LIBRARY_COLUMNS.TAGS
        ],
        iEmpty: {
          btn: labels.CreateNewScreensaver,
          message: labels.EmptyScreensaver,
          icon: 'mdi-plus',
          id: 'btn-empty--training-library-screensaver-table'
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
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent',
      renderedColumns: 'trainingLibrary/getRenderedColumns',
      firstColFixed: 'trainingLibrary/getFirstColFixed',
      lastColFixed: 'trainingLibrary/getLastColFixed'
    })
  },
  watch: {
    renderedColumns: {
      immediate: true,
      handler(renderedCols = []) {
        this.tableOptions.columns.forEach((col) => {
          if (col.property === PROPERTY_STORE.SCREENSAVER_NAME) {
            col.show = true
            return
          }
          col.show = renderedCols.includes(col.property)
        })
      }
    },
    selectedTrainingContent(tabValue) {
      if (tabValue === TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU) {
        this.$set(this.tableOptions, 'iEmpty', {
          ...this.tableOptions.iEmpty,
          message: labels.EmptyScreensaverCreatedByYouSubtitle
        })
      } else {
        this.$set(this.tableOptions, 'iEmpty', {
          ...this.tableOptions.iEmpty,
          message: ''
        })
      }
    },
    firstColFixed() {
      this.tableOptions.columns[0].fixed = this.firstColFixed
      this.$refs.refTable.firstColFixed = this.firstColFixed
    },
    lastColFixed() {
      this.tableOptions.columns[this.tableOptions.columns.length - 1].fixed = this.lastColFixed
      this.$refs.refTable.lastColFixed = this.lastColFixed
    }
  },
  methods: {
    ...mapActions({
      callForData: 'trainingLibrary/callForTableData',
      setNewScreensaverModal: 'trainingLibrary/setNewScreensaverModal'
    }),
    handleAddScreenSaver() {
      this.setNewScreensaverModal({
        status: true,
        selectedRow: null,
        isEdit: false,
        isDuplicate: false
      })
    }
  }
}
</script>
