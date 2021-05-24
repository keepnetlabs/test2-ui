<template>
  <div class="proxy-settings">
    <company-settings-header title="Proxy Settings" sub-title="Configure proxy" />
    <new-proxy-settings
      :status="newProxyModalStatus"
      @closeOverlay="toggleProxyModalStatus"
      @handleDelete="handleDeleteProxySettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
      :resourceId="selectedEditProxySettings"
      :isEdit="isEdit"
      v-if="newProxyModalStatus"
    />
    <delete-proxy-settings
      :status="deleteProxyModalStatus"
      :data="selectedDeleteProxySettings"
      @closeOverlay="toggleDeleteProxyModalStatus"
      @handleDelete="handleDeleteProxySettings"
    />
    <div class="proxy-settings__container">
      <data-table
        id="company-settings-proxy-settings-data-table"
        ref="refProxySettingsList"
        :loading="loading"
        :table="tableData"
        :refName="'proxySettingsList'"
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
        @addNewProxySetting="toggleProxyModalStatus"
        @onEmptyBtnClicked="toggleProxyModalStatus"
        @handleMultipleDelete="handleMultipleDelete"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearchProxySettings"
        @downloadEvent="exportProxySettingsList"
        @on-all-records-button-click="handleAllRecordsClick"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @on-table-settings-change="handleSetRenderedColumns"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        :isServerSide="true"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
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
import NewProxySettings from '@/components/Company Settings/ProxySettings/NewProxySettings'
import { deleteProxySettings, exportProxySettings, searchProxySettings } from '@/api/proxySettings'
import DeleteProxySettings from '@/components/Company Settings/ProxySettings/DeleteProxySettings'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import QueryHelperForTable from '@/helper-classes/query-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
export default {
  name: 'PROXYSettings',
  components: {
    CompanySettingsHeader,
    DataTable,
    NewProxySettings,
    DeleteProxySettings
  },
  data() {
    return {
      tableData: [],
      loading: false,
      selectedDeleteProxySettings: null,
      isRestoredOrClearedFilters: false,
      selectedEditProxySettings: null,
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
            label: 'Proxy Name',
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.ADDRESS,
            align: 'left',
            editable: false,
            label: 'IP Address',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.PORT,
            align: 'left',
            editable: false,
            label: 'Port',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.AuthenticationTypeName,
            align: 'left',
            editable: false,
            label: 'Authentication',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 180
          },
          {
            property: PROPERTY_STORE.ISDEFAULT,
            align: 'center',
            editable: false,
            label: 'Is Default?',
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            width: 150
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: 'right',
            sortable: true,
            show: true,
            filterableType: 'date',
            type: 'text',
            width: 180
          }
        ],
        isColumnFilterActive: false,
        pageSizes: [5, 10, 25],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        downloadButton: {
          show: true,
          disabled: false
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--proxy-settings-row-actions',
            disabled: false
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--proxy-settings-row-actions',
            disabled: false
          }
        ],
        empty: {
          message: 'No PROXY Configurations',
          btn: 'Create PROXY Configuration',
          icon: 'mdi-plus',
          id: 'btn-empty--proxy-settings',
          disabled: false
        },
        addButton: {
          show: true,
          action: 'addNewProxySetting',
          tooltip: 'Add PROXY Setting',
          id: 'btn-add--proxy-settings',
          disabled: false
        }
      },
      newProxyModalStatus: false,
      deleteProxyModalStatus: false,
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
            },
            {
              Condition: 'OR',
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
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.bodyOptions.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyOptions.filter.FilterGroups[1].FilterItems = this.bodyOptions.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'Status'
          }
          if (item.FieldName === 'AuthenticationTypeName') {
            item.FieldName = 'AuthenticationType'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForSearchProxySettings()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.bodyOptions.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.bodyOptions.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.bodyOptions.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForSearchProxySettings()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.bodyOptions.ascending = order === 'ascending'
      this.bodyOptions.orderBy = prop === 'statusName' ? 'Status' : prop
      this.callForSearchProxySettings()
    },
    resetPageNumber() {
      //generic
      this.bodyOptions.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.bodyOptions.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForSearchProxySettings()
    },
    toggleProxyModalStatus() {
      if (this.newProxyModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }
      this.newProxyModalStatus = !this.newProxyModalStatus
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.PROXY_SETTINGS, JSON.stringify(tableSettings))
    },
    handleAllRecordsClick() {
      this.bodyOptions.pageSize = 75000
      this.showAllRecords = false
      this.callForSearchProxySettings()
    },
    getDisabledStatusOfEdit({ isOwner } = {}) {
      //return this.tableOptions.rowActions[0].disabled || !isOwner
    },
    getDisabledStatusOfDelete({ isOwner } = {}) {
      //return this.tableOptions.rowActions[1].disabled || !isOwner
    },
    exportProxySettingsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.bodyOptions.filter)),
        this.$refs.refProxySettingsList,
        'CreateTime'
      )
      if (this.$refs.refProxySettingsList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
        clientTableExportHelper.filter.FilterGroups[1].FilterItems.find(
          (item) => item.FieldName === 'StatusName'
        ).FieldName = 'Status'
      }
      if (
        this.$refs.refProxySettingsList.sortProps &&
        this.$refs.refProxySettingsList.sortProps.order
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
        exportProxySettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Proxy Settings.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    toggleDeleteProxyModalStatus() {
      this.deleteProxyModalStatus = !this.deleteProxyModalStatus
    },
    callForSearchProxySettings() {
      this.loading = true
      searchProxySettings(this.bodyOptions)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.totalNumberOfRecords = totalNumberOfRecords

          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          const { results = [] } = data
          this.tableData = results
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
    },
    handleEditAction({ resourceId } = {}) {
      this.isEdit = true
      this.selectedEditProxySettings = resourceId
      this.toggleProxyModalStatus()
    },
    closeOverlayWithUpdate() {
      this.toggleProxyModalStatus()
      this.callForSearchProxySettings()
    },
    callForDeleteProxySettings(resourceId) {
      deleteProxySettings(resourceId)
        .then(() => {
          this.callForSearchProxySettings()
        })
        .finally(() => {
          this.selectedDeleteProxySettings = null
        })
    },
    handleDeleteProxySettings(row) {
      const { resourceId } = row
      this.$refs.refProxySettingsList.unSelectRow(row)
      this.callForDeleteProxySettings(resourceId)
    },
    handleDeleteAction(selectedRow) {
      this.selectedDeleteProxySettings = selectedRow
      this.toggleDeleteProxyModalStatus()
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
      this.callForSearchProxySettings()
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
      this.callForSearchProxySettings()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.PROXY_SETTINGS,
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
      this.selectedDeleteProxySettings = selections
      this.toggleDeleteProxyModalStatus()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyOptions = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refProxySettingsList.filterValues = {}
      this.$refs.refProxySettingsList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.PROXY_SETTINGS)
      this.callForSearchProxySettings()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.PROXY_SETTINGS)
      )
      if (savedFilter) {
        this.bodyOptions.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refProxySettingsList.filterValues = savedFilter.filterValues
          this.$refs.refProxySettingsList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForSearchProxySettings()
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.PROXY_SETTINGS))
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.setDefaultValues()
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.setQueryValuesToPayload(this.$route.query)
    this.bodyOptions.pageSize = size
    this.bodyOptions.pageNumber = page
    this.serverSideProps.pageSize = size
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss"></style>
