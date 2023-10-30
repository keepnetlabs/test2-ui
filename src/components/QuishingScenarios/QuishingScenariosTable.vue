<template>
  <DataTable
    id="quishing-scenarios-data-table"
    class="scenarios"
    ref="refScenariosList"
    is-server-side
    selectable
    filterable
    options
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.empty"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :addButton="tableOptions.addButton"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @onEmptyBtnClicked="handleEmitScenarioModal(null, false)"
    @addAction="handleEmitScenarioModal(null, false)"
    @downloadEvent="exportScenarios"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForData"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :id="tableOptions.rowActions[0].id"
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled"
        :checkIsOwnerProperty="false"
        @on-click="handleFastLaunch(scope.row)"
      />
      <RowActionsMenu>
        <ScenariosRowActionsEditButton
          :id="tableOptions.rowActions[1].id"
          :scope="scope"
          :name="tableOptions.rowActions[1].name"
          :disabled="tableOptions.rowActions[1].disabled"
          @on-click="handleEmitScenarioModal(scope.row, false)"
        />
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[2].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[2].disabled"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          @on-click="handlePreview(scope.row)"
        />
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[3].id"
          :scope="scope"
          :disabled="tableOptions.rowActions[3].disabled"
          :icon="tableOptions.rowActions[3].icon"
          :text="tableOptions.rowActions[3].name"
          :check-is-owner-property="false"
          @on-click="handleEmitScenarioModal(scope.row, true)"
        />
        <ScenariosRowActionsDeleteButton
          :id="tableOptions.rowActions[4].id"
          :scope="scope"
          :name="tableOptions.rowActions[4].name"
          :disabled="tableOptions.rowActions[4].disabled"
          @on-click="handleDelete(scope.row)"
        />
      </RowActionsMenu>
    </template>
  </DataTable>
</template>

<script>
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import DataTable from '@/components/DataTable.vue'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { useLoading } from '@/hooks/useLoading'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  LABEL_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import QuishingService from '@/api/quishing'
import { COMMON_SIMULATOR_COLUMNS } from '@/components/Common/Simulator/utils'
export default {
  name: 'QuishingScenariosTable',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    ScenariosRowActionsEditButton,
    DataTable,
    DefaultButtonRowAction,
    ScenariosRowActionsDeleteButton
  },
  props: {
    scenarioDetailsLookup: {
      type: Object
    }
  },
  mixins: [useLoading, useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.QUISHING_SCENARIOS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.QUISHING_SCENARIOS,
        columns: [
          COMMON_SIMULATOR_COLUMNS.NAME,
          COMMON_SIMULATOR_COLUMNS.METHOD,
          COMMON_SIMULATOR_COLUMNS.LANGUAGE,
          COMMON_SIMULATOR_COLUMNS.TAGS,
          COMMON_SIMULATOR_COLUMNS.DIFFICULTY,
          COMMON_SIMULATOR_COLUMNS.CREATE_TIME,
          COMMON_SIMULATOR_COLUMNS.CREATED_BY,
          COMMON_SIMULATOR_COLUMNS.AVAILABLE_FOR,
          COMMON_SIMULATOR_COLUMNS.EMAIL_TEMPLATE,
          COMMON_SIMULATOR_COLUMNS.LANDING_PAGE_TEMPLATE
        ],
        rowActions: [
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'on-fast-launch',
            id: 'btn-fast-launch--quishing-scenarios-row-actions',
            disabled: !this.$store.getters['permissions/getPhishingScenariosPreviewPermissions']
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            id: 'btn-edit--quishing-row-actions',
            disabled: !this.$store.getters['permissions/getPhishingScenariosEditPermissions']
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--quishing-scenarios-row-actions'
          },
          {
            name: 'Duplicate',
            icon: 'mdi-content-copy',
            action: 'handleDuplicate',
            id: 'btn-duplicate--quishing-scenarios-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--quishing-scenarios-row-actions',
            disabled: !this.$store.getters['permissions/getPhishingScenariosDeletePermissions']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getPhishingScenariosExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_SCENARIO,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--scenarios'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Scenario',
          id: 'btn-add--scenarios',
          disabled: !this.$store.getters['permissions/getPhishingScenariosCreatePermissions']
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  watch: {
    scenarioDetailsLookup() {
      this.$set(
        this.tableOptions.columns[1],
        'filterableItems',
        this.scenarioDetailsLookup.methodTypes.map((item) => {
          return { text: item.text, value: item.text }
        })
      )
      this.$set(
        this.tableOptions.columns[3],
        'filterableItems',
        this.scenarioDetailsLookup.difficultyTypes.map((item) => {
          return { text: item.text, value: item.text }
        })
      )
    }
  },
  created() {
    this.callForData()
    this.callForLanguages('refScenariosList')
  },
  methods: {
    callForData() {
      this.setLoading(true)
      QuishingService.searchScenarios(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } =
            response?.data?.data || {}
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          const { results = [] } = data
          this.tableData = results
        })
        .finally(this.setLoading)
    },
    handleFastLaunch(row = {}) {
      this.$emit('on-fast-launch', row)
    },
    handleEmitScenarioModal(row = {}, isDuplicate = false) {
      this.$emit('on-edit-or-new', row, isDuplicate)
    },
    handlePreview(row = {}) {
      this.$emit('on-preview', row)
    },
    handleDelete(row = {}) {
      this.$emit('on-delete', row)
    },
    exportScenarios({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        QuishingService.exportScenarios(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Quishing-Scenarios.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
