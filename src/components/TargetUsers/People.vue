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
      :setClassName="setCellClassName"
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
    selectedSyncIndex: null,
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
          type: 'status',
          width: 200
        },
        {
          property: 'email',
          align: 'left',
          editable: false,
          label: 'Email',
          sortable: true,
          show: true,
          type: 'priority',
          width: 250
        },
        {
          property: 'department',
          align: 'left',
          editable: false,
          label: 'Department',
          sortable: true,
          show: true,
          type: 'chart',
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
          property: 'priority',
          align: 'center',
          editable: false,
          label: 'Priority',
          sortable: true,
          show: true,
          type: 'priority',
          width: 125,
          fullWidth: true
        },
        {
          property: 'progress',
          align: 'left',
          editable: false,
          label: 'Date Added',
          sortable: true,
          show: true,
          type: 'progress',
          width: 150
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
    setCellClassName(obj) {
      if (obj.rowIndex === this.selectedSyncIndex && obj.columnIndex === 8) {
        return 'clock-wise'
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
    handleSyncUser(scope) {
      this.selectedSyncIndex = scope.$index
      this.tableOptions.rowActions = [
        {
          name: 'Sync User',
          icon: 'mdi-sync',
          action: 'syncUser'
        }
      ]
      setTimeout(() => {
        this.tableOptions.rowActions = [
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
        this.selectedSyncIndex = null
      }, 5000)
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
    handleDeleteUser(selectedUser) {}
  }
}
</script>

<style lang="scss">
.people {
  padding-top: 24px;
  .add-users__title {
    font-size: 14px;
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
.clock-wise {
  .cell {
    * {
      visibility: visible !important;
    }
  }
  i {
    animation: antiClockwiseSpin 1s infinite ease-in;
    animation-delay: 0s;
    color: #2196f3 !important;
  }
}
@keyframes antiClockwiseSpin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
