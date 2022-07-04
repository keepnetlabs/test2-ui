<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :loading="isLoading"
    :count-row="tableOptions.countRow"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :download-button="tableOptions.downloadButton"
    :is-settings-popup="tableOptions.isSettingsPopup"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
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
import { getDefaultAxiosPayload } from '@/utils/functions'
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
      axiosPayload: getDefaultAxiosPayload({ pageSize: 5 }),
      defaultAxiosPayload: getDefaultAxiosPayload({ pageSize: 5 }),
      CONSTANTS: {
        id: 'target-users-view-target-users-group-data-table'
      },
      isLoading: false,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSVIEWUSERGROUPS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TARGET_USERS_VIEW_USER_GROUPS,
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
      serverSideProps: new ServerSideProps('', false, 5, 1, 0, 0)
    }
  },
  created() {
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
    columnFilterChanged(filter) {
      this.resetPageNumber()
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.resetPageNumber()
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
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
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
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
