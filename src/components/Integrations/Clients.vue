<template>
  <div id="integrations" class="integrations">
    <new-clients :showModal="modalStatus" @closeOverlay="changeModalStatus" />
    <data-table
      id="integrationsClientList"
      ref="integrationsClientList"
      :refName="'integrationsClientList'"
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
      @onEmptyBtnClicked="onEmptyBtnClicked"
      @deleteAction="handleDelete"
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportIntegrationList"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewClients from './NewClients'
import { getStoreValue, PROPERTY_STORE } from '../../model/constants/commonConstants'

export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewClients
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.INTEGRATIONNAME,
            align: 'left',
            editable: false,
            label: 'Integration Name',
            sortable: true,
            show: true,
            type: 'text',
            width: 175
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            width: 175
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.COMPANY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANY),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
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
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
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
          subMes: 'Add Clients',
          btn: 'Add Clients',
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
    },
    onEmptyBtnClicked() {
      this.modalStatus = true
    }
  },
  mounted() {
    this.$refs.integrationsClientList.loadWithDataArray([
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

<style lang="scss"></style>
