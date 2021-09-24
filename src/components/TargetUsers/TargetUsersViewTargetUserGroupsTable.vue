<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :refName="'groupsTable'"
    :loading="isLoading"
    :count-row="tableOptions.countRow"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :stored-table-settings="storedTableSettings"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :download-button="tableOptions.downloadButton"
    :is-settings-popup="tableOptions.isSettingsPopup"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @set-default-search="handleSetDefaultSearch"
    @restore-default-search="handleRestoreDefaultSearch"
    @clear-filters="handleClearFilters"
    @on-table-settings-change="handleSetRenderedColumns"
    @refreshAction="callForData"
  >
    <template #datatable-custom-column="{ scope, col }">
      <span @click="handleGroupNameClick(scope.row)" class="popup-link">
        {{ scope.row[col.property] }}
      </span>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { getTargetUserViewUserGroups } from '@/api/targetUsers'
const axiosPayload = {
  pageNumber: 1,
  pageSize: 5,
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
}
export default {
  name: 'TargetUsersViewTargetUserGroupsTable',
  components: {
    DataTable
  },
  props: {
    itemResourceId: {
      type: String
    }
  },
  data() {
    return {
      axiosPayload: JSON.parse(JSON.stringify(axiosPayload)),
      defaultAxiosPayload: JSON.parse(JSON.stringify(axiosPayload)),
      CONSTANTS: {
        id: 'target-users-view-target-users-group-data-table'
      },
      isLoading: false,
      tableOptions: {
        isColumnFilterActive: false,
        isSettingsPopup: false,
        countRow: 5,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.NAME),
            fixed: 'left',
            sortable: true,
            show: true,
            width: 150,
            type: 'slot',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            isEditable: true,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            isEditable: true,
            width: 192,
            overrideWidth: true
          }
        ],
        downloadButton: { show: false },
        iEmpty: { message: labels.NoTargetUserGroups },
        serverSideEvents: { pagination: true, search: true, sort: true }
      },
      tableData: [],
      storedTableSettings: null,
      serverSideProps: new ServerSideProps('', false, 5, 1, 0, 0)
    }
  },
  created() {
    this.getStoredTableSettings()
    this.setDefaultFilter()
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      getTargetUserViewUserGroups(this.itemResourceId, this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
          this.setLoading(true)
        })
        .finally(this.setLoading)
    },
    setLoading(val = false) {
      this.isLoading = val
    },
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.TARGET_USERS_VIEW_USER_GROUPS)
      )
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    sortChanged({ order } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.callForData()
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.callForData()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSVIEWUSERGROUPS,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.setDefaultFilter()
      this.callForData()
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSVIEWUSERGROUPS)
      )
      if (!savedFilter) return
      const { filter, filterValues } = savedFilter
      this.axiosPayload.filter = filter
      this.tableOptions.isColumnFilterActive = true
      this.reRenderColumns(filterValues)
    },
    handleClearFilters() {
      this.axiosPayload = JSON.parse(JSON.stringify(this.defaultAxiosPayload))
      this.reRenderColumns({})
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSVIEWUSERGROUPS)
      this.callForData()
    },
    reRenderColumns(filterValues) {
      this.$nextTick(() => {
        this.$refs.refTable.filterValues = filterValues
        this.$refs.refTable.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      })
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.TARGET_USERS_VIEW_USER_GROUPS,
        JSON.stringify(tableSettings)
      )
    },
    handleGroupNameClick(row = '') {
      this.$router.push({
        name: 'Target Group Users',
        params: { id: row.resourceId, label: row.name, from: 'people' }
      })
    }
  }
}
</script>

<style lang="scss">
#target-users-view-target-users-group-data-table.k-table__wrapper {
  padding-bottom: 0;
}
</style>
