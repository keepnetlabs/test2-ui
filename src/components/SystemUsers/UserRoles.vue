<template>
  <div class="user-roles">
    <delete-system-user-role-modal
      :status="showDeleteSystemUserModal"
      v-if="showDeleteSystemUserModal"
      @closeOverlay="toggleShowDeleteSystemUserModal"
    />
    <cant-delete-user-role-modal
      :status="showCantDeleteUserModal"
      v-if="showCantDeleteUserModal"
      @closeOverlay="toggleCantDeleteUserRoleModal"
    />
    <div class="user-roles__container">
      <data-table
        ref="refUserRolesList"
        :refName="'userRolesList'"
        :columns="tableOptions.columns"
        :countRow="5"
        :empty="tableOptions.empty"
        :filterable="true"
        :isServerSide="false"
        :row-key="rowKey"
        groupable
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
        @handleAddNewUserRole="handleAddNewUserRole"
      />
    </div>
  </div>
</template>

<script>
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import DeleteSystemUserRoleModal from '@/components/SystemUsers/DeleteSystemUserRoleModal'
import CantDeleteUserRoleModal from '@/components/SystemUsers/CantDeleteUserRoleModal'
export default {
  name: 'UserRoles',
  components: {
    CantDeleteUserRoleModal,
    DataTable,
    DeleteSystemUserRoleModal
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: 'date',
            align: 'left',
            editable: false,
            label: 'Date',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Name',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: 'status',
            align: 'left',
            editable: false,
            label: 'Name',
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            width: 150
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
      showCantDeleteUserModal: false
    }
  },
  methods: {
    handleAddNewUserRole() {},
    toggleShowDeleteSystemUserModal() {
      this.showDeleteSystemUserModal = !this.showDeleteSystemUserModal
    },
    toggleCantDeleteUserRoleModal() {
      this.showCantDeleteUserModal = !this.showCantDeleteUserModal
    }
  },
  mounted() {
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
  }
}
</script>

<style lang="scss"></style>
