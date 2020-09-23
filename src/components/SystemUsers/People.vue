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
        :status="showDeleteSystemUserModal"
        :selected-row="selectedDeleteRow"
        v-if="showDeleteSystemUserModal"
        @handleDelete="callForDeleteUser"
        @closeOverlay="toggleShowDeleteSystemUserModal"
      />
      <data-table
        ref="refSystemUsersList"
        :refName="'systemUsersList'"
        :columns="tableOptions.columns"
        :countRow="5"
        :empty="tableOptions.empty"
        :filterable="true"
        :isServerSide="false"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :sizeable="true"
        @editAction="handleEdit"
        @deleteAction="handleDelete"
        @handleAddNewSystemUsers="toggleCreateOrEditSystemUser"
        @onEmptyBtnClicked="toggleCreateOrEditSystemUser"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
      />
    </div>
  </div>
</template>

<script>
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser'
import { getSystemUsers } from '@/api/systemUsers'
import DeleteSystemUserModal from '@/components/SystemUsers/DeleteSystemUserModal'
export default {
  name: 'People',
  components: {
    DataTable,
    CreateOrEditSystemUser,
    DeleteSystemUserModal
  },
  data() {
    return {
      tableOptions: {
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
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 180
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
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
          tooltip: 'Add a New System User'
        }
      },
      requestBody: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  FieldName: 'FirstName',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'LastName',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'CompanyName',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'PhoneNumber',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'StatusId',
                  Operator: '=',
                  Value: ''
                }
              ],
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
      getSystemUsers(this.requestBody).then((response) => {
        const { data } = response.data
        this.$refs.refSystemUsersList.loadWithDataArray(data.results || [])
      })
    },
    columnFilterChanged(filter) {
      let items = []
      let requestBody = this.requestBody.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
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
    callForDeleteUser(row) {}
  },
  created() {
    this.callForListSystemUsers()
  }
}
</script>

<style lang="scss"></style>
