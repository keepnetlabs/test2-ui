<template>
  <div class="investigations">
    <div class="investigations__container">
      <!-- New investigation popup starts here. You can define all props here. If you want to open that overlay, you have to set isWantToAddNewCommunity to true -->

      <new-investigation
        @closeWithRoute="onAddClose"
        @closeAdd="isWantToAddNewCommunity = false"
        @refreshDatatable="refreshDatatable"
        ref="refNewInvestigation"
        :status="isWantToAddNewCommunity"
        v-if="isWantToAddNewCommunity"
      />
      <app-dialog
        :status="isWantToStopInvestigation"
        icon="mdi-alert"
        :title="labels.StopOngoingInvestigation"
        :subtitle="labels.DoYouWantToStopInvestigation"
        :body="labels.OnceYouStoppedInvestigation"
        @changeStatus="isWantToStopInvestigation = false"
      >
        <template v-slot:app-dialog-footer>
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
          is-server-side
          :loading="loading"
          :show-all-records="showAllRecords"
          :is-column-filter-active="isColumnFilterActive"
          id="investigations-data-table"
          ref="investigationTable"
          :refName="'investigationTable'"
          :columns="columns"
          :totalNumberOfRecords="totalNumberOfRecords"
          :table="tableData.data"
          :pageSizes="pageSizes"
          :defaultSort="'date'"
          :selectable="true"
          :filterable="true"
          :options="true"
          :rowActions="rowActions"
          :stored-table-settings="storedTableSettings"
          :addButton="addUsers"
          :empty="iEmpty"
          :selectEvent="selectEvent"
          :chartOptions="chartOptions"
          :sizeable="true"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          @createCommunityFromMobileInfo="createCommunityFromMobileInfo()"
          @stopInvestigationFunc="stopInvestigationFunc($event)"
          @investigationDetails="investigationDetails($event)"
          @downloadEvent="exportInvestigationList"
          @paginationChangedEvent="paginationChangedEvent($event)"
          @onEmptyBtnClicked="isWantToAddNewCommunity = true"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @refreshAction="getInvestigationList"
          @on-all-records-button-click="handleAllRecordsClick"
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
              :to="{ name: 'Playbook', params: { playbookId: item.resourceId } }"
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
import { checkPermission } from '@/utils/functions'

import QueryHelperForTable from '@/helper-classes/query-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'

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
    tableState: false,
    showAllRecords: false,
    totalNumberOfRecords: 0,
    stopInvestigateButtonDisabled: false,
    loading: false,
    showPlaybookModal: false,
    selectedPlaybookId: null,
    isWantToAddNewCommunity: false,
    isWantToStopInvestigation: false,
    init: true,
    labels,
    investigationListDataLength: 0,
    storedTableSettings: null,
    columns: [
      // Should be defined to show the table
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
        //minWidth: 80
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
        width: 150,
        filterableType: 'select',
        filterableItems: ['Running', 'Canceled', 'Expired', 'Finished']
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
        //minWidth: 80
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
        //minWidth: 80
      },
      {
        property: 'userStatus',
        align: 'center',
        editable: false,
        label: getStoreValue('userStatus'),
        fixed: false,
        sortable: false,
        show: true,
        type: 'chart',
        width: 130
        //minWidth: 35
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
        width: 120
        // minWidth: 60
      }
    ],
    pageSizes: [5, 10, 25],
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
        disabled: !checkPermission('investigations/{resourceId}/cancel', 'PUT')
      }
    ],
    addUsers: {
      show: true,
      tooltip: labels.StartAnInvestigation,
      action: 'createCommunityFromMobileInfo',
      id: 'btn-add--investigations',
      disabled: !checkPermission('investigations', 'POST')
    },
    iEmpty: {
      message: labels.NoInvestigationStarted,
      btn: labels.StartNewInvestigation,
      id: 'btn-empty--investigations',
      icon: 'mdi-plus'
    },
    selectEvent: {
      clipboard: true,
      edit: false,
      delete: false,
      download: false
    },
    chartOptions: {
      backgroundColor: ['#3f51b5', '#00bcd4'],
      labels: [labels.CompletedUserCount, labels.NotStartedUserCount],
      showTooltipLine: true
    },
    isColumnFilterActive: false,
    bodyData: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'createTime',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    defaultRequestBody: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'createTime',
      ascending: false,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    },
    serverSideProps: new ServerSideProps()
  }),
  methods: {
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.bodyData.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.isColumnFilterActive = columnFilterActive
      this.getInvestigationList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getInvestigationList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.getInvestigationList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.getInvestigationList()
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONS)
      )
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.investigationTable.filterValues = savedFilter.filterValues
          this.$refs.investigationTable.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
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
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONS)
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
    handleAllRecordsClick() {
      this.bodyData.pageSize = 75000
      this.showAllRecords = false
      this.getInvestigationList()
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
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      const _this = this

      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, this.bodyData)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      const _this = this
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }

      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    columnFilterChanged(filter) {
      this.isColumnFilterActive = true
      let items = []
      this.bodyData.filter.FilterGroups[0].FilterItems.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
        }
      })

      this.bodyData.filter.FilterGroups[0].FilterItems = []
      this.bodyData.filter.FilterGroups[0].FilterItems = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          this.bodyData.filter.FilterGroups[0].FilterItems.push(filter[i])
        })
      } else {
        const { FieldName, Value } = filter
        if (FieldName === 'status' && Value === '') {
        } else {
          this.bodyData.filter.FilterGroups[0].FilterItems.push(filter)
        }
      }

      const _this = this
      this.loading = true

      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
        this.loading = false
      })
    },
    columnFilterCleared(fieldName) {
      let items = []
      this.bodyData.filter.FilterGroups[0].FilterItems.map((x, i, t) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      this.bodyData.filter.FilterGroups[0].FilterItems = [...items]
      const _this = this
      this.loading = true
      if (this.$route.name === 'Investigations') {
        this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
          this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
          this.loading = false
        })
      }

      this.isColumnFilterActive = this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      const _this = this

      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    refreshDatatable() {
      this.loading = true

      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.loading = false
      })
    },
    onAddClose(resp) {
      // set mobile vision
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.$router.push(`/investigation-details/${resp.data.data.resourceId}`)
      this.isWantToAddNewCommunity = false
    },
    createCommunityFromMobileInfo() {
      // open new investigation overlay
      this.isWantToAddNewCommunity = true
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
        })
        .then((response) => {
          const {
            data: { data }
          } = response

          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results

          this.totalNumberOfRecords = totalNumberOfRecords

          if (this.bodyData.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }

          if (totalNumberOfRecords <= 1000 && this.bodyData.pageSize === 1000) {
            this.showAllRecords = false
          }
        })
    }
  },
  computed: {
    ...mapGetters({
      // get table data via vuex.
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
    // triggered to relevant action at investigations.js
    if (!this.checkPermissions('investigations/search', 'POST')) {
      this.$router.push('/incident-responder')
    }
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.INVESTIGATIONS))
    if (this.$route.params && this.$route.params.selectedEmail) {
      this.isWantToAddNewCommunity = true
    }
    this.$nextTick(() => {
      if (this.$route.params && this.$route.params.selectedEmail) {
        if (this.$refs.refNewInvestigation && this.init) {
          this.init = false
          this.$refs.refNewInvestigation.fillForm(this.$route.params.selectedEmail)
        }
      }
    })
    if (this.isLoadState) {
      const tableState =
        this.$store.state['datatable'].tables['Investigations'] &&
        this.$store.state['datatable'].tables['Investigations'].tableState
      if (tableState) {
        this.serverSideProps = tableState.serverSideProps
        const { filterValues = {} } = tableState
        if (Object.keys(filterValues).length) {
          this.isColumnFilterActive = true
          for (const [key, value] of Object.entries(filterValues)) {
            if (value.selectValue === 'between') {
              this.bodyData.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue[0],
                FieldName: key,
                Operator: '>='
              })
              this.bodyData.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue[1],
                FieldName: key,
                Operator: '<='
              })
            } else {
              this.bodyData.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue,
                FieldName: key,
                Operator: value.selectValue
              })
            }
          }
        }
        this.tableState = { persistentState: tableState }
      }
    } else {
      this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.AUDIT))
      this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
      this.queryHelper.setDefaultValues()
      this.queryHelper.controlRouteQuery()
      const { page, size } = this.queryHelper.returnQueryValues()
      this.bodyData.pageSize = size
      this.bodyData.pageNumber = page
      this.serverSideProps.pageSize = size
      this.getDefaultFilterAndSearch()
    }

    if (this.$route.query.openPopup) {
      this.isWantToAddNewCommunity = true
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
