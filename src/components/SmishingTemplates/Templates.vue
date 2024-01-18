<template>
  <div id="smishing-templates">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewSmishingTemplate
        ref="newEmailTemplate"
        :status="modalStatus"
        :emailTemplateId="emailTemplateId"
        :isEdit="isEdit"
        :isDuplicate="isDuplicate"
        :editableFormValues="editableFormValues"
        @changeNewEmailTemplateModalStatus="changeNewEmailTemplateModalStatus"
        @showRenameAttachmentModal="onShowRenameAttachmentModal"
      />
    </v-overlay>
    <DeleteTemplateModal
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selectedEmailTemplate="selectedEmailTemplate"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
    />
    <AppDialog
      v-if="isTemplateDetails"
      custom-size="668"
      max-height
      max-height-size="900"
      icon="mdi-eye"
      title="Text Message Template Preview"
      :status="isTemplateDetails"
      :subtitle="selectedTemplateHeader"
      @changeStatus="isTemplateDetails = false"
    >
      <template v-slot:app-dialog-body>
        <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
        <div v-show="!isPreviewLoading" class="template-preview">
          <div class="d-flex flex-column py-6">
            <span class="mb-2 text-body-1">Text Message</span>
            <span class="text-body-1">{{ template }}</span>
          </div>
        </div>
      </template>
      <template #app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            id="btn-close--email-preview-popup"
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isTemplateDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </AppDialog>

    <data-table
      v-if="getSmishingTextMessageTemplatesSearchPermissions"
      id="emailTemplates-data-table"
      ref="refEmailTemplatesList"
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
      :download-button="tableOptions.downloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewEmailTemplateModalStatus(true)"
      @downloadEvent="exportEmailTemplates"
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
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :disabled="tableOptions.rowActions[0].disabled"
          :text="tableOptions.rowActions[0].name"
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
            :scope="scope"
            :id="tableOptions.rowActions[2].id"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
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
    </data-table>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import NewSmishingTemplate from '@/components/SmishingTemplates/NewTemplate'
import DeleteTemplateModal from '@/components/SmishingTemplates/DeleteTemplateModal'
import AppDialog from '@/components/AppDialog'
import SmishingService from '@/api/smishing'
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
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import * as Validations from '@/utils/validations'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'SmishingTemplates',
  components: {
    ScenariosRowActionsDeleteButton,
    ScenariosRowActionsEditButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DatatableLoading,
    DataTable,
    DeleteTemplateModal,
    NewSmishingTemplate,
    AppDialog
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      attachmentName: '',
      isRenameAttachmentModalVisible: false,
      languageFilterOptions: [],
      editableFormValues: {},
      timeoutId: '',
      emailTemplateParams: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      labels,
      totalNumberOfRecords: 0,
      tableData: [],
      showDeleteModal: false,
      isPreviewLoading: false,
      selectedEmailTemplate: {},
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SMISHING_TEMPLATES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SMISHING_TEMPLATES,
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
            property: 'categoryName',
            align: 'left',
            editable: false,
            label: labels.Method,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'select',
            filterableCustomFieldName: 'CategoryResourceId',
            filterableItems: [
              { text: 'Click Only', value: 'WNZt0sCVCWB3' },
              { text: 'Data Submission', value: 'DYC0gugxJMjT' }
            ]
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
            property: PROPERTY_STORE.DIFFICULTY,
            align: 'center',
            editable: false,
            label: labels.DIFFICULTY,
            sortable: true,
            show: true,
            type: 'status',
            filterableType: 'select',
            filterableItems: [
              { text: 'Easy', value: 'mT0CeYGgKsVb' },
              { text: 'Medium', value: 'Z5XeVlpw6Dps' },
              { text: 'Hard', value: 'c4LCGEB9MayB' }
            ],
            width: 180,
            filterableCustomFieldName: 'DifficultyResourceId'
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
          }
        ],
        rowActions: [
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--email-templates-row-actions'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters[
              'permissions/getSmishingTextMessageTemplatesEditPermissions'
            ],
            id: 'btn-edit--email-templates-row-actions'
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'disable',
            id: 'btn-duplicate--email-templates-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters[
              'permissions/getSmishingTextMessageTemplatesDeletePermissions'
            ],
            id: 'btn-delete--email-templates-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters[
            'permissions/getSmishingTextMessageTemplatesExportPermissions'
          ]
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_EMAIL_TEMPLATES,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--emailTemplates'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Template',
          id: 'btn-add--emailTemplates',
          disabled: !this.$store.getters[
            'permissions/getSmishingTextMessageTemplatesCreatePermissions'
          ]
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      selectedTemplateHeader: null,
      template: null,
      templateHTML: null
    }
  },
  computed: {
    ...mapGetters({
      getSmishingTextMessageTemplatesSearchPermissions:
        'permissions/getSmishingTextMessageTemplatesSearchPermissions'
    }),
    getTextMessage() {
      return this.emailTemplateParams?.template
    }
  },
  mounted() {
    this.callForLanguages('refEmailTemplatesList')
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    onShowRenameAttachmentModal() {
      this.isRenameAttachmentModalVisible = true
    },
    onCloseRenameAttachmentModal() {
      this.attachmentName = ''
      this.isRenameAttachmentModalVisible = false
    },
    onConfirmRenameAttachment() {
      if (this.$refs.refAttachmentNameForm && this.$refs.refAttachmentNameForm.validate()) {
        if (this.$refs.newEmailTemplate) {
          let fileExtension = ''
          const type = this.$refs.newEmailTemplate.formValues.attachmentFiles[0].type
          if (this.$refs.newEmailTemplate.formValues.attachmentFiles[0].name) {
            fileExtension = this.$refs?.newEmailTemplate?.formValues?.attachmentFiles?.[0]?.name.split(
              '.'
            )[1]
            const file = this.$refs.newEmailTemplate.formValues.attachmentFiles[0]
            this.$refs.newEmailTemplate.formValues.attachmentFiles = [
              new File([file], `${this.attachmentName}.${fileExtension}`, {
                type
              })
            ]
          } else {
            fileExtension = this.$refs?.newEmailTemplate?.formValues?.attachmentFiles?.[0]?.fileName.split(
              '.'
            )[1]
            this.$refs.newEmailTemplate.formValues.attachmentFiles = [
              {
                ...this.$refs.newEmailTemplate.formValues.attachmentFiles[0],
                fileName: `${this.attachmentName}.${fileExtension}`
              }
            ]
          }
          this.$refs.newEmailTemplate.isPhishingFileModified = true
        }
        this.onCloseRenameAttachmentModal()
      }
    },
    handleSuccessDeleteAction(row) {
      this.$refs.refEmailTemplatesList.unSelectRow(row)
      this.showDeleteModal = false
      this.callForData()
    },
    handlePreview(row) {
      this.isTemplateDetails = true
      const id = row.resourceId
      this.isPreviewLoading = true
      SmishingService.getTextMessageTemplate(id)
        .then((response) => {
          const data = response.data.data
          this.selectedTemplateHeader = data.name
          this.template = data.template
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.isPreviewLoading = false
          }, 500)
        })
    },
    handleEdit(row, isDuplicate) {
      this.editableFormValues = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.emailTemplateId = row.resourceId
    },
    checkIfCanCloseGrapesJSModal() {
      if (this.$refs.newEmailTemplate) {
        if (this.$refs.newEmailTemplate.$refs.refEmailTemplate)
          this.$refs.newEmailTemplate.$refs.refEmailTemplate.toggleShowGrapesModal()
      }
    },
    checkIfCanCloseNewEmailTemplate() {
      if (this.$refs.newEmailTemplate) {
        this.$refs.newEmailTemplate.changeNewEmailTemplateModalStatus()
      }
    },
    changeNewEmailTemplateModalStatus(status, restart) {
      this.modalStatus = status
      this.emailTemplateId = null
      this.isEdit = false
      this.isDuplicate = false
      if (restart) {
        this.editableFormValues = {}
        this.emailTemplateId = null
        this.isEdit = false
        this.isDuplicate = false
        this.callForData()
      }
    },
    exportEmailTemplates({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        SmishingService.exportTextMessageTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `smishing-templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    callForData() {
      if (this.getSmishingTextMessageTemplatesSearchPermissions) {
        this.loading = true
        SmishingService.searchTextMessageTemplates(this.axiosPayload)
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
      this.selectedEmailTemplate = row
      this.showDeleteModal = true
    }
  }
}
</script>
