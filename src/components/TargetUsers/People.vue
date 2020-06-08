<template>
  <div class="people">
    <delete-user-modal
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      @deleteAction="handleDeleteUser"
      v-if="isWantToShowDeleteUserModal"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <add-users-manually-modal
      :is-show="isWantToShowAddUsersManuallyModal"
      v-if="isWantToShowAddUsersManuallyModal"
      @changeModalStatus="changeAddUsersManuallyModalStatus"
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
      <template v-slot:datatable-column-popup="{ scope, col }">
        <div @click="showPopupModal = true" style="cursor: pointer;">
          {{ scope.row[col.property] }}
        </div>
        <v-overlay :opacity="0.46" :value="showPopupModal" :z-index="999" fixed>
          <v-card class="download-card pb-4 pa-6" light style="max-width: 580px;">
            <v-list-item>
              <div class="v-btn v-cart-icon-wrapper">
                <v-icon class="ml-2" color="blue" left medium>mdi-account-plus</v-icon>
              </div>
              <v-list-item-content class="pt-0 pb-0">
                <v-list-item-title class="v-card-headline"
                  >I AM POPUP FROM DATATABLE CELL</v-list-item-title
                >
                <v-list-item-subtitle class="v-card-sub-header">ROW...</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :key="item" v-for="item in scope.row" class="check-wrapper pl-0 pr-0">
              <v-list-item-content> {{ item }}</v-list-item-content>
            </v-list-item>
            <div class="d-flex download-buttons flex-row flex-wrap">
              <v-btn @click="showPopupModal = false" color="#f56c6c" text>CANCEL</v-btn>
            </div>
          </v-card>
        </v-overlay>
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import DeleteUserModal from './DeleteUserModal'
import AddUsersManuallyModal from './AddUsersManuallyModal'
export default {
  name: 'People',
  components: {
    DeleteUserModal,
    Datatable,
    AddUsersManuallyModal
  },
  data: () => ({
    isWantToShowDeleteUserModal: false,
    isWantToShowAddUsersManuallyModal: false,
    selectedRow: {},
    showPopupModal: false,
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
          width: 200,
          showHeaderTooltip: true
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
          type: 'popup',
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
      switch (item) {
        case this.addUsersItems[0]:
          this.isWantToShowAddUsersManuallyModal = true
          break
        default:
          break
      }
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
    changeAddUsersManuallyModalStatus(status) {
      this.isWantToShowAddUsersManuallyModal = status
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

<style lang="scss">
.people {
  .k-table__wrapper .card {
    padding: 0;
    margin-top: 24px;
  }

  .add-users__title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
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
}
</style>
