<template>
  <div id="integrations">
    <new-integration :showModal="modalStatus" @closeOverlay="changeModalStatus" />
    <data-table
      id="integrationsList"
      ref="refIntegrationsList"
      :refName="'integrationsList'"
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
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportIntegrationList"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'

export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewIntegration
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: 'integrationName',
            align: 'left',
            editable: false,
            label: 'Integration Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: true,
            width: 175
            //minWidth: 80
          },
          {
            property: 'description',
            align: 'left',
            editable: false,
            label: 'Description',
            sortable: true,
            show: true,
            type: 'text',
            width: 175
            //minWidth: 80
          },
          {
            property: 'company',
            align: 'left',
            editable: false,
            label: 'Company',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300
            //minWidth: 80
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true
            //minWidth: 80
          },
          {
            property: 'created',
            align: 'left',
            editable: false,
            label: 'Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300
            //minWidth: 80
          }
        ],
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'edit'
          },
          {
            name: 'Disable',
            icon: 'mdi-minus-circle-outline',
            action: 'disable'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        empty: {
          message: 'No integrations are showing',
          subMes: 'Add Integrations',
          btn: 'Add Integrations',
          icon: 'mdi-account-plus'
        },

        addButton: {
          show: true,
          action: 'addAction'
        }
      },
      modalStatus: false
    }
  },
  methods: {
    handleDelete() {},
    handleAdd() {},
    exportIntegrationList() {},
    changeModalStatus(status) {
      this.modalStatus = status
    }
  },
  mounted() {
    this.$refs.refIntegrationsList.loadWithDataArray([
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      },
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      },
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      },
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      },
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      },
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      },
      {
        integrationName: 'integrationName',
        description: 'description',
        company: 'company',
        status: 'Active',
        created: 'created'
      }
    ])
  }
}
</script>

<style></style>
