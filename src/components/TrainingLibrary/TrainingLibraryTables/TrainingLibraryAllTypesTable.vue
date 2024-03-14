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
  >
    <template #empty-table-inline>
      <div class="empty-inline">
        <h2 id="text--empty-table-title" class="people__no-data__header">
          {{ getEmptyTableText }}
        </h2>
        <p
          v-if="getEmptyTableSubtitleText"
          id="text--empty-table-subtitle"
          class="people__no-data__body"
        >
          {{ getEmptyTableSubtitleText }}
        </p>
        <div class="people__no-data__buttons mt-4">
          <VMenu offset-y transition="scale-transition" nudge-bottom="4">
            <template #activator="{ on }">
              <div
                class="people__no-data__buttons--button"
                style="height: 36px;"
                v-on="on"
                id="btn-empty--target-users-people"
              >
                <VIcon color="#fff" class="mr-1">mdi-plus</VIcon>
                <span class="fw-600">{{ labels.CreateNewMaterial.toUpperCase() }}</span>
              </div>
            </template>
            <div>
              <VList>
                <VListItem
                  v-for="item in addTrainingItems"
                  :key="item.id"
                  :id="item.id"
                  :disabled="item.disabled"
                  @click="handleAddTrainingLibraryContent(item.text)"
                >
                  <VListItemTitle class="add-users__title">{{ item.text }}</VListItemTitle>
                </VListItem>
              </VList>
            </div>
          </VMenu>
        </div>
      </div>
    </template>
    <template #datatable-row-actions="{ scope }">
      <TrainingLibraryTrainingRowActions
        v-if="scope.row.type === TRAINING_LIBRARY_TYPES.TRAINING"
        :scope="scope"
      />
      <TrainingLibraryLearningPathRowActions
        v-else-if="scope.row.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH"
        :scope="scope"
      />
      <TrainingLibraryScreensaverRowActions
        v-else-if="scope.row.type === TRAINING_LIBRARY_TYPES.SCREENSAVER"
        :scope="scope"
      />
      <TrainingLibraryInfographicRowActions
        v-else-if="scope.row.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC"
        :scope="scope"
      />
      <TrainingLibraryPosterRowActions
        v-else-if="scope.row.type === TRAINING_LIBRARY_TYPES.POSTER"
        :scope="scope"
      />
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
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import AwarenessEducatorService from '@/api/awarenessEducator'
import {
  TRAINING_LIBRARY_COLUMNS,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/utils'
import { addTrainingItems } from '@/components/TrainingLibrary/utils'
import TrainingLibraryTrainingRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryTrainingRowActions.vue'
import TrainingLibraryLearningPathRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryLearningPathRowActions.vue'
import TrainingLibraryScreensaverRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryScreensaverRowActions.vue'
import TrainingLibraryInfographicRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryInfographicRowActions.vue'
import TrainingLibraryPosterRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryPosterRowActions.vue'
import { mapGetters } from 'vuex'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import useAddTrainingLibraryContent from '@/hooks/useAddTrainingLibraryContent'

export default {
  name: 'TrainingLibraryAllTypesTable',
  components: {
    TrainingLibraryPosterRowActions,
    TrainingLibraryInfographicRowActions,
    TrainingLibraryScreensaverRowActions,
    TrainingLibraryLearningPathRowActions,
    TrainingLibraryTrainingRowActions,
    DataTable
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      TRAINING_LIBRARY_TYPES,
      addTrainingItems,
      labels,
      CONSTANTS: {
        id: 'awareness-educator-training-library-all-types-data-table'
      },
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_LIBRARY_ALL_TYPES_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_LIBRARY_ALL_TYPES_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          TRAINING_LIBRARY_COLUMNS.MATERIAL_NAME,
          TRAINING_LIBRARY_COLUMNS.TYPE,
          TRAINING_LIBRARY_COLUMNS.CATEGORY,
          TRAINING_LIBRARY_COLUMNS.TARGET_AUDIENCE,
          TRAINING_LIBRARY_COLUMNS.LANGUAGES,
          TRAINING_LIBRARY_COLUMNS.CREATED_BY,
          TRAINING_LIBRARY_COLUMNS.COMPLIANCE,
          TRAINING_LIBRARY_COLUMNS.TAGS
        ],
        iEmpty: {
          btn: labels.CreateNewMaterial,
          message: labels.EmptyTrainingMaterial,
          icon: 'mdi-plus',
          id: 'btn-empty--training-library-all-types-table'
          //todo disabled: !this.$store.getters['permissions/getCreateTrainingPermission']
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
      selectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent',
      renderedColumns: 'trainingLibrary/getRenderedColumns',
      firstColFixed: 'trainingLibrary/getFirstColFixed',
      lastColFixed: 'trainingLibrary/getLastColFixed',
      tableData: 'trainingLibrary/getTableData',
      serverSideProps: 'trainingLibrary/getServerSideProps',
      axiosPayload: 'trainingLibrary/getAxiosPayload',
      isLoading: 'trainingLibrary/getIsLoading'
    }),
    getEmptyTableText() {
      if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS)
        return labels.EmptyTrainingMaterial
      else if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES)
        return labels.EmptyTrainingFavorites
      else if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU)
        return labels.EmptyTrainingAllTypeCreatedByYou
      else return labels.EmptyTrainingMaterial
    },
    getEmptyTableSubtitleText() {
      if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS) return ''
      else if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES) return ''
      else if (this.selectedTrainingContent === TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU)
        return labels.EmptyTrainingAllTypeCreatedByYouSubtitle
      else return ''
    }
  },
  watch: {
    renderedColumns: {
      immediate: true,
      handler(renderedCols = []) {
        this.tableOptions.columns.forEach((col) => {
          if (col.property === PROPERTY_STORE.MATERIAL_NAME) {
            col.show = true
            return
          }
          col.show = renderedCols.includes(col.property)
        })
      }
    },
    firstColFixed() {
      this.$refs.refTable.firstColFixed = this.firstColFixed
    },
    lastColFixed() {
      this.$refs.refTable.lastColFixed = this.lastColFixed
    }
  },
  mounted() {
    this.$refs.refTable.firstColFixed = this.firstColFixed
    this.$refs.refTable.lastColFixed = this.lastColFixed
  }
}
</script>
