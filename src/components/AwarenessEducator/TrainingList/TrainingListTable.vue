<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    row-key="trainingId"
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
    @onEmptyBtnClicked="handleAdd"
    @add-training="handleAdd"
    @downloadEvent="exportTrainingList"
  >
    <template #addUsers>
      <v-menu :offset-y="true" bottom left nudge-right="32" nudge-bottom="4">
        <template #activator="{ on: menu }">
          <v-tooltip bottom opacity="1">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-on="{ ...tooltip, ...menu }"
                :disabled="!$store.getters['permissions/getCreateTrainingPermission']"
                id="btn-add--training"
                class="button-new"
                style="margin-right: 10px;"
                rounded
                color="#2196f3"
              >
                <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
                <span class="button-new__text">NEW</span>
              </v-btn>
            </template>
            <span class="tooltip-span">Add Training</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-for="item in addTrainingItems"
            :key="item.id"
            :id="item.id"
            :disabled="item.disabled"
            @click="handleAddTraining(item)"
          >
            <v-list-item-title class="add-users__title">{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import { EMITS, COLUMNS, TRAINING_TYPES } from '../utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
export default {
  name: 'TrainingListTable',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable
  },
  mixins: [useLoading, useDefaultTableFunctions, useAwarenessColumnBindsFromApi],
  data() {
    return {
      TRAINING_TYPES,
      CONSTANTS: {
        id: 'awareness-educator-training-list-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.NAME,
          COLUMNS.DESCRIPTION,
          COLUMNS.CATEGORY,
          COLUMNS.AUDIENCE,
          COLUMNS.LANGUAGES,
          COLUMNS.TYPE,
          COLUMNS.CREATED_BY,
          COLUMNS.TAGS,
          COLUMNS.CREATE_TIME
        ],
        iEmpty: {
          btn: labels.CreateNewTraining,
          message: labels.EmptyTraining,
          icon: 'mdi-plus',
          id: 'btn-empty--training-list',
          disabled: !this.$store.getters['permissions/getCreateTrainingPermission']
        },
        addButton: {
          show: true,
          action: 'add-training',
          tooltip: labels.AddTraining,
          id: 'btn-add--training',
          disabled: !this.$store.getters['permissions/getCreateTrainingPermission']
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getExportTrainingPermission']
        },
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
      },
      addTrainingItems: [
        { text: 'SCORM Training', id: 'btn-add-scorm-training' },
        {
          text: 'Poster',
          id: 'btn-add-poster'
        }
      ]
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
    exportTrainingList(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        AwarenessEducatorService.exportTrainingList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Training-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleDuplicate(row) {
      AwarenessEducatorService.duplicateTraining(row.trainingId).then(() => {
        this.callForData()
      })
    },
    handleAddTraining(item) {
      const safeItem = item ?? { text: '' }
      if (safeItem.text === this.addTrainingItems[0].text) {
        this.handleAdd()
      }
      if (safeItem.text === this.addTrainingItems[1].text) {
        this.handleAddPoster()
      }
    },
    handleDownloadPoster(item) {
      this.$emit(EMITS.ON_DOWNLOAD_POSTER, item ?? {})
    }
  }
}
</script>
