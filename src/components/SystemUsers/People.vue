<template>
  <div class="system-users-people">
    <div class="system-users-people__container">
      <create-or-edit-system-user
        v-if="showCreateOrEditSystemUserModal"
        :status="showCreateOrEditSystemUserModal"
        @closeOverlay="toggleCreateOrEditSystemUser"
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
        @handleAddNewSystemUsers="handleAddNewSystemUsers"
        @onEmptyBtnClicked="toggleCreateOrEditSystemUser"
      />
    </div>
  </div>
</template>

<script>
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser'
export default {
  name: 'People',
  components: {
    DataTable,
    CreateOrEditSystemUser
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
            width: 150
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
            property: PROPERTY_STORE.ROLE,
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
            property: PROPERTY_STORE.PHONE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONE),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
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
      showCreateOrEditSystemUserModal: false
    }
  },
  methods: {
    handleAddNewSystemUsers() {},
    toggleCreateOrEditSystemUser() {
      this.showCreateOrEditSystemUserModal = !this.showCreateOrEditSystemUserModal
    }
  }
}
</script>

<style lang="scss"></style>
