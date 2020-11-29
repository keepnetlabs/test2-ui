<template>
  <div class="rest-api">
    <new-rest-api-configuration
      :status="showNewRestApiModal"
      @closeOverlay="showNewRestApiModal = false"
    />
    <company-settings-header title="Rest API" sub-title="Manage Rest API configurations" />
    <div class="rest-api__container">
      <data-table
        ref="refSmtpSettingsList"
        :refName="'smtpSettingsList'"
        :columns="tableOptions.columns"
        :countRow="5"
        :empty="tableOptions.empty"
        id="company-settings-rest-api-data-table"
        :filterable="true"
        :isServerSide="false"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :sizeable="true"
        @onEmptyBtnClicked="showNewRestApiModal = true"
        @handleAddNewRestApi="handleAddNewRestApi"
      />
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import NewRestApiConfiguration from '@/components/Company Settings/NewRestApiConfiguration'

export default {
  name: 'RestApi',
  components: {
    CompanySettingsHeader,
    DataTable,
    NewRestApiConfiguration
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.TYPE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TYPE),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.URL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.URL),
            sortable: true,
            show: true,
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
            type: 'text',
            width: 350
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            sortable: true,
            show: true,
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
            type: 'text',
            width: 150
          }
        ],
        pageSizes: [5, 10, 25],
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
          message: 'You do not have any REST API configurations',
          subMes: 'Create a new configuration',
          btn: 'Create New Rest API configuration',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewRestApi',
          tooltip: 'Add a New Rest Api'
        }
      },
      showNewRestApiModal: false
    }
  },
  methods: {
    handleAddNewRestApi() {}
  }
}
</script>

<style></style>
