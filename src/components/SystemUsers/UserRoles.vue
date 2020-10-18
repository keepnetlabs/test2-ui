<template>
  <div class="user-roles">
    <delete-system-user-role-modal
      :status="showDeleteSystemUserModal"
      v-if="showDeleteSystemUserModal"
      :selected-row="selectedDeleteRow"
      @closeOverlay="toggleShowDeleteSystemUserModal"
    />
    <cant-delete-user-role-modal
      :status="showCantDeleteUserModal"
      v-if="showCantDeleteUserModal"
      @closeOverlay="toggleCantDeleteUserRoleModal"
    />
    <div class="user-roles__container">
      <DatatableLoading :loading="loading">
        <template v-slot:skeleton-content>
          <data-table
            :is-column-filter-active="tableOptions.isColumnFilterActive"
            :table="tableData"
            ref="refUserRolesList"
            :refName="'userRolesList'"
            :columns="tableOptions.columns"
            :select-event="tableOptions.selectEvent"
            :countRow="5"
            :empty="tableOptions.empty"
            :filterable="true"
            :isServerSide="false"
            :row-key="rowKey"
            :showClusterItemsRowAction="true"
            :options="true"
            :cluster-items="[
              { name: 'id', selected: true },
              { name: 'name', selected: false }
            ]"
            :addButton="tableOptions.addButton"
            :pageSizes="tableOptions.pageSizes"
            :row-actions="tableOptions.rowActions"
            :selectable="true"
            :sizeable="true"
            @deleteAction="handleDelete"
            @handleAddNewUserRole="handleAddNewUserRole"
            @columnFilterChanged="columnFilterChanged"
            @columnFilterCleared="columnFilterCleared"
          />
        </template>
      </DatatableLoading>
    </div>
  </div>
</template>

<script>
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import DeleteSystemUserRoleModal from '@/components/SystemUsers/DeleteSystemUserRoleModal'
import CantDeleteUserRoleModal from '@/components/SystemUsers/CantDeleteUserRoleModal'
import { getUserRoles } from '@/api/systemUsers'
import DatatableLoading from '../SkeletonLoading/DatatableLoading'
export default {
  name: 'UserRoles',
  components: {
    CantDeleteUserRoleModal,
    DataTable,
    DeleteSystemUserRoleModal,
    DatatableLoading
  },
  data() {
    return {
      loading: true,
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.ROLENAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TITLE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150,
            filterableType: 'text',
            filterableCustomFieldName: 'RoleName'
          },
          {
            property: PROPERTY_STORE.USERCOUNT,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.USERCOUNT),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 100,
            emptyText: '0'
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
            property: PROPERTY_STORE.TYPENAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TYPENAME),
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
        pageSizes: [5, 10, 25],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
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
          message: 'You do not have any User Roles',
          btn: 'Create a New User Role',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewUserRole',
          tooltip: 'Add a New System User'
        }
      },
      showDeleteSystemUserModal: false,
      rowKey: 'id',
      showCantDeleteUserModal: false,
      requestBody: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'RoleName',
        ascending: true,
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
      selectedDeleteRow: null
    }
  },
  methods: {
    handleAddNewUserRole() {},
    toggleShowDeleteSystemUserModal() {
      if (this.showDeleteSystemUserModal) {
        this.selectedDeleteRow = null
      }
      this.showDeleteSystemUserModal = !this.showDeleteSystemUserModal
    },
    toggleCantDeleteUserRoleModal() {
      this.showCantDeleteUserModal = !this.showCantDeleteUserModal
    },
    callForGetUserRoles() {
      this.loading = true
      getUserRoles(this.requestBody)
        .then((response) => {
          const { data } = response.data
          this.tableData = data.results || []
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
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
      this.callForGetUserRoles()
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
      this.callForGetUserRoles()

      this.tableOptions.isColumnFilterActive =
        this.requestBody.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleDelete(row) {
      this.selectedDeleteRow = row
      this.toggleShowDeleteSystemUserModal()
    }
  },
  mounted() {
    /*
    this.$refs.refUserRolesList.loadWithDataArray([
      {
        id: 1,
        date: '2016-05-02',
        name: 'wangxiaohu',
        status: 'Active'
      },
      {
        id: 2,
        date: '2016-05-04',
        name: 'wangxiaohu',
        status: 'Active',
        children: [
          {
            id: 31,
            date: '2016-05-01',
            name: 'wangxiaohu',
            status: 'Active'
          },
          {
            id: 32,
            date: '2016-05-05',
            name: 'wangxiaohu',
            status: 'Active'
          }
        ]
      },
      {
        id: 3,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [
          {
            id: 33,
            date: '2016-05-02',
            name: 'wangxiaohu',
            status: 'Inactive'
          },
          {
            id: 34,
            date: '2016-05-05',
            name: 'wangxiaohu',
            status: 'Inactive'
          }
        ]
      }
    ])
  */
  },

  created() {
    this.callForGetUserRoles()
  }
}
</script>

<style lang="scss"></style>
