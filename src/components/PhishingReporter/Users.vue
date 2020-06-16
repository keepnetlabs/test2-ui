<template>
  <div id="users" class="users">
    <app-dialog
      :status="isWantToDelete"
      icon="mdi-alert"
      title="Delete User"
      subtitle="Do you want to delete this user?"
    >
      <template v-slot:app-dialog-body> {{ getUserName }} will be deleted ! </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn class="users__button" text color="#f56c6c" @click="isWantToDelete = false"
            >CANCEL</v-btn
          >
          <v-btn class="users__button" text color="#2196f3" @click="deleteUser">DELETE</v-btn>
        </div>
      </template>
    </app-dialog>
    <data-table
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      :empty="tableOptions.empty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'usersListTable'"
      :row-actions="tableOptions.rowActions"
      :selectable="true"
      :sizeable="true"
      @deleteAction="handleDelete"
      @handleEdit="handleEdit"
      @downloadEvent="exportPhishingReporterUserList"
      id="usersList"
      ref="refUsersList"
      @turnOn="callForTurnOn"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  searchPhishingReporterUser,
  exportPhishingReporterUserList
} from '../../api/phishingReporter'

import AppDialog from '../AppDialog'

export default {
  name: 'Users',
  components: {
    DataTable,
    AppDialog
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: 'firstName',
            align: 'left',
            editable: false,
            label: 'First Name',
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150,
            isEditable: true,
            editComponent: 'textfield'
            //minWidth: 80
          },
          {
            property: 'lastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            isEditable: true,
            editComponent: 'textfield'
            //minWidth: 80
          },
          {
            property: 'email',
            align: 'left',
            editable: false,
            label: 'E-mail',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            isEditable: true,
            editComponent: 'textfield'
            //minWidth: 80
          },
          {
            property: 'hostName',
            align: 'left',
            editable: false,
            label: 'Device Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'fiber',
            isEditable: true,
            editComponent: 'textfield',

            width: 200
            //minWidth: 80
          },
          {
            property: 'lastSeen',
            align: 'left',
            editable: false,
            label: 'Last Seen',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            isEditable: true,
            editComponent: 'textfield',
            width: 220
            //minWidth: 80
          },
          {
            property: 'addInVersion',
            align: 'center',
            editable: false,
            label: 'Version',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            isEditable: true,
            editComponent: 'textfield',
            width: 140
            //minWidth: 80
          },
          {
            property: 'addInStatus',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            isEditable: true,
            editComponent: 'textfield',
            hasTooltip: true,
            //minWidth: 80,
            fullWidth: true
          }
        ],
        empty: {
          message: 'You do not have any users, yet'
        },
        rowActions: [
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          },
          {
            name: 'Turn On',
            icon: 'mdi-power',
            action: 'turnOn'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100]
      },
      isWantToDelete: false,
      selectedRow: null
    }
  },
  computed: {
    getUserName() {
      return this.selectedRow && (this.selectedRow.firstName || this.selectedRow.lastName)
        ? `${this.selectedRow.firstName} ${this.selectedRow.lastName}`
        : 'This user'
    }
  },
  methods: {
    handleDelete(row) {
      this.selectedRow = row
      this.isWantToDelete = true
    },
    handleEdit(rows) {
      console.log('rows', rows)
    },
    handleAdd(row) {},
    callForPhishingReporterUser() {
      const payload = {
        pageNumber: 1,
        pageSize: 5,
        orderBy: 'LastSeen',
        ascending: false
      }
      searchPhishingReporterUser(payload)
        .then((response) => {
          const {
            data: {
              data: { results }
            }
          } = response
          this.$refs.refUsersList.loadWithDataArray(results || [])
        })
        .catch((error) => {
          /*
            this.$store.dispatch('common/createSnackBar', {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: "Error when getting the user phishing reporter! "
            })
             */
        })
    },
    callForTurnOn(row) {
      console.log('row', row)
    },
    exportPhishingReporterUserList({ exportTypes, reportAllPages, pageNumber }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber,
          pageSize: 10,
          orderBy: 'LastSeen',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportPhishingReporterUserList(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `users.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
    },
    deleteUser() {
      this.isWantToDelete = false
    }
  },

  created() {
    this.callForPhishingReporterUser()
  }
}
</script>

<style lang="scss">
.users {
  padding-top: 16px;
  &__button {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
  }
}
</style>
