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
    @onEmptyBtnClicked="handleAdd"
    @add-training="handleAdd"
  >
    <template #empty-table-inline>
      <div class="people__no-data">
        <p id="text--empty-table-title" class="people__no-data__header">
          {{ labels.EmptyTrainingMaterial }}
        </p>
        <div class="people__no-data__buttons mt-4">
          <VMenu offset-y transition="scale-transition" nudge-bottom="4">
            <template v-slot:activator="{ on }">
              <div
                class="people__no-data__buttons--button"
                v-on="on"
                id="btn-empty--target-users-people"
              >
                <VIcon color="#fff" style="margin-top: 1px;" class="mr-1">mdi-plus</VIcon>
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
      <DefaultButtonRowAction
        v-if="scope.row.type === TRAINING_TYPES.SCORM"
        :id="tableOptions.rowActions[0].id"
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled"
        :checkIsOwnerProperty="false"
        @on-click="handleSendTraining(scope.row)"
      />
      <DefaultButtonRowAction
        v-else
        :id="tableOptions.rowActions[2].id"
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="tableOptions.rowActions[2].disabled"
        :icon="tableOptions.rowActions[2].icon"
        :text="tableOptions.rowActions[2].name"
        :checkIsOwnerProperty="false"
        @on-click="handlePreview(scope.row)"
      />
      <RowActionsMenu>
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[1].id"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled || !scope.row.isEditable"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          @on-click="handleEdit(scope.row)"
        />
        <DefaultMenuRowAction
          v-if="scope.row.type === TRAINING_TYPES.SCORM"
          :id="tableOptions.rowActions[2].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[2].disabled"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
        />
        <DefaultMenuRowAction
          v-else
          :id="tableOptions.rowActions[5].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[5].disabled"
          :icon="tableOptions.rowActions[5].icon"
          :text="tableOptions.rowActions[5].name"
          :checkIsOwnerProperty="false"
          @on-click="handleDownloadPoster(scope.row)"
        />
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[3].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[3].disabled"
          :icon="tableOptions.rowActions[3].icon"
          :text="tableOptions.rowActions[3].name"
          @on-click="handleDuplicate(scope.row)"
        />
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[4].id"
          :scope="scope"
          :disabled="tableOptions.rowActions[4].disabled || !scope.row.isEditable"
          :icon="tableOptions.rowActions[4].icon"
          :text="tableOptions.rowActions[4].name"
          @on-click="handleActionDelete(scope.row)"
        />
      </RowActionsMenu>
    </template>
  </DataTable>
</template>

<script>
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import DataTable from '@/components/DataTable.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import { EMITS, TRAINING_TYPES } from '@/components/AwarenessEducator/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_COLUMNS } from '@/components/TrainingLibrary/utils'
import { addTrainingItems } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingLibraryAllTypesTable',
  components: { RowActionsMenu, DefaultButtonRowAction, DataTable, DefaultMenuRowAction },
  mixins: [useLoading, useDefaultTableFunctions, useAwarenessColumnBindsFromApi],
  data() {
    return {
      TRAINING_TYPES,
      addTrainingItems,
      labels,
      CONSTANTS: {
        id: 'awareness-educator-training-library-all-types-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
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
        //todo rowActions
        rowActions: [
          {
            id: 'btn-send--row-actions-training-list',
            name: labels.SendTraining,
            icon: 'mdi-send',
            disabled: !this.$store.getters['permissions/getSendTrainingPermission']
          },
          {
            id: 'btn-edit--row-actions-training-list',
            name: labels.Edit,
            icon: 'mdi-pencil',
            disabled: !this.$store.getters['permissions/getUpdateTrainingPermission']
          },
          {
            id: 'btn-preview--row-actions-training-list',
            name: labels.Preview,
            icon: 'mdi-eye'
          },
          {
            id: 'btn-duplicate--row-actions-training-list',
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'on-duplicate'
          },
          {
            id: 'btn-delete--row-actions-training-list',
            name: labels.Delete,
            icon: 'mdi-delete',
            disabled: !this.$store.getters['permissions/getDeleteTrainingPermission']
          },
          {
            id: 'btn-download--row-actions-training-list',
            name: labels.DownloadPoster,
            icon: 'mdi-download',
            disabled: !this.$store.getters['permissions/getDeleteTrainingPermission']
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  methods: {
    handleSendTraining(row) {
      this.$emit(EMITS.ON_TRAINING, row)
    },
    handleEdit(row) {
      this.$emit(EMITS.ON_EDIT, row)
    },
    handlePreview(row) {
      this.$emit(EMITS.ON_PREVIEW, row)
    },
    handleActionDelete(row) {
      this.$emit(EMITS.ON_ACTION_DELETE, row)
    },
    handleAdd() {
      this.$emit(EMITS.ON_ADD)
    },
    handleAddPoster() {
      this.$emit(EMITS.ON_ADD_POSTER)
    },
    handleDuplicate(row) {
      AwarenessEducatorService.duplicateTraining(row.trainingId).then(() => {
        this.callForData()
      })
    },
    handleDownloadPoster(item = {}) {
      this.$emit(EMITS.ON_DOWNLOAD_POSTER, item)
    },
    handleAddTrainingLibraryContent(text) {}
  }
}
</script>
