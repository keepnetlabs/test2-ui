<template>
  <div class="system-users-people">
    <div class="system-users-people__container">
      <create-or-edit-system-user
        v-if="showCreateOrEditSystemUserModal"
        :status="showCreateOrEditSystemUserModal"
        @closeOverlayWithUpdate="closeOverlayWithUpdate"
        @closeOverlay="toggleCreateOrEditSystemUser"
        :selectedRow="selectedRow"
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
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :table="tableData"
        ref="refSystemUsersList"
        :refName="'systemUsersList'"
        :columns="tableOptions.columns"
        id="system-users-people-data-table"
        :empty="tableOptions.empty"
        :filterable="true"
        :isServerSide="false"
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
        @refreshAction="callForListSystemUsers"
      />
    </div>
  </div>
</template>

<script>
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser'
import { deleteSystemUser, getSystemUsers, exportSystemUsers } from '@/api/systemUsers'
import DeleteSystemUserModal from '@/components/SystemUsers/DeleteSystemUserModal'
import { checkPermission } from '@/utils/functions'
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
            width: 150
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
            width: 180
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
            action: 'editAction',
            disabled: !this.checkPermissions('system-users/{resourceId}', 'PUT')
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.checkPermissions('system-users/{resourceId}', 'DELETE')
          }
        ],
        empty: {
          message: 'You do not have any System Users',
          btn: 'Create a New System User',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewSystemUsers',
          tooltip: 'Add a New System User',
          disabled: !this.checkPermissions('system-users', 'POST')
        }
      },
      requestBody: {
        pageNumber: 1,
        pageSize: 50000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      showCreateOrEditSystemUserModal: false,
      selectedRow: null,
      showDeleteSystemUserModal: false,
      selectedDeleteRow: null
    }
  },
  methods: {
    exportSystemUsers({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.requestBody.filter
        }
        exportSystemUsers(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `system-users.${exportType.toLocaleLowerCase()}`
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
            const { data } = response.data
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
    this.callForListSystemUsers()
  }
}
</script>

<style lang="scss"></style>
