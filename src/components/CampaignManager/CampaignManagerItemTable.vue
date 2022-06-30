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
      :loading="isLoading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :server-side-props="serverSideProps"
      :server-side-events="tableOptions.serverSideEvents"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :add-button="tableOptions.addButton"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @on-add-button-click="handleOnAddButtonClick"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @refreshAction="callForData"
      @downloadEvent="exportCampaignManagerItemList"
    >
      <template #table-search-left-side>
        <v-btn
          id="btn-back--campaign-manager-clustered-table"
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
          @on-launch="handleLaunch"
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
  exportCampaignManagerItem,
  launchPhishingCampaign,
  pausePhishingCampaignJob,
  resumePhishingCampaignJob,
  searchCampaignPhishingJob,
  stopPhishingCampaignJob
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog'
import { getDefaultAxiosPayload } from '@/utils/functions'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_BACK_CLICK: 'on-back-click'
}
export default {
  name: 'CampaignManagerItemTable',
  components: { CampaignManagerItemDeleteDialog, CampaignManagerItemRowActions, DataTable },
  props: {
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
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'CreatedDate' }),
      CONSTANTS: {
        id: 'campaign-manager-item-data-table',
        ascending: 'ascending'
      },
      tableData: [],
      selectedRow: {},
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
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
          id: 'btn-add--item-campaign-manager',
          disabled: !this.$store.getters['permissions/getCampaignManagerParentCreatePermissions']
        },
        rowActions: [
          {
            name: labels.Stop,
            isNotShow: true,
            id: 'btn-stop--row-actions-campaign-item-manager',
            icon: 'mdi-stop',
            action: 'on-stop',
            disabled: !this.$store.getters['permissions/getCampaignReportsPausePermissions']
          },
          {
            name: labels.Delete,
            id: 'btn-delete--row-actions-campaign-manager',
            icon: 'mdi-delete',
            action: 'on-delete',
            disabled: !this.$store.getters['permissions/getCampaignReportsDeletePermissions']
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
        this?.$refs?.refTable?.reRenderFilters()
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
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
            this.tableData = results
          })
          .finally(this.setLoading)
      })
    },
    exportCampaignManagerItemList(downloadTypes = []) {
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
        exportCampaignManagerItem(payload, this.item.resourceId).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Campaign-Manager-Instance.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    columnFilterChanged(filter) {
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
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
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
    handleBackClick() {
      this.$emit(EMITS.ON_BACK_CLICK)
    },
    handleOnAddButtonClick() {
      this.$emit('on-launch', { resourceId: this.item.resourceId })
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
    handleOnDelete(item = {}) {
      this.isDeleteDialogActionButtonDisabled = true
      deletePhishingCampaignJob(item.resourceId)
        .then(() => {
          this.$refs.refTable.unSelectRow(item)
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
    },
    handleLaunch(row = {}) {
      launchPhishingCampaign(row.resourceId).then(() => {
        this.callForData()
      })
    }
  }
}
</script>
<style lang="scss">
#campaign-manager-item-data-table {
  .table-header-disable {
    opacity: 1;
    pointer-events: visible;
    * {
      opacity: 0.85;
      pointer-events: none;
    }
    #btn-back--campaign-manager-clustered-table {
      pointer-events: visible;
      opacity: 1;
    }
  }
  .selection-row {
    top: 131px;
  }
}
</style>
