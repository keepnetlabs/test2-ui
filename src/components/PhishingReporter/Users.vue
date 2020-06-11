<template>
  <div id="users" class="users">
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
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

export default {
  name: 'Users',
  components: {
    DataTable
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
            width: 150
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
            width: 150
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
            width: 300
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
      }
    }
  },
  methods: {
    handleDelete(row) {
      //TODO DELETE ACTION
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
    exportPhishingReporterUserList(exportType) {
      const payload = {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'LastSeen',
        ascending: false,
        reportAllPages: true,
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
    }
  },

  created() {
    this.callForPhishingReporterUser()
  }
}
</script>

<style lang="scss">
.users {
  .k-table__wrapper .card {
    padding: 0;
    margin-top: 24px;
  }
}
</style>
