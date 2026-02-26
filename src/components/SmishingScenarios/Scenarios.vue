<template>
  <div id="smishing">
    <NewScenario
      v-if="modalStatus"
      ref="newScenarioModal"
      :status="modalStatus"
      :scenarioId="scenarioId"
      :isEdit="isEdit"
      :isDuplicate="isDuplicate"
      :editableFormValues="editableFormValues"
      :scenarioDetailsLookup="scenarioDetailsLookup"
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
    <SmishingScenarioPreview
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedPhishingScenario"
      @on-close="toggleShowPreviewDialog"
    />
    <NoTextMessageTemplateModal
      v-if="isShowNoTextMessageTemplateModal"
      :status="isShowNoTextMessageTemplateModal"
      @handleCloseModal="handleCloseNoTextMessageModal"
      @handleConfirm="handleConfirmNoTextMessage"
    />
    <NoLandingPageTemplateModal
      v-if="isShowNoLandingPageTemplateModal"
      :status="isShowNoLandingPageTemplateModal"
      @handleCloseModal="handleCloseNoLandingPageTemplateModal"
      @handleConfirm="handleConfirmNoLandingPageTemplate"
    />
    <DataTable
      v-if="getSmishingScenariosSearchPermissions"
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
    >
      <template #datatable-custom-column="{ scope }">
        <LanguagesColumn
          v-if="scope.column.property === 'languageTypeName'"
          :value="scope.row.languageTypeName"
          :preferred-language-types="preferredLanguageTypes"
        />
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
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
import NewScenario from '@/components/SmishingScenarios/NewScenario'
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
import SmishingService from '@/api/smishing'
import SmishingScenarioPreview from '@/components/SmishingScenarios/SmishingScenarioPreview'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import NoTextMessageTemplateModal from '@/components/SmishingScenarios/NoTextMessageTemplateModal'
import NoLandingPageTemplateModal from '@/components/SmishingScenarios/NoLandingPageTemplateModal'
import CommonSimulatorDeleteScenario from '@/components/Common/Simulator/CommonSimulatorDeleteScenario'
import LanguagesColumn from '@/components/Common/Simulator/LanguagesColumn/LanguagesColumn.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getScenarioDataDetails } from '@/api/scenarios'

export default {
  name: 'SmishingScenarios',
  components: {
    LanguagesColumn,
    CommonSimulatorDeleteScenario,
    ScenariosRowActionsEditButton,
    ScenariosRowActionsDeleteButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    SmishingScenarioPreview,
    DataTable,
    NewScenario,
    NoTextMessageTemplateModal,
    NoLandingPageTemplateModal
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      scenarioDetailsLookup: null,
      isShowFastLaunch: false,
      isShowPreviewDialog: false,
      isShowNoTextMessageTemplateModal: false,
      isShowNoLandingPageTemplateModal: false,
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
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SMISHING_SCENARIOS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SMISHING_SCENARIOS,
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
            property: 'method',
            align: 'left',
            editable: false,
            label: labels.Method,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'select',
            filterableItems: [
              { text: 'Click Only', value: 'Click-Only' },
              { text: 'Data Submission', value: 'Data Submission' },
              { text: 'MFA', value: 'MFA' }
            ]
          },
          {
            property: PROPERTY_STORE.LANGUAGE,
            align: 'left',
            editable: false,
            label: labels.Languages,
            sortable: true,
            show: true,
            type: 'slot',
            fixed: false,
            width: 248,
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
            property: PROPERTY_STORE.CREATEDBY,
            align: 'left',
            editable: false,
            label: 'Created By',
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text'
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
          }
        ],
        rowActions: [
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--scenarios-row-actions'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            id: 'btn-edit--scenarios-row-actions',
            disabled: !this.$store.getters['permissions/getSmishingScenariosEditPermissions']
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
            disabled: !this.$store.getters['permissions/getSmishingScenariosDeletePermissions']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getSmishingScenariosExportPermissions']
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
          disabled: !this.$store.getters['permissions/getSmishingScenariosCreatePermissions']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      selectedPhishingScenario: {}
    }
  },
  computed: {
    preferredLanguageTypes() {
      return this.scenarioDetailsLookup?.preferredLanguageTypes || []
    },
    ...mapGetters({
      getSmishingScenariosSearchPermissions: 'permissions/getSmishingScenariosSearchPermissions'
    })
  },
  mounted() {
    this.callForLanguages('refScenariosList')
    this.callForScenarioDetails()
  },
  methods: {
    deleteScenario: SmishingService.deleteSmishingScenario,
    bulkDeleteScenarios: SmishingService.bulkDeleteSmishingScenarios,
    callForScenarioDetails() {
      LookupLocalStorage.getSingle(21)
        .then((languageOptions) => {
          const options =
            languageOptions?.map((lang) => ({
              text: lang.isoFriendlyName || lang.name,
              value: lang.resourceId
            })) || []
          return Promise.all([
            SmishingService.getSmishingScenarioFormDetails(),
            getScenarioDataDetails()
          ]).then(([smishingResponse, phishingResponse]) => {
            const data = smishingResponse?.data?.data || {
              methodTypes: [],
              difficultyTypes: []
            }
            const preferredRaw =
              phishingResponse?.data?.data?.preferredLanguageTypes || []
            const preferredLanguageTypes = preferredRaw
              .map((lang) => ({
                ...lang,
                text: options.find((opt) => opt.value === lang.value)?.text || lang.text || ''
              }))
              .filter((item) => item.text)
            this.scenarioDetailsLookup = {
              ...data,
              preferredLanguageTypes
            }
            this.$set(
              this.tableOptions.columns[1],
              'filterableItems',
              (this.scenarioDetailsLookup.methodTypes || []).map((item) => ({
                text: item.text,
                value: item.text
              }))
            )
            this.$set(
              this.tableOptions.columns[4],
              'filterableItems',
              (this.scenarioDetailsLookup.difficultyTypes || []).map((item) => ({
                text: item.text,
                value: item.text
              }))
            )
            return smishingResponse
          })
        })
        .finally(() => {
          this.callForData()
        })
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
        SmishingService.exportSmishingScenarios(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `smishing-scenarios.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    callForData() {
      this.loading = true
      if (this.getSmishingScenariosSearchPermissions) {
        SmishingService.searchSmishingScenarios(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results.map((item) => {
              const language = this.languageFilterOptions.find(
                (lang) => lang.languageName === item.languageTypeName
              )
              return {
                ...item,
                languageTypeName: language?.text || item.languageTypeName
              }
            })
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      }
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
    handleShowNoTextMessageModal() {
      this.isShowNoTextMessageTemplateModal = true
    },
    handleCloseNoTextMessageModal() {
      this.isShowNoTextMessageTemplateModal = false
    },
    handleConfirmNoTextMessage() {
      this.$emit('handleNoMessageTemplate')
    },
    handleShowNoLandingPageTemplateModal() {
      this.isShowNoLandingPageTemplateModal = true
    },
    handleCloseNoLandingPageTemplateModal() {
      this.isShowNoLandingPageTemplateModal = false
    },
    handleConfirmNoLandingPageTemplate() {
      this.$emit('handleNoLandingPageTemplate')
    }
  }
}
</script>
