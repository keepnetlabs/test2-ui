<template>
  <div class="smtp-settings">
    <company-settings-header title="SMTP Settings" sub-title="Manage SMTP server settings" />
    <new-smtp-settings
      v-if="newSmtpModalStatus && getSMTPSettingsCreatePermissions"
      ref="newSmtpSettings"
      :status="newSmtpModalStatus"
      :resourceId="selectedEditSmtpSettings"
      :is-edit="isEdit"
      @closeOverlay="toggleSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
    />
    <delete-smtp-settings
      v-if="deleteSmtpModalStatus && getSMTPSettingsDeletePermissions"
      :status="deleteSmtpModalStatus"
      :data="selectedDeleteSmtpSettings"
      @closeOverlay="toggleDeleteSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
      @handleMultipleDelete="handleDeleteMultipleSmtpSettings"
    />
    <div class="smtp-settings__container">
      <data-table
        id="company-settings-smtp-settings-data-table"
        ref="refSmtpSettingsList"
        is-server-side
        filterable
        options
        selectable
        :loading="loading"
        :table="tableData"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :download-button="tableOptions.downloadButton"
        :addButton="tableOptions.addButton"
        :select-event="tableOptions.selectEvent"
        :row-actions="tableOptions.rowActions"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @addNewSmtpSetting="toggleSmtpModalStatus"
        @onEmptyBtnClicked="toggleSmtpModalStatus"
        @handleMultipleDelete="handleMultipleDelete"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
        @downloadEvent="exportSmtpSettingsList"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @handleSelectionChange="handleTableSelectionChange"
      >
        <template #datatable-row-actions="{ scope }">
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[0].id"
            :icon="tableOptions.rowActions[0].icon"
            :text="tableOptions.rowActions[0].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[0].disabled"
            @on-click="handleEditAction(scope.row)"
          />
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[1].id"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            @on-click="handleDeleteAction(scope.row)"
          />
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import NewSmtpSettings from '@/components/Company Settings/SmtpSettings/NewSmtpSettings'
import { deleteSmtpSettings, exportSmtpSettings, searchSmtpSettings } from '@/api/smtpSettings'
import DeleteSmtpSettings from '@/components/Company Settings/SmtpSettings/DeleteSmtpSettings'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'SMTPSettings',
  components: {
    DefaultButtonRowAction,
    DeleteSmtpSettings,
    CompanySettingsHeader,
    DataTable,
    NewSmtpSettings
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      tableData: [],
      loading: false,
      selectedDeleteSmtpSettings: null,
      selectedTableItems: [],
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
            width: 160
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDBY),
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 180
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
            filterableType: 'date'
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
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: [
              { text: 'Running', value: 'Running' },
              { text: 'Failed', value: 'Failed' }
            ],
            width: 150
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SMTP_SETTINGS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SMTP_SETTINGS,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: this.$store.getters['permissions/getSMTPSettingsDeletePermissions'],
          download: false,
          disabledStatuses: {
            delete: false
          }
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getSMTPSettingsExportPermissions']
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--smtp-settings-row-actions',
            disabled: !this.$store.getters['permissions/getSMTPSettingsUpdatePermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--smtp-settings-row-actions',
            disabled: !this.$store.getters['permissions/getSMTPSettingsDeletePermissions']
          }
        ],
        empty: {
          message: labels.EmptySmtpSettings,
          btn: labels.EmptySmtpSettingsSub,
          icon: 'mdi-plus',
          id: 'btn-empty--smtp-settings',
          disabled: !this.$store.getters['permissions/getSMTPSettingsCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'addNewSmtpSetting',
          tooltip: 'Add SMTP Setting',
          id: 'btn-add--smtp-settings',
          disabled: !this.$store.getters['permissions/getSMTPSettingsCreatePermissions']
        }
      },
      newSmtpModalStatus: false,
      deleteSmtpModalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getSMTPSettingsSearchPermissions: 'permissions/getSMTPSettingsSearchPermissions',
      getSMTPSettingsCreatePermissions: 'permissions/getSMTPSettingsCreatePermissions',
      getSMTPSettingsUpdatePermissions: 'permissions/getSMTPSettingsUpdatePermissions',
      getSMTPSettingsDeletePermissions: 'permissions/getSMTPSettingsDeletePermissions',
      getSMTPSettingsGetPermissions: 'permissions/getSMTPSettingsGetPermissions',
      getSMTPSettingsExportPermissions: 'permissions/getSMTPSettingsExportPermissions'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    handleTableSelectionChange(items) {
      this.selectedTableItems = items
      this.changeMultipleDeleteDisability()
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'Status'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop === 'statusName' ? 'Status' : prop
      this.callForData()
    },
    checkIfCanCloseSmtpModal() {
      this.$refs.newSmtpSettings.closeOverlay()
    },
    toggleSmtpModalStatus() {
      if (this.newSmtpModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }
      this.newSmtpModalStatus = !this.newSmtpModalStatus
    },
    exportSmtpSettingsList(downloadTypes) {
      downloadTypes.exportTypes.map((exportType) => {
        const payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportSmtpSettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Smtp Settings.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    toggleDeleteSmtpModalStatus() {
      this.deleteSmtpModalStatus = !this.deleteSmtpModalStatus
    },
    callForData() {
      if (this.getSMTPSettingsSearchPermissions) {
        this.loading = true
        searchSmtpSettings(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results
            this.tableData = data.results
            this.changeMultipleDeleteDisability()
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    changeMultipleDeleteDisability() {
      this.$set(
        this.tableOptions.selectEvent.disabledStatuses,
        'delete',
        !this.selectedTableItems.every((row) => row.isOwner)
      )
    },
    handleEditAction({ resourceId } = {}) {
      if (this.getSMTPSettingsUpdatePermissions && this.getSMTPSettingsGetPermissions) {
        this.isEdit = true
        this.selectedEditSmtpSettings = resourceId
        this.toggleSmtpModalStatus()
      }
    },
    closeOverlayWithUpdate() {
      this.toggleSmtpModalStatus()
      this.callForData()
    },
    callForDeleteSmtpSettings(resourceId) {
      if (this.getSMTPSettingsDeletePermissions) {
        deleteSmtpSettings(resourceId)
          .then(() => {
            this.callForData()
          })
          .finally(() => {
            this.selectedDeleteSmtpSettings = null
          })
      }
    },
    handleDeleteSmtpSettings(row) {
      if (this.getSMTPSettingsDeletePermissions) {
        const { resourceId } = row
        this.$refs.refSmtpSettingsList.unSelectRow(row)
        this.callForDeleteSmtpSettings(resourceId)
      }
    },
    handleDeleteAction(selectedRow) {
      if (this.getSMTPSettingsDeletePermissions) {
        this.selectedDeleteSmtpSettings = selectedRow
        this.toggleDeleteSmtpModalStatus()
      }
    },
    handleMultipleDelete(selections) {
      if (this.getSMTPSettingsDeletePermissions) {
        this.selectedDeleteSmtpSettings = selections
        this.toggleDeleteSmtpModalStatus()
      }
    },
    handleDeleteMultipleSmtpSettings(selections) {
      if (this.getSMTPSettingsDeletePermissions) {
        selections.forEach((item) => {
          this.handleDeleteSmtpSettings(item)
        })
      }
    }
  }
}
</script>
