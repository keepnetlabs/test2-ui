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
      <template v-slot:app-dialog-body>
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
      <template v-slot:app-dialog-footer>
        <AppDialogFooter
          @handleClose="onCloseRenameAttachmentModal"
          @handleConfirm="onConfirmRenameAttachment"
        />
      </template>
    </AppDialog>
    <DeleteEmailTemplates
      :status="showDeleteModal"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      @handleMultipleDelete="handleDeleteMultiple"
      :selectedEmailTemplate="selectedEmailTemplate"
    />
    <app-dialog
      v-if="isTemplateDetails"
      custom-size="1600"
      max-height
      max-height-size="900"
      icon="mdi-eye"
      :title="selectedTemplateHeader"
      :status="isTemplateDetails"
      :subtitle="'Email Template Preview'"
      @changeStatus="isTemplateDetails = false"
    >
      <template v-slot:app-dialog-body>
        <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
        <div v-show="!isPreviewLoading" class="template-preview">
          <div class="template-preview__text" v-if="!!templateHTML">
            <div>
              <span class="template-preview__text--title">Template Name: </span>
              <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
            </div>
            <div>
              <span class="template-preview__text--title">From Name: </span>
              <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
            </div>
            <div>
              <span class="template-preview__text--title">From Email Address: </span>
              <span class="template-preview__text--body">{{
                emailTemplateParams.fromAddress
              }}</span>
            </div>
          </div>
          <div
            v-if="emailTemplateParams.attachment"
            class="attachment-wrapper mt-2"
            style="position: relative;"
          >
            <div class="attachment blue-attach mb-0">
              <AttachmentsPreview
                :deletable="false"
                :att="emailTemplateParams.attachment"
                :isEmailTemplate="true"
              />
            </div>
          </div>
          <hr class="mt-2" v-if="!!templateHTML" />
          <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isTemplateDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>

    <data-table
      v-if="getEmailTemplatesSearchPermissions"
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
      :axios-payload.sync="bodyData"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewEmailTemplateModalStatus(true)"
      @downloadEvent="exportEmailTemplates"
      @handleMultipleDelete="handleActionDelete"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :scope="scope"
          :icon="tableOptions.rowActions[0].icon"
          :disabled="tableOptions.rowActions[0].disabled"
          :text="tableOptions.rowActions[0].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            @on-click="handleEdit(scope.row, false)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleEdit(scope.row, true)"
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
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewEmailTemplates from './NewEmailTemplates'
import DeleteEmailTemplates from './DeleteEmailTemplates'
import AppDialog from '../AppDialog'
import { deleteIntegration, disableIntegration, enableIntegration } from '@/api/integrations'
import {
  getEmailTemplatesList,
  exportEmailTemplates,
  getEmailTemplatePreviewContent
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
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
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import KEmailPreview from '@/components/KEmailPreview'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import * as Validations from '@/utils/validations'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { mapGetters } from 'vuex'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'

export default {
  name: 'EmailTemplates',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DatatableLoading,
    KEmailPreview,
    DataTable,
    DeleteEmailTemplates,
    NewEmailTemplates,
    AppDialog,
    AppDialogFooter,
    AttachmentsPreview
  },
  mixins: [useCallForLanguagesForTableFilter],
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
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.EMAILTEMPLATES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.EMAILTEMPLATES,
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
            property: PROPERTY_STORE.CATEGORYNAME,
            align: 'left',
            editable: false,
            label: labels.Category,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 175,
            filterableType: 'select',
            filterableCustomFieldName: 'CategoryResourceId',
            filterableItems: [
              { text: 'Click Only', value: 'WNZt0sCVCWB3' },
              { text: 'Data Submission', value: 'DYC0gugxJMjT' },
              { text: 'Attachment', value: '7dLrW2kdBTDs' }
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
            // filterableType: 'select',
            // filterableItems: ['Custom', 'System']
          },
          {
            property: PROPERTY_STORE.TAGS,
            align: 'left',
            editable: false,
            label: 'Tags',
            fixed: false,
            sortable: true,
            show: true,
            type: 'textArray',
            width: 150,
            hasTooltip: true,
            filterableType: 'text',
            filterableCustomFieldName: PROPERTY_STORE.TAGS
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
            action: 'handlePreview'
            // disabled: !this.$store.getters['permissions/getEmailTemplatesPreviewPermissions']
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getEmailTemplatesEditPermissions']
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'disable'
            // disabled: !this.$store.getters['permissions/getEmailTemplatesCreatePermissions']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getEmailTemplatesDeletePermissions']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getEmailTemplatesExportPermissions']
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
          disabled: !this.$store.getters['permissions/getEmailTemplatesCreatePermissions']
        }
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      selectedTemplateHeader: null,
      templateHTML: null
    }
  },
  computed: {
    ...mapGetters({
      getEmailTemplatesSearchPermissions: 'permissions/getEmailTemplatesSearchPermissions'
    })
  },
  created() {
    this.callForLanguages('refEmailTemplatesList')
    this.getDatatableList()
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
            fileExtension = this.$refs.newEmailTemplate.formValues.attachmentFiles[0].name.split(
              '.'
            )[1]
            const file = {
              ...this.$refs.newEmailTemplate.formValues.attachmentFiles[0]
            }
            this.$refs.newEmailTemplate.formValues.attachmentFiles = [
              new File([file], `${this.attachmentName}.${fileExtension}`, {
                type
              })
            ]
          } else {
            fileExtension = this.$refs.newEmailTemplate.formValues.attachmentFiles[0].fileName.split(
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
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyData.filter.FilterGroups[1].FilterItems = this.bodyData.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
    },
    handleDeleteMultiple(selections) {
      selections.forEach((item) => {
        this.handleDelete(item)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.getDatatableList()
    },
    handleDelete(row) {
      deleteIntegration(row.resourceId).then(() => {
        this.$refs.refEmailTemplatesList.unSelectRow(row)
        this.getDatatableList()
      })
    },
    handlePreview(row) {
      this.isTemplateDetails = true
      const id = row.resourceId
      this.isPreviewLoading = true
      getEmailTemplatePreviewContent(id)
        .then((response) => {
          const data = response.data.data
          this.selectedTemplateHeader = data.subject
          const { fromName, fromAddress, name, difficultyResourceId, phishingFileName } = data
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
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
        this.getDatatableList()
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
          filter: this.bodyData.filter
        }
        exportEmailTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `EmailTemplates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getDatatableList() {
      if (this.getEmailTemplatesSearchPermissions) {
        this.loading = true
        getEmailTemplatesList(this.bodyData)
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
      } else {
        this.$router.push('/')
      }
    },
    handleActionDelete(row) {
      this.selectedEmailTemplate = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.getDatatableList()
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  }
}
</script>

<style lang="scss">
.emailTemplates {
  min-height: 90vh;
}
.emailTemplates__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
