<template>
  <div class="custom-api">
    <div class="custom-apis__container">
      <company-settings-header
        title="Custom API"
        sub-title="Create API Key to your customers for integration"
      />
      <data-table
        ref="refCustomApiList"
        :refName="'smtpSettingsList'"
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
        @onEmptyBtnClicked="showSmsSettingsModal = true"
        @handleAddNewCustomApi="handleAddNewCustomApi"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'CustomApi',
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.COMPANY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANY),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.APIKEY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.APIKEY),
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
          message: 'You do not have any Custom API',
          subMes: 'Create a new custom API',
          btn: 'Create New Custom API',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewCustomApi',
          tooltip: 'Add a New Custom Api'
        }
      }
    }
  },
  components: {
    CompanySettingsHeader,
    DataTable
  },
  methods: {
    handleAddNewCustomApi() {}
  }
}
</script>

<style></style>
