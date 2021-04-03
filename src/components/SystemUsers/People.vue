<template>
  <div class="system-users-people">
    <div class="system-users-people__container">
      <create-or-edit-system-user
        v-if="showCreateOrEditSystemUserModal"
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
        @handleDelete="callForDeleteUser"
        @handleMultipleDelete="deleteMultipleItems"
        @closeOverlay="toggleShowDeleteSystemUserModal"
      />

      <data-table
        v-if="checkPermissions('system-users/search', 'POST')"
        id="system-users-people-data-table"
        ref="refSystemUsersList"
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :total-number-of-records="totalNumberOfRecords"
        :table="tableData"
        :refName="'systemUsersList'"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :show-all-records="showAllRecords"
        :filterable="true"
        :options="true"
        :select-event="tableOptions.selectEvent"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :download-button="tableOptions.downloadButton"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :sizeable="true"
        @deleteAction="handleDelete"
        @downloadEvent="exportSystemUsers"
        @editAction="handleEdit"
        @handleAddNewSystemUsers="toggleCreateOrEditSystemUser"
        @onEmptyBtnClicked="toggleCreateOrEditSystemUser"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @on-all-records-button-click="handleAllRecordsClick"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @refreshAction="callForListSystemUsers"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        is-server-side
        :isServerSide="false"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: false, search: false, sort: false }"
      />
    </div>
  </div>
</template>

<script>
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser'
import { deleteSystemUser, getSystemUsers, exportSystemUsers } from '@/api/systemUsers'
import DeleteSystemUserModal from '@/components/SystemUsers/DeleteSystemUserModal'
import { checkPermission } from '@/utils/functions'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
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
      showAllRecords: false,
      totalNumberOfRecords: 0,
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
            width: 150
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
          delete: false,
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
          btn: 'Create a New System User',
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
      requestBody: {
        pageNumber: 1,
        pageSize: 1000,
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
        pageSize: 1000,
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
      showCreateOrEditSystemUserModal: false,
      selectedRow: null,
      showDeleteSystemUserModal: false,
      selectedDeleteRow: null,
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    resetPageNumber() {
      //generic
      this.requestBody.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.requestBody.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForListSystemUsers()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.requestBody.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.requestBody.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.requestBody.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForListSystemUsers()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.requestBody.ascending = order === 'ascending'
      this.requestBody.orderBy = prop
      this.callForListSystemUsers()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.requestBody.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
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
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.SYSTEMUSERSPEOPLE)
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
    handleAllRecordsClick() {
      this.requestBody.pageSize = 75000
      this.showAllRecords = false
      this.callForListSystemUsers()
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
            this.totalNumberOfRecords = totalNumberOfRecords
            if (this.requestBody.pageSize === 1000 && totalNumberOfRecords > 1000) {
              this.showAllRecords = true
            }
            if (totalNumberOfRecords <= 1000 && this.requestBody.pageSize === 1000) {
              this.showAllRecords = false
            }
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
    deleteMultipleItems(selections) {},
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.requestBody.filter.FilterGroups[0].FilterItems
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
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.requestBody.filter.FilterGroups[0].FilterItems = requestBody
      this.callForListSystemUsers()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.requestBody.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.requestBody.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForListSystemUsers()

      this.tableOptions.isColumnFilterActive =
        this.requestBody.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleEdit(row) {
      this.selectedRow = row
      this.toggleCreateOrEditSystemUser()
    },
    toggleShowDeleteSystemUserModal() {
      if (this.showDeleteSystemUserModal) {
        this.selectedDeleteRow = null
      }
      this.showDeleteSystemUserModal = !this.showDeleteSystemUserModal
    },
    handleDelete(row) {
      this.selectedDeleteRow = row
      this.toggleShowDeleteSystemUserModal()
    },
    callForDeleteUser({ resourceId = '' } = {}) {
      this.deleteButtonDisabled = true
      deleteSystemUser(resourceId)
        .then(() => {
          this.toggleShowDeleteSystemUserModal()
          this.callForListSystemUsers()
        })
        .finally(() => {
          this.deleteButtonDisabled = false
        })
    }
  },
  created() {
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    this.setQueryValuesToPayload(this.$route.query)
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss"></style>
