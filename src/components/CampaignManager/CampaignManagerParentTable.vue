<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @on-add-button-click="toggleAddCampaignManagerModal"
    @onEmptyBtnClicked="toggleAddCampaignManagerModal"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @downloadEvent="exportCampaignManagerList"
    @refreshAction="callForData"
    @handleMultipleDelete="handleMultipleDeleteOfCampaigns"
  >
    <template #datatable-custom-column="{ scope, col }">
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
      <template v-if="scope.column.property === 'status'">
        <div class="campaign-manager-parent-table__status-column">
          <v-tooltip bottom :disabled="getTooltipDisabilityStatus(scope.row)">
            <template v-slot:activator="{ on }">
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
      <template v-if="scope.column.property === 'method'">
        <v-tooltip v-if="scope.row[col.property] === METHOD_TYPES.MULTIPLE_METHOD" bottom>
          <template #activator="{ on }">
            <span v-on="on">
              {{ scope.row[col.property] }}
            </span>
          </template>
          <div
            v-for="(methodWrapper, index) in getMethodDetail(scope.row.methodDetail)"
            :key="index"
          >
            {{ methodWrapper.method }} ({{ methodWrapper.count }})
          </div>
        </v-tooltip>
        <span v-else> {{ scope.row[col.property] }}</span>
      </template>
    </template>
    <template #datatable-row-actions="{ scope }">
      <CampaignManagerRowActions
        :scope="scope"
        :row-actions="tableOptions.rowActions"
        :isNewInstanceDisabled="
          scope.row.categoryDistributionType !== SCENARIO_DISTRIBUTION_TEXTS[0] &&
          scope.row.frequency !== 0
        "
        @on-edit="handleEdit"
        @on-preview="handlePreview"
        @on-delete="handleDelete"
        @on-duplicate="handleDuplicate"
        @on-launch="handleLaunch"
      />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS, getStatusBadgeProps, METHOD_TYPES } from '@/components/CampaignManager/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton'
import labels from '@/model/constants/labels'
import CampaignManagerRowActions from '@/components/CampaignManager/CampaignManagerRowActions'
import { exportCampaignManager, searchCampaignManager } from '@/api/phishingsimulator'
import { mapGetters } from 'vuex'
import { getDefaultAxiosPayload, getDataTableFieldLabel } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import Badge from '@/components/Badge'
import { SCENARIO_DISTRIBUTION_TEXTS } from '@/components/CampaignManager/utils'

const EMITS = {
  UPDATE_AXIOS_PAYLOAD: 'update:axios-payload',
  RESET_AXIOS_PAYLOAD: 'reset-axios-payload',
  ON_RECORD_BUTTON_CLICK: 'on-record-button-click',
  ON_EDIT: 'on-edit',
  ON_PREVIEW: 'on-preview',
  ON_DELETE: 'on-delete',
  ON_DUPLICATE: 'on-duplicate',
  ON_LAUNCH: 'on-launch'
}

export default {
  name: 'CampaignManagerParentTable',
  components: { TheRecordsButton, DataTable, CampaignManagerRowActions, Badge },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    statusItems: {
      type: Array
    }
  },
  emits: EMITS,
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      SCENARIO_DISTRIBUTION_TEXTS,
      METHOD_TYPES,
      CONSTANTS: {
        id: 'campaign-manager-parent-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_PARENT_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        columns: [
          COLUMNS.CAMPAIGN_NAME,
          COLUMNS.TARGET_USERS,
          COLUMNS.STATUS,
          COLUMNS.SCENARIO_COUNT,
          COLUMNS.SCENARIO_DISTRIBUTION,
          COLUMNS.METHOD,
          COLUMNS.HAS_TRAINING,
          COLUMNS.CREATEDBY,
          COLUMNS.EMAIL_DELIVERY,
          COLUMNS.CREATE_TIME,
          COLUMNS.LAST_LAUNCH
        ],
        iEmpty: {
          message: labels.EmptyCampaignManager,
          btn: labels.New,
          action: 'on-add-button-click',
          id: 'btn-empty--campaign-manager',
          icon: 'mdi-plus',
          disabled: !this.$store.getters['permissions/getCampaignManagerParentCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'on-add-button-click',
          tooltip: 'Add a Campaign',
          id: 'btn-add--campaign-manager',
          disabled: !this.$store.getters['permissions/getCampaignManagerParentCreatePermissions']
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getCampaignManagerParentExportPermissions']
        },
        rowActions: [
          {
            name: labels.Preview,
            id: 'btn-preview--row-actions-campaign-manager',
            icon: 'mdi-eye',
            action: 'on-preview'
          },
          {
            name: labels.Duplicate,
            id: 'btn-duplicate--row-actions-campaign-manager',
            icon: 'mdi-content-copy',
            action: 'on-duplicate'
          },
          {
            name: labels.Delete,
            id: 'btn-delete--row-actions-campaign-manager',
            icon: 'mdi-delete',
            action: 'on-delete',
            disabled: !this.$store.getters['permissions/getCampaignManagerParentDeletePermissions']
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  computed: {
    ...mapGetters({
      getCampaignManagerParentSearchPermissions:
        'permissions/getCampaignManagerParentSearchPermissions',
      getCampaignManagerParentExportPermissions:
        'permissions/getCampaignManagerParentExportPermissions'
    })
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
  mounted() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (this.getCampaignManagerParentSearchPermissions) {
        this.setLoading(true)
        searchCampaignManager(this.axiosPayload)
          .then((response) => {
            const {
              data: { data = {} }
            } = response
            const {
              results = [],
              totalNumberOfRecords = 0,
              totalNumberOfPages = 0,
              pageNumber = 1
            } = data
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
      }
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      const scenarioDistributionColumnIndex = this.axiosPayload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'CategoryDistributionType'
      )
      if (scenarioDistributionColumnIndex !== -1) {
        this.axiosPayload.filter.FilterGroups[1].FilterItems[
          scenarioDistributionColumnIndex
        ].FieldName = 'ScenarioDistribution'
      }
      this.resetPageNumber()
      this.callForData()
    },
    getMethodDetail(methodDetail = {}) {
      if (!methodDetail) return {}
      try {
        return JSON.parse(methodDetail)
      } catch (e) {
        return {}
      }
    },
    setLoading(flag = false) {
      this.$emit('update:is-loading', flag)
    },
    handleRecordButtonClick(row) {
      this.$emit(EMITS.ON_RECORD_BUTTON_CLICK, row)
    },
    toggleAddCampaignManagerModal() {
      this.$emit('toggle-add-campaign-manager-modal')
    },
    exportCampaignManagerList(downloadTypes) {
      if (this.getCampaignManagerParentExportPermissions) {
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
    handleLaunch(row) {
      this.$emit(EMITS.ON_LAUNCH, row)
    },
    handleMultipleDeleteOfCampaigns(items, excludedItems, selectAll) {
      const payload = {
        items: selectAll ? [] : items.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.$emit(
        'on-multiple-delete',
        payload,
        selectAll ? this.serverSideProps.totalNumberOfRecords : items.length
      )
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
    getDataTableFieldLabel(status = '') {
      return getDataTableFieldLabel(status)
    },
    getTooltipDisabilityStatus(row = {}) {
      return row?.status !== 'Error' || !row?.jobResultMessage
    }
  }
}
</script>
