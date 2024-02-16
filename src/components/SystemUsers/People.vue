<template>
  <div class="system-users-people">
    <div class="system-users-people__container">
      <create-or-edit-system-user
        v-if="showCreateOrEditSystemUserModal"
        ref="systemUserModal"
        :status="showCreateOrEditSystemUserModal"
        :selectedRow="selectedRow"
        :isSameUser="isSameUser"
        @closeOverlayWithUpdate="closeOverlayWithUpdate"
        @closeOverlay="toggleCreateOrEditSystemUser"
      />
      <delete-system-user-modal
        v-if="showDeleteSystemUserModal"
        :status="showDeleteSystemUserModal"
        :selected-row="selectedDeleteRow"
        :confirmButtonDisabled="deleteButtonDisabled"
        :is-multiple="isMultipleDelete"
        :user-count="multipleDeletedUserCount"
        @handleDelete="callForDeleteUser"
        @handleMultipleDelete="deleteMultipleItems"
        @closeOverlay="toggleShowDeleteSystemUserModal"
      />
      <data-table
        v-if="getSystemUsersSearchPermission"
        id="system-users-people-data-table"
        ref="refSystemUsersList"
        is-server-side
        is-server-side-selection
        filterable
        options
        selectable
        :loading="loading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :select-event="tableOptions.selectEvent"
        :addButton="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :row-actions="tableOptions.rowActions"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        @handleAddNewSystemUsers="toggleCreateOrEditSystemUser"
        @deleteAction="handleDelete"
        @downloadEvent="exportSystemUsers"
        @editAction="handleEdit"
        @onEmptyBtnClicked="toggleCreateOrEditSystemUser"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @handleMultipleDelete="handleMultipleDeleteOfSystemUsers"
      >
        <template #datatable-row-actions="{ scope }">
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[0].id"
            :icon="tableOptions.rowActions[0].icon"
            :text="tableOptions.rowActions[0].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[0].disabled || !scope.row.isEditable"
            disabledTooltipText="You are not authorized to update this user"
            @on-click="handleEdit(scope.row)"
          />
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[1].id"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :scope="scope"
            :disabled="
              tableOptions.rowActions[1].disabled ||
              scope.row.email === getUser.email ||
              !scope.row.isEditable
            "
            disabledTooltipText="You are not authorized to delete this user"
            @on-click="handleDelete(scope.row)"
          />
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser'
import {
  deleteSystemUser,
  getSystemUsers,
  exportSystemUsers,
  bulkDeleteSystemUsers
} from '@/api/systemUsers'
import DeleteSystemUserModal from '@/components/SystemUsers/DeleteSystemUserModal'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'People',
  components: {
    DataTable,
    CreateOrEditSystemUser,
    DeleteSystemUserModal,
    DefaultButtonRowAction
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      deleteButtonDisabled: false,
      loading: true,
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      multipleSystemUserPayload: {},
      tableData: [],
      tableOptions: {
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getSystemUsersExportPermission']
        },
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SYSTEMUSERSPEOPLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SYSTEM_USERS_PEOPLE,
        columns: [
          {
            property: PROPERTY_STORE.FIRSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150,
            filterableType: 'text',
            filterableCustomFieldName: 'FirstName'
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150,
            filterableType: 'text',
            filterableCustomFieldName: 'LastName'
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: 'text',
            width: 275,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 180,
            filterableType: 'text',
            filterableCustomFieldName: 'CompanyName'
          },
          {
            property: PROPERTY_STORE.ROLES,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.ROLE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150,
            filterableType: 'text',
            filterableCustomFieldName: 'Roles'
          },
          {
            property: PROPERTY_STORE.PHONENUMBER,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 200,
            filterableType: 'text',
            filterableCustomFieldName: 'PhoneNumber'
          },
          {
            property: PROPERTY_STORE.STATUSNAME,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUSNAME),
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            width: 150,
            filterableType: 'select',
            filterableItems: [
              { text: 'Active', value: '1' },
              { text: 'Inactive', value: '0' }
            ],
            filterableCustomFieldName: 'StatusId'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 180,
            filterableType: 'date'
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            id: 'btn-edit--system-users-people-row-actions',
            action: 'editAction',
            disabled: !this.$store.getters['permissions/getSystemUsersUpdatePermission']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--system-users-people-row-actions',
            disabled: !this.$store.getters['permissions/getSystemUsersDeletePermission']
          }
        ],
        empty: {
          message: 'You do not have any System Users',
          btn: labels.New,
          id: 'btn-empty--system-users-people',
          icon: 'mdi-plus',
          disabled: !this.$store.getters['permissions/getSystemUsersCreatePermission']
        },
        addButton: {
          show: true,
          action: 'handleAddNewSystemUsers',
          id: 'btn-add--system-users-people',
          tooltip: 'Add a New System User',
          disabled: !this.$store.getters['permissions/getSystemUsersCreatePermission']
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      showCreateOrEditSystemUserModal: false,
      selectedRow: null,
      showDeleteSystemUserModal: false,
      selectedDeleteRow: null,
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getSystemUsersSearchPermission: 'permissions/getSystemUsersSearchPermission',
      getUser: 'auth/userGetter'
    }),
    isSameUser() {
      return this.getUser?.email === this.selectedRow?.email
    }
  },
  mounted() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      if (this.getSystemUsersSearchPermission) {
        getSystemUsers(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            this.tableData = data.results || []
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      }
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'StatusId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForData()
    },
    handleMultipleDeleteOfSystemUsers(items, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedUserCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : items.length
      this.multipleSystemUserPayload = {
        items: selectAll ? [] : items.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.toggleShowDeleteSystemUserModal()
    },
    callForMultipleDelete() {
      this.deleteButtonDisabled = true
      bulkDeleteSystemUsers(this.multipleSystemUserPayload)
        .then(() => {
          this?.$refs?.refSystemUsersList?.resetSelectableParams()
          this.callForData()
          this.toggleShowDeleteSystemUserModal()
        })
        .finally(() => {
          this.deleteButtonDisabled = false
        })
    },
    exportSystemUsers(downloadTypes) {
      downloadTypes.exportTypes.map((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        exportSystemUsers(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `System Users.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    toggleCreateOrEditSystemUser() {
      this.showCreateOrEditSystemUserModal = !this.showCreateOrEditSystemUserModal
      if (!this.showCreateOrEditSystemUserModal) {
        this.selectedRow = null
      }
    },
    closeOverlayWithUpdate() {
      this.toggleCreateOrEditSystemUser()
      this.callForData()
    },
    deleteMultipleItems() {
      this.callForMultipleDelete()
    },
    handleEdit(row) {
      this.selectedRow = row
      this.toggleCreateOrEditSystemUser()
    },
    toggleShowDeleteSystemUserModal() {
      if (this.showDeleteSystemUserModal) {
        this.selectedDeleteRow = null
        this.multipleSystemUserPayload = {}
        this.isMultipleDelete = false
        this.multipleDeletedUserCount = 0
      }
      this.showDeleteSystemUserModal = !this.showDeleteSystemUserModal
    },
    handleDelete(row) {
      this.selectedDeleteRow = row
      this.toggleShowDeleteSystemUserModal()
    },
    callForDeleteUser(row = {}) {
      this.deleteButtonDisabled = true
      deleteSystemUser(row.resourceId)
        .then(() => {
          this.$refs.refSystemUsersList.unSelectRow(row)
          this.$refs.refSystemUsersList.changeServerSideSelectionCount(-1)
          this.toggleShowDeleteSystemUserModal()
          this.callForData()
        })
        .finally(() => {
          this.deleteButtonDisabled = false
        })
    },
    checkIfCanCloseSystemUserModal() {
      if (this.$refs.systemUserModal) {
        this.$refs.systemUserModal.closeOverlay()
      }
    }
  }
}
</script>
