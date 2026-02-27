<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    is-server-side-selection
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
    @onEmptyBtnClicked="handleAddInfoGraphic"
    @add-training="handleAddInfoGraphic"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @sortChangedEvent="sortChanged"
  >
    <template #datatable-custom-column="{ scope }">
      <LanguagesColumn
        v-if="scope.column.property === 'languages'"
        :value="scope.row.languages"
        :preferred-language-types="getPreferredLanguageTypes"
      />
    </template>
    <template #datatable-row-actions="{ scope }">
      <TrainingLibraryInfographicRowActions
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
import TrainingLibraryInfographicRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryInfographicRowActions.vue'
import LanguagesColumn from '@/components/Common/Simulator/LanguagesColumn/LanguagesColumn.vue'
import { mapActions, mapGetters } from 'vuex'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import tableFilterMixin from '@/components/TrainingLibrary/mixins/tableFilterMixin'
export default {
  name: 'TrainingLibraryInfographicTable',
  components: {
    LanguagesColumn,
    TrainingLibraryInfographicRowActions,
    DataTable
  },
  mixins: [tableFilterMixin],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-training-library-infographic-data-table'
      },
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_LIBRARY_INFOGRAPHIC_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_LIBRARY_INFOGRAPHIC_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          TRAINING_LIBRARY_COLUMNS.INFOGRAPHIC_NAME,
          TRAINING_LIBRARY_COLUMNS.CATEGORY,
          TRAINING_LIBRARY_COLUMNS.LEVEL,
          TRAINING_LIBRARY_COLUMNS.TARGET_AUDIENCE,
          TRAINING_LIBRARY_COLUMNS.DURATION,
          TRAINING_LIBRARY_COLUMNS.LANGUAGES,
          TRAINING_LIBRARY_COLUMNS.CREATED_BY,
          TRAINING_LIBRARY_COLUMNS.COMPLIANCE,
          TRAINING_LIBRARY_COLUMNS.TAGS,
          TRAINING_LIBRARY_COLUMNS.VENDOR,
          TRAINING_LIBRARY_COLUMNS.DATE_CREATED
        ],
        iEmpty: {
          btn: labels.CreateNewInfographic,
          message: labels.EmptyInfographic,
          icon: 'mdi-plus',
          id: 'btn-empty--training-library-infographic-table',
          disabled: !this.$store.getters['permissions/getCreateTrainingPermission']
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: false
        },
        rowActions: ['', '', ''],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  computed: {
    ...mapGetters({
      getPreferredLanguageTypes: 'trainingLibraryHelpers/getPreferredLanguageTypes',
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
          if (col.property === PROPERTY_STORE.INFOGRAPHIC_NAME) {
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
            message: labels.EmptyInfographic,
            btn: labels.CreateNewInfographic
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
    this.$refs.refTable.$refs.elTableRef.sort(
      this.axiosPayload.orderBy,
      this.axiosPayload.sortOrder ? 'ascending' : 'descending'
    )
  },
  methods: {
    ...mapActions({
      callForData: 'trainingLibrary/callForTrainingLibrary',
      setNewInfographicModal: 'trainingLibrary/setNewInfographicModal'
    }),
    handleAddInfoGraphic() {
      this.setNewInfographicModal({
        status: true,
        isEdit: false,
        selectedRow: null,
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
