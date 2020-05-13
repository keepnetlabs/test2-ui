<template>
  <div id="users">
    <data-table
      id="usersList"
      ref="refUsersList"
      :refName="'usersListTable'"
      :columns="tableOptions.columns"
      :countRow="5"
      :selectable="true"
      :filterable="true"
      :options="true"
      :sizeable="true"
      :row-actions="tableOptions.rowActions"
      :pageSizes="tableOptions.pageSizes"
      :empty="tableOptions.empty"
      :addButton="tableOptions.addButton"
      @deleteAction="handleDelete"
      @downloadEvent="exportPhishingReporterUserList"
    />
  </div>
</template>

<script>
  import DataTable from "../DataTable";
  import {
    searchPhishingReporterUser,
    exportPhishingReporterUserList
  } from "../../api/phishingReporter";
  import {COMMON_CONSTANTS} from "../../model/constants/commonConstants";

  export default {
    name: "Users",
    components: {
      DataTable
    },
    data() {
      return {
        tableOptions: {
          columns: [
            {
              property: "firstName",
              align: "left",
              editable: false,
              label: "First Name",
              sortable: true,
              show: true,
              type: "text",
              width: 175,
              //minWidth: 80
            },
            {
              property: "lastName",
              align: "left",
              editable: false,
              label: "Last Name",
              sortable: true,
              show: true,
              type: "text",
              width: 175,
              //minWidth: 80
            },
            {
              property: "email",
              align: "left",
              editable: false,
              label: "E-mail",
              fixed: false,
              sortable: true,
              show: true,
              type: "text",
              width: 300,
              //minWidth: 80
            },
            {
              property: "hostName",
              align: "left",
              editable: false,
              label: "Device Name",
              fixed: false,
              sortable: true,
              show: true,
              type: "text",
              width: 200,
              //minWidth: 80
            },
            {
              property: "lastSeen",
              align: "left",
              editable: false,
              label: "Last Seen",
              fixed: false,
              sortable: true,
              show: true,
              type: "text",
              width: 220,
              //minWidth: 80
            },
            {
              property: "addInVersion",
              align: "left",
              editable: false,
              label: "Version",
              fixed: false,
              sortable: true,
              show: true,
              type: "text",
              width: 140,
              //minWidth: 80
            },
            {
              property: "addInStatus",
              align: "left",
              editable: false,
              label: "Status",
              fixed: false,
              sortable: true,
              show: true,
              type: "status",
              width: 160,
              hasTooltip: true,
              //minWidth: 80
            },
          ],
          empty: {
            message: "No users are showing",
            subMes: "Add Users",
            btn: "Add Users",
            icon: "mdi-account-plus"
          },
          rowActions: [
            {
              name: "Delete",
              icon: "mdi-delete",
              action: "deleteAction"
            }
          ],
          pageSizes: [5, 10, 25, 50, 100],
        }
      }
    },
    methods: {
      handleDelete(row) {

      },
      handleAdd(row) {

      },
      callForPhishingReporterUser() {
        const payload = {
          pageNumber: 1,
          pageSize: 5,
          orderBy: "LastSeen",
          ascending: false,
        }
        searchPhishingReporterUser(payload).then(response => {
          const {data: {data: {results}}} = response

          this.$refs.refUsersList.loadWithDataArray(results.map(item => {
            return {...item, status: item.addInStatus}
          }))
        }).catch(error => {
          /*
          this.$store.dispatch('common/createSnackBar', {
            errorState: true,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: "Error when getting the user phishing reporter! "
          })
           */
        })
      },
      exportPhishingReporterUserList(exportType) {
        const payload = {
          pageNumber: 1,
          pageSize: 10,
          orderBy: "LastSeen",
          ascending: false,
          reportAllPages: true,
          exportType: exportType === "XLS" ? "Excel" : exportType
        }
        exportPhishingReporterUserList(payload).then(response => {
          const {data} = response
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = `users.${exportType.toLocaleLowerCase()}`;
          link.click();
        }).catch(error => {
        })
      }
    },

    created() {
      this.callForPhishingReporterUser()
    }
  }
</script>

<style scoped>

</style>
