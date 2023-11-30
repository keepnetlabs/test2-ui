<template>
  <div id="callback-scenarios">
    <CommonSimulatorFastLaunch
      v-if="isShowFastLaunch"
      ref="fastLaunch"
      :status="isShowFastLaunch"
      :selected-scenario="selectedRow"
      @on-close="toggleShowFastLaunch"
    />
    <v-overlay
      v-if="modalStatus"
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
    >
      <CallbackScenarioModal
        ref="newScenarioModal"
        :status="modalStatus"
        :scenarioId="scenarioId"
        :isEdit="isEdit"
        :isDuplicate="isDuplicate"
        :editableFormValues="editableFormValues"
        :scenarioDetailsLookup="scenarioDetailsLookup"
        :languages="languages"
        @changeNewScenarioModalStatus="changeNewScenarioModalStatus"
      />
    </v-overlay>
    <DeleteScenario
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selectedScenario="selectedScenario"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
    />
    <CallbackScenarioPreview
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedPhishingScenario"
      :languages="languages"
      @on-close="toggleShowPreviewDialog"
    />
    <DataTable
      v-if="getCallbackScenariosSearchPermissions"
      id="scenarios-data-table"
      class="scenarios"
      ref="refScenariosList"
      is-server-side
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
      @handleMultipleDelete="handleActionDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-fast-launch="handleFastLaunch"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[1].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[1].disabled"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          @on-click="handlePreview(scope.row)"
        />
        <RowActionsMenu>
          <ScenariosRowActionsEditButton
            :id="tableOptions.rowActions[0].id"
            :scope="scope"
            :name="tableOptions.rowActions[0].name"
            :disabled="tableOptions.rowActions[0].disabled"
            @on-click="handleEdit(scope.row, false)"
          />
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :check-is-owner-property="false"
            @on-click="handleEdit(scope.row, true)"
          />
          <ScenariosRowActionsDeleteButton
            :id="tableOptions.rowActions[3].id"
            :scope="scope"
            :name="tableOptions.rowActions[3].name"
            :disabled="tableOptions.rowActions[3].disabled"
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CallbackScenarioModal from '@/components/CallbackScenarios/CallbackScenarioModal'
import DeleteScenario from '@/components/CallbackScenarios/DeleteCallbackScenario'
import {
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import CallbackService from '@/api/callback'
import CommonSimulatorFastLaunch from '@/components/Common/Simulator/CommonSimulatorFastLaunch'
import CallbackScenarioPreview from '@/components/CallbackScenarios/CallbackScenarioPreview'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'CallbackScenarios',
  components: {
    ScenariosRowActionsEditButton,
    ScenariosRowActionsDeleteButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    CallbackScenarioPreview,
    CommonSimulatorFastLaunch,
    DataTable,
    DeleteScenario,
    CallbackScenarioModal
  },
  props: {
    languages: {
      type: Array
    }
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      languageFilterOptions: [],
      scenarioDetailsLookup: {
        difficultyTypes: [
          {
            text: 'Easy',
            value: 1
          },
          {
            text: 'Medium',
            value: 2
          },
          {
            text: 'Hard',
            value: 3
          }
        ]
      },
      isShowFastLaunch: false,
      isShowPreviewDialog: false,
      selectedRow: null,
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null,
      labels,
      selectedScenarioURL: '',
      tableData: [],
      showDeleteModal: false,
      selectedScenario: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CALLBACK_SCENARIOS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CALLBACK_SCENARIOS,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Scenario Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.LANGUAGE,
            align: 'left',
            editable: false,
            label: labels.LANGUAGE,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 175,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'languageTypeResourceId'
          },
          {
            property: PROPERTY_STORE.TAGS,
            align: 'left',
            editable: false,
            label: 'Tags',
            fixed: false,
            sortable: true,
            show: true,
            type: 'smallBadge',
            width: 150,
            hasTooltip: true,
            filterableType: 'text',
            filterableCustomFieldName: PROPERTY_STORE.TAGS
          },
          {
            property: 'difficulty',
            align: 'center',
            editable: false,
            label: labels.DIFFICULTY,
            sortable: true,
            show: true,
            type: 'status',
            filterableType: 'select',
            filterableItems: ['Easy', 'Medium', 'Hard'],
            width: 180
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: 'left',
            editable: false,
            label: 'Created By',
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text'
          }
          // {
          //   property: 'availableFor',
          //   align: 'right',
          //   label: labels.AvailableFor,
          //   fixed: false,
          //   sortable: false,
          //   hideSort: true,
          //   show: true,
          //   type: 'number',
          //   width: 100
          // },
          // {
          //   property: 'emailTemplate',
          //   align: 'left',
          //   editable: false,
          //   label: 'Email Template',
          //   sortable: true,
          //   show: true,
          //   type: 'text',
          //   fixed: false,
          //   width: 240,
          //   filterableType: 'text'
          // },
          // {
          //   property: 'callingTemplate',
          //   align: 'left',
          //   editable: false,
          //   label: 'Calling Template',
          //   sortable: true,
          //   show: true,
          //   type: 'text',
          //   fixed: false,
          //   width: 240,
          //   filterableType: 'text'
          // }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            id: 'btn-edit--scenarios-row-actions',
            disabled: !this.$store.getters['permissions/getCallbackScenariosEditPermissions']
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
            disabled: !this.$store.getters['permissions/getCallbackScenariosDeletePermissions']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getCallbackScenariosExportPermissions']
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
          disabled: !this.$store.getters['permissions/getCallbackScenariosCreatePermissions']
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
      getCallbackScenariosSearchPermissions: 'permissions/getCallbackScenariosSearchPermissions'
    })
  },
  created() {
    this.callForLanguages('refScenariosList')
    this.callForData()
  },
  methods: {
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedPhishingScenario = {}
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    handleSuccessDeleteAction(row) {
      this.$refs.refScenariosList.unSelectRow(row)
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
        CallbackService.exportCallbackScenarios(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Callback-Scenarios.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    callForData() {
      this.loading = true
      if (this.getCallbackScenariosSearchPermissions) {
        CallbackService.searchCallbackScenarios(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      }
    },
    handleActionDelete(row) {
      this.selectedScenario = row
      this.showDeleteModal = true
    }
  }
}
</script>
