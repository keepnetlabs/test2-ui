<template>
  <div class="user-directories">
    <new-ldap-integration
      v-if="ldapModalStatus"
      :status="ldapModalStatus"
      @closeOverlay="ldapModalStatus = false"
    />
    <company-settings-header
      title="User Directories"
      sub-title="Manage user directory integrations like LDAP and MS Active Directory"
    />
    <div class="user-directories__container">
      <data-table
        id="user-directories-data-table"
        ref="refUserDirectoriesList"
        :refName="'userDirectoriesList'"
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
        @onEmptyBtnClicked="ldapModalStatus = true"
      />
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import NewLdapIntegration from '@/components/Company Settings/NewLdapIntegration'
import {getStoreValue, PROPERTY_STORE} from '@/model/constants/commonConstants'

export default {
  name: 'UserDirectories',
  components: {
    CompanySettingsHeader,
    DataTable,
    NewLdapIntegration
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.INTEGRATIONNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.INTEGRATIONNAME),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.TYPE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TYPE),
            sortable: true,
            show: true,
            fixed: false,
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
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.USERS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.USERS),
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
          message: 'You do not have any user directory integration, yet',
          subMes: 'Create a new user directory integration',
          btn: 'Add a New Integration',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddUserDirectories',
          tooltip: 'Add a New Integration'
        }
      },
      ldapModalStatus: false
    }
  }
}
</script>

<style lang="scss"></style>
