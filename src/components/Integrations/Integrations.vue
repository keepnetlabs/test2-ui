<template>
  <div id="integrations">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <new-integration
        v-if="modalStatus"
        :showModal="modalStatus"
        :integrationId="integrationId"
        @closeOverlay="changeModalStatus"
      />
    </v-overlay>
    <delete-integration-modal
      :status="showDeleteModal"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      @handleMultipleDelete="handleDeleteMultiple"
      :selected-integration="selectedIntegration"
    />

    <data-table
      v-if="checkPermissions('analysis-engines/search', 'POST')"
      id="integrations-data-table"
      ref="refIntegrationsList"
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :show-all-records="showAllRecords"
      :refName="'integrationsList'"
      :columns="tableOptions.columns"
      :total-number-of-records="totalNumberOfRecords"
      :selectable="true"
      :filterable="true"
      :options="true"
      :sizeable="true"
      :pageSizes="tableOptions.pageSizes"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :stored-table-settings="storedTableSettings"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @disable="handleDisable"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportIntegrationList"
      @handleMultipleDelete="handleActionDelete"
      @paginationChangedEvent="paginationChangedEvent($event)"
      :dataLength="tableData && tableData.totalNumberOfRecords"
      :requestParams="bodyData"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      :download-button="tableOptions.downloadButton"
      @refreshAction="getDatatableList"
      @on-all-records-button-click="handleAllRecordsClick"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-table-settings-change="handleSetRenderedColumns"
      :isServerSide="true"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
    >
      <template v-slot:datatable-row-actions="{ scope }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="handleEdit(scope.row)"
              :id="`btn-edit--integrations-row-action-${
                scope.$index
              }-${Math.random().toString().substring(2)}`"
              class="btn-hover"
              icon
              v-on="on"
              :disabled="tableOptions.rowActions[0].disabled"
            >
              <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ tableOptions.rowActions[0].name }}</span>
        </v-tooltip>
        <v-menu bottom left offset-y transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn class="btn-hover" icon v-on="on">
              <v-icon @click.native="selectedMenuIndex = scope.$index">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="v-cart-dropdown-list el-table__action-buttons integrations__row-actions">
            <v-list-item
              :id="`btn-status--integrations-row-action-${
                scope.$index
              }-0-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[1].disabled"
            >
              <v-list-item-title
                @click="
                  scope.row.status === 'Active' ? handleDisable(scope.row) : handleEnable(scope.row)
                "
              >
                <v-icon class="pr-3">{{
                  scope.row.status === 'Active'
                    ? 'mdi-minus-circle-outline'
                    : 'mdi-check-circle-outline'
                }}</v-icon>
                <span>{{
                  scope.row.status === labels.Active ? labels.InActive : labels.Active
                }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :id="`btn-delete--integrations-row-action-${
                scope.$index
              }-1-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[2].disabled"
            >
              <v-list-item-title @click="handleActionDelete(scope.row)">
                <v-icon class="pr-3">mdi-delete</v-icon>
                <span>{{ labels.Delete }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'
import DeleteIntegrationModal from './DeleteIntegrationModal'
import {
  deleteIntegration,
  disableIntegration,
  enableIntegration,
  exportReportedEmails,
  getIntegrationList
} from '@/api/integrations'
import {
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  INTEGRATION_TYPES,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { checkPermission } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewIntegration,
    DeleteIntegrationModal
  },
  data() {
    return {
      loading: true,
      integrationId: null,
      labels,
      showAllRecords: false,
      totalNumberOfRecords: 0,
      tableData: [],
      showDeleteModal: false,
      storedTableSettings: null,
      selectedIntegration: {},
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: labels.IntegrationName,
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: PROPERTY_STORE.ANALYSISENGINENAME,
            align: 'left',
            editable: false,
            label: labels.IntegrationType,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'select',
            filterableCustomFieldName: 'analysisEngineTypeId',
            filterableItems: [
              INTEGRATION_TYPES.FORTINET,
              INTEGRATION_TYPES.VIRUSTOTAL,
              INTEGRATION_TYPES.VMRAY,
              INTEGRATION_TYPES.IBMXFORCE,
              INTEGRATION_TYPES.SPAMHOUSE,
              INTEGRATION_TYPES.CUSTOMINTEGRATION,
              INTEGRATION_TYPES.GOOGLESAFEBROWSER
            ]
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            filterableCustomFieldName: 'Description'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 150,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.checkPermissions('analysis-engines/{resourceId}', 'PUT')
          },
          {
            name: labels.Disable,
            icon: 'mdi-minus-circle-outline',
            action: 'disable',
            disabled: !this.checkPermissions('analysis-engines/{resourceId}/disable', 'PUT')
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.checkPermissions('analysis-engines/{resourceId}', 'DELETE')
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.checkPermissions('analysis-engines/search/export', 'POST')
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_INTEGRATIONS,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--integrations'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add an integration',
          id: 'btn-add--integrations',
          disabled: !this.checkPermissions('analysis-engines', 'POST')
        }
      },
      modalStatus: false,
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
    }
  },
  methods: {
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.INTEGRATION, JSON.stringify(tableSettings))
    },
    resetPageNumber() {
      //generic
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyData.filter.FilterGroups[1].FilterItems = this.bodyData.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.getDatatableList()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.bodyData.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.bodyData.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.bodyData.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.getDatatableList()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.INTEGRATIONS)
      )
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refIntegrationsList.filterValues = savedFilter.filterValues
          this.$refs.refIntegrationsList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refIntegrationsList.filterValues = {}
      this.$refs.refIntegrationsList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.INTEGRATIONS)
      this.getDatatableList()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.INTEGRATIONS,
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
      this.getDatatableList()
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      this.getDatatableList()
    },
    handleDeleteMultiple(selections) {
      selections.forEach((item) => {
        this.handleDelete(item)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    handleDelete(row) {
      this.$refs.refIntegrationsList.$refs.elTableRef.toggleRowSelection(row, false)
      deleteIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleEdit(row) {
      this.modalStatus = true
      this.integrationId = row.resourceId
    },
    handleDisable(row) {
      disableIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleEnable(row) {
      enableIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleAdd() {},
    changeModalStatus(status, restart) {
      this.integrationId = null
      this.modalStatus = status
      if (restart) this.getDatatableList()
    },
    exportIntegrationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }
        exportReportedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Integrations.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch((error) => {})
      })
    },
    getDatatableList() {
      this.loading = true
      if (this.checkPermissions('analysis-engines/search', 'POST')) {
        getIntegrationList(this.bodyData)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results
            this.totalNumberOfRecords = totalNumberOfRecords

            if (this.bodyData.pageSize === 1000 && totalNumberOfRecords > 1000) {
              this.showAllRecords = true
            }

            if (totalNumberOfRecords <= 1000 && this.bodyData.pageSize === 1000) {
              this.showAllRecords = false
            }
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      } else {
        this.$router.push('/')
      }
    },
    handleActionDelete(row) {
      this.selectedIntegration = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
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

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName =
            filter[i].FieldName.slice(0, 1).toUpperCase() + filter[i].FieldName.slice(1)
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName.slice(0, 1).toUpperCase() + filter.FieldName.slice(1)
        const { FieldName, Value } = filter
        if (FieldName === 'Status' && Value === '') {
        } else {
          requestBody.push(elem)
        }
      }
      this.bodyData.filter.FilterGroups[0].FilterItems = requestBody
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName.toLowerCase() !== fieldName.toLowerCase()) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.getDatatableList()
      this.tableOptions.isColumnFilterActive =
        this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },
  created() {
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.setQueryValuesToPayload(this.$route.query)
    this.bodyData.pageSize = size
    this.bodyData.pageNumber = page
    this.serverSideProps.pageSize = size
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.INTEGRATION))
  },
  mounted() {
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss">
.integrations {
  min-height: 90vh;
}
.integrations__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
