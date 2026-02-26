<template>
  <KContainer tabless id="vishing-templates">
    <VishingTemplatePreview
      v-if="isPreviewVisible"
      :status="isPreviewVisible"
      :selectedRow="selectedTemplate"
      :showTemplateInfo="false"
      :isTextToSpeechCompatible="isTextToSpeechCompatible"
      :voiceResourceId="voiceResourceId"
      :language="selectedTemplateLanguage"
      :voice="selectedTemplateVoice"
      @on-close="onToggleShowPreviewModal"
    />
    <DeleteVishingTemplateDialog
      v-if="isDeleteModalVisible"
      :status="isDeleteModalVisible"
      :selectedTemplate="selectedTemplate"
      :templateCount="multipleDeletedTemplatesCount"
      :multipleDeletePayload="multipleTemplatesPayload"
      :isMultiple="isMultipleDelete"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @on-success-multiple="handleSuccessMultipleDeleteAction"
      @handleCloseModal="isDeleteModalVisible = false"
    />
    <VishingTemplateModal
      ref="refVishingTemplateModal"
      v-if="modalStatus"
      :status="modalStatus"
      :templateId="getTemplateId"
      :isEdit="isEdit"
      :isDuplicate="isDuplicate"
      :languages="languages"
      :voices="voices"
      :languageItems="languageItems"
      @changeVishingTemplateModalStatus="changeNewVishingTemplateModalStatus"
    />
    <DataTable
      v-if="getVishingTemplatesSearchPermissions"
      id="vishing-templates-data-table"
      ref="refVishingTemplatesList"
      is-server-side
      is-server-side-selection
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
      :download-button="tableOptions.downloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewVishingTemplateModalStatus(true)"
      @downloadEvent="exportVishingTemplates"
      @handleMultipleDelete="handleMultipleDelete"
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
          :scope="scope"
          :check-is-owner-property="false"
          :icon="tableOptions.rowActions[0].icon"
          :disabled="tableOptions.rowActions[0].disabled"
          :text="tableOptions.rowActions[0].name"
          @on-click="handlePreview(scope.row)"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            show-tooltip
            disabled-tooltip-text="You are not authorized to edit this template"
            class-name="vishing-templates__menu-row-action-tooltip"
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            @on-click="handleEdit(scope.row, false)"
          />

          <DefaultMenuRowAction
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[3].disabled"
            :icon="tableOptions.rowActions[3].icon"
            :text="tableOptions.rowActions[3].name"
            @on-click="handleEdit(scope.row, true)"
          />
          <DefaultMenuRowAction
            show-tooltip
            class-name="vishing-templates__menu-row-action-tooltip"
            disabled-tooltip-text="You are not authorized to delete this template"
            :scope="scope"
            :disabled="tableOptions.rowActions[4].disabled"
            :icon="tableOptions.rowActions[4].icon"
            :text="tableOptions.rowActions[4].name"
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </DataTable>
  </KContainer>
</template>

<script>
import DataTable from '@/components/DataTable'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import KContainer from '@/components/KContainer/KContainer'
import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import {
  exportVishingTemplates,
  getVishingTemplates,
  getVishingTemplateLanguages
} from '@/api/vishing'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import DeleteVishingTemplateDialog from '@/components/VishingTemplates/DeleteVishingTemplateDialog'
import VishingTemplateModal from '@/components/VishingTemplates/VishingTemplateModal'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { useLoading } from '@/hooks/useLoading'
import { mapGetters } from 'vuex'

export default {
  name: 'VishingTemplates',
  components: {
    KContainer,
    VishingTemplatePreview,
    DataTable,
    DefaultButtonRowAction,
    RowActionsMenu,
    DefaultMenuRowAction,
    DeleteVishingTemplateDialog,
    VishingTemplateModal
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      selectedTemplateLanguage: '',
      selectedTemplateVoice: '',
      voiceResourceId: '',
      isTextToSpeechCompatible: false,
      vishingTemplateId: null,
      modalStatus: false,
      isPreviewVisible: false,
      isEdit: false,
      isDuplicate: false,
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      multipleTemplatesPayload: {},
      tableData: [],
      isDeleteModalVisible: false,
      selectedTemplate: null,
      languages: [],
      voices: [],
      languageItems: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.VISHINGTEMPLATES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.VISHINGTEMPLATES,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: labels.TemplateName,
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: 'language',
            align: 'left',
            editable: false,
            label: 'Language',
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 175,
            filterableType: 'select',
            filterableItems: []
          },
          {
            property: 'voice',
            align: 'left',
            editable: false,
            label: 'Voice',
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 175,
            filterableType: 'select',
            filterableItems: []
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
            overrideWidth: true,
            width: 175,
            filterableCustomFieldName: PROPERTY_STORE.CREATEDBY,
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
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          },
          {
            property: 'availableFor',
            align: 'right',
            label: labels.AvailableFor,
            fixed: false,
            sortable: false,
            hideSort: true,
            show: true,
            type: 'number',
            width: 100
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
          }
        ],
        rowActions: [
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            disabled: !this.$store.getters['permissions/getVishingTemplatesPreviewPermissions']
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getVishingTemplatesEditPermissions']
          },
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'handleFastLaunch',
            disabled: !this.$store.getters['permissions/getPhishingScenariosPreviewPermissions']
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'disable',
            disabled: !this.$store.getters['permissions/getVishingTemplatesCreatePermissions']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getVishingTemplatesDeletePermissions']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getVishingTemplatesExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_VISHING_TEMPLATES,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--vishingTemplates'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Vishing Template',
          id: 'btn-add--vishingTemplates',
          disabled: !this.$store.getters['permissions/getVishingTemplatesCreatePermissions']
        }
      },
      axiosPayload: getDefaultAxiosPayload({}, 'default'),
      serverSideProps: new ServerSideProps()
    }
  },
  watch: {
    selectedTemplate: {
      deep: true,
      handler(val) {
        if (!val) {
          this.voiceResourceId = ''
          this.isTextToSpeechCompatible = false
          return
        }
        const vishingLanguageIndex = this.languageItems.findIndex(
          (language) => language.language === val.language && language.name === val.voice
        )
        if (vishingLanguageIndex !== -1) {
          this.voiceResourceId = this.languageItems[vishingLanguageIndex].resourceId
          this.isTextToSpeechCompatible = [2, 3].includes(
            this.languageItems[vishingLanguageIndex].voiceProviderTypeId
          )
          this.selectedTemplateLanguage = val.language
          this.selectedTemplateVoice = val.voice
        }
      }
    }
  },
  computed: {
    getTemplateId() {
      return this.selectedTemplate ? this.selectedTemplate.resourceId : ''
    },
    ...mapGetters({
      getVishingTemplatesSearchPermissions: 'permissions/getVishingTemplatesSearchPermissions'
    })
  },
  beforeRouteLeave(to, from, next) {
    const { refVishingTemplateModal } = this.$refs
    if (refVishingTemplateModal && refVishingTemplateModal.status) {
      refVishingTemplateModal.changeVishingTemplateModalStatus()
      next(false)
    } else {
      next()
    }
  },
  mounted() {
    this.callForData()
    this.callForLanguages()
  },
  methods: {
    onToggleShowPreviewModal() {
      if (this.isPreviewVisible) this.selectedTemplate = null
      this.isPreviewVisible = !this.isPreviewVisible
    },
    handlePreview(row) {
      this.vishingTemplateId = row.resourceId
      this.selectedTemplate = row
      this.onToggleShowPreviewModal()
    },
    handleEdit(row, isDuplicate) {
      this.selectedTemplate = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.vishingTemplateId = row.resourceId
    },
    checkIfCanCloseVishingTemplateModal() {
      if (this.$refs?.refVishingTemplateModal) {
        this.$refs.refVishingTemplateModal.changeVishingTemplateModalStatus()
      }
    },
    changeNewVishingTemplateModalStatus(status, restart) {
      this.modalStatus = status
      this.vishingTemplateId = null
      this.isEdit = false
      this.isDuplicate = false
      if (restart) {
        this.selectedTemplate = null
        this.vishingTemplateId = null
        this.isEdit = false
        this.isDuplicate = false
        this.callForData()
      }
    },
    exportVishingTemplates({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportVishingTemplates(payload).then((response) => {
          const { data } = response
          if (data && data instanceof Blob) {
            const link = document.createElement('a')
            link.href = globalThis.URL.createObjectURL(data)
            link.download = `VishingTemplates.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          }
        })
      })
    },
    callForData() {
      if (this.getVishingTemplatesSearchPermissions) {
        this.isLoading = true
        getVishingTemplates(this.axiosPayload)
          .then((response) => {
            const {
              totalNumberOfRecords = 0,
              totalNumberOfPages = 1,
              pageNumber = 1,
              results = []
            } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            this.tableData = results
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.isLoading = false))
      } else {
        this.$router.push('/')
      }
    },
    callForLanguages() {
      getVishingTemplateLanguages().then((response) => {
        this.languageItems = response?.data?.data || []
        const voiceFilterableItems = response?.data?.data
          ? response.data.data.map((language) => language.name)
          : []
        const uniqueVoiceFilterableItems = [...new Set(voiceFilterableItems)]
        this.voices = uniqueVoiceFilterableItems
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'voice'),
          'filterableItems',
          uniqueVoiceFilterableItems
        )
        const languageFilterableItems = response?.data?.data
          ? response.data.data.map((language) => language.language)
          : []
        const uniqueLanguageFilterableItems = [...new Set(languageFilterableItems)]
        this.languages = uniqueLanguageFilterableItems
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'language'),
          'filterableItems',
          uniqueLanguageFilterableItems
        )
        this?.$refs?.refVishingTemplatesList?.reRenderFilters()
      })
    },
    handleSuccessDeleteAction(row) {
      this.$refs.refVishingTemplatesList?.resetSelectableParams()
      this.isDeleteModalVisible = false
      this.callForData()
    },
    handleSuccessMultipleDeleteAction() {
      this?.$refs?.refVishingTemplatesList?.resetSelectableParams()
      this.isDeleteModalVisible = false
      this.callForData()
    },
    handleMultipleDelete(selections, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedTemplatesCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleTemplatesPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.isDeleteModalVisible = true
    },
    handleActionDelete(row) {
      this.isMultipleDelete = false
      this.selectedTemplate = row
      this.isDeleteModalVisible = true
    },
    handleFastLaunch(row) {
      this.selectedTemplate = row
    }
  }
}
</script>
