<template>
  <div class="smtp-settings">
    <company-settings-header title="SMTP Settings" sub-title="Manage SMTP server settings" />
    <div class="smtp-settings__container">
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
      />
    </div>
  </div>
</template>

<script>
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
export default {
  name: 'SMTPSettings',
  components: {
    CompanySettingsHeader,
    DataTable
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.NAME),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDBY),
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
          },
          {
            property: PROPERTY_STORE.AVAILABLEFOR,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.AVAILABLEFOR),
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
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
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
          message: 'You do not have any SMTP configuration, yet',
          subMes: 'Create a new user directory integration',
          btn: 'Create Integration',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddUserDirectories',
          tooltip: 'Add SMTP Setting'
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
