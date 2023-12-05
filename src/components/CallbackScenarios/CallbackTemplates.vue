<template>
  <div>
    <CallbackTemplatePreview
      v-if="isPreviewVisible"
      :status="isPreviewVisible"
      :selectedRow="selectedTemplate"
      :showTemplateInfo="false"
      :languageItems="languageItems"
      @on-close="onToggleShowPreviewModal"
    />
    <DeleteCallbackTemplateModal
      :status="isDeleteModalVisible"
      :selectedTemplate="selectedTemplate"
      @onCancel="onCloseDeleteModal"
      @onConfirm="handleDeleteConfirm"
    />
    <CallbackTemplateModal
      ref="refCallbackTemplateModal"
      v-if="modalStatus"
      :status="modalStatus"
      :templateId="getTemplateId"
      :isEdit="isEdit"
      :isDuplicate="isDuplicate"
      :languages="languages"
      :voices="voices"
      :languageItems="languageItems"
      @changeCallbackTemplateModalStatus="changeNewCallbackTemplateModalStatus"
    />
    <DataTable
      v-if="getCallbackTemplatesSearchPermissions"
      id="callback-templates-data-table"
      ref="refCallbackTemplatesTable"
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
      :download-button="tableOptions.downloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewCallbackTemplateModalStatus(true)"
      @downloadEvent="exportCallbackTemplates"
      @handleMultipleDelete="handleActionDelete"
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
            class-name="callback-templates__menu-row-action-tooltip"
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
            class-name="callback-templates__menu-row-action-tooltip"
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
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import CallbackTemplatePreview from '@/components/CallbackScenarios/CallbackTemplatePreview'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  getStoreValue,
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
// TODO: Change endpoints
import CallbackService from '@/api/callback'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import DeleteCallbackTemplateModal from '@/components/CallbackScenarios/DeleteCallbackTemplateModal'
import CallbackTemplateModal from '@/components/CallbackScenarios/CallbackTemplateModal'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { useLoading } from '@/hooks/useLoading'
import { mapGetters } from 'vuex'

export default {
  name: 'CallbackTemplates',
  components: {
    CallbackTemplatePreview,
    DataTable,
    DefaultButtonRowAction,
    RowActionsMenu,
    DefaultMenuRowAction,
    DeleteCallbackTemplateModal,
    CallbackTemplateModal
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      modalStatus: false,
      isPreviewVisible: false,
      isEdit: false,
      isDuplicate: false,
      tableData: [],
      isDeleteModalVisible: false,
      selectedTemplate: null,
      languages: [],
      voices: [],
      languageItems: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CALLBACK_TEMPLATES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CALLBACK_TEMPLATES,
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
            action: 'handlePreview'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getCallbackTemplatesEditPermissions']
          },
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'handleFastLaunch',
            disabled: !this.$store.getters['permissions/getCallbackCampaignCreatePermissions']
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'disable',
            disabled: !this.$store.getters['permissions/getCallbackTemplatesCreatePermissions']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getCallbackTemplatesDeletePermissions']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getCallbackTemplatesExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: `You do not have any callback templates`,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--callback-templates'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Callback Template',
          id: 'btn-add--callback-templates',
          disabled: !this.$store.getters['permissions/getCallbackTemplatesCreatePermissions']
        }
      },
      axiosPayload: getDefaultAxiosPayload({}, 'CreateTime'),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getTemplateId() {
      return this.selectedTemplate ? this.selectedTemplate.resourceId : ''
    },
    ...mapGetters({
      getCallbackTemplatesSearchPermissions: 'permissions/getCallbackTemplatesSearchPermissions'
    })
  },
  beforeRouteLeave(to, from, next) {
    const { refCallbackTemplateModal } = this.$refs
    if (refCallbackTemplateModal && refCallbackTemplateModal.status) {
      refCallbackTemplateModal.changeCallbackTemplateModalStatus()
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
      this.selectedTemplate = row
      this.onToggleShowPreviewModal()
    },
    handleEdit(row, isDuplicate) {
      this.selectedTemplate = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
    },
    checkIfCanCloseCallbackTemplateModal() {
      if (this.$refs?.refCallbackTemplateModal) {
        this.$refs.refCallbackTemplateModal.changeCallbackTemplateModalStatus()
      }
    },
    changeNewCallbackTemplateModalStatus(status, restart) {
      this.modalStatus = status
      this.isEdit = false
      this.isDuplicate = false
      if (restart) {
        this.selectedTemplate = null
        this.isEdit = false
        this.isDuplicate = false
        this.callForData()
      }
    },
    exportCallbackTemplates({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        CallbackService.exportCallbackTemplates(payload).then((response) => {
          const { data } = response
          if (data && data instanceof Blob) {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `CallbackTemplates.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          }
        })
      })
    },
    callForData() {
      if (this.getCallbackTemplatesSearchPermissions) {
        this.isLoading = true
        CallbackService.searchCallbackTemplates(this.axiosPayload)
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
      CallbackService.getCallbackTemplateLanguages().then((response) => {
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
        this?.$refs?.refCallbackTemplatesTable?.reRenderFilters()
      })
    },
    onCloseDeleteModal() {
      this.selectedTemplate = null
      this.isDeleteModalVisible = false
    },
    handleDeleteConfirm() {
      CallbackService.deleteCallbackTemplate(this.selectedTemplate.resourceId)
        .then(this.callForData)
        .finally(this.onCloseDeleteModal)
    },
    handleActionDelete(row) {
      this.selectedTemplate = row
      this.isDeleteModalVisible = true
    },
    handleFastLaunch(row) {
      this.selectedTemplate = row
    }
  }
}
</script>
