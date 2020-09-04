<template>
  <div class="user-roles">
    <delete-system-user-role-modal
      :status="showDeleteSystemUserModal"
      v-if="showDeleteSystemUserModal"
      @closeOverlay="toggleShowDeleteSystemUserModal"
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
        :options="true"
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
export default {
  name: 'UserRoles',
  components: {
    DataTable,
    DeleteSystemUserRoleModal
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.TITLE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TITLE),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.USERS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.USERS),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.COMPANY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANY),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.TYPE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TYPE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
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
      showDeleteSystemUserModal: false
    }
  },
  methods: {
    handleAddNewUserRole() {},
    toggleShowDeleteSystemUserModal() {
      this.showDeleteSystemUserModal = !this.showDeleteSystemUserModal
    }
  }
}
</script>

<style lang="scss"></style>
