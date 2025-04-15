<template>
  <div class="notification-templates">
    <CompanySettingsHeader
      title="Notification Templates"
      sub-title="Manage notification email templates"
    />
    <NewNotificationTemplate
      v-if="newNotificationTemplateStatus"
      ref="newNotificationTemplate"
      :edit-items-disabled="editItemsDisabled"
      :selectedItem="selectedItem"
      :isDuplicate="isDuplicate"
      :status="newNotificationTemplateStatus"
      @closeOverlay="toggleNewNotificationTemplate"
      @closeOverlayWithUpdate="closeNotificationTemplateWithUpdate"
    />
    <DeleteNotificationTemplateModal
      v-if="showDeleteNotificationTemplateModal"
      :selectedItem="selectedItem"
      :isDeleteButtonDisabled="isDeleteButtonDisabled"
      :status="showDeleteNotificationTemplateModal"
      @handleDelete="handleDeleteNotificationTemplate"
      @closeDialog="toggleDeleteNotificationTemplate"
    />
    <DefaultTemplateDeleteWarningModal
      v-if="showDeleteDefaultNotificationTemplateWarningModal"
      :status="showDeleteDefaultNotificationTemplateWarningModal"
      :templateName="selectedItem.name"
      @closeOverlay="toggleDeleteDefaultTemplateWarningModal"
    />
    <NotificationTemplatesPreviewDialog
      v-if="showNotificationTemplatePreviewDialog"
      :status="showNotificationTemplatePreviewDialog"
      :selected-row="selectedItem"
      @on-close="toggleNotificationPreviewDialog"
    />
    <div class="notification-templates__container">
      <DataTable
        v-if="getNotificationTemplatesSearchPermissions"
        ref="refNotificationList"
        id="company-settings-notification-templates-data-table"
        filterable
        options
        selectable
        is-server-side
        :columns="tableOptions.columns"
        :table="tableData"
        :empty="tableOptions.empty"
        :loading="isLoading"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        :addButton="tableOptions.addButton"
        :row-actions="tableOptions.rowActions"
        :select-event="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @downloadEvent="exportNotificationTemplate"
        @handleAddNotificationTemplates="toggleNewNotificationTemplate"
        @onEmptyBtnClicked="toggleNewNotificationTemplate"
        @refreshAction="callForData"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @handlePreview="handlePreview"
      >
        <template #datatable-row-actions="{ scope }">
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[0].id"
            :scope="scope"
            :icon="tableOptions.rowActions[0].icon"
            :text="tableOptions.rowActions[0].name"
            :disabled="tableOptions.rowActions[0].disabled"
            @on-click="handleEdit(scope.row)"
          />
          <RowActionsMenu>
            <DefaultMenuRowAction
              :id="tableOptions.rowActions[1].id"
              :scope="scope"
              :icon="tableOptions.rowActions[1].icon"
              :text="tableOptions.rowActions[1].name"
              :checkIsOwnerProperty="false"
              @on-click="handlePreview(scope.row)"
            />
            <DefaultMenuRowAction
              :id="tableOptions.rowActions[2].id"
              :scope="scope"
              :disabled="tableOptions.rowActions[2].disabled"
              :icon="tableOptions.rowActions[2].icon"
              :text="tableOptions.rowActions[2].name"
              :checkIsOwnerProperty="false"
              @on-click="handleDuplicate(scope.row)"
            />
            <DefaultMenuRowAction
              :id="tableOptions.rowActions[3].id"
              :scope="scope"
              :disabled="tableOptions.rowActions[3].disabled"
              :icon="tableOptions.rowActions[3].icon"
              :text="tableOptions.rowActions[3].name"
              @on-click="handleMakeDefault(scope.row)"
            />
            <DefaultMenuRowAction
              :id="tableOptions.rowActions[4].id"
              :scope="scope"
              :disabled="tableOptions.rowActions[4].disabled"
              :icon="tableOptions.rowActions[4].icon"
              :text="tableOptions.rowActions[4].name"
              @on-click="handleDelete(scope.row)"
            />
          </RowActionsMenu>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal'
import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate'
import {
  deleteEmailTemplate,
  getCategories,
  searchEmailTemplate,
  exportEmailTemplate,
  getTemplateTypes,
  makeDefaultTemplate
} from '@/api/company'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultTemplateDeleteWarningModal from '@/components/Company Settings/DefaultTemplateDeleteWarningModal'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import NotificationTemplatesPreviewDialog from '@/components/Company Settings/NotificationTemplatesPreviewDialog'
export default {
  name: 'NotificationTemplates',
  components: {
    NotificationTemplatesPreviewDialog,
    RowActionsMenu,
    DefaultMenuRowAction,
    DefaultButtonRowAction,
    NewNotificationTemplate,
    DeleteNotificationTemplateModal,
    DataTable,
    CompanySettingsHeader,
    DefaultTemplateDeleteWarningModal
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      showDeleteDefaultNotificationTemplateWarningModal: false,
      showNotificationTemplatePreviewDialog: false,
      isDuplicate: false,
      categories: [],
      tableData: [],
      editItemsDisabled: false,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: labels.TemplateName,
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'defaultTemplate',
            width: 280,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CATEGORYNAME,
            align: 'left',
            label: labels.Category,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'CategoryResourceId'
          },
          {
            property: PROPERTY_STORE.TYPENAME,
            align: 'left',
            label: labels.TemplateType,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'TypeResourceId'
          },
          {
            property: PROPERTY_STORE.SUBJECT,
            align: 'left',
            label: labels.EmailSubject,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
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
            label: labels.CreateTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'date'
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: 'left',
            label: labels.CreatedBy,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.AVAILABLE_FOR,
            align: 'right',
            label: labels.AvailableFor,
            fixed: false,
            sortable: false,
            hideSort: true,
            show: true,
            type: 'number',
            width: 100,
            isEditable: true
          }
        ],
        addButton: {
          show: true,
          action: 'handleAddNotificationTemplates',
          tooltip: 'Add a Notification Template',
          id: 'btn-add--notification-template',
          disabled: !this.$store.getters['permissions/getNotificationTemplatesCreatePermissions']
        },
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.NOTIFICATION_TEMPLATE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.NOTIFICATION_TEMPLATE,
        empty: {
          message: labels.EmptyNotificationTemplate,
          subMes: labels.EmptyNotificationTemplateSub,
          btn: 'New',
          id: 'btn-empty--notification-template',
          icon: 'mdi-plus',
          disabled: !this.$store.getters['permissions/getNotificationTemplatesCreatePermissions']
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            id: 'btn-edit--notification-template-row-actions',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getNotificationTemplatesUpdatePermissions']
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--notification-template-row-actions'
          },
          {
            name: 'Duplicate',
            icon: 'mdi-content-copy',
            id: 'btn-duplicate--notification-template-row-actions',
            action: 'handleDuplicate'
          },
          {
            name: 'Make Default',
            icon: 'mdi-star-circle',
            id: 'btn-make-default--notification-template-row-actions',
            action: 'handleMakeDefault',
            disabled: !this.$store.getters[
              'permissions/getNotificationTemplatesMakeDefaultPermissions'
            ]
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            id: 'btn-delete--notification-template-row-actions',
            action: 'handleDelete',
            disabled: !this.$store.getters['permissions/getNotificationTemplatesDeletePermissions']
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      },
      isDeleteButtonDisabled: false,
      showDeleteNotificationTemplateModal: false,
      newNotificationTemplateStatus: false,
      selectedItem: null,
      axiosPayload: getDefaultAxiosPayload(),
      defaultAxiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getNotificationTemplatesSearchPermissions:
        'permissions/getNotificationTemplatesSearchPermissions'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    closeNotificationTemplateWithUpdate() {
      this.callForData()
      this.toggleNewNotificationTemplate()
    },
    exportNotificationTemplate(downloadTypes) {
      downloadTypes.exportTypes.map((exportType) => {
        const payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportEmailTemplate(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Notification Templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handlePreview(row) {
      this.selectedItem = row
      this.toggleNotificationPreviewDialog()
    },
    handleDelete(row) {
      this.selectedItem = row
      if (row.isDefault) {
        this.showDeleteDefaultNotificationTemplateWarningModal = true
        return
      }
      this.toggleDeleteNotificationTemplate()
    },
    handleDuplicate(row) {
      this.selectedItem = row
      this.isDuplicate = true
      this.toggleNewNotificationTemplate()
    },
    handleMakeDefault(row) {
      makeDefaultTemplate(row.resourceId).then(() => {
        this.callForData()
      })
    },
    handleDeleteNotificationTemplate(resourceId) {
      this.isDeleteButtonDisabled = true
      deleteEmailTemplate(resourceId)
        .then(() => {
          this.$refs.refNotificationList.unSelectRow(this.selectedItem)
          this.callForData()
        })
        .finally(() => {
          this.toggleDeleteNotificationTemplate()
          this.isDeleteButtonDisabled = false
        })
    },
    toggleDeleteNotificationTemplate() {
      if (this.showDeleteNotificationTemplateModal) {
        this.selectedItem = null
      }
      this.showDeleteNotificationTemplateModal = !this.showDeleteNotificationTemplateModal
    },
    toggleDeleteDefaultTemplateWarningModal() {
      this.showDeleteDefaultNotificationTemplateWarningModal = !this
        .showDeleteDefaultNotificationTemplateWarningModal
    },
    checkIfCanCloseNotificationTemplateModal() {
      if (this.$refs.newNotificationTemplate) this.$refs.newNotificationTemplate.closeOverlay()
    },
    checkIfCanCloseGrapesJSModal() {
      if (this.$refs.newNotificationTemplate) {
        if (this.$refs.newNotificationTemplate.$refs.refEmailTemplate) {
          this.$refs.newNotificationTemplate.$refs.refEmailTemplate.toggleShowGrapesModal()
        }
      }
    },
    toggleNotificationPreviewDialog() {
      if (this.showNotificationTemplatePreviewDialog) {
        this.selectedItem = null
      }
      this.showNotificationTemplatePreviewDialog = !this.showNotificationTemplatePreviewDialog
    },
    toggleNewNotificationTemplate() {
      if (this.newNotificationTemplateStatus) {
        this.selectedItem = null
        this.editItemsDisabled = false
      }
      this.newNotificationTemplateStatus = !this.newNotificationTemplateStatus
    },

    callForSearchEmailTemplate() {
      return searchEmailTemplate(this.axiosPayload)
    },
    callForCategories() {
      return getCategories()
    },
    callForTemplateTypes() {
      return getTemplateTypes()
    },
    callForData() {
      this.setLoading(true)
      Promise.all([
        this.callForCategories(),
        this.callForSearchEmailTemplate(),
        this.callForTemplateTypes()
      ])
        .then((response) => {
          const [categories, emailTemplates, templateTypes] = response
          const {
            data: { data: templateData }
          } = emailTemplates
          const {
            data: { data: categoriesData }
          } = categories
          const {
            data: { data: templateTypesData }
          } = templateTypes

          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = templateData
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = templateData.results.map((item) => ({
            ...item,
            tags: item.tags ? item.tags.filter((tag) => tag.trim().length > 0) : []
          }))
          this.categories = categoriesData.map((category) => {
            return { text: category.name, value: category.resourceId }
          })
          this.templateTypeItems = templateTypesData.map((type) => {
            return { text: type.name, value: type.resourceId }
          })
          this.$set(this.tableOptions.columns, 1, {
            ...this.tableOptions.columns[1],
            filterableItems: this.categories
          })
          this.$set(this.tableOptions.columns, 2, {
            ...this.tableOptions.columns[2],
            filterableItems: this.templateTypeItems
          })
          this?.$refs?.refNotificationList?.reRenderFilters()
        })
        .finally(this.setLoading)
    },
    handleEdit(row) {
      if (!row.isOwner) {
        this.editItemsDisabled = true
      }
      this.selectedItem = row
      this.isDuplicate = false
      this.toggleNewNotificationTemplate()
    }
  }
}
</script>
