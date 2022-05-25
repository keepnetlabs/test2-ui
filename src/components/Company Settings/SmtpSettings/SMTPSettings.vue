<template>
  <div class="smtp-settings">
    <company-settings-header title="SMTP Settings" sub-title="Manage SMTP server settings" />
    <new-smtp-settings
      v-if="newSmtpModalStatus && getSMTPSettingsCreatePermissions"
      ref="newSmtpSettings"
      :status="newSmtpModalStatus"
      @closeOverlay="toggleSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
      :resourceId="selectedEditSmtpSettings"
      :isEdit="isEdit"
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
        :axios-payload.sync="bodyOptions"
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
        @refreshAction="callForSearchSmtpSettings"
        @downloadEvent="exportSmtpSettingsList"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @handleSelectionChange="handleTableSelectionChange"
      >
        <!-- <template v-slot:datatable-custom-column="{ scope }">
          <div>
            <span
              >{{ scope.row.name }}
              <v-icon v-if="scope.row.isDefault" color="#1173C1"
              class="pl-2"
                >mdi-star-circle</v-icon
              >
            </span>
          </div>
        </template> -->
        <template #datatable-row-actions="{ scope }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                @click.native="handleEditAction(scope.row)"
                :disabled="getDisabledStatusOfEdit(scope.row)"
                class="btn-hover mr-1"
                icon
                :id="`${tableOptions.rowActions[0].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                v-on="on"
              >
                <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[0].name }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="getDisabledStatusOfDelete(scope.row)"
                @click.native="handleDeleteAction(scope.row)"
                class="btn-hover"
                icon
                :id="`${tableOptions.rowActions[1].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                v-on="on"
              >
                <v-icon>{{ tableOptions.rowActions[1].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[1].name }}</span>
          </v-tooltip>
          <!-- <v-menu bottom left offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="btn-hover" icon v-on="on">
                <v-icon @click.native="selectedMenuIndex = scope.$index"
                  >mdi-dots-vertical</v-icon
                >
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                class="sub-menu-el"
                :disabled="getDisabledStatusOfDelete(scope.row)"
                :id="`${tableOptions.rowActions[1].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                @click="handleDeleteAction(scope.row)"
              >
                <v-list-item-title class="sub-menu-el__title">
                  <v-icon
                    class="smtp-settings__row-actions__overflow-menu__icon"
                    >{{ tableOptions.rowActions[1].icon }}</v-icon
                  >
                  <span>{{ tableOptions.rowActions[1].name }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="sub-menu-el"
                :disabled="getDisabledStatusOfDelete(scope.row)"
                :id="`${tableOptions.rowActions[2].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                @click="handleMakeDefault(scope.row)"
              >
                <v-list-item-title @click="() => {}" class="sub-menu-el__title">
                  <v-icon
                    class="smtp-settings__row-actions__overflow-menu__icon"
                    >{{ tableOptions.rowActions[2].icon }}</v-icon
                  >
                  <span>{{ tableOptions.rowActions[2].name }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
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
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { mapGetters } from 'vuex'
export default {
  name: 'SMTPSettings',
  components: {
    DeleteSmtpSettings,
    CompanySettingsHeader,
    DataTable,
    NewSmtpSettings
  },
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
            // type: "slot",
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
          // {
          //   name: "Make Default",
          //   icon: "mdi-star-circle",
          //   action: "makeDefaultAction",
          //   id: "btn-make-default--smtp-settings-row-actions",
          //   disabled: !this.$store.getters['permissions/getSMTPSettingsUpdatePermissions']
          // },
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
      bodyOptions: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
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
  methods: {
    handleTableSelectionChange(items) {
      this.selectedTableItems = items
      this.changeMultipleDeleteDisability()
    },
    handleSearchChange(searchFilter = {}) {
      //generic
      this.bodyOptions.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyOptions.filter.FilterGroups[1].FilterItems = this.bodyOptions.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'Status'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForSearchSmtpSettings()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyOptions.pageNumber = pageNumber
      this.callForSearchSmtpSettings()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyOptions.ascending = order === 'ascending'
      this.bodyOptions.orderBy = prop === 'statusName' ? 'Status' : prop
      this.callForSearchSmtpSettings()
    },
    resetPageNumber() {
      this.bodyOptions.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyOptions.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearchSmtpSettings()
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
    getDisabledStatusOfEdit({ isOwner } = {}) {
      return this.tableOptions.rowActions[0].disabled || !isOwner
    },
    getDisabledStatusOfDelete({ isOwner } = {}) {
      return this.tableOptions.rowActions[1].disabled || !isOwner
    },
    exportSmtpSettingsList(downloadTypes) {
      downloadTypes.exportTypes.map((exportType) => {
        const payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.bodyOptions.orderBy,
          ascending: this.bodyOptions.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyOptions.filter
        }
        exportSmtpSettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
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
    callForSearchSmtpSettings() {
      if (this.getSMTPSettingsSearchPermissions) {
        this.loading = true
        searchSmtpSettings(this.bodyOptions)
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
            // this.tableData = data.results.map((item) => ({
            //   ...item,
            //   isDefault: true,
            // }));
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
      this.callForSearchSmtpSettings()
    },
    callForDeleteSmtpSettings(resourceId) {
      if (this.getSMTPSettingsDeletePermissions) {
        deleteSmtpSettings(resourceId)
          .then(() => {
            this.callForSearchSmtpSettings()
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
    handleMakeDefault(selectedRow) {},
    columnFilterChanged(filter) {
      this.bodyOptions.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.bodyOptions
      )
      this.callForSearchSmtpSettings()
    },
    columnFilterCleared(fieldName) {
      this.bodyOptions.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyOptions
      )
      this.callForSearchSmtpSettings()
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
  },
  created() {
    this.callForSearchSmtpSettings()
  }
}
</script>

<style lang="scss" scoped>
.smtp-settings__row-actions__overflow-menu__icon {
  margin-right: 16px;
}

.sub-menu-el__title {
  display: flex;
  align-items: center;
}
</style>
