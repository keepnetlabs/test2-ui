<template>
  <div class="system-users-people">
    <div class="system-users-people__container">
      <create-or-edit-system-user
        v-if="showCreateOrEditSystemUserModal"
        ref="systemUserModal"
        :status="showCreateOrEditSystemUserModal"
        :selectedRow="selectedRow"
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
        v-if="checkPermissions('system-users/search', 'POST')"
        id="system-users-people-data-table"
        ref="refSystemUsersList"
        is-server-side
        is-server-side-selection
        filterable
        options
        selectable
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :table="tableData"
        :refName="'systemUsersList'"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :select-event="tableOptions.selectEvent"
        :stored-table-settings="storedTableSettings"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :download-button="tableOptions.downloadButton"
        :row-actions="tableOptions.rowActions"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @deleteAction="handleDelete"
        @downloadEvent="exportSystemUsers"
        @editAction="handleEdit"
        @handleAddNewSystemUsers="toggleCreateOrEditSystemUser"
        @onEmptyBtnClicked="toggleCreateOrEditSystemUser"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @refreshAction="callForListSystemUsers"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @on-table-settings-change="handleSetRenderedColumns"
        @handleMultipleDelete="handleMultipleDeleteOfSystemUsers"
      />
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
import { checkPermission, getDefaultAxiosPayload } from '@/utils/functions'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
export default {
  name: 'People',
  components: {
    DataTable,
    CreateOrEditSystemUser,
    DeleteSystemUserModal
  },
  data() {
    return {
      deleteButtonDisabled: false,
      loading: true,
      storedTableSettings: null,
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      multipleSystemUserPayload: {},
      tableData: [],
      tableOptions: {
        downloadButton: {
          show: true,
          disabled: !this.checkPermissions('system-users/search/export', 'POST')
        },
        isColumnFilterActive: false,
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
            width: 150,
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
        pageSizes: [5, 10, 25],
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            id: 'btn-edit--system-users-people-row-actions',
            action: 'editAction',
            disabled: !this.checkPermissions('system-users/{resourceId}', 'PUT')
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--system-users-people-row-actions',
            disabled: !this.checkPermissions('system-users/{resourceId}', 'DELETE')
          }
        ],
        empty: {
          message: 'You do not have any System Users',
          btn: labels.New,
          id: 'btn-empty--system-users-people',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewSystemUsers',
          id: 'btn-add--system-users-people',
          tooltip: 'Add a New System User',
          disabled: !this.checkPermissions('system-users', 'POST')
        }
      },
      requestBody: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      showCreateOrEditSystemUserModal: false,
      selectedRow: null,
      showDeleteSystemUserModal: false,
      selectedDeleteRow: null,
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    resetPageNumber() {
      this.requestBody.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SYSTEM_USERS_PEOPLE, JSON.stringify(tableSettings))
    },
    handleSearchChange(searchFilter = {}) {
      this.requestBody.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.requestBody.filter.FilterGroups[1].FilterItems = this.requestBody.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'StatusId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.checkIsColumnFilterActive()
      this.callForListSystemUsers()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.requestBody.pageNumber = pageNumber
      this.callForListSystemUsers()
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
        filter: this.requestBody.filter
      }
      this.toggleShowDeleteSystemUserModal()
    },
    callForMultipleDelete() {
      this.deleteButtonDisabled = true
      bulkDeleteSystemUsers(this.multipleSystemUserPayload)
        .then(() => {
          this.$refs.refSystemUsersList.resetSelectableParams()
          this.callForListSystemUsers()
          this.toggleShowDeleteSystemUserModal()
        })
        .finally(() => {
          this.deleteButtonDisabled = false
        })
    },
    sortChanged({ order, prop } = {}) {
      this.requestBody.ascending = order === 'ascending'
      this.requestBody.orderBy = prop
      this.callForListSystemUsers()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.requestBody.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForListSystemUsers()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.SYSTEMUSERSPEOPLE)
      )
      if (savedFilter) {
        this.requestBody.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refSystemUsersList.filterValues = savedFilter.filterValues
          this.$refs.refSystemUsersList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForListSystemUsers()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.requestBody = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refSystemUsersList.filterValues = {}
      this.$refs.refSystemUsersList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.callForListSystemUsers()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.SYSTEMUSERSPEOPLE,
        JSON.stringify({
          filter: this.requestBody.filter,
          filterValues
        })
      )
    },
    exportSystemUsers({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.requestBody.filter)),
        this.$refs.refSystemUsersList,
        'CreateTime'
      )
      if (this.$refs.refSystemUsersList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
        clientTableExportHelper.filter.FilterGroups[1].FilterItems.find(
          (item) => item.FieldName === 'StatusName'
        ).FieldName = 'StatusId'
      }
      if (
        this.$refs.refSystemUsersList.sortProps &&
        this.$refs.refSystemUsersList.sortProps.order
      ) {
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
          filter: filter
        }
        exportSystemUsers(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `System Users.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    handleAddNewSystemUsers() {},
    toggleCreateOrEditSystemUser() {
      this.showCreateOrEditSystemUserModal = !this.showCreateOrEditSystemUserModal
      if (!this.showCreateOrEditSystemUserModal) {
        this.selectedRow = null
      }
    },
    closeOverlayWithUpdate() {
      this.toggleCreateOrEditSystemUser()
      this.callForListSystemUsers()
    },
    callForListSystemUsers() {
      this.loading = true
      if (this.checkPermissions('system-users/search', 'POST')) {
        getSystemUsers(this.requestBody)
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
      } else {
        this.$router.push('/')
      }
    },
    deleteMultipleItems() {
      this.callForMultipleDelete()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.requestBody.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.requestBody
      )
      this.callForListSystemUsers()
    },
    columnFilterCleared(fieldName) {
      this.requestBody.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.requestBody
      )
      this.checkIsColumnFilterActive()
      this.callForListSystemUsers()
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
          this.callForListSystemUsers()
        })
        .finally(() => {
          this.deleteButtonDisabled = false
        })
    },
    checkIfCanCloseSystemUserModal() {
      if (this.$refs.systemUserModal) {
        this.$refs.systemUserModal.closeOverlay()
      }
    },
    checkIsColumnFilterActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.requestBody)
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.SYSTEM_USERS_PEOPLE)
    )
    this.getDefaultFilterAndSearch()
  }
}
</script>
