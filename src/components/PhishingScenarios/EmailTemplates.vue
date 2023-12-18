<template>
  <div id="emailTemplates">
    <NewEmailTemplates
      v-if="modalStatus"
      ref="newEmailTemplate"
      :status="modalStatus"
      :email-template-id="emailTemplateId"
      :is-edit="isEdit"
      :is-duplicate="isDuplicate"
      @changeNewEmailTemplateModalStatus="changeNewEmailTemplateModalStatus"
      @showRenameAttachmentModal="onShowRenameAttachmentModal"
    />
    <CommonSimulatorAttachmentRenameDialog
      v-if="isShowRenameAttachmentDialog"
      :status="isShowRenameAttachmentDialog"
      @on-close="onCloseRenameAttachmentModal"
      @on-confirm="onConfirmRenameAttachment"
    />
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selected-email-template="selectedEmailTemplate"
      :api-func="deleteEmailTemplate"
      @on-success="handleSuccessDeleteAction"
      @on-close="showDeleteModal = false"
    />
    <CommonSimulatorEmailTemplatePreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedEmailTemplate"
      @on-close="togglePreviewDialog"
    />
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
          @on-click="togglePreviewDialog(scope.row)"
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
import DataTable from '../DataTable'
import NewEmailTemplates from './NewEmailTemplates'
import {
  getEmailTemplatesList,
  exportEmailTemplates,
  deleteEmailTemplate
} from '@/api/phishingsimulator'
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
import * as Validations from '@/utils/validations'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
// import { deleteEmailTemplate } from '@/api/company'
import CommonSimulatorAttachmentRenameDialog from '@/components/Common/Simulator/CommonSimulatorAttachmentRenameDialog.vue'
export default {
  name: 'EmailTemplates',
  components: {
    CommonSimulatorAttachmentRenameDialog,
    CommonSimulatorEmailTemplateDeleteDialog,
    CommonSimulatorEmailTemplatePreviewDialog,
    ScenariosRowActionsDeleteButton,
    ScenariosRowActionsEditButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    NewEmailTemplates
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      isShowRenameAttachmentDialog: false,
      languageFilterOptions: [],
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
            label: labels.Method,
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
            disabled: !this.$store.getters['permissions/getEmailTemplatesEditPermissions'],
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
            disabled: !this.$store.getters['permissions/getEmailTemplatesDeletePermissions'],
            id: 'btn-delete--email-templates-row-actions'
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
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isShowPreviewDialog: false,
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
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    deleteEmailTemplate,
    onShowRenameAttachmentModal() {
      this.isShowRenameAttachmentDialog = true
    },
    onCloseRenameAttachmentModal() {
      this.isShowRenameAttachmentDialog = false
    },
    onConfirmRenameAttachment(attachmentName = '') {
      if (this.$refs.newEmailTemplate) {
        let fileExtension = ''
        const type = this.$refs.newEmailTemplate.formValues.attachmentFiles[0].type
        if (this.$refs.newEmailTemplate.formValues.attachmentFiles[0].name) {
          fileExtension = this.$refs?.newEmailTemplate?.formValues?.attachmentFiles?.[0]?.name.split(
            '.'
          )[1]
          const file = this.$refs.newEmailTemplate.formValues.attachmentFiles[0]
          this.$refs.newEmailTemplate.formValues.attachmentFiles = [
            new File([file], `${attachmentName}.${fileExtension}`, {
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
              fileName: `${attachmentName}.${fileExtension}`
            }
          ]
        }
        this.$refs.newEmailTemplate.isPhishingFileModified = true
      }
      this.onCloseRenameAttachmentModal()
    },
    handleSuccessDeleteAction(row) {
      this.$refs.refEmailTemplatesList.unSelectRow(row)
      this.showDeleteModal = false
      this.callForData()
    },
    togglePreviewDialog(row = null) {
      this.selectedEmailTemplate = row
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    handleEdit(row, isDuplicate) {
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
    callForData() {
      if (this.getEmailTemplatesSearchPermissions) {
        this.loading = true
        getEmailTemplatesList(this.axiosPayload)
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
