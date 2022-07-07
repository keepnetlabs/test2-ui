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
    @onEmptyBtnClicked="handleAdd"
    @add-training="handleAdd"
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled"
        :checkIsOwnerProperty="false"
        @on-click="handleSendTraining(scope.row)"
      />
      <RowActionsMenu>
        <DefaultMenuRowAction
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          @on-click="handleEdit(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[2].disabled"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :disabled="tableOptions.rowActions[3].disabled"
          :icon="tableOptions.rowActions[3].icon"
          :text="tableOptions.rowActions[3].name"
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
import { EMITS, COLUMNS } from '../utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
export default {
  name: 'TrainingListTable',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable
  },
  mixins: [useLoading, useDefaultTableFunctions],
  inject: {
    languages: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    targetAudiences: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
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
          delete: true,
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
          COLUMNS.TAGS
        ],
        iEmpty: {
          btn: labels.CreateNewTraining,
          message: labels.EmptyTraining,
          icon: 'mdi-plus',
          id: 'btn-empty--training-list'
        },
        addButton: {
          show: true,
          action: 'add-training',
          tooltip: labels.AddTraining,
          id: 'btn-add--training'
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
  watch: {
    languages(val) {
      console.log('val', val)
    },
    categories(val) {
      console.log('val', val)
    },
    targetAudiences(val) {
      console.log('val', val)
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.searchTraining(this.axiosPayload)
        .then((response) => {
          console.log('response', response)
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
    }
  }
}
</script>
