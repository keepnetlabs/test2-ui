<template>
  <div class="smtp-settings">
    <company-settings-header title="SMTP Settings" sub-title="Manage SMTP server settings" />
    <new-smtp-settings
      v-if="newSmtpModalStatus && PERMISSIONS.CREATE.hasPermission"
      :status="newSmtpModalStatus"
      @closeOverlay="toggleSmtpModalStatus"
      @handleDelete="handleDeleteSmtpSettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
      :resourceId="selectedEditSmtpSettings"
      :isEdit="isEdit"
    />
    <delete-smtp-settings
      v-if="deleteSmtpModalStatus && PERMISSIONS.DELETE.hasPermission"
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
        :loading="loading"
        :table="tableData"
        :refName="'smtpSettingsList'"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :total-number-of-records="totalNumberOfRecords"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :filterable="true"
        :show-all-records="showAllRecords"
        :options="true"
        :download-button="tableOptions.downloadButton"
        :stored-table-settings="storedTableSettings"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :is-downloadable="true"
        :select-event="tableOptions.selectEvent"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :sizeable="true"
        :resizable="true"
        @addNewSmtpSetting="toggleSmtpModalStatus"
        @onEmptyBtnClicked="toggleSmtpModalStatus"
        @handleMultipleDelete="handleMultipleDelete"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearchSmtpSettings"
        @downloadEvent="exportSmtpSettingsList"
        @on-all-records-button-click="handleAllRecordsClick"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @on-table-settings-change="handleSetRenderedColumns"
      >
        <template #datatable-row-actions="{scope}">
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
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
export default {
  name: 'SMTPSettings',
  components: {
    DeleteSmtpSettings,
    CompanySettingsHeader,
    DataTable,
    NewSmtpSettings
  },
  props: {
    PERMISSIONS: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      selectedDeleteSmtpSettings: null,
      isRestoredOrClearedFilters: false,
      selectedEditSmtpSettings: null,
      storedTableSettings: null,
      isEdit: false,
      showAllRecords: false,
      totalNumberOfRecords: 0,
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
        isColumnFilterActive: false,
        pageSizes: [5, 10, 25],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: this.PERMISSIONS.DELETE.hasPermission,
          download: false
        },
        downloadButton: {
          show: true,
          disabled: !this.PERMISSIONS.EXPORT.hasPermission
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--smtp-settings-row-actions',
            disabled: !this.PERMISSIONS.UPDATE.hasPermission
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--smtp-settings-row-actions',
            disabled: !this.PERMISSIONS.DELETE.hasPermission
          }
        ],
        empty: {
          message: 'No SMTP Configurations',
          btn: 'Create SMTP Configuration',
          icon: 'mdi-plus',
          id: 'btn-empty--smtp-settings',
          disabled: !this.PERMISSIONS.CREATE.hasPermission
        },
        addButton: {
          show: true,
          action: 'addNewSmtpSetting',
          tooltip: 'Add SMTP Setting',
          id: 'btn-add--smtp-settings',
          disabled: !this.PERMISSIONS.CREATE.hasPermission
        }
      },
      newSmtpModalStatus: false,
      deleteSmtpModalStatus: false,
      bodyOptions: {
        pageNumber: 1,
        pageSize: 1000,
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
      },
      defaultRequestBody: {
        pageNumber: 1,
        pageSize: 1000,
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
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SMTP_SETTINGS, JSON.stringify(tableSettings))
    },
    handleAllRecordsClick() {
      this.bodyOptions.pageSize = 75000
      this.showAllRecords = false
      this.callForSearchSmtpSettings()
    },
    getDisabledStatusOfEdit({ isOwner } = {}) {
      return this.tableOptions.rowActions[0].disabled || !isOwner
    },
    getDisabledStatusOfDelete({ isOwner } = {}) {
      return this.tableOptions.rowActions[1].disabled || !isOwner
    },
    exportSmtpSettingsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const { EXPORT } = this.PERMISSIONS
      if (EXPORT.hasPermission) {
        const clientTableExportHelper = new ClientTableExportHelper(
          JSON.parse(JSON.stringify(this.bodyOptions.filter)),
          this.$refs.refSmtpSettingsList,
          'CreateTime'
        )
        if (this.$refs.refSmtpSettingsList.search) {
          clientTableExportHelper.addSearchItems(this.tableOptions.columns)
          clientTableExportHelper.filter.FilterGroups[1].FilterItems.find(
            (item) => item.FieldName === 'StatusName'
          ).FieldName = 'Status'
        }
        if (
          this.$refs.refSmtpSettingsList.sortProps &&
          this.$refs.refSmtpSettingsList.sortProps.order
        ) {
          clientTableExportHelper.addSortItems()
        }

        const { filter, sortFilter } = clientTableExportHelper
        exportTypes.map((exportType) => {
          const payload = {
            ...sortFilter,
            pageNumber: pageNumber,
            pageSize: pageSize,
            reportAllPages,
            exportType: exportType === 'XLS' ? 'Excel' : exportType,
            filter
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
      }
    },
    toggleDeleteSmtpModalStatus() {
      this.deleteSmtpModalStatus = !this.deleteSmtpModalStatus
    },
    callForSearchSmtpSettings() {
      const { SEARCH } = this.PERMISSIONS
      if (SEARCH.hasPermission) {
        this.loading = true
        searchSmtpSettings(this.bodyOptions)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords = 0 } = data
            this.totalNumberOfRecords = totalNumberOfRecords
            if (this.bodyOptions.pageSize === 1000 && totalNumberOfRecords > 1000) {
              this.showAllRecords = true
            }

            if (totalNumberOfRecords <= 1000 && this.bodyOptions.pageSize === 1000) {
              this.showAllRecords = false
            }

            this.tableData = data.results
          })
          .finally(() => {
            this.loading = false
            this.isRestoredOrClearedFilters = false
          })
      }
    },
    handleEditAction({ resourceId } = {}) {
      const { UPDATE, GET } = this.PERMISSIONS
      if (UPDATE.hasPermission && GET.hasPermission) {
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
      const { DELETE } = this.PERMISSIONS
      if (DELETE.hasPermission) {
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
      const { DELETE } = this.PERMISSIONS
      if (DELETE.hasPermission) {
        const { resourceId } = row
        this.callForDeleteSmtpSettings(resourceId)
      }
    },
    handleDeleteAction(selectedRow) {
      const { DELETE } = this.PERMISSIONS
      if (DELETE.hasPermission) {
        this.selectedDeleteSmtpSettings = selectedRow
        this.toggleDeleteSmtpModalStatus()
      }
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyOptions.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
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
      if (this.isRestoredOrClearedFilters) {
        return
      }
      let items = []
      let filterPayload = this.bodyOptions.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyOptions.filter.FilterGroups[0].FilterItems = filterPayload
      this.tableOptions.isColumnFilterActive =
        this.bodyOptions.filter.FilterGroups[0].FilterItems.length >= 1
      this.callForSearchSmtpSettings()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.SMTP_SETTINGS,
        JSON.stringify({
          filter: this.bodyOptions.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleMultipleDelete(selections) {
      const { DELETE } = this.PERMISSIONS
      if (DELETE.hasPermission) {
        this.selectedDeleteSmtpSettings = selections
        this.toggleDeleteSmtpModalStatus()
      }
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyOptions = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refSmtpSettingsList.filterValues = {}
      this.$refs.refSmtpSettingsList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.SMTP_SETTINGS)
      this.callForSearchSmtpSettings()
    },
    handleDeleteMultipleSmtpSettings(selections) {
      const { DELETE } = this.PERMISSIONS
      if (DELETE.hasPermission) {
        selections.forEach((item) => this.handleDeleteSmtpSettings(item))
      }
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.SMTP_SETTINGS)
      )
      if (savedFilter) {
        this.bodyOptions.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refSmtpSettingsList.filterValues = savedFilter.filterValues
          this.$refs.refSmtpSettingsList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForSearchSmtpSettings()
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.SMTP_SETTINGS))
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss"></style>
