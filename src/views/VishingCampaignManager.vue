<template>
  <KContainer id="vishing-campaign-manager" tabless>
    <VishingTemplatePreview
      v-if="isPreviewVisible"
      isCampaign
      :status="isPreviewVisible"
      :selectedRow="selectedRow"
      @on-close="onToggleShowPreviewModal"
    />
    <DeleteVishingCampaignDialog
      :status="isDeleteModalVisible"
      :selectedRow="selectedRow"
      :selectedRowCount="selectedRowCount"
      :isMultiple="isMultipleDelete"
      @onCancel="handleCloseDeleteModal"
      @onConfirm="handleConfirmDelete"
    />
    <VishingCampaignModal
      ref="refVishingCampaignModal"
      v-if="isCampaignModalVisible"
      :status="isCampaignModalVisible"
      :selectedRow="selectedRow"
      :isEdit="isEdit"
      :isDuplicate="isDuplicate"
      @cancel="handleCloseCampaignModal"
    />
    <DataTable
      id="vishing-campaign-manager-data-table"
      ref="refTable"
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
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="isCampaignModalVisible = true"
      @addAction="isCampaignModalVisible = true"
      @downloadEvent="exportVishingCampaigns"
      @handleMultipleDelete="handleMultipleDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <div class="vishing-campaign-manager__status-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.status)" size="medium" />
        </div>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          v-if="['Scheduled', 'Idle'].includes(scope.row.status)"
          :scope="scope"
          :icon="tableOptions.rowActions[0].icon"
          :disabled="tableOptions.rowActions[0].disabled"
          :text="tableOptions.rowActions[0].name"
          :checkIsOwnerProperty="false"
          @on-click="handleLaunch(scope.row)"
        />
        <DefaultButtonRowAction
          v-if="scope.row.status === 'Running'"
          :scope="scope"
          :icon="tableOptions.rowActions[6].icon"
          :disabled="tableOptions.rowActions[6].disabled"
          :text="tableOptions.rowActions[6].name"
          :checkIsOwnerProperty="false"
          @on-click="handleStop(scope.row)"
        />
        <DefaultButtonRowAction
          v-if="
            scope.row.status === 'Completed' ||
            scope.row.status === 'Cancelled' ||
            scope.row.status === 'Error'
          "
          :scope="scope"
          :icon="tableOptions.rowActions[1].icon"
          :disabled="tableOptions.rowActions[1].disabled"
          :text="tableOptions.rowActions[1].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            v-if="scope.row.status !== 'Completed' && scope.row.status !== 'Cancelled'"
            :scope="scope"
            :icon="tableOptions.rowActions[1].icon"
            :disabled="tableOptions.rowActions[1].disabled"
            :text="tableOptions.rowActions[1].name"
            :checkIsOwnerProperty="false"
            @on-click="handlePreview(scope.row)"
          />
          <DefaultMenuRowAction
            v-if="['Scheduled', 'Idle'].includes(scope.row.status)"
            :scope="scope"
            :icon="tableOptions.rowActions[2].icon"
            :disabled="tableOptions.rowActions[2].disabled"
            :text="tableOptions.rowActions[2].name"
            @on-click="handleEdit(scope.row)"
          />
          <DefaultMenuRowAction
            v-if="!['Scheduled', 'Idle'].includes(scope.row.status)"
            :scope="scope"
            :disabled="tableOptions.rowActions[5].disabled"
            :icon="tableOptions.rowActions[5].icon"
            :text="tableOptions.rowActions[5].name"
            :checkIsOwnerProperty="false"
            @on-click="handleViewReport(scope.row)"
          />
          <DefaultMenuRowAction
            v-if="['Scheduled', 'Running', 'Idle'].includes(scope.row.status)"
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
            @on-click="handleDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </DataTable>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { useLoading } from '@/hooks/useLoading'
import {
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getVishingCampaigns, exportVishingCampaigns, deleteVishingCampaign } from '@/api/vishing'
import labels from '@/model/constants/labels'
import DataTable from '@/components/DataTable'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import { getStatusBadgeProps } from '@/components/VishingCampaignManager/utils'
import Badge from '@/components/Badge'
import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview'
import DeleteVishingCampaignDialog from '@/components/VishingCampaignManager/DeleteVishingCampaignDialog'
import VishingCampaignModal from '@/components/VishingCampaignManager/VishingCampaignModal'

export default {
  name: 'VishingCampaignManager',
  components: {
    KContainer,
    DataTable,
    DefaultButtonRowAction,
    RowActionsMenu,
    DefaultMenuRowAction,
    Badge,
    VishingTemplatePreview,
    DeleteVishingCampaignDialog,
    VishingCampaignModal
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      isPreviewVisible: false,
      isDeleteModalVisible: false,
      isCampaignModalVisible: false,
      loading: true,
      isEdit: false,
      isMultipleDelete: false,
      isDuplicate: false,
      tableData: [],
      selectedRow: null,
      selectedRowCount: 0,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.VISHING_CAMPAIGN_MANAGER,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.VISHING_CAMPAIGN_MANAGER,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Campaign Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: 'targetUsers',
            align: 'right',
            editable: false,
            label: 'Target Users',
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: 'number'
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'select',
            filterableItems: ['Completed', 'Running', 'Idle', 'Scheduled', 'Cancelled', 'Error'],
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
            property: 'templateName',
            align: 'left',
            editable: false,
            label: 'Template',
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            overrideWidth: true,
            width: 200,
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          },
          {
            property: 'lastLaunch',
            align: 'left',
            editable: false,
            label: 'Last Launch',
            fixed: false,
            sortable: true,
            show: true,
            overrideWidth: true,
            width: 200,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          }
        ],
        rowActions: [
          {
            name: labels.Launch,
            icon: 'mdi-send',
            action: 'handleLaunch'
          },
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
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'handleDuplicate'
            // disabled: !this.$store.getters['permissions/getEmailTemplatesCreatePermissions']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'handleDelete'
            // disabled: !this.$store.getters['permissions/getEmailTemplatesDeletePermissions']
          },
          {
            name: labels.ViewReport,
            icon: 'mdi-text-box',
            action: 'handleViewReport'
          },
          {
            name: labels.Stop,
            icon: 'mdi-stop',
            action: 'handleStop'
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
          delete: true,
          download: false
        },
        empty: {
          message: labels.NoVishingCampaigns,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--vishingCampaigns'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Vishing Campaign',
          id: 'btn-add--vishingCampaigns'
          // TODO: Add permissions
          // disabled: !this.$store.getters['permissions/getEmailTemplatesCreatePermissions']
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.callForData()
  },

  methods: {
    callForData() {
      // TODO: Add permissions
      // if (this.getEmailTemplatesSearchPermissions) {
      this.loading = true
      getVishingCampaigns(this.axiosPayload)
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
        .finally(() => (this.loading = false))
      // } else {
      // this.$router.push('/')
      // }
    },
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    exportVishingCampaigns({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportVishingCampaigns(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Vishing-Campaigns.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    onToggleShowPreviewModal() {
      if (this.isPreviewVisible) this.selectedRow = null
      this.isPreviewVisible = !this.isPreviewVisible
    },
    onToggleShowDeleteModal() {
      if (this.isDeleteModalVisible) {
        this.selectedRow = null
        this.isMultipleDelete = false
      }
      this.isDeleteModalVisible = !this.isDeleteModalVisible
    },
    handleViewReport(row) {
      this.$router.push({
        name: 'Vishing Report',
        params: {
          id: row.resourceId
        }
      })
    },
    handleTryAgain(row) {},
    handleStop(row) {},
    handleLaunch(row) {},
    handlePreview(row) {
      this.selectedRow = row
      this.onToggleShowPreviewModal()
    },
    handleEdit(row, isDuplicate) {
      this.selectedRow = row
      this.isEdit = !isDuplicate
      this.isDuplicate = isDuplicate
      this.isCampaignModalVisible = true
    },
    handleConfirmDelete() {
      deleteVishingCampaign(this.selectedRow.resourceId)
        .then(this.callForData)
        .finally(this.handleCloseDeleteModal)
    },
    handleDelete(row) {
      this.selectedRow = row
      this.isDeleteModalVisible = true
    },
    handleMultipleDelete(items, excludedItems, selectAll) {
      this.multipleDeletePayload = {
        items: selectAll ? [] : items.map((item) => item.companyResourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.selectedRowCount = selectAll ? this.serverSideProps.totalNumberOfRecords : items.length
      this.isMultipleDelete = true
      this.onToggleShowDeleteModal()
    },
    handleCloseDeleteModal() {
      this.isMultipleDelete = false
      this.selectedRow = null
      this.isDeleteModalVisible = false
    },
    handleCloseCampaignModal() {
      this.selectedRow = null
      this.isEdit = false
      this.isDuplicate = false
      this.isCampaignModalVisible = false
    }
  }
}
</script>
