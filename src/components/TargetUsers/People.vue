<template>
  <div class="people">
    <delete-user-modal
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      @deleteAction="handleDeleteUser"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <datatable
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'peopleTable'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      @addToGroup="handleAddToGroup"
      @createGroupWithUser="handleCreateGroupWithUser"
      @submenuItemClick="handleSubMenuItemClick"
      @syncUser="handleSyncUser"
      @delete="handleDelete"
      ref="refDataTable"
    >
      <template v-slot:addUsers>
        <v-menu :offset-y="true" bottom left>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn class="btn-add mr-1" icon v-on="{ ...tooltip, ...menu }">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ 'Add Users' }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item :key="item" @click="handleAddUsers(item)" v-for="item in addUsersItems">
              <v-list-item-title class="add-users__title">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import DeleteUserModal from './DeleteUserModal'

export default {
  name: 'People',
  components: {
    DeleteUserModal,
    Datatable
  },
  data: () => ({
    isWantToShowDeleteUserModal: false,
    selectedRow: {},
    items: [
      { title: 'Click Me1' },
      { title: 'Click Me2' },
      { title: 'Click Me3' },
      { title: 'Click Me4' }
    ],
    tableOptions: {
      columns: [
        // Should be defined to show the table
        {
          property: 'firstName',
          align: 'left',
          editable: false,
          label: 'First Name',
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: 200
        },
        {
          property: 'lastName',
          align: 'left',
          editable: false,
          label: 'Last Name',
          sortable: true,
          show: true,
          type: 'text',
          width: 200
        },
        {
          property: 'department',
          align: 'left',
          editable: false,
          label: 'Department',
          sortable: true,
          show: true,
          type: 'text',
          width: 200
        },
        {
          property: 'title',
          align: 'left',
          editable: false,
          label: 'Job Title',
          sortable: true,
          show: true,
          type: 'text',
          width: 250
        },

        {
          property: 'date',
          align: 'left',
          editable: false,
          label: 'Date Added',
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        },
        {
          property: 'priority',
          align: 'center',
          editable: false,
          label: 'Priority',
          sortable: true,
          show: true,
          type: 'priority',
          width: 125,
          fullWidth: true
        }
      ],
      pageSizes: [5, 10, 25, 50, 100],
      selectEvent: {
        clipboard: true,
        edit: true,
        delete: true,
        download: true
      },
      iEmpty: {
        message: 'You do not have any users added, yet',
        subMes: 'Start now',
        btn: 'Add Users',
        icon: 'mdi-account-plus'
      },
      addButton: {
        show: true,
        action: 'addButton'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'edit',
          isNotShow: true
        },
        {
          name: 'Add to a group',
          icon: 'mdi-account-multiple-plus',
          action: 'addToGroup'
        },
        {
          name: 'Create a group with user',
          icon: 'mdi-account-multiple',
          action: 'createGroupWithUser'
        },
        {
          name: 'Download',
          icon: 'mdi-download',
          action: 'download',
          subElements: ['PDF', 'CSV', 'XLS']
        },
        {
          name: 'Sync User',
          icon: 'mdi-sync',
          action: 'syncUser'
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'delete'
        }
      ]
    },

    addUsersItems: ['Add users manually', 'Import from a file', 'LDAP Integration']
  }),
  methods: {
    handleAddUsers(item) {
      console.log(item)
    },
    handleAddToGroup(row) {
      console.log('handleAddToGroup', row)
    },
    handleCreateGroupWithUser(row) {
      console.log('handleCreateGroupWithUser', row)
    },
    handleSubMenuItemClick(exportType) {
      console.log('handleSubMenuItemClick', exportType)
    },
    handleSyncUser(row) {
      console.log('handleSyncUser', row)
    },
    handleDelete(row) {
      this.changeDeleteModalStatus(true)
      this.selectedRow = row
    },
    changeDeleteModalStatus(status) {
      this.isWantToShowDeleteUserModal = status
    },
    handleDeleteUser(selectedUser) {
      console.log('selectedUser', selectedUser)
    }
  },
  mounted() {
    this.$refs.refDataTable.loadWithDataArray([
      {
        firstName: 'Gurkan',
        lastName: 'Ugurlu',
        department: 'Computer',
        title: 'Frontend Developer',
        date: '17.05.2020',
        priority: 'Medium'
      },
      {
        firstName: 'Gurkan',
        lastName: 'Ugurlu',
        department: 'Computer',
        title: 'Frontend Developer',
        date: '17.05.2020',
        priority: 'Low'
      },
      {
        firstName: 'Gurkan',
        lastName: 'Ugurlu',
        department: 'Computer',
        title: 'Frontend Developer',
        date: '17.05.2020',
        priority: 'High'
      },
      {
        firstName: 'Gurkan',
        lastName: 'Ugurlu',
        department: 'Computer',
        title: 'Frontend Developer',
        date: '17.05.2020',
        priority: 'Very Low'
      },
      {
        firstName: 'Gurkan',
        lastName: 'Ugurlu',
        department: 'Computer',
        title: 'Frontend Developer',
        date: '17.05.2020',
        priority: 'Very High'
      }
    ])
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-card {
    margin: 24px 0 0 0 !important;
    padding: 0 !important;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
      0 1px 1px -1px rgba(204, 204, 204, 0.12) !important;
    background-color: #ffffff;
  }

  .wrapper .card {
    box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
      0 1px 1px -1px rgba(204, 204, 204, 0.12) !important;
  }

  .table-wrapper {
    box-shadow: none !important;
  }
}

.btn-add {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5);
  background-color: #2196f3;
  color: white;

  .v-icon {
    font-size: 18px !important;
    color: white;
  }
}

.add-users__title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
</style>
