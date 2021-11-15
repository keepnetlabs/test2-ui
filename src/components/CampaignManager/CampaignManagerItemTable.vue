<template>
  <div>
    <CampaignManagerItemDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :item="selectedRow"
      :is-action-button-disabled="isDeleteDialogActionButtonDisabled"
      @on-close="toggleShowDeleteDialog"
      @on-delete="handleOnDelete"
    />
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
      :add-button="tableOptions.addButton"
      @on-add-button-click="toggleAddCampaignManagerModal"
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
        <CampaignManagerItemRowActions
          :scope="scope"
          :row-actions="tableOptions.rowActions"
          @on-delete="handleDelete"
          @on-stop="handleStop"
        />
      </template>
      <template #table-all-records>
        <div class="campaign-manager__table-all-records">
          {{ labels.InstancesOfCampaign }}: {{ item.name }}
        </div>
      </template>
    </DataTable>
  </div>
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
import {
  deletePhishingCampaignJob,
  searchCampaignPhishingJob,
  stopPhishingCampaignJob
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_BACK_CLICK: 'on-back-click'
}
export default {
  name: 'CampaignManagerItemTable',
  components: { CampaignManagerItemDeleteDialog, CampaignManagerItemRowActions, DataTable },
  props: {
    axiosPayload: {
      type: Object
    },
    item: {
      type: Object
    },
    statusItems: {
      type: Array
    }
  },
  emits: EMITS,
  mixins: [useLoading],
  data() {
    return {
      labels,
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      CONSTANTS: {
        id: 'campaign-manager-parent-data-table',
        ascending: 'ascending'
      },
      tableData: [],
      selectedRow: {},
      storedTableSettings: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          COLUMNS.SCHEDULE,
          COLUMNS.TARGET_USERS_ITEM_TABLE,
          COLUMNS.STATUS,
          COLUMNS.CREATE_TIME_ITEM_TABLE
        ],
        iEmpty: {
          message: labels.EmptyCampaignManagerReport,
          id: 'btn-empty--campaign-manager-report'
        },
        addButton: {
          show: true,
          action: 'on-add-button-click',
          tooltip: 'Add a Campaign',
          id: 'btn-add--item-campaign-manager'
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
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  watch: {
    statusItems(val) {
      if (val.length) {
        const col = this.tableOptions.columns.find(
          (col) => col.property === COLUMNS.STATUS.property
        )
        this.$set(
          col,
          'filterableItems',
          val.map((item) => {
            return { ...item, value: item.text }
          })
        )
        this.$nextTick(() => {
          this.$refs.refTable.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
        })
      }
    }
  },
  created() {
    this.getStoredTableSettings()
    this.setDefaultFilter()
    this.callForData()
  },
  methods: {
    callForData() {
      console.log('this.axiosPayload', this.axiosPayload)
      this.setLoading(true)
      this.$nextTick(() => {
        searchCampaignPhishingJob(this.axiosPayload, this.item.resourceId)
          .then((response) => {
            const {
              data: { data = [] }
            } = response
            const { results = [], totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            results[0].status = 'Completed'
            results[1].status = 'Running'
            results[2].status = 'Paused'
            results[3].status = 'Canceled'
            this.tableData = results
          })
          .finally(this.setLoading)
      })
    },
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
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        copyOfAxiosPayload
      )
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
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
      this.axiosPayload.pageNumber = 1
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
      console.log('copyOfAxiosPayload', copyOfAxiosPayload)
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
    },
    toggleAddCampaignManagerModal() {
      this.$emit('toggle-add-campaign-manager-modal')
    },
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = {}
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleDelete(row = {}) {
      this.selectedRow = row
      this.toggleShowDeleteDialog()
    },
    handleOnDelete(resourceId) {
      this.isDeleteDialogActionButtonDisabled = true
      deletePhishingCampaignJob(resourceId)
        .then(() => {
          this.callForData()
        })
        .finally(() => {
          this.isDeleteDialogActionButtonDisabled = false
          this.toggleShowDeleteDialog()
        })
    },
    handleStop(row = {}) {
      stopPhishingCampaignJob(row.resourceId).then(() => {
        this.callForData()
      })
    }
  }
}
</script>
