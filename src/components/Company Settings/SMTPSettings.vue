<template>
  <div class="smtp-settings">
    <company-settings-header title="SMTP Settings" sub-title="Manage SMTP server settings" />
    <new-smtp-settings
      :status="newSmtpModalStatus"
      @closeOverlay="toggleSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
    />
    <delete-smtp-settings
      :status="deleteSmtpModalStatus"
      :data="selectedDeleteSmtpSettings"
      v-if="deleteSmtpModalStatus"
      @closeOverlay="toggleDeleteSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
    />
    <div class="smtp-settings__container">
      <DatatableLoading :loading="loading">
        <template v-slot:skeleton-content>
          <data-table
            ref="refSmtpSettingsList"
            :table="tableData"
            :refName="'smtpSettingsList'"
            :columns="tableOptions.columns"
            :countRow="5"
            :empty="tableOptions.empty"
            @addNewSmtpSetting="toggleSmtpModalStatus"
            :filterable="true"
            :isServerSide="false"
            :options="true"
            :addButton="tableOptions.addButton"
            :pageSizes="tableOptions.pageSizes"
            :row-actions="tableOptions.rowActions"
            :selectable="true"
            :sizeable="true"
            @onEmptyBtnClicked="toggleSmtpModalStatus"
            @deleteAction="handleDeleteAction"
          />
        </template>
      </DatatableLoading>
    </div>
  </div>
</template>

<script>
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import NewSmtpSettings from '@/components/Company Settings/NewSmtpSettings'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import { deleteSmtpSettings, searchSmtpSettings } from '@/api/smtpSettings'
import DeleteSmtpSettings from '@/components/Company Settings/DeleteSmtpSettings'
export default {
  name: 'SMTPSettings',
  components: {
    DeleteSmtpSettings,
    CompanySettingsHeader,
    DataTable,
    NewSmtpSettings,
    DatatableLoading
  },
  data() {
    return {
      tableData: [],
      loading: true,
      selectedDeleteSmtpSettings: null,
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
            property: PROPERTY_STORE.SMTPADDRESS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.SMTPADDRESS),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.STATUSNAME,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
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
          message: 'You do not have any SMTP configuration, yet',
          subMes: 'Create a new user directory integration',
          btn: 'Create SMTP Configuration',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'addNewSmtpSetting',
          tooltip: 'Add SMTP Setting'
        }
      },
      newSmtpModalStatus: false,
      deleteSmtpModalStatus: false,
      bodyOptions: {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  methods: {
    toggleSmtpModalStatus() {
      this.newSmtpModalStatus = !this.newSmtpModalStatus
    },
    toggleDeleteSmtpModalStatus() {
      this.deleteSmtpModalStatus = !this.deleteSmtpModalStatus
    },
    callForSearchSmtpSettings() {
      this.loading = true
      searchSmtpSettings(this.bodyOptions)
        .then((response) => {
          const { data: { data: { results = [] } = {} } = {} } = response
          this.tableData = results
        })
        .finally(() => (this.loading = false))
    },
    callForDeleteSmtpSettings(resourceId) {
      deleteSmtpSettings(resourceId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            message: response.data.message,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle-outline'
          })
          this.callForSearchSmtpSettings()
        })
        .finally(() => {
          this.selectedDeleteSmtpSettings = null
        })
    },
    handleDeleteSmtpSettings(row) {
      const { resourceId } = row
      this.toggleDeleteSmtpModalStatus()
      this.callForDeleteSmtpSettings(resourceId)
    },
    handleDeleteAction(selectedRow) {
      this.selectedDeleteSmtpSettings = selectedRow
      this.toggleDeleteSmtpModalStatus()
    }
  },
  created() {
    this.callForSearchSmtpSettings()
  }
}
</script>

<style lang="scss"></style>
