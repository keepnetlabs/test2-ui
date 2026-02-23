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
    <AlertBox
      v-if="canRenderAlertBox"
      class="bg-aqua-light mb-4"
      icon-color="#2196F3"
      icon-name="mdi-information"
      text="You don’t have any remaining Callback phone numbers. Please wait until your active campaigns are completed. Also you can get in touch with us for purchasing more numbers."
      :slots="{ primaryAction: false, secondaryAction: false }"
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
      @refreshAction="callForAvailableNumbers"
      @downloadEvent="exportCampaignManagerItemList"
    >
      <template #datatable-custom-column="{ scope, col }">
        <template v-if="scope.column.property === 'frequencyDescription'">
          <div class="reported-email-subject__container">
            <div class="reported-email-subject">
              <span> {{ scope.row[col.property] }}</span>
            </div>
            <TheRecordsButton
              label="recurrence"
              plural-label="recurrences"
              single-label="View Report"
              zero-label="No Recurrence"
              width="150px"
              variant="primary"
              :index="scope.$index"
              :row="scope.row"
              :disabled-count="0"
              :is-show-button-with-zero-total="false"
              @on-click="handleRecordButtonClick"
            />
          </div>
        </template>
        <div
          v-if="scope.column.property === 'status'"
          class="campaign-manager-item-table__status-column"
        >
          <v-tooltip bottom :disabled="getTooltipDisabilityStatus(scope.row)">
            <template #activator="{ on }">
              <v-btn style="display: none;" />
              <Badge
                v-bind="getStatusBadgeProps(scope.row.status)"
                :listeners="on"
                size="medium"
                :col="col"
              />
            </template>
            <span>{{ getErrorMessage(scope.row) }}</span>
          </v-tooltip>
        </div>
      </template>
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
          :campaign-resource-id="item.resourceId"
          :scope="scope"
          :row-actions="tableOptions.rowActions"
          @on-delete="handleDelete"
          @on-stop="handleStop"
          @on-launch="handleLaunch"
        />
      </template>
      <template #table-all-records>
        <div class="campaign-manager__table-all-records">
          {{ getTableAllRecordsText }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS, getStatusBadgeProps } from '@/components/CampaignManager/utils'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import DataTable from '@/components/DataTable'
import CampaignManagerItemRowActions from '@/components/CallbackCampaignManager/CampaignManagerItemRowActions'
import CallbackService from '@/api/callback'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import Badge from '@/components/Badge'
import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton.vue'
import AlertBox from '@/components/AlertBox'

const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_BACK_CLICK: 'on-back-click',
  ON_RECORD_BUTTON_CLICK: 'on-record-button-click'
}
export default {
  name: 'CampaignManagerItemTable',
  components: {
    TheRecordsButton,
    Badge,
    CampaignManagerItemDeleteDialog,
    CampaignManagerItemRowActions,
    DataTable,
    AlertBox
  },
  props: {
    item: {
      type: Object
    },
    statusItems: {
      type: Array
    }
  },
  emits: EMITS,
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      availablePhoneNumbers: 0,
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
          COLUMNS.FREQUENCY,
          COLUMNS.START_TIME,
          COLUMNS.TARGET_USERS_ITEM_TABLE,
          COLUMNS.STATUS,
          COLUMNS.CREATE_TIME_ITEM_TABLE
        ],
        iEmpty: {
          message: `You do not have any Campaign Instances`,
          id: 'btn-empty--campaign-manager-report'
        },
        addButton: {
          show: true,
          action: 'on-add-button-click',
          tooltip: 'Add a Campaign',
          id: 'btn-add--item-campaign-manager',
          disabled: !this.$store.getters['permissions/getCallbackCampaignCreatePermissions']
        },
        rowActions: [
          {
            name: labels.Stop,
            isNotShow: true,
            id: 'btn-stop--row-actions-campaign-item-manager',
            icon: 'mdi-stop',
            action: 'on-stop',
            disabled: !this.$store.getters['permissions/getCallbackCampaignJobStopPermissions']
          },
          {
            name: labels.Delete,
            id: 'btn-delete--row-actions-campaign-manager',
            icon: 'mdi-delete',
            action: 'on-delete',
            disabled: !this.$store.getters['permissions/getCallbackCampaignJobDeletePermissions']
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  computed: {
    getTableAllRecordsText() {
      return `${labels.CampaignName}: ${this?.item?.name}`
    },
    canRenderAlertBox() {
      return !this.isLoading && this.availablePhoneNumbers === 0
    }
  },
  watch: {
    statusItems: {
      deep: true,
      immediate: true,
      handler(val) {
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
    }
  },
  created() {
    this.callForAvailableNumbers()
  },
  methods: {
    callForAvailableNumbers(params = {}) {
      this.setLoading(true)
      CallbackService.getUsedCallbackNumbers()
        .then((res) => {
          const { companyCount = 0, usedCount = 0 } = res.data.data
          this.availablePhoneNumbers = companyCount - usedCount
          if (this.availablePhoneNumbers === 0) {
            this.tableOptions.addButton.disabled = true
            this.tableOptions.addButton.tooltip =
              'You can’t create a new campaign unless you have an available Callback phone number'
          }
        })
        .finally(() => this.callForData({ isInitial: params.isInitial }))
    },
    callForData(params = {}) {
      if (!params.isInitial) {
        this.setLoading(true)
      }
      this.$nextTick(() => {
        CallbackService.searchCallbackJobs(this.item.resourceId, this.axiosPayload)
          .then((response) => {
            const {
              data: { data = [] }
            } = response
            const { results = [], totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            this.tableData = results
            this.tableData = results.map((item) => {
              const newItem = JSON.parse(JSON.stringify(item))
              delete newItem['frequencyCount']
              newItem.total = Number(item['frequencyCount']) || 0
              return newItem
            })
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
        CallbackService.exportCallbackJobs(this.item.resourceId, payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Callback-Campaign-Instances.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
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
      CallbackService.deleteCallbackJob(this.item.resourceId, item.instanceGroup)
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
      CallbackService.stopCallbackCampaignJob(this.item.resourceId, row.instanceGroup).then(() => {
        this.callForData()
      })
    },
    handleLaunch(row = {}) {
      CallbackService.startCallbackCampaignJob(this.item.resourceId, row.instanceGroup).then(() => {
        this.callForData()
      })
    },
    getErrorMessage(row = {}) {
      if (row.status === 'Error') {
        return row?.jobResultMessage || ''
      }
      return ''
    },
    getStatusBadgeProps(status = '') {
      return getStatusBadgeProps(status)
    },
    getTooltipDisabilityStatus(row = {}) {
      return row?.status !== 'Error' || !row?.jobResultMessage
    },
    handleRecordButtonClick(row) {
      this.$emit(EMITS.ON_RECORD_BUTTON_CLICK, row)
    },
    reRenderFilters(filterValues = undefined) {
      this?.$refs?.refTable?.reRenderFilters(filterValues)
    },
    resetSearchText() {
      this.$refs.refTable.resetSearchText()
    },
    resetTable() {
      this.resetSearchText()
      this.reRenderFilters({})
      this.axiosPayload = getDefaultAxiosPayload({
        orderBy: 'CreatedDate'
      })
    }
  }
}
</script>
