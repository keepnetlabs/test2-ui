<template>
  <div id="emailTemplates">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewEmailTemplates
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
    <AppDialog
      :status="isRenameAttachmentModalVisible"
      title="Rename The Attachment"
      @changeStatus="onCloseRenameAttachmentModal"
    >
      <template #app-dialog-body>
        <v-form ref="refAttachmentNameForm" @submit.prevent>
          <v-text-field
            v-model.trim="attachmentName"
            v-bind="commonRules"
            id="input--new-email-templates-template-name"
            placeholder="Enter a name"
            hint="*Required"
            required
            outlined
            dense
            persistent-hint
            @keyup.enter="onConfirmRenameAttachment"
          />
        </v-form>
      </template>
      <template #app-dialog-footer>
        <AppDialogFooter
          @handleClose="onCloseRenameAttachmentModal"
          @handleConfirm="onConfirmRenameAttachment"
        />
      </template>
    </AppDialog>
    <DeleteEmailTemplates
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selectedEmailTemplate="selectedEmailTemplate"
      :templateCount="multipleDeletedTemplatesCount"
      :multipleDeletePayload="multipleTemplatesPayload"
      :isMultiple="isMultipleDelete"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @on-success-multiple="handleSuccessMultipleDeleteAction"
      @handleCloseModal="showDeleteModal = false"
    />
    <EmailTemplatePreview
      v-if="isTemplateDetails"
      :status="isTemplateDetails"
      :isPreviewLoading="isPreviewLoading"
      :selectedTemplateHeader="selectedTemplateHeader"
      :templateHTML="templateHTML"
      :emailTemplateParams="emailTemplateParams"
      @close="isTemplateDetails = false"
    />
    <DataTable
      v-if="getCallbackEmailTemplatesSearchPermissions"
      id="emailTemplates-data-table"
      ref="refEmailTemplatesList"
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
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import NewEmailTemplates from '@/components/CallbackScenarios/NewEmailTemplate'
import DeleteEmailTemplates from '@/components/CallbackScenarios/DeleteEmailTemplate'
import EmailTemplatePreview from '@/components/CallbackScenarios/EmailTemplatePreview'
import AppDialog from '@/components/AppDialog'
import CallbackService from '@/api/callback'
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
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import * as Validations from '@/utils/validations'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'CallbackEmailTemplates',
  components: {
    EmailTemplatePreview,
    ScenariosRowActionsDeleteButton,
    ScenariosRowActionsEditButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    DeleteEmailTemplates,
    NewEmailTemplates,
    AppDialog,
    AppDialogFooter
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
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      multipleTemplatesPayload: {},
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
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CALLBACK_EMAIL_TEMPLATES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CALLBACK_EMAIL_TEMPLATES,
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
            property: PROPERTY_STORE.LANGUAGE,
            align: 'left',
            editable: false,
            label: labels.LANGUAGE,
            sortable: true,
            show: true,
            type: 'multiText',
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
            disabled: !this.$store.getters['permissions/getCallbackEmailTemplatesEditPermissions'],
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
              'permissions/getCallbackEmailTemplatesDeletePermissions'
            ],
            id: 'btn-delete--email-templates-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getCallbackEmailTemplatesExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
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
          disabled: !this.$store.getters['permissions/getCallbackEmailTemplatesCreatePermissions']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      selectedTemplateHeader: null,
      templateHTML: null
    }
  },
  computed: {
    ...mapGetters({
      getCallbackEmailTemplatesSearchPermissions:
        'permissions/getCallbackEmailTemplatesSearchPermissions'
    })
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
            fileExtension = this.$refs?.newEmailTemplate?.formValues?.attachmentFiles?.[0]?.fileName?.split(
              '.'
            )?.[1]
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
      this.$refs.refEmailTemplatesList?.resetSelectableParams()
      this.showDeleteModal = false
      this.callForData()
    },
    handleSuccessMultipleDeleteAction() {
      this?.$refs?.refEmailTemplatesList?.resetSelectableParams()
      this.showDeleteModal = false
      this.callForData()
    },
    handlePreview(row) {
      this.isTemplateDetails = true
      const id = row.resourceId
      this.isPreviewLoading = true
      CallbackService.getEmailTemplate(id)
        .then((response) => {
          const data = response.data.data
          this.selectedTemplateHeader = data.name
          const {
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            phishingFileName,
            subject
          } = data
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            subject,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null
          }
          this.templateHTML = data.template
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
        CallbackService.exportEmailTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Callback-Email-Templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    callForData() {
      if (this.getCallbackEmailTemplatesSearchPermissions) {
        this.loading = true
        CallbackService.searchEmailTemplates(this.axiosPayload)
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
      this.showDeleteModal = true
    },
    handleActionDelete(row) {
      this.isMultipleDelete = false
      this.selectedEmailTemplate = row
      this.showDeleteModal = true
    }
  }
}
</script>
