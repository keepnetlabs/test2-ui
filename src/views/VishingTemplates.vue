<!-- TODO: add this line to DataTable v-if="getEmailTemplatesSearchPermissions" -->
<template>
  <KContainer id="vishing-templates">
    <VishingTemplatePreview
      v-if="isPreviewVisible"
      :status="isPreviewVisible"
      :selectedRow="selectedTemplate"
      :showTemplateInfo="false"
      @on-close="onToggleShowPreviewModal"
    />
    <DeleteVishingTemplateDialog
      :status="isDeleteModalVisible"
      :selectedTemplate="selectedTemplate"
      @onCancel="onCloseDeleteModal"
      @onConfirm="handleDeleteConfirm"
    />
    <VishingTemplateModal
      ref="refVishingTemplateModal"
      v-if="modalStatus"
      :status="modalStatus"
      :templateId="getTemplateId"
      :isEdit="isEdit"
      :isDuplicate="isDuplicate"
      @changeVishingTemplateModalStatus="changeNewVishingTemplateModalStatus(false)"
    />
    <DataTable
      id="vishing-templates-data-table"
      ref="refVishingTemplatesList"
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
      @addAction="changeNewVishingTemplateModalStatus(true)"
      @downloadEvent="exportVishingTemplates"
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
            disabledTooltipText="You are not authorized to edit this template"
            className="vishing-templates__menu-row-action-tooltip"
            showTooltip
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            @on-click="handleEdit(scope.row, false)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            @on-click="handleFastLaunch(scope.row, false)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[3].disabled"
            :icon="tableOptions.rowActions[3].icon"
            :text="tableOptions.rowActions[3].name"
            :checkIsOwnerProperty="false"
            @on-click="handleEdit(scope.row, true)"
          />
          <DefaultMenuRowAction
            disabledTooltipText="You are not authorized to delete this template"
            className="vishing-templates__menu-row-action-tooltip"
            showTooltip
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
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
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
  getVishingTemplateList,
  deleteVishingTemplate
} from '@/api/vishing'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import DeleteVishingTemplateDialog from '@/components/VishingTemplates/DeleteVishingTemplateDialog'
import VishingTemplateModal from '@/components/VishingTemplates/VishingTemplateModal'
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
  data() {
    return {
      vishingTemplateId: null,
      modalStatus: false,
      isPreviewVisible: false,
      loading: true,
      isEdit: false,
      isDuplicate: false,
      tableData: [],
      isDeleteModalVisible: false,
      // TODO: Set initial value to null
      selectedTemplate: {
        resourceId: '123',
        name: 'Template Name'
      },
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
            filterableItems: [
              'English - Female',
              'English - Male',
              'German - Male',
              'German - Female'
            ]
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
            // filterableType: 'select',
            // filterableItems: ['Custom', 'System']
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
            label: labels.AvailalbeFor,
            fixed: false,
            sortable: false,
            hideSort: true,
            filtarable: false,
            show: true,
            type: 'number',
            width: 100,
            isEditable: true
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
            // disabled: !this.$store.getters['permissions/getEmailTemplatesPreviewPermissions']
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit'
            // TODO: Add permissions
            // disabled: !this.$store.getters['permissions/getEmailTemplatesEditPermissions']
          },
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'handleFastLaunch'
            // disabled: !this.$store.getters['permissions/getPhishingScenariosPreviewPermissions']
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
            action: 'deleteAction'
            // TODO: Add permissions
            // disabled: !this.$store.getters['permissions/getEmailTemplatesDeletePermissions']
          }
        ],
        downloadButton: {
          show: true
          // TODO: Add permissions
          // disabled: !this.$store.getters['permissions/getEmailTemplatesExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
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
          id: 'btn-add--vishingTemplates'
          // TODO: Add permissions
          // disabled: !this.$store.getters['permissions/getEmailTemplatesCreatePermissions']
        }
      },
      bodyData: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getTemplateId() {
      return this.selectedTemplate ? this.selectedTemplate.resourceId : ''
    }
  },
  created() {
    this.getDatatableList()
  },
  methods: {
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
    onToggleShowPreviewModal() {
      if (this.isPreviewVisible) this.selectedTemplate = null
      this.isPreviewVisible = !this.isPreviewVisible
    },
    handlePreview(row) {
      this.vishingTemplateId = row.resourceId
      this.onToggleShowPreviewModal()
    },
    handleEdit(row, isDuplicate) {
      this.selectedTemplate = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.vishingTemplateId = row.resourceId
    },
    // checkIfCanCloseNewEmailTemplate() {
    //   if (this.$refs.newEmailTemplate) {
    //     this.$refs.newEmailTemplate.changeNewEmailTemplateModalStatus()
    //   }
    // },
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
        this.getDatatableList()
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
          filter: this.bodyData.filter
        }
        exportVishingTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `VishingTemplates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getDatatableList() {
      // TODO: Add permissions
      // if (this.getEmailTemplatesSearchPermissions) {
      this.loading = true
      getVishingTemplateList(this.bodyData)
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
      // } else {
      // this.$router.push('/')
      // }
    },
    onCloseDeleteModal() {
      this.selectedTemplate = null
      this.isDeleteModalVisible = false
    },
    handleDeleteConfirm() {
      deleteVishingTemplate(this.selectedTemplate.resourceId)
        .then(this.getDatatableList)
        .finally(this.onCloseDeleteModal)
    },
    handleActionDelete(row) {
      this.selectedTemplate = row
      this.isDeleteModalVisible = true
    },
    handleFastLaunch(row) {
      this.selectedTemplate = row
      // TODO: Add Fast Launch logic here
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
  }
}
</script>
