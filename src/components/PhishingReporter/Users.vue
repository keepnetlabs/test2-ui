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
      @addAction="handleAdd"
    />
  </div>
</template>

<script>
  import DataTable from "../DataTable";

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
              label: "Name",
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
              property: "deviceName",
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
              property: "version",
              align: "left",
              editable: false,
              label: "Version",
              fixed: false,
              sortable: true,
              show: true,
              type: "text",
              width: 160,
              //minWidth: 80
            },
            {
              property: "status",
              align: "left",
              editable: false,
              label: "Status",
              fixed: false,
              sortable: true,
              show: true,
              type: "status",
              width: 160,
              hasTooltip:true,
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
          addButton:{
            show:true,
            action:"addAction"
          }
        }
      }
    },
    methods: {
      handleDelete(row) {
        console.log("row", row)
      },
      handleAdd(row){
        console.log("row",row)
      }
    },
    mounted() {
      this.$refs.refUsersList.loadWithDataArray([{
        firstName: "Gürkan",
        lastName: "Uğurlu",
        email: "gurkan.ugurlu@keepnetslab.com",
        deviceName: "pc",
        lastSeen: "10.10.2020",
        version: "1.0.8",
        status: "Online"
      },
        {
          firstName: "Gürkan",
          lastName: "Uğurlu",
          email: "gurkan.ugurlu@keepnetslab.com",
          deviceName: "pc",
          lastSeen: "10.10.2020",
          version: "1.0.8",
          status: "Offline"
        },
        {
          firstName: "Gürkan",
          lastName: "Uğurlu",
          email: "gurkan.ugurlu@keepnetslab.com",
          deviceName: "pc",
          lastSeen: "10.10.2020",
          version: "1.0.8",
          status: "Disabled"
        },
        {
          firstName: "Gürkan",
          lastName: "Uğurlu",
          email: "gurkan.ugurlu@keepnetslab.com",
          deviceName: "pc",
          lastSeen: "10.10.2020",
          version: "1.0.8",
          status: "Deactivated"
        },
        {
          firstName: "Gürkan",
          lastName: "Uğurlu",
          email: "gurkan.ugurlu@keepnetslab.com",
          deviceName: "pc",
          lastSeen: "10.10.2020",
          version: "1.0.8",
          status: "Network Error"
        },
        {
          firstName: "Gürkan",
          lastName: "Uğurlu",
          email: "gurkan.ugurlu@keepnetslab.com",
          deviceName: "pc",
          lastSeen: "10.10.2020",
          version: "1.0.8",
          status: "User Unavailable"
        },
        {
          firstName: "Gürkan",
          lastName: "Uğurlu",
          email: "gurkan.ugurlu@keepnetslab.com",
          deviceName: "pc",
          lastSeen: "10.10.2020",
          version: "1.0.8",
          status: "Not Installed"
        },

      ])
    }
  }
</script>

<style scoped>

</style>
