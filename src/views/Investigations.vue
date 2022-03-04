<template>
  <div class="investigations">
    <div class="investigations__container">
      <new-investigation
        v-if="isShowNewInvestigationModal"
        ref="refNewInvestigation"
        :status="isShowNewInvestigationModal"
        @closeWithRoute="onAddClose"
        @closeAdd="isShowNewInvestigationModal = false"
        @refreshDatatable="refreshDatatable"
      />
      <app-dialog
        :status="isWantToStopInvestigation"
        :title="labels.StopOngoingInvestigation"
        :subtitle="labels.DoYouWantToStopInvestigation"
        :body="labels.OnceYouStoppedInvestigation"
        @changeStatus="isWantToStopInvestigation = false"
        icon="mdi-alert"
      >
        <template #app-dialog-footer>
          <app-dialog-footer
            cancel-button-id="btn-cancel--investigations-popup"
            confirm-button-id="btn-stop--investigations-popup"
            :confirm-button-disabled="stopInvestigateButtonDisabled"
            @handleClose="isWantToStopInvestigation = false"
            @handleConfirm="stopInvestigation"
          />
        </template>
      </app-dialog>
      <v-card class="investigations__container-card" light>
        <datatable
          v-bind="tableState"
          selectable
          filterable
          options
          is-server-side
          isServerSideSelection
          :loading="loading"
          :is-column-filter-active="isColumnFilterActive"
          id="investigations-data-table"
          ref="investigationTable"
          :refName="'investigationTable'"
          :columns="columns"
          :table="tableData.data"
          :rowActions="rowActions"
          :stored-table-settings="storedTableSettings"
          :addButton="newInvestigationButton"
          :empty="iEmpty"
          :selectEvent="selectEvent"
          :chartOptions="chartOptions"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          @startNewInvestigation="startNewInvestigation"
          @stopInvestigationFunc="stopInvestigationFunc($event)"
          @investigationDetails="investigationDetails($event)"
          @downloadEvent="exportInvestigationList"
          @paginationChangedEvent="paginationChangedEvent($event)"
          @onEmptyBtnClicked="isShowNewInvestigationModal = true"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @refreshAction="getInvestigationList"
          @set-default-search="handleSetDefaultSearch"
          @restore-default-search="handleRestoreDefaultSearch"
          @clear-filters="handleClearFilters"
          @on-table-settings-change="handleSetRenderedColumns"
          @server-side-page-number-changed="serverSidePageNumberChanged"
          @server-side-size-changed="serverSideSizeChanged"
          @searchChangedEvent="handleSearchChange"
          @sortChangedEvent="sortChanged"
        >
          <template v-slot:datatable-custom-column="{ scope }">
            <span
              v-if="
                scope.row && scope.row.matchingPlaybooks && scope.row.matchingPlaybooks.length === 0
              "
            >
              {{ scope.row.source === labels.Auto ? 'Auto Analysis' : scope.row.source }}
            </span>
            <span
              :key="item.resourceId"
              v-else
              v-for="item in scope.row.matchingPlaybooks"
              class="popup-link"
              @click="togglePlaybookModalWithSelected(item.resourceId)"
              >{{ item.name }}</span
            >
          </template>
        </datatable>
      </v-card>
    </div>
    <app-modal
      :status="showPlaybookModal"
      v-if="showPlaybookModal"
      :icon-name="getIconName"
      :title="getTitle"
      :show-footer="false"
      class-name="incident-responder__playbook"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          :playbookId="selectedPlaybookId"
          @cancelForm="togglePlaybookModal"
          @closeFormWithUpdate="closePlaybookWithUpdate"
          v-if="showPlaybookModal"
        />
      </template>
    </app-modal>
  </div>
</template>

<script>
import Datatable from '../components/DataTable'
import newInvestigation from '../components/Investigation/NewInvestigation'
import AppDialog from '../components/AppDialog'
import { mapGetters } from 'vuex'
import { exportInvestigationList } from '@/api/incidentResponder'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CreateOrEditRule from '../components/Playbook/CreateOrEditRule'
import AppModal from '@/components/AppModal'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import { checkPermission, getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'

export default {
  name: 'Investigations',
  components: {
    AppDialogFooter,
    Datatable,
    newInvestigation,
    AppDialog,
    CreateOrEditRule,
    AppModal
  },
  props: {
    selectedEmail: {
      type: Object
    },
    isSelectedEmail: {
      type: Boolean
    },
    isLoadState: {
      type: Boolean
    }
  },
  data: () => ({
    tableState: null,
    stopInvestigateButtonDisabled: false,
    loading: false,
    showPlaybookModal: false,
    selectedPlaybookId: null,
    isShowNewInvestigationModal: false,
    isWantToStopInvestigation: false,
    init: true,
    labels,
    storedTableSettings: null,
    columns: [
      {
        property: 'incident',
        align: 'left',
        editable: false,
        label: getStoreValue('investigationName'),
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 240,
        isFilterable: true,
        editComponent: 'textfield',
        filterableType: 'text'
      },
      {
        property: 'source',
        align: 'left',
        editable: false,
        label: getStoreValue('trigger'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'slot',
        width: 240,
        filterableType: 'text'
      },
      {
        property: 'status',
        align: 'center',
        editable: false,
        label: getStoreValue('status'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'status',
        isEditable: true,
        isWithTooltip: true,
        width: 150,
        filterableType: 'select',
        filterableItems: ['Running', 'Cancelled', 'Expired', 'Finished', 'Queued', 'No match']
      },
      {
        property: 'createTime',
        align: 'left',
        editable: false,
        label: getStoreValue('createTime'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'date'
      },
      {
        property: 'expireDate',
        align: 'left',
        editable: false,
        label: getStoreValue('expireDate'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'date'
      },
      {
        property: 'userStatus',
        informationTextProperty: 'scanStatusText',
        align: 'center',
        editable: false,
        label: getStoreValue('scanStatus'),
        fixed: false,
        sortable: false,
        show: true,
        type: 'chart',
        wıdth: 175
      },
      {
        property: 'progress',
        align: 'center',
        editable: false,
        label: getStoreValue('progress'),
        fixed: false,
        sortable: false,
        show: true,
        type: 'progress',
        progressType: 'stats',
        width: 130
      }
    ],
    rowActions: [
      {
        name: labels.Details,
        icon: 'mdi-text-box-multiple',
        action: 'investigationDetails',
        id: 'btn-details--investigations-row-actions',
        disabled: !checkPermission('investigations/{resourceId}', 'GET')
      },
      {
        name: labels.StopAction,
        icon: 'mdi-stop',
        id: 'btn-stop--investigations-row-actions',
        action: 'stopInvestigationFunc',
        disabled: !checkPermission('investigations/{resourceId}/cancel', 'PUT'),
        getButtonVisibility: (status) => {
          return status === 'Running'
        }
      }
    ],
    newInvestigationButton: {
      show: true,
      tooltip: labels.StartAnInvestigation,
      action: 'startNewInvestigation',
      id: 'btn-add--investigations',
      disabled: !checkPermission('investigations', 'POST')
    },
    iEmpty: {
      message: labels.NoInvestigationStarted,
      btn: labels.StartAnInvestigation,
      id: 'btn-empty--investigations'
    },
    selectEvent: {
      clipboard: true,
      edit: false,
      delete: false,
      download: false,
      pause: false,
      stop: false
    },
    chartOptions: {
      backgroundColor: ['#3f51b5', '#00bcd4'],
      labels: [labels.CompletedUserCount, labels.NotStartedUserCount],
      showTooltipLine: true,
      isWithText: true
    },
    isColumnFilterActive: false,
    bodyData: getDefaultAxiosPayload(),
    defaultRequestBody: getDefaultAxiosPayload(),
    serverSideProps: new ServerSideProps()
  }),
  methods: {
    getDynamicScanStatusWidth(columnItems) {
      if (!columnItems) {
        return 250
      }
      const lengthMap = columnItems.map(
        (item) => item[0].toString().length + item[1].toString().length
      )
      const maxLength = Math.max(...lengthMap)
      if (isNaN(maxLength) || maxLength === Infinity || maxLength === -Infinity) {
        return 250
      }
      return 175 + maxLength * 10
    },
    setDynamicScanStatusWidth() {
      const scanStatusItems = this.tableData.data.map((item) => item.userStatus)
      const scanStatusColumnIndex = this.columns.findIndex(
        (column) => column.property === 'userStatus'
      )
      if (scanStatusColumnIndex !== -1) {
        this.columns[scanStatusColumnIndex].width = this.getDynamicScanStatusWidth(scanStatusItems)
      }
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.bodyData.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.calculateIsFilterColumnActive()
      this.getInvestigationList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getInvestigationList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.getInvestigationList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getInvestigationList()
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    calculateIsFilterColumnActive() {
      this.isColumnFilterActive = isColumnFilterActive(this.bodyData)
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONS)
      )
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.investigationTable.reRenderColumns(savedFilter.filterValues)
        })
      }
      this.getInvestigationList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.investigationTable.filterValues = {}
      this.$refs.investigationTable.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.getInvestigationList()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.INVESTIGATIONS, JSON.stringify(tableSettings))
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONS,
        JSON.stringify({
          filter: this.bodyData.filter,
          filterValues
        })
      )
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    handeRuleNameClick(resourceId) {
      this.selectedPlaybookId = resourceId
      this.showPlaybookModal = true
    },
    closePlaybookWithUpdate() {
      this.togglePlaybookModal()
    },
    togglePlaybookModal() {
      this.selectedPlaybookId = null
      return (this.showPlaybookModal = !this.showPlaybookModal)
    },
    togglePlaybookModalWithSelected(selectedPlaybookId) {
      this.selectedPlaybookId = selectedPlaybookId
      return (this.showPlaybookModal = !this.showPlaybookModal)
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = {
        ...this.bodyData,
        orderBy: prop,
        ascending: order === 'ascending'
      }
      this.getInvestigationList()
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }

      this.getInvestigationList()
    },
    columnFilterChanged(filter) {
      this.isColumnFilterActive = true
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)

      this.getInvestigationList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.calculateIsFilterColumnActive()

      if (this.$route.name === 'Investigations') {
        this.getInvestigationList()
      }
    },
    refreshDatatable() {
      this.loading = true
      this.getInvestigationList()
    },
    onAddClose(resp) {
      if (resp?.data?.data?.resourceId) {
        this.$router.push(`/investigation-details/${resp.data.data.resourceId}`)
      }
      this.isShowNewInvestigationModal = false
    },
    startNewInvestigation() {
      this.isShowNewInvestigationModal = true
    },
    investigationDetails(value) {
      this.$router.push({
        name: 'Investigation Details',
        params: { id: value.row.resourceId }
      })
    },
    exportInvestigationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: this.bodyData.orderBy,
          ascending: this.bodyData.ascending,
          reportAllPages: reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }

        exportInvestigationList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Investigations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },

    stopInvestigationFunc(value) {
      this.isWantToStopInvestigation = true
      this.selectedRow = value
    },
    stopInvestigation() {
      const value = this.selectedRow
      let store = this.$store
      this.stopInvestigateButtonDisabled = true
      this.$store
        .dispatch('investigations/cancelInvestigation', value.row.resourceId)
        .catch(() => {})
        .then(() => {
          this.isWantToStopInvestigation = false
          store.dispatch('investigations/SET_INVESTIGATIONLISTEMPY', [])
        })
        .finally(() => {
          this.stopInvestigateButtonDisabled = false
          this.refreshDatatable()
        })
    },
    getInvestigationList() {
      this.loading = true
      this.$store
        .dispatch('investigations/getInvestigationList', this.bodyData)
        .finally(() => {
          this.loading = false
          this.tableData.data = this.tableData.data || []
          this.setDynamicScanStatusWidth()
          if (this.$refs && this.$refs.investigationTable) {
            this.$refs.investigationTable.$forceUpdate()
          }
        })
        .then((response) => {
          const {
            data: {}
          } = response
          const {
            data: {
              data: { totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
        })
    }
  },
  computed: {
    ...mapGetters({
      tableData: 'investigations/investigationListGetter' // for using getters
    }),
    getTitle() {
      return `${this.selectedPlaybookId ? 'Edit' : 'Create New'} Rule`
    },
    getIconName() {
      return `${this.selectedPlaybookId ? 'mdi-pencil' : 'mdi-plus'}`
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'Investigation Details' && !to.params.isLoadState) {
      next({ ...to, params: { isLoadState: true } })
    } else {
      next()
    }
  },
  created() {
    if (!this.checkPermissions('investigations/search', 'POST')) {
      this.$router.push('/incident-responder')
    }
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.INVESTIGATIONS))
    if (this.$route.params && this.$route.params.selectedEmail) {
      this.isShowNewInvestigationModal = true
    }
    this.$nextTick(() => {
      if (this.$route.params && this.$route.params.selectedEmail) {
        if (this.$refs.refNewInvestigation && this.init) {
          this.init = false
          this.$refs.refNewInvestigation.fillForm(this.$route.params.selectedEmail)
        }
      }
    })

    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.INVESTIGATIONS))
    this.getDefaultFilterAndSearch()

    if (this.$route.query.openPopup) {
      this.isShowNewInvestigationModal = true
    }
  },
  beforeDestroy() {
    const tableState = {
      ...this.$refs.investigationTable.getState(),
      serverSideProps: this.serverSideProps
    }
    this.$store.dispatch('datatable/setTable', {
      key: 'Investigations',
      tableState
    })
    this.$store.commit('investigations/SET_INVESTIGATIONLISTEMPY', [])
  },
  beforeRouteLeave(to, from, next) {
    const { refNewInvestigation } = this.$refs
    if (refNewInvestigation && refNewInvestigation.status) {
      if (to.name === 'Investigation Details') {
        return next()
      }
      refNewInvestigation.onCancelClicked()
      next(false)
    } else {
      next()
    }
  }
}
</script>
<style lang="scss">
.investigations {
  padding: 13px 16px 16px 16px;
  &__container {
    min-height: 80vh;
    &-card {
      border-radius: 20px !important;
      margin-top: -2px;
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12) !important;
      background-color: #ffffff;
      padding: 16px 24px 0 24px;
    }
  }
  .table-wrapper {
    margin-top: 8px;
  }
  .newInvestigationOverlay {
    background-color: #fff !important;
    overflow: auto !important;
    height: 100% !important;
    max-width: 100vw !important;
    width: 100% !important;
    display: block !important;
    justify-content: center !important;
    align-items: center !important;

    > ::v-deep .v-overlay__content {
      height: auto;
      width: 100%;
    }
  }
}
</style>
