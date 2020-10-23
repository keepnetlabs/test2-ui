<template>
  <div class="smtp-settings">
    <company-settings-header title="SMTP Settings" sub-title="Manage SMTP server settings" />
    <new-smtp-settings
      v-if="newSmtpModalStatus"
      :status="newSmtpModalStatus"
      @closeOverlay="toggleSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
      :resourceId="selectedEditSmtpSettings"
      :isEdit="isEdit"
    />
    <delete-smtp-settings
      :status="deleteSmtpModalStatus"
      :data="selectedDeleteSmtpSettings"
      v-if="deleteSmtpModalStatus"
      @closeOverlay="toggleDeleteSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
      @handleMultipleDelete="handleDeleteMultipleSmtpSettings"
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
            id="company-settings-smtp-settings-data-table"
            :empty="tableOptions.empty"
            @addNewSmtpSetting="toggleSmtpModalStatus"
            :filterable="true"
            :options="true"
            :addButton="tableOptions.addButton"
            :pageSizes="tableOptions.pageSizes"
            :is-downloadable="true"
            @downloadEvent="exportSmtpSettingsList"
            :select-event="tableOptions.selectEvent"
            :row-actions="tableOptions.rowActions"
            :selectable="true"
            :sizeable="true"
            :resizable="true"
            @onEmptyBtnClicked="toggleSmtpModalStatus"
            @deleteAction="handleDeleteAction"
            @editAction="handleEditAction"
            @handleMultipleDelete="handleMultipleDelete"
            @columnFilterChanged="columnFilterChanged"
            @columnFilterCleared="columnFilterCleared"
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
import { deleteSmtpSettings, exportSmtpSettings, searchSmtpSettings } from '@/api/smtpSettings'
import DeleteSmtpSettings from '@/components/Company Settings/DeleteSmtpSettings'
import { exportPhishingReporterUserList } from '@/api/phishingReporter'
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
      selectedEditSmtpSettings: null,
      isEdit: false,
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
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.SMTPADDRESS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.SMTPADDRESS),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.USERNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDBY),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
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
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
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
      if (this.newSmtpModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }

      this.newSmtpModalStatus = !this.newSmtpModalStatus
    },
    exportSmtpSettingsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: PROPERTY_STORE.CREATETIME,
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportSmtpSettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `smtp-settings.${exportType.toLocaleLowerCase()}`
          link.click()
        })
      })
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
    handleEditAction({ resourceId } = {}) {
      this.isEdit = true
      this.selectedEditSmtpSettings = resourceId
      this.toggleSmtpModalStatus()
    },
    closeOverlayWithUpdate() {
      this.toggleSmtpModalStatus()
      this.callForSearchSmtpSettings()
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
      this.callForDeleteSmtpSettings(resourceId)
    },
    handleDeleteAction(selectedRow) {
      this.selectedDeleteSmtpSettings = selectedRow
      this.toggleDeleteSmtpModalStatus()
    },
    columnFilterChanged(filter) {
      let items = []
      let requestBody = this.bodyOptions.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }
      this.bodyOptions.filter.FilterGroups[0].FilterItems = requestBody
      this.callForSearchSmtpSettings()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyOptions.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })
      filterPayload = [...items]
      this.bodyOptions.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForSearchSmtpSettings()
    },
    handleMultipleDelete(selections) {
      this.selectedDeleteSmtpSettings = selections
      this.toggleDeleteSmtpModalStatus()
    },
    handleDeleteMultipleSmtpSettings(selections) {
      selections.forEach((item) => this.handleDeleteSmtpSettings(item))
    }
  },
  created() {
    this.callForSearchSmtpSettings()
  }
}
</script>

<style lang="scss"></style>
