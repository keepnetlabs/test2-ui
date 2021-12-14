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
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :download-button="tableOptions.downloadButton"
    @on-add-button-click="toggleAddCampaignManagerModal"
    @onEmptyBtnClicked="toggleAddCampaignManagerModal"
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
    @downloadEvent="exportCampaignManagerList"
    @refreshAction="callForData"
  >
    <template v-slot:datatable-custom-column="{ scope, col }">
      <template v-if="scope.column.property === 'name'">
        <div class="reported-email-subject__container">
          <div class="reported-email-subject">
            <span> {{ scope.row[col.property] }}</span>
          </div>
          <TheRecordsButton
            label="instance"
            :index="scope.$index"
            :row="scope.row"
            :disabled-count="0"
            @on-click="handleRecordButtonClick"
          />
        </div>
      </template>
    </template>
    <template #datatable-row-actions="{ scope }">
      <CampaignManagerRowActions
        :PERMISSIONS="PERMISSIONS"
        :scope="scope"
        :row-actions="tableOptions.rowActions"
        @on-edit="handleEdit"
        @on-preview="handlePreview"
        @on-delete="handleDelete"
        @on-duplicate="handleDuplicate"
        @on-pause="handlePause"
        @on-run="handleRun"
        @on-stop="handleStop"
        @on-launch="handleLaunch"
      />
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
import CampaignManagerRowActions from '@/components/CampaignManager/CampaignManagerRowActions'
import { exportCampaignManager, searchCampaignManager } from '@/api/phishingsimulator'
import QueryHelperForTable from '@/helper-classes/query-helper'
import { getDefaultFilter } from '@/utils/functions'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axios-payload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_RECORD_BUTTON_CLICK: 'on-record-button-click',
  ON_EDIT: 'on-edit',
  ON_PREVIEW: 'on-preview',
  ON_DELETE: 'on-delete',
  ON_DUPLICATE: 'on-duplicate',
  ON_PAUSE: 'on-pause',
  ON_RUN: 'on-run',
  ON_STOP: 'on-stop',
  ON_LAUNCH: 'on-launch'
}

export default {
  name: 'CampaignManagerParentTable',
  components: { TheRecordsButton, DataTable, CampaignManagerRowActions },
  props: {
    axiosPayload: {
      type: Object
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    PERMISSIONS: {
      type: Object
    },
    statusItems: {
      type: Array
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
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.CAMPAIGN_NAME,
          COLUMNS.TARGET_USERS,
          COLUMNS.CREATEDBY,
          COLUMNS.STATUS,
          COLUMNS.CREATE_TIME,
          COLUMNS.LAST_LAUNCH
        ],
        iEmpty: {
          message: labels.EmptyCampaignManager,
          btn: labels.New,
          action: 'on-add-button-click',
          id: 'btn-empty--campaign-manager',
          icon: 'mdi-plus',
          disabled: !this.PERMISSIONS.CREATE.hasPermission
        },
        addButton: {
          show: true,
          action: 'on-add-button-click',
          tooltip: 'Add a Campaign',
          id: 'btn-add--campaign-manager',
          disabled: !this.PERMISSIONS.CREATE.hasPermission
        },
        downloadButton: {
          show: true,
          disabled: !this.PERMISSIONS.EXPORT.hasPermission
        },
        rowActions: [
          {
            name: labels.Preview,
            id: 'btn-preview--row-actions-campaign-manager',
            icon: 'mdi-eye',
            action: 'on-preview',
            disabled: !this.PERMISSIONS.GET.hasPermission
          },
          {
            name: labels.Duplicate,
            id: 'btn-duplicate--row-actions-campaign-manager',
            icon: 'mdi-content-copy',
            action: 'on-duplicate',
            disabled: !this.PERMISSIONS.GET.hasPermission
          },
          {
            name: labels.Delete,
            id: 'btn-delete--row-actions-campaign-manager',
            icon: 'mdi-delete',
            action: 'on-delete',
            disabled: !this.PERMISSIONS.DELETE.hasPermission
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
    this.setQueryValues()
    this.setDefaultFilter()
    this.callForData()
  },
  methods: {
    getStoredTableSettings() {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE)
      )
    },
    setQueryValues() {
      this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
      this.queryHelper.setDefaultValues()
      this.queryHelper.controlRouteQuery()
      const { page, size } = this.queryHelper.returnQueryValues()
      this.axiosPayload.pageSize = size
      this.serverSideProps.pageSize = size
      this.axiosPayload.pageNumber = page
    },
    setDefaultFilter() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE)
      )
      if (!savedFilter || !savedFilter.filter.FilterGroups[0].FilterItems.length) return
      const {
        filter = JSON.parse(JSON.stringify(getDefaultFilter().filter)),
        filterValues
      } = savedFilter
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter = filter
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.tableOptions.isColumnFilterActive = true
      this.$nextTick(() => {
        this.$refs.refTable.reRenderColumns(filterValues)
      })
    },
    callForData() {
      const { SEARCH } = this.PERMISSIONS
      if (SEARCH.hasPermission) {
        this.$nextTick(() => {
          this.setLoading(true)
          searchCampaignManager(this.axiosPayload)
            .then((response) => {
              const {
                data: { data = [] }
              } = response
              const { results = [], totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
              this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
              this.serverSideProps.totalNumberOfPages = totalNumberOfPages
              this.serverSideProps.pageNumber = pageNumber
              this.tableData = results.map((item) => {
                const newItem = JSON.parse(JSON.stringify(item))
                delete newItem['instanceCount']
                newItem.targetUsers = Number(newItem.targetUsers)
                newItem.total = Number(item['instanceCount'])
                return newItem
              })
            })
            .finally(this.setLoading)
        })
      }
    },
    setLoading(flag = false) {
      this.$emit('update:is-loading', flag)
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
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.ascending = order === this.CONSTANTS.ascending
      copyOfAxiosPayload.orderBy = prop
      this.emitCopyOfAxiosPayload(copyOfAxiosPayload)
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
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
      const copyOfAxiosPayload = this.copyAxiosPayload()
      copyOfAxiosPayload.filter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE,
        JSON.stringify({
          filter: copyOfAxiosPayload.filter,
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
    },
    toggleAddCampaignManagerModal() {
      this.$emit('toggle-add-campaign-manager-modal')
    },
    exportCampaignManagerList(downloadTypes) {
      const { EXPORT } = this.PERMISSIONS
      if (EXPORT.hasPermission) {
        downloadTypes.exportTypes.forEach((item) => {
          let payload = {
            pageNumber: downloadTypes.pageNumber,
            pageSize: downloadTypes.pageSize,
            orderBy: this.axiosPayload.orderBy,
            ascending: this.axiosPayload.ascending,
            reportAllPages: downloadTypes.reportAllPages,
            exportType: item === 'XLS' ? 'Excel' : item,
            filter: this.axiosPayload.filter
          }
          exportCampaignManager(payload).then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Campaign-Manager.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          })
        })
      }
    },
    handleEdit(row) {
      this.$emit(EMITS.ON_EDIT, row)
    },
    handlePreview(row) {
      this.$emit(EMITS.ON_PREVIEW, row)
    },
    handleDelete(row) {
      this.$emit(EMITS.ON_DELETE, row)
    },
    handleDuplicate(row) {
      this.$emit(EMITS.ON_DUPLICATE, row)
    },
    handlePause(row) {
      this.$emit(EMITS.ON_PAUSE, row)
    },
    handleRun(row) {
      this.$emit(EMITS.ON_RUN, row)
    },
    handleStop(row) {
      this.$emit(EMITS.ON_STOP, row)
    },
    handleLaunch(row) {
      this.$emit(EMITS.ON_LAUNCH, row)
    }
  }
}
</script>
