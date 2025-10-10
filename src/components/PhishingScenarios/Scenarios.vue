<template>
  <div id="scenarios">
    <CampaignManagerScenarioStatisticsModal
      v-if="isShowScenarioStatistics"
      :navigation-drawer-value="isShowScenarioStatistics"
      @navigation-drawer-change="handleStatisticsModalStatusChange"
    />
    <CommonSimulatorFastLaunch
      v-if="isShowFastLaunch"
      ref="fastLaunch"
      is-phishing
      :status="isShowFastLaunch"
      :selected-scenario="selectedRow"
      @on-close="toggleShowFastLaunch"
    />
    <CommonSimulatorNewScenario
      v-if="modalStatus"
      ref="newScenarioModal"
      :status="modalStatus"
      :scenarioId="scenarioId"
      :isEdit="isEdit"
      :isDuplicate="isDuplicate"
      :editableFormValues="editableFormValues"
      :scenarioDetailsLookup="scenarioDetailsLookup"
      :isAttachmentBased="isAttachmentBasedScenario"
      @changeNewScenarioModalStatus="changeNewScenarioModalStatus"
    />
    <CommonSimulatorDeleteScenario
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selectedScenario="selectedScenario"
      :api-func="deleteScenario"
      :scenarioCount="multipleDeletedScenariosCount"
      :multipleDeleteApiFunc="bulkDeleteScenarios"
      :multipleDeletePayload="multipleScenariosPayload"
      :isMultiple="isMultipleDelete"
      @on-success="handleSuccessDeleteAction"
      @on-success-multiple="handleSuccessMultipleDeleteAction"
      @on-close="showDeleteModal = false"
    />
    <CommonSimulatorPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedPhishingScenario"
      :api-func="getPhishingScenarioLandingPageAndEmailTemplate"
      :languages="languageFilterOptions"
      @on-close="toggleShowPreviewDialog"
    />
    <data-table
      v-if="getPhishingScenariosSearchPermissions"
      id="scenarios-data-table"
      class="scenarios"
      ref="refScenariosList"
      is-server-side
      is-server-side-selection
      selectable
      filterable
      options
      :loading="loading"
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
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewScenarioModalStatus(true)"
      @downloadEvent="exportScenario"
      @handleMultipleDelete="handleMultipleDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-fast-launch="handleFastLaunch"
      @on-show-scenario-statistics="isShowScenarioStatistics = true"
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
            @on-click="handleEdit(scope.row, false)"
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
            @on-click="handleEdit(scope.row, true)"
          />
          <ScenariosRowActionsDeleteButton
            :id="tableOptions.rowActions[4].id"
            :scope="scope"
            :name="tableOptions.rowActions[4].name"
            :disabled="tableOptions.rowActions[4].disabled"
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
      <template #addUsers>
        <VTooltip bottom opacity="1">
          <template #activator="{ on: tooltip }">
            <VBtn
              v-on="{ ...tooltip }"
              id="btn-add--campaign-manager"
              class="button-new"
              style="margin-right: 10px;"
              rounded
              color="#2196f3"
              @click="changeNewScenarioModalStatus(true)"
            >
              <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
              <span class="button-new__text">NEW</span>
            </VBtn>
          </template>
          <span class="tooltip-span">{{ 'Add a Scenario' }}</span>
        </VTooltip>
        <VTooltip bottom>
          <template #activator="{ on }">
            <v-btn v-on="on" icon @click="toggleShowScenarioStatistics">
              <VIcon color="#757575">mdi-chart-bar</VIcon>
            </v-btn>
          </template>
          <span>Show Scenario Statistics</span>
        </VTooltip>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import CommonSimulatorDeleteScenario from '@/components/Common/Simulator/CommonSimulatorDeleteScenario'
import {
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  deleteScenario,
  exportScenarios,
  getScenariosList,
  bulkDeleteScenarios
} from '@/api/scenarios'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CommonSimulatorPreviewDialog from '@/components/Common/Simulator/CommonSimulatorPreviewDialog'
import { getPhishingScenarioLandingPageAndEmailTemplate } from '@/api/phishingsimulator'
import CommonSimulatorNewScenario from '@/components/Common/Simulator/CommonSimulatorNewScenario'
import { COMMON_SIMULATOR_COLUMNS } from '@/components/Common/Simulator/utils'
import CommonSimulatorFastLaunch from '@/components/Common/Simulator/CommonSimulatorFastLaunch'
import CampaignManagerScenarioStatisticsModal from '@/components/CampaignManager/CampaignManagerScenarioStatisticsModal.vue'
export default {
  name: 'EmailTemplates',
  components: {
    CampaignManagerScenarioStatisticsModal,
    CommonSimulatorFastLaunch,
    CommonSimulatorNewScenario,
    CommonSimulatorPreviewDialog,
    ScenariosRowActionsEditButton,
    ScenariosRowActionsDeleteButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    CommonSimulatorDeleteScenario
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  props: {
    scenarioDetailsLookup: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowScenarioStatistics: false,
      isShowFastLaunch: false,
      isShowPreviewDialog: false,
      selectedRow: null,
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      multipleScenariosPayload: {},
      scenarioId: null,
      labels,
      selectedScenarioURL: '',
      tableData: [],
      showDeleteModal: false,
      selectedScenario: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SCENARIOS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SCENARIOS,
        columns: [
          COMMON_SIMULATOR_COLUMNS.NAME,
          COMMON_SIMULATOR_COLUMNS.CATEGORY,
          COMMON_SIMULATOR_COLUMNS.PHISHING_METHOD,
          COMMON_SIMULATOR_COLUMNS.LANGUAGES,
          COMMON_SIMULATOR_COLUMNS.TAGS,
          COMMON_SIMULATOR_COLUMNS.DIFFICULTY,
          COMMON_SIMULATOR_COLUMNS.CREATED_BY,
          COMMON_SIMULATOR_COLUMNS.CREATE_TIME
        ],
        rowActions: [
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'on-fast-launch',
            id: 'btn-fast-launch--scenarios-row-actions',
            disabled: !this.$store.getters['permissions/getPhishingScenariosPreviewPermissions']
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            id: 'btn-edit--scenarios-row-actions',
            disabled: !this.$store.getters['permissions/getPhishingScenariosEditPermissions']
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--scenarios-row-actions'
          },
          {
            name: 'Duplicate',
            icon: 'mdi-content-copy',
            action: 'handleEdit',
            id: 'btn-duplicate--scenarios-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--scenarios-row-actions',
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
          delete: true,
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
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      selectedPhishingScenario: {}
    }
  },
  computed: {
    ...mapGetters({
      getPhishingScenariosSearchPermissions: 'permissions/getPhishingScenariosSearchPermissions'
    }),
    isAttachmentBasedScenario() {
      return this.selectedRow?.method === 'Attachment' || undefined
    }
  },
  watch: {
    scenarioDetailsLookup: {
      handler() {
        this.$set(
          this.tableOptions.columns[1],
          'filterableItems',
          this.scenarioDetailsLookup?.categories?.map((item) => {
            return { text: item.text, value: item.text }
          })
        )
        this.$set(
          this.tableOptions.columns[2],
          'filterableItems',
          this.scenarioDetailsLookup.methodTypes.map((item) => {
            return { text: item.text, value: item.text }
          })
        )
        this.$set(
          this.tableOptions.columns[4],
          'filterableItems',
          this?.scenarioDetailsLookup?.difficultyTypes?.map((item) => {
            return { text: item.text, value: item.text }
          })
        )
        this?.$refs?.refScenariosList?.reRenderFilters()
      },
      deep: true
    }
  },
  mounted() {
    this.callForLanguages('refScenariosList')
    this.callForData()
  },
  methods: {
    getPhishingScenarioLandingPageAndEmailTemplate,
    deleteScenario,
    bulkDeleteScenarios,
    callForData() {
      this.loading = true
      if (this.getPhishingScenariosSearchPermissions) {
        getScenariosList(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            const enrichedResults = results?.map((item) => {
              if (Array.isArray(item.languageTypeName)) {
                return {
                  ...item,
                  languageTypeName: item.languageTypeName?.map((code) => {
                    const language = this.languageFilterOptions.find(
                      (lang) => lang.languageName === code
                    )
                    return language?.text || code
                  })
                }
              } else {
                const language = this.languageFilterOptions.find(
                  (lang) => lang.languageName === item.languageTypeName
                )
                return {
                  ...item,
                  languageTypeName: language?.text || item.languageTypeName
                }
              }
            })
            this.tableData = enrichedResults
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      }
    },
    handleStatisticsModalStatusChange(status) {
      if (status) {
        this.isShowScenarioStatistics = status
        return
      }
      document.querySelector('.k-navigation-drawer').style.right = '-100%'
      setTimeout(() => {
        this.isShowScenarioStatistics = status
      }, 250)
    },
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedPhishingScenario = {}
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    handleSuccessDeleteAction(row) {
      this.$refs.refScenariosList.resetSelectableParams()
      this.showDeleteModal = false
      this.callForData()
    },
    handleSuccessMultipleDeleteAction() {
      this?.$refs?.refScenariosList?.resetSelectableParams()
      this.showDeleteModal = false
      this.callForData()
    },
    handleFastLaunch(row = {}) {
      this.selectedRow = row
      this.toggleShowFastLaunch()
    },
    handlePreview(row) {
      this.selectedPhishingScenario = row
      this.toggleShowPreviewDialog()
    },
    toggleShowFastLaunch() {
      if (this.isShowFastLaunch) this.selectedRow = null
      this.isShowFastLaunch = !this.isShowFastLaunch
    },
    handleEdit(row, isDuplicate) {
      this.selectedRow = row
      this.editableFormValues = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.scenarioId = row.resourceId
    },
    checkIfCanCLoseNewScenarioModal() {
      if (this.$refs.newScenarioModal) {
        this.$refs.newScenarioModal.changeNewScenarioModalStatus()
      }
    },
    checkIfCanCloseFastLaunchModal() {
      if (this.$refs.fastLaunch) {
        this.$refs.fastLaunch.closeOverlay()
      }
    },
    changeNewScenarioModalStatus(status, restart) {
      this.modalStatus = status
      this.scenarioId = null
      this.isEdit = false
      this.isDuplicate = false
      if (!status) {
        this.selectedRow = null
      }
      if (restart) {
        this.editableFormValues = {}
        this.scenarioId = null
        this.isEdit = false
        this.isDuplicate = false
        this.callForData()
      }
    },
    exportScenario({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportScenarios(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Scenarios.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleMultipleDelete(selections, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedScenariosCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleScenariosPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.showDeleteModal = true
    },
    handleActionDelete(row) {
      this.isMultipleDelete = false
      this.selectedScenario = row
      this.showDeleteModal = true
    },
    toggleShowScenarioStatistics() {
      this.isShowScenarioStatistics = !this.isShowScenarioStatistics
    }
  }
}
</script>
