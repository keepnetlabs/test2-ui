<template>
  <div id="permissionLogs" class="permission-logs">
    <new-permissions
      v-if="newPermissionsModalStatus"
      ref="permissionsModal"
      :status="newPermissionsModalStatus"
      :resourceId="resourceId"
      :isEdit="isEdit"
      :permissions="permissions"
      :permissionEditData="permissionEditData"
      @closeOverlay="togglePermissionModalStatus"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
    />
    <app-dialog
      v-if="deleteDialog"
      :status="deleteDialog"
      type="delete"
      title-id="text--permissions-delete-popup-title"
      subtitle-id="text--permissions-delete-popup-subtitle"
      icon="mdi-delete"
      title="Delete Permission?"
      subtitle="The permission will deleted permanently"
      @changeStatus="closeDeleteDialog"
    >
      <template #app-dialog-body> {{ deletePermissionName }} will be deleted. </template>
      <template #app-dialog-footer>
        <app-dialog-footer
          cancel-button-id="btn-cancel--delete-permission-popup"
          confirm-button-id="btn-delete--delete-permission-popup"
          type="delete"
          @handleClose="closeDeleteDialog"
          @handleConfirm="handleDeleteDialog"
        />
      </template>
    </app-dialog>
    <cannot-delete-role-dialog
      v-if="isShowCannotDeleteDialog"
      :status="isShowCannotDeleteDialog"
      :system-user-count="systemUserCount"
      @on-close="toggleShowCannotDeleteDialog"
    />
    <div class="permission-logs__container">
      <div class="permission-logs__datatable">
        <data-table
          v-if="getSystemRolesSearchPermission"
          id="permission-data-list"
          ref="refPermissionList"
          is-server-side
          selectable
          filterable
          options
          :loading="loading"
          :table="tableData"
          :columns="tableOptions.columns"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :addButton="tableOptions.addButton"
          :rowActions="tableOptions.rowActions"
          :axios-payload.sync="axiosPayload"
          :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
          :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
          :download-button="{ show: false }"
          @openPermissionModal="openPermissionModal"
          @refreshAction="callForData"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @server-side-page-number-changed="serverSidePageNumberChanged"
          @server-side-size-changed="serverSideSizeChanged"
          @searchChangedEvent="handleSearchChange"
          @sortChangedEvent="sortChanged"
          @delete="handleDelete"
          @editPermissions="editPermissions"
        >
          <template #datatable-row-actions="{ scope }">
            <DefaultButtonRowAction
              :id="tableOptions.rowActions[0].id"
              :icon="tableOptions.rowActions[0].icon"
              :text="tableOptions.rowActions[0].name"
              :scope="scope"
              :disabled="tableOptions.rowActions[0].disabled"
              @on-click="editPermissions(scope.row)"
            />
            <DefaultButtonRowAction
              :id="tableOptions.rowActions[1].id"
              :icon="tableOptions.rowActions[1].icon"
              :text="tableOptions.rowActions[1].name"
              :scope="scope"
              :disabled="tableOptions.rowActions[1].disabled"
              @on-click="handleDelete(scope.row)"
            />
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
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  createRandomCryptStringNumber,
  getDefaultAxiosPayload,
  getErrorMessage
} from '@/utils/functions'
import NewPermissions from '@/components/Permissions/NewPermissions'
import {
  deletePermission,
  getPermissionLogs,
  getPermissionAll,
  getPermissionData
} from '@/api/permissions'
import AppDialog from '../components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import CannotDeleteRoleDialog from '@/components/Permissions/CannotDeleteRoleDialog'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'Permission',
  components: {
    CannotDeleteRoleDialog,
    DefaultButtonRowAction,
    NewPermissions,
    DataTable,
    AppDialogFooter,
    AppDialog
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      systemUserCount: 0,
      isShowCannotDeleteDialog: false,
      deleteDialog: false,
      deletePermissionName: null,
      deletePermissionId: null,
      selectedItem: null,
      loading: true,
      labels,
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.PERMISSION,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SYSTEM_USERS_ROLES,
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
            width: 140,
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
            width: 180,
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
          disabled: !this.$store.getters['permissions/getSystemRolesCreatePermission']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
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
            disabled: !this.$store.getters['permissions/getSystemRolesUpdatePermission']
          },
          {
            name: 'Delete',
            id: 'btn-delete--permissions',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this.$store.getters['permissions/getSystemRolesDeletePermission']
          }
        ]
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      newPermissionsModalStatus: false,
      isEdit: false,
      resourceId: null,
      permissions: [],
      permissionEditData: null
    }
  },
  computed: {
    ...mapGetters({
      getSystemRolesUpdatePermission: 'permissions/getSystemRolesUpdatePermission',
      getSystemRolesSearchPermission: 'permissions/getSystemRolesSearchPermission'
    })
  },
  created() {
    this.getPermissions()
    this.callForData()
  },
  methods: {
    handleEditAction({ resourceId } = {}) {
      if (this.getSystemRolesUpdatePermission) {
        this.isEdit = true
        this.selectedEditSmtpSettings = resourceId
        this.toggleSmtpModalStatus()
      }
    },
    closeDeleteDialog() {
      this.deleteDialog = false
    },
    handleDeleteDialog() {
      deletePermission(this.deletePermissionId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            message: response.data.message,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.$refs.refPermissionList.unSelectRow(this.selectedItem)
          this.deleteDialog = false
          this.callForData()
        })
        .catch((e) => {
          if (e?.response?.status === 400) {
            this.deleteDialog = false
          } else {
            this.$store.dispatch('common/createSnackBar', {
              message: getErrorMessage(e),
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
          }
        })
    },
    handleDelete(item) {
      this.systemUserCount = item.userCount
      if (item.userCount) {
        return this.toggleShowCannotDeleteDialog()
      }
      this.deletePermissionName = item.roleName
      this.deletePermissionId = item?.resourceId
      this.selectedItem = item
      this.deleteDialog = true
    },
    editPermissions(item) {
      this.resourceId = item?.resourceId
      this.isEdit = true
      getPermissionData(this.resourceId).then((response) => {
        this.permissionEditData = response.data.data
        this.togglePermissionModalStatus()
      })
    },
    getPermissions() {
      getPermissionAll().then((response) => {
        let sortedPermissions = []
        response.data.data.map((item) => {
          switch (item.moduleName) {
            case 'Threat Sharing':
              sortedPermissions[0] = item
              break
            case 'Phishing Simulator':
              sortedPermissions[1] = item
              break
            case 'Smishing Simulator':
              sortedPermissions[2] = item
              break
            case 'Quishing Simulator':
              sortedPermissions[9] = item
              break
            case 'Awareness Educator':
              sortedPermissions[3] = item
              break
            case 'Incident Responder':
              sortedPermissions[4] = item
              break
            case 'Phishing Reporter Add-In':
              sortedPermissions[5] = item
              break
            case 'Email Threat Simulator':
              sortedPermissions[6] = item
              break
            case 'Company':
              sortedPermissions[7] = item
              break
            case 'Vishing Simulator':
              sortedPermissions[8] = item
              break
            case 'Threat Intelligence':
              sortedPermissions[10] = item
              break
            default:
              break
          }
        })
        this.permissions = sortedPermissions.filter((item) => item)
        function search_and_delete(obj, search_term) {
          if (obj && obj.children === null) {
            delete obj['children']
          }
          if (obj && !obj.permissionResourceId) {
            obj.permissionResourceId = createRandomCryptStringNumber()
          }
          if (obj && obj.children) {
            obj.children = obj.children.filter((elem) => search_and_delete(elem, search_term))
          }
          return obj
        }
        for (let i = 0; i < this.permissions.length; i++) {
          this.permissions[i] = search_and_delete(this.permissions[i], 'children')
        }
      })
    },
    toggleShowCannotDeleteDialog() {
      this.isShowCannotDeleteDialog = !this.isShowCannotDeleteDialog
    },
    closeOverlayWithUpdate() {
      if (this.newPermissionsModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }
      this.newPermissionsModalStatus = !this.newPermissionsModalStatus
      this.callForData()
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
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      filterItems.forEach((item) => {
        if (item.FieldName === 'TypeName') {
          item.FieldName = 'Type'
        }
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    callForData() {
      this.loading = true
      getPermissionLogs(this.axiosPayload)
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
    checkIfCanClosePermissionsModal() {
      if (this.$refs.permissionsModal) {
        this.$refs.permissionsModal.closeOverlay()
      }
    }
  }
}
</script>
