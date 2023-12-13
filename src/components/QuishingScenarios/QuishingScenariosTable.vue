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
        v-if="scope.row.type !== QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT"
        :id="tableOptions.rowActions[0].id"
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled"
        :checkIsOwnerProperty="false"
        @on-click="handleFastLaunch(scope.row)"
      />
      <DefaultMenuRowAction
        v-else
        :id="tableOptions.rowActions[2].id"
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="tableOptions.rowActions[2].disabled"
        :icon="tableOptions.rowActions[2].icon"
        :text="tableOptions.rowActions[2].name"
        @on-click="handlePreview(scope.row)"
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
          v-if="checkRowIsIndividualPrintout(scope.row)"
          :id="tableOptions.rowActions[5].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[5].disabled"
          :icon="tableOptions.rowActions[5].icon"
          :text="tableOptions.rowActions[5].name"
          @on-click="handlePrintPreview(scope.row)"
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
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { columnFilterChanged } from '@/utils/helperFunctions'
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
      QUISHING_EMAIL_TEMPLATE_TYPES,
      tableData: [],
      activeTemplateTypes: [
        QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      ],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.QUISHING_SCENARIOS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.QUISHING_SCENARIOS,
        columns: [
          COMMON_SIMULATOR_COLUMNS.NAME,
          COMMON_SIMULATOR_COLUMNS.QUISHING_TYPE,
          COMMON_SIMULATOR_COLUMNS.QUISHING_METHOD,
          COMMON_SIMULATOR_COLUMNS.LANGUAGE,
          COMMON_SIMULATOR_COLUMNS.TAGS,
          COMMON_SIMULATOR_COLUMNS.DIFFICULTY,
          COMMON_SIMULATOR_COLUMNS.CREATE_TIME,
          COMMON_SIMULATOR_COLUMNS.CREATED_BY
        ],
        rowActions: [
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'on-fast-launch',
            id: 'btn-fast-launch--quishing-scenarios-row-actions',
            disabled: !this.$store.getters[
              'permissions/getQuishingCampaignManagerParentCreatePermissions'
            ]
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            id: 'btn-edit--quishing-row-actions',
            disabled: !this.$store.getters['permissions/getQuishingScenariosEditPermissions']
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
            disabled: !this.$store.getters['permissions/getQuishingScenariosDeletePermissions']
          },
          {
            name: labels.PrintPreview,
            icon: 'mdi-file-eye',
            action: 'printPreviewAction',
            id: 'btn-preview--quishing-scenarios-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getQuishingScenariosExportPermissions']
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
          id: 'btn-empty--scenarios',
          disabled: !this.$store.getters['permissions/getQuishingScenariosCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Scenario',
          id: 'btn-add--scenarios',
          disabled: !this.$store.getters['permissions/getQuishingScenariosCreatePermissions']
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  watch: {
    scenarioDetailsLookup() {
      this.$set(
        this.tableOptions.columns[2],
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
      this.axiosPayload.templateTypes = this.activeTemplateTypes
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
          filter: this.axiosPayload.filter,
          templateTypes: this.activeTemplateTypes
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
    },
    checkRowIsIndividualPrintout(row = {}) {
      return (
        row.quishingType.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    },
    handlePrintPreview(row = {}) {
      QuishingService.getQuishingPdfScenarioPreviewContent(row.resourceId).then((response) => {
        const file = new File([response.data], 'Quishing PDF Preview', {
          type: 'application/pdf'
        })
        const fileURL = URL.createObjectURL(file)
        const newWindow = window.open(fileURL)
        newWindow.onload = function () {
          setTimeout(() => {
            newWindow.document.title = 'Quishing PDF Preview'
          }, 250)
        }
      })
    },
    columnFilterChanged(filter) {
      if (filter.FieldName === 'quishingType') {
        if (!filter.Value)
          this.activeTemplateTypes = [
            QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
            QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
          ]
        else {
          this.activeTemplateTypes = filter.Value.split(',')
        }
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
          filter,
          this.axiosPayload
        )
      }
      this.callForData()
    }
  }
}
</script>
