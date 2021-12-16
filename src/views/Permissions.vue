<template>
  <div id="permissionLogs" class="permission-logs">
    <new-permissions
      v-if="newPermissionsModalStatus"
      :status="newPermissionsModalStatus"
      @closeOverlay="togglePermissionModalStatus"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
      :resourceId="resourceId"
      :isEdit="isEdit"
      :permissions="permissions"
      :permissionEditData="permissionEditData"
    />
    <app-dialog
      v-if="deleteDialog"
      :status="deleteDialog"
      title-id="text--permissions-delete-popup-title"
      subtitle-id="text--permissions-delete-popup-subtitle"
      icon="mdi-delete"
      title="Delete Permission?"
      subtitle="The permission will deleted permanently"
    >
      <template v-slot:app-dialog-body> {{ deletePermissionName }} will be deleted. </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          cancel-button-id="btn-cancel--delete-permission-popup"
          confirm-button-id="btn-delete--delete-permission-popup"
          type="delete"
          @handleClose="closeDeleteDialog"
          @handleConfirm="handleDeleteDialog"
        />
      </template>
    </app-dialog>
    <div class="permission-logs__container">
      <div class="permission-logs__datatable">
        <data-table
          id="permission-data-list"
          ref="refPermissionList"
          is-server-side
          :loading="loading"
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :table="tableData"
          :refName="'permissionList'"
          :columns="tableOptions.columns"
          :stored-table-settings="storedTableSettings"
          :total-number-of-records="totalNumberOfRecords"
          :selectable="true"
          :filterable="true"
          :options="true"
          :sizeable="true"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          :pageSizes="tableOptions.pageSizes"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :show-all-records="showAllRecords"
          :addButton="tableOptions.addButton"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :rowActions="tableOptions.rowActions"
          @openPermissionModal="openPermissionModal"
          @refreshAction="getDatatableList"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @on-all-records-button-click="handleAllRecordsClick"
          @set-default-search="handleSetDefaultSearch"
          @restore-default-search="handleRestoreDefaultSearch"
          @clear-filters="handleClearFilters"
          @server-side-page-number-changed="serverSidePageNumberChanged"
          @server-side-size-changed="serverSideSizeChanged"
          @searchChangedEvent="handleSearchChange"
          @sortChangedEvent="sortChanged"
          @delete="handleDelete"
          @editPermissions="editPermissions"
          @on-table-settings-change="handleSetRenderedColumns"
          :download-button="{ show: false }"
        >
          <template #datatable-row-actions="{ scope }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click.native="editPermissions(scope.row)"
                  :disabled="getDisabledStatusOfEdit(scope.row)"
                  class="btn-hover mr-1"
                  icon
                  :id="`${tableOptions.rowActions[0].id}-${Math.random().toString().substring(2)}`"
                  v-on="on"
                >
                  <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
                </v-btn>
              </template>
              <span>{{ tableOptions.rowActions[0].name }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  :disabled="getDisabledStatusOfDelete(scope.row)"
                  @click.native="handleDelete(scope.row)"
                  class="btn-hover"
                  icon
                  :id="`${tableOptions.rowActions[1].id}-${Math.random().toString().substring(2)}`"
                  v-on="on"
                >
                  <v-icon>{{ tableOptions.rowActions[1].icon }}</v-icon>
                </v-btn>
              </template>
              <span>{{ tableOptions.rowActions[1].name }}</span>
            </v-tooltip>
          </template>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable'
import {
  COMMON_CONSTANTS,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { checkPermission } from '@/utils/functions'
import NewPermissions from '@/components/Permissions/NewPermissions'
import {
  deletePermission,
  getPermissionLogs,
  getPermissionAll,
  getPermissionData
} from '@/api/permissions'
import AppDialog from '../components/AppDialog'

import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

export default {
  name: 'Permission',
  components: {
    NewPermissions,
    DataTable,
    AppDialogFooter,
    AppDialog
  },
  data() {
    return {
      deleteDialog: false,
      deletePermissionName: null,
      deletePermissionId: null,
      selectedItem: null,
      storedTableSettings: null,
      loading: true,
      labels,
      showAllRecords: false,
      totalNumberOfRecords: 0,
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.ROLENAME,
            align: 'left',
            editable: false,
            label: LABEL_STORE.ROLENAMEPERMISSION,
            sortable: true,
            show: true,
            type: 'text',
            width: 240,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.USERCOUNT,
            align: 'center',
            editable: false,
            label: LABEL_STORE.USERCOUNT,
            fixed: false,
            sortable: true,
            show: true,
            type: 'number',
            width: 120,
            filterableType: 'number',
            emptyText: 0
          },
          {
            property: PROPERTY_STORE.TENANTUSERCOUNT,
            align: 'center',
            editable: false,
            label: labels.TenantUserCount,
            fixed: false,
            sortable: true,
            show: true,
            type: 'number',
            width: 160,
            filterableType: 'number',
            emptyText: 0
          },
          {
            property: PROPERTY_STORE.TYPENAME,
            align: 'center',
            editable: false,
            label: LABEL_STORE.TYPENAME,
            fixed: false,
            sortable: true,
            show: true,
            type: 'badge',
            width: 150,
            filterableType: 'select',
            filterableItems: [
              { text: 'System', value: '1' },
              { text: 'Custom', value: '2' }
            ],
            filterableCustomFieldName: 'Type'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: LABEL_STORE.CREATETIME,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          }
        ],
        addButton: {
          show: true,
          tooltip: labels.ADDAPERMISSION,
          action: 'openPermissionModal',
          id: 'btn-add--permissions',
          disabled: !checkPermission('roles', 'POST')
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.PERMISSIONS
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            id: 'btn-empty--permissions',
            action: 'editPermissions',
            isNotShow: true,
            disabled: !checkPermission('roles/{resourceId}', 'PUT')
          },
          {
            name: 'Delete',
            id: 'btn-delete--permissions',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !checkPermission('roles/{resourceId}', 'DELETE')
          }
        ]
      },
      bodyData: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      defaultRequestBody: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'RoleName',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      serverSideProps: new ServerSideProps(),
      newPermissionsModalStatus: false,
      selectedPermissionId: null,
      isEdit: false,
      resourceId: null,
      permissions: [],
      permissionEditData: null
    }
  },
  methods: {
    getDisabledStatusOfEdit({ isOwner } = {}) {
      return this.tableOptions.rowActions[0].disabled || !isOwner
    },
    getDisabledStatusOfDelete({ isOwner } = {}) {
      return this.tableOptions.rowActions[1].disabled || !isOwner
    },
    handleEditAction({ resourceId } = {}) {
      const { UPDATE, GET } = this.PERMISSIONS
      if (UPDATE.hasPermission && GET.hasPermission) {
        this.isEdit = true
        this.selectedEditSmtpSettings = resourceId
        this.toggleSmtpModalStatus()
      }
    },
    closeDeleteDialog() {
      this.deleteDialog = false
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SYSTEM_USERS_ROLES, JSON.stringify(tableSettings))
    },
    handleDeleteDialog() {
      deletePermission(this.deletePermissionId)
        .then(() => {
          this.$refs.refPermissionList.unSelectRow(this.selectedItem)
          this.deleteDialog = false
          this.getDefaultFilterAndSearch()
        })
        .catch(() => {
          this.$store.dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message:
                (error.response.data &&
                  error.response.data.validationMessages &&
                  error.response.data.validationMessages[0]) ||
                error.response.data.message ||
                error.response.data.Message,
              icon: 'mdi-alert'
            },
            { root: true }
          )
        })
    },
    handleDelete(item) {
      this.deletePermissionName = item.roleName
      this.deletePermissionId = item.resourceId
      this.selectedItem = item
      this.deleteDialog = true
    },
    editPermissions(item) {
      this.resourceId = item.resourceId
      this.isEdit = true
      getPermissionData(this.resourceId).then((response) => {
        this.permissionEditData = response.data.data
        this.togglePermissionModalStatus()
      })
    },
    getPermissions() {
      getPermissionAll().then((response) => {
        const sortedPermissions = []
        response.data.data.map((item) => {
          switch (item.moduleName) {
            case 'Threat Sharing':
              sortedPermissions[0] = item
              break
            case 'Phishing Simulation':
              sortedPermissions[1] = item
              break
            case 'Incident Responder':
              sortedPermissions[2] = item
              break
            case 'Phishing Reporter Add-In':
              sortedPermissions[3] = item
              break
            case 'Company':
              sortedPermissions[4] = item
              break
            default:
              break
          }
        })
        this.permissions = sortedPermissions
        function search_and_delete(obj, search_term) {
          if (obj['children'] === null) {
            delete obj['children']
          }
          if (!obj['permissionResourceId']) {
            obj.permissionResourceId = Math.random()
          }
          if (obj.children) {
            obj.children = obj.children.filter((elem) => search_and_delete(elem, search_term))
          }
          return obj
        }
        for (let i = 0; i < this.permissions.length; i++) {
          this.permissions[i] = search_and_delete(this.permissions[i], 'children')
        }
      })
    },
    closeOverlayWithUpdate() {
      if (this.newPermissionsModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }
      this.newPermissionsModalStatus = !this.newPermissionsModalStatus
      this.getDefaultFilterAndSearch()
    },
    togglePermissionModalStatus() {
      if (this.newPermissionsModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }
      this.newPermissionsModalStatus = !this.newPermissionsModalStatus
    },
    openPermissionModal() {
      this.togglePermissionModalStatus()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.PERMISSION))
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refPermissionList.filterValues = savedFilter.filterValues
          this.$refs.refPermissionList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.tableOptions.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      filterItems.forEach(myFunction)

      function myFunction(item) {
        if (item.FieldName === 'TypeName') {
          item.FieldName = 'Type'
        }
      }
      this.bodyData.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refPermissionList.filterValues = {}
      this.$refs.refPermissionList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.getDatatableList()
    },
    exportPermissionLog({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.bodyData.filter)),
        this.$refs.refPermissionList,
        'LogDate'
      )
      if (this.$refs.refPermissionList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
      }
      if (this.$refs.refPermissionList.sortProps && this.$refs.refPermissionList.sortProps.order) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper

      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportPermissionLog(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Permission Log.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      const copyOfFilter = JSON.parse(JSON.stringify(this.bodyData.filter))
      copyOfFilter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.PERMISSION,
        JSON.stringify({
          filter: copyOfFilter,
          filterValues
        })
      )
    },
    getDatatableList() {
      this.loading = true
      getPermissionLogs(this.bodyData)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    handleAllRecordsClick() {
      this.bodyData.pageSize = 75000
      this.showAllRecords = false
      this.getDatatableList()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      this.resetPageNumber()
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        const { FieldName, Value } = filter
        if (FieldName === 'Status' && Value === '') {
        } else {
          requestBody.push(elem)
        }
      }

      this.bodyData.filter.FilterGroups[0].FilterItems = requestBody
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.getDatatableList()

      this.tableOptions.isColumnFilterActive =
        this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.SYSTEM_USERS_ROLES)
    )
  },
  mounted() {
    this.getPermissions()
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss">
.permission-logs {
  width: 100%;
  //min-height: 90vh;
  &__container {
    border-radius: 20px !important;
    background: white;
  }
  &__datatable {
    padding: 0;
  }
}
</style>
