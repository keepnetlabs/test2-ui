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
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @onEmptyBtnClicked="handleAddScreenSaver"
    @add-training="handleAddScreenSaver"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @sortChangedEvent="sortChanged"
  >
    <template #datatable-row-actions="{ scope }">
      <TrainingLibraryScreensaverRowActions
        v-if="!isLoading"
        :scope="scope"
        @on-force-update="callForData"
      />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
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
import tableFilterMixin from '@/components/TrainingLibrary/mixins/tableFilterMixin'
export default {
  name: 'TrainingLibraryScreensaverTable',
  components: {
    TrainingLibraryScreensaverRowActions,
    DataTable
  },
  mixins: [tableFilterMixin],
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
          TRAINING_LIBRARY_COLUMNS.TAGS,
          TRAINING_LIBRARY_COLUMNS.VENDOR,
          TRAINING_LIBRARY_COLUMNS.DATE_CREATED
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
    selectedTrainingContent: {
      immediate: true,
      handler(tabValue) {
        if (tabValue === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES) {
          this.$set(this.tableOptions, 'iEmpty', {
            ...this.tableOptions.iEmpty,
            message: labels.EmptyTrainingFavorites,
            btn: null
          })
        } else {
          this.$set(this.tableOptions, 'iEmpty', {
            ...this.tableOptions.iEmpty,
            message: labels.EmptyScreensaver,
            btn: labels.CreateNewScreensaver
          })
        }
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
  mounted() {
    this.$refs.refTable.firstColFixed = this.firstColFixed
    this.$refs.refTable.lastColFixed = this.lastColFixed
  },
  methods: {
    ...mapActions({
      callForData: 'trainingLibrary/callForTrainingLibrary',
      setNewScreensaverModal: 'trainingLibrary/setNewScreensaverModal'
    }),
    handleAddScreenSaver() {
      this.setNewScreensaverModal({
        status: true,
        selectedRow: null,
        isEdit: false,
        isDuplicate: false
      })
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.callForData()
    }
  }
}
</script>
