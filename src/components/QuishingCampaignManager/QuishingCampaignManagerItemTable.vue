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
      <template #datatable-custom-column="{ scope, col }">
        <template v-if="scope.column.property === 'frequencyDescription'">
          <div class="reported-email-subject__container">
            <div class="reported-email-subject">
              <span> {{ scope.row[col.property] }}</span>
            </div>
            <TheRecordsButton
              label="recurrence"
              width="150px"
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
          v-if="!isQuishingTypePrintout"
          :type="SCENARIO_TYPES.QUISHING"
          :campaign-resource-id="item.resourceId"
          :scope="scope"
          :row-actions="tableOptions.rowActions"
          @on-delete="handleDelete"
          @on-stop="handleStop"
          @on-launch="handleLaunch"
        />
        <template v-else>
          <DefaultButtonRowAction
            :scope="scope"
            :check-is-owner-property="false"
            icon="mdi-download"
            text="Download"
            @on-click="handleDownload(scope.row)"
          />
          <RowActionsMenu>
            <DefaultMenuRowAction
              :scope="scope"
              :check-is-owner-property="false"
              icon="mdi-text-box"
              text="View Report"
              @on-click="handleViewReport(scope.row)"
            />
            <DefaultMenuRowAction
              :scope="scope"
              :check-is-owner-property="false"
              icon="mdi-delete"
              text="Delete"
              @on-click="handleDelete(scope.row)"
            />
          </RowActionsMenu>
        </template>
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
import CampaignManagerItemRowActions from '@/components/CampaignManager/CampaignManagerItemRowActions'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import Badge from '@/components/Badge'
import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton.vue'
import QuishingService from '@/api/quishing'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_BACK_CLICK: 'on-back-click',
  ON_RECORD_BUTTON_CLICK: 'on-record-button-click'
}

export default {
  name: 'QuishingCampaignManagerItemTable',
  components: {
    RowActionsMenu,
    DefaultMenuRowAction,
    DefaultButtonRowAction,
    TheRecordsButton,
    Badge,
    CampaignManagerItemDeleteDialog,
    CampaignManagerItemRowActions,
    DataTable
  },
  props: {
    item: {
      type: Object
    },
    statusItems: {
      type: Array
    },
    isQuishingTypePrintout: {
      type: Boolean,
      default: false
    }
  },
  emits: EMITS,
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      SCENARIO_TYPES,
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
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.QUISHING_CAMPAIGN_MANAGER_ITEM_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.QUISHING_CAMPAIGN_MANAGER_ITEM_TABLE,
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
          message: labels.EmptyCampaignManagerReport,
          id: 'btn-empty--campaign-manager-report'
        },
        addButton: {
          show: true,
          action: 'on-add-button-click',
          tooltip: 'Add a Campaign',
          id: 'btn-add--item-campaign-manager',
          disabled: !this.$store.getters[
            'permissions/getQuishingCampaignManagerParentCreatePermissions'
          ]
        },
        rowActions: [
          {
            name: labels.Stop,
            isNotShow: true,
            id: 'btn-stop--row-actions-campaign-item-manager',
            icon: 'mdi-stop',
            action: 'on-stop'
          },
          {
            name: labels.Delete,
            id: 'btn-delete--row-actions-campaign-manager',
            icon: 'mdi-delete',
            action: 'on-delete',
            disabled: !this.$store.getters[
              'permissions/getQuishingCampaignReportsDeletePermissions'
            ]
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  computed: {
    getTableAllRecordsText() {
      return `${labels.InstancesOfCampaign}: ${this?.item?.name}`
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
        this.reRenderFilters()
      }
    },
    isQuishingTypePrintout: {
      immediate: true,
      handler(val) {
        if (val) {
          this.tableOptions.columns = [
            COLUMNS.START_TIME,
            COLUMNS.TARGET_USERS_ITEM_TABLE,
            COLUMNS.CREATE_TIME_ITEM_TABLE
          ]
          this.tableOptions.rowActions = [
            {
              name: labels.Download,
              isNotShow: true,
              id: 'btn-download--row-actions-campaign-item-manager',
              icon: 'mdi-download',
              action: 'on-download'
            },
            {
              name: labels.Stop,
              isNotShow: true,
              id: 'btn-stop--row-actions-campaign-item-manager',
              icon: 'mdi-stop',
              action: 'on-stop'
            },
            {
              name: labels.Delete,
              id: 'btn-delete--row-actions-campaign-manager',
              icon: 'mdi-delete',
              action: 'on-delete',
              disabled: !this.$store.getters[
                'permissions/getQuishingCampaignReportsDeletePermissions'
              ]
            }
          ]
        } else {
          this.tableOptions.columns = [
            COLUMNS.FREQUENCY,
            COLUMNS.START_TIME,
            COLUMNS.TARGET_USERS_ITEM_TABLE,
            COLUMNS.STATUS,
            COLUMNS.CREATE_TIME_ITEM_TABLE
          ]
          this.tableOptions.rowActions = [
            {
              name: labels.Stop,
              isNotShow: true,
              id: 'btn-stop--row-actions-campaign-item-manager',
              icon: 'mdi-stop',
              action: 'on-stop'
            },
            {
              name: labels.Delete,
              id: 'btn-delete--row-actions-campaign-manager',
              icon: 'mdi-delete',
              action: 'on-delete',
              disabled: !this.$store.getters[
                'permissions/getQuishingCampaignReportsDeletePermissions'
              ]
            }
          ]
        }
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
        QuishingService.searchCampaignQuishingJob(this.axiosPayload, this.item.resourceId)
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
        QuishingService.exportCampaignManagerItem(payload, this.item.resourceId).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Campaign-Manager-Instance.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        )
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
      QuishingService.deleteQuishingCampaignJob(this.item.resourceId, item.instanceGroup)
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
      QuishingService.stopQuishingCampaignJob(this.item.resourceId, row.instanceGroup).then(() => {
        this.callForData()
      })
    },
    handleLaunch(row = {}) {
      QuishingService.launchQuishingCampaignInstanceGroup(
        this.item.resourceId,
        row.instanceGroup
      ).then(() => {
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
    },
    handleDownload(row) {
      QuishingService.getQuishingPdfCampaignDownloadContent(
        this.item.resourceId,
        row.instanceGroup
      ).then((response) => {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(response.data)
        link.download = `Quishing PDF Preview.pdf`
        link.click()
      })
    },
    handleViewReport(row) {
      this.$router.push({
        name: 'Quishing Report',
        params: { id: this.item.resourceId, instanceGroup: row.instanceGroup }
      })
    }
  }
}
</script>
