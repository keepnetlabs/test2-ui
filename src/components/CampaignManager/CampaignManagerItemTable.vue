<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :refName="'campaignManagerItemTable'"
    :loading="isLoading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :stored-table-settings="storedTableSettings"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="tableOptions.rowActions"
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
    <template #table-search-left-side>
      <v-btn
        id="btn-back--compaign-manager-clustered-table"
        text
        color="#2196f3"
        class="clustered-table-back-btn"
        @click="handleBackClick"
      >
        <v-icon left>mdi-arrow-left</v-icon> {{ labels.Back }}</v-btn
      >
    </template>
    <template #datatable-row-actions="{ scope }">
      <CampaignManagerItemRowActions :scope="scope" :row-actions="tableOptions.rowActions" />
    </template>
    <template #table-all-records>
      <div class="campaign-manager__table-all-records">
        {{ labels.InstancesOfCampaign }}: Gürkan
      </div>
    </template>
  </DataTable>
</template>

<script>
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from '@/components/CampaignManager/utils'
import labels from '@/model/constants/labels'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CampaignManagerItemRowActions from '@/components/CampaignManager/CampaignManagerItemRowActions'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_BACK_CLICK: 'on-back-click'
}
export default {
  name: 'CampaignManagerItemTable',
  components: { CampaignManagerItemRowActions, DataTable },
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
      labels,
      CONSTANTS: {
        id: 'campaign-manager-parent-data-table',
        ascending: 'ascending'
      },
      tableData: [],
      storedTableSettings: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        isColumnFilterActive: false,
        columns: [COLUMNS.SCHEDULE, COLUMNS.TARGET_USERS, COLUMNS.STATUS, COLUMNS.CREATE_TIME],
        iEmpty: {
          message: labels.EmptyCampaignManager,
          btn: labels.New,
          id: 'btn-empty--campaign-manager',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: labels.Stop,
            id: 'btn-stop--row-actions-campaign-item-manager',
            icon: 'mdi-stop',
            action: 'on-stop'
          },
          {
            name: labels.Delete,
            id: 'btn-delete--row-actions-campaign-manager',
            icon: 'mdi-delete',
            action: 'on-delete'
          }
        ]
      }
    }
  },
  created() {
    this.getStoredTableSettings()
    this.setDefaultFilter()
    this.tableData = [
      {
        resourceId: 'askjajsajsajs',
        name: 'Gurkan',
        total: 5,
        actionStatus: 'paused'
      },
      {
        resourceId: 'askjzsassaajsajsajs',
        name: 'Gurkan2',
        total: 1,
        actionStatus: 'launch'
      }
    ]
  },
  methods: {
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE)
      )
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE)
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
        DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE,
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
        TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE,
        JSON.stringify(tableSettings)
      )
    },
    handleBackClick() {
      this.$emit(EMITS.ON_BACK_CLICK)
    }
  }
}
</script>
