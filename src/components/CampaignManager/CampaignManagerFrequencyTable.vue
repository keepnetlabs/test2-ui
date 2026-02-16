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
        <div class="campaign-manager-item-table__status-column">
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
          :campaign-resource-id="parentResourceId"
          :scope="scope"
          :row-actions="tableOptions.rowActions"
          @on-delete="handleDelete"
          @on-stop="handleStop"
          @on-launch="handleLaunch"
        />
      </template>
      <template #table-all-records>
        <div class="campaign-manager__table-all-records">
          {{ labels.RecurrencesOfInstance }}: {{ item.frequencyDescription }}
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
import {
  deletePhishingCampaignJob,
  exportCampaignManagerItem,
  searchCampaignPhishingJob
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerItemDeleteDialog from '@/components/CampaignManager/CampaignManagerItemDeleteDialog'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import Badge from '@/components/Badge'
const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axiosPayload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_BACK_CLICK: 'on-back-click'
}
export default {
  name: 'CampaignManagerItemTable',
  components: {
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
    parentResourceId: {
      type: String
    }
  },
  emits: EMITS,
  mixins: [useLoading, useDefaultTableFunctions],
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
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_FREQUENCY_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_FREQUENCY_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.SCHEDULE,
          {
            ...COLUMNS.TARGET_USERS_ITEM_TABLE,
            width: 240,
            showHeaderTooltip: true,
            headerTooltip: 'Number of users in the most recent recurrence of this instance.',
            headerTooltipIcon: 'mdi-information-outline',
            headerTooltipIconColor: '#757575'
          },
          {
            ...COLUMNS.STATUS,
            width: 240,
            showHeaderTooltip: true,
            headerTooltip: 'Current status of the most recent recurrence of this instance.',
            headerTooltipIcon: 'mdi-information-outline',
            headerTooltipIconColor: '#757575'
          },
          COLUMNS.CREATE_TIME_ITEM_TABLE
        ],
        iEmpty: {
          message: labels.EmptyCampaignManagerReport,
          id: 'btn-empty--campaign-manager-report'
        },
        addButton: {
          show: false
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
        searchCampaignPhishingJob(
          {
            ...this.axiosPayload,
            phishingCampaignFrequencyGroup: this.item.frequencyGroup
          },
          this.parentResourceId
        )
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
          filter: this.axiosPayload.filter,
          phishingCampaignFrequencyGroup: this.item.frequencyGroup
        }
        exportCampaignManagerItem(payload, this.parentResourceId).then((response) => {
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
    handleBackClick() {
      this.$emit(EMITS.ON_BACK_CLICK)
    },
    handleOnAddButtonClick() {
      this.$emit('on-launch', { resourceId: this.parentResourceId })
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
      deletePhishingCampaignJob(this.parentResourceId, item.instanceGroup)
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
      this.$emit('on-stop', {
        resourceId: this.parentResourceId,
        instanceGroup: row.instanceGroup
      })
    },
    handleLaunch(row = {}) {
      this.$emit('on-start', {
        resourceId: this.parentResourceId,
        instanceGroup: row.instanceGroup
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
    }
  }
}
</script>
