<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :refName="'campaignManagerTable'"
    :loading="isLoading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :stored-table-settings="storedTableSettings"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
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
    <template v-slot:datatable-custom-column="{ scope, col }">
      <template v-if="scope.column.property === 'name'">
        <div class="reported-email-subject__container">
          <div class="reported-email-subject">
            <span> {{ scope.row[col.property] }}</span>
          </div>
          <TheRecordsButton
            :index="scope.$index"
            :row="scope.row"
            @on-click="handleRecordButtonClick"
          />
        </div>
      </template>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { COLUMNS } from '@/components/CampaignManager/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton'
import labels from '@/model/constants/labels'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_RECORD_BUTTON_CLICK: 'on-record-button-click'
}
export default {
  name: 'CampaignManagerParentTable',
  components: { TheRecordsButton, DataTable },
  props: {
    axiosPayload: {
      type: Object
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: EMITS,
  data() {
    return {
      CONSTANTS: {
        id: 'campaign-manager-parent-data-table',
        ascending: 'ascending'
      },
      tableData: [],
      storedTableSettings: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          COLUMNS.CAMPAIGN_NAME,
          COLUMNS.TARGET_USERS,
          COLUMNS.STATUS,
          COLUMNS.CREATE_TIME,
          COLUMNS.LAST_LAUNCH
        ],
        iEmpty: {
          message: labels.EmptyCampaignManager,
          btn: labels.New,
          id: 'btn-empty--campaign-manager',
          icon: 'mdi-plus'
        }
      }
    }
  },
  created() {
    this.getStoredTableSettings()
    this.setDefaultFilter()
    this.tableData = [
      {
        name: 'Gurkan',
        total: 5
      }
    ]
  },
  methods: {
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE)
      )
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE)
      )
      if (!savedFilter) return
      const { filter, filterValues } = savedFilter
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter = filter
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.tableOptions.isColumnFilterActive = true
      this.$refs.refTable.reRenderColumns(filterValues)
    },
    callForData() {
      //TODO Axios call
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        copyOfAxiosPayload
      )
      this.$emit('update:axiosPayload', copyOfAxiosPayload)
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        copyOfAxiosPayload
      )
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.checkIsColumnFilterActive()
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.pageNumber = pageNumber
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order } = {}) {
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.ascending = order === this.CONSTANTS.ascending
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.callForData()
    },
    resetPageNumber() {
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.pageNumber = 1
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.serverSideProps.pageNumber = 1
    },
    emitCopyOfAxiosPayload(payload) {
      this.$emit(EMITS.UPDATE_AXIOS_PAYLOAD, payload)
    },
    copyAxiosPayload() {
      return JSON.parse(JSON.stringify(this.axiosPayload))
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.callForData()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    checkIsColumnFilterActive() {
      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleRestoreDefaultSearch() {
      this.setDefaultFilter()
      this.callForData()
    },
    handleClearFilters() {
      this.$emit(EMITS.RESET_AXIOS_PAYLOAD)
      this.$refs.refTable.reRenderColumns({})
      this.callForData()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE,
        JSON.stringify(tableSettings)
      )
    },
    handleRecordButtonClick(row) {
      this.$emit(EMITS.ON_RECORD_BUTTON_CLICK, row)
    }
  }
}
</script>
