<template>
  <div class="sms-settings">
    <new-sms-settings :status="showSmsSettingsModal" @closeOverlay="showSmsSettingsModal = false" />
    <company-settings-header title="SMS Settings" sub-title="Manage SMS Integrations" />
    <div class="sms-settings__container">
      <data-table
        ref="refSmtpSettingsList"
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
        @handleAddNewSmsIntegration="handleAddNewSmsIntegration"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import NewSmsSettings from '@/components/Company Settings/NewSmsSettings'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'SmsSettings',
  components: {
    CompanySettingsHeader,
    DataTable,
    NewSmsSettings
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.PROVIDER,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PROVIDER),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.ACCOUNTSID,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.ACCOUNTSID),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
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
          message: 'You do not have any SMS integrations',
          subMes: 'Create a new configuration',
          btn: 'Create New SMS Integration',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewSmsIntegration',
          tooltip: 'Add a New Rest Api'
        }
      },
      showSmsSettingsModal: false
    }
  },
  methods: {
    handleAddNewSmsIntegration() {}
  }
}
</script>

<style></style>
