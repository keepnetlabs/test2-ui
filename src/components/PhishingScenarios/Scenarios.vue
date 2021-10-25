<template>
  <div id="scenarios">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewScenario
        :status="modalStatus"
        :scenarioId="scenarioId"
        :isEdit="isEdit"
        :isDuplicate="isDuplicate"
        :editableFormValues="editableFormValues"
        :scenarioDetailsLookup="scenarioDetailsLookup"
        @changeNewScenarioModalStatus="changeNewScenarioModalStatus"
      />
    </v-overlay>
    <DeleteScenario
      :status="showDeleteModal"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      @handleMultipleDelete="handleDeleteMultiple"
      :selectedScenario="selectedScenario"
    />
    <app-dialog
      :status="isScenarioDetails"
      @changeStatus="isScenarioDetails = false"
      icon="mdi-eye"
      :title="'Landing Page Template Preview'"
      :subtitle="selectedScenarioHeader"
      :size="'ultraMaximum'"
    >
      <template v-slot:app-dialog-body>
        <p class="pl-1">
          <span>Phishing URL:</span> <b>{{ selectedScenarioURL }}</b>
        </p>
        <k-shadow-frame :content="templateHTML" :key="templateHTML + 'appDialog'" />
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isScenarioDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>

    <data-table
      v-if="checkPermissions('phishing-simulator/phishing-scenario/search', 'POST')"
      id="scenarios-data-table"
      ref="refScenariosList"
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :show-all-records="showAllRecords"
      :refName="'scenariosList'"
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
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewScenarioModalStatus(true)"
      @downloadEvent="exportScenario"
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
      class="scenarios"
    >
      <template v-slot:datatable-row-actions="{ scope }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :id="`btn-edit--scenarios-row-action-${
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
          <v-list class="v-cart-dropdown-list el-table__action-buttons scenarios__row-actions">
            <v-list-item
              :id="`btn-status--scenarios-row-action-${
                scope.$index
              }-0-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[1].disabled"
              @click="handleEdit(scope.row, false)"
            >
              <v-list-item-title @click="() => {}">
                <v-icon class="pr-3">{{ 'mdi-pencil' }}</v-icon>
                <span>Edit</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :id="`btn-status--scenarios-row-action-${
                scope.$index
              }-0-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[2].disabled"
              @click="handlePreview(scope.row)"
            >
              <v-list-item-title @click="() => {}">
                <v-icon class="pr-3">{{ 'mdi-eye' }}</v-icon>
                <span>Preview</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :id="`btn-duplicate--scenarios-row-action-${
                scope.$index
              }-1-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[3].disabled"
            >
              <v-list-item-title @click="handleEdit(scope.row, true)">
                <v-icon class="pr-3">mdi-content-copy</v-icon>
                <span>Duplicate</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :id="`btn-delete--scenarios-row-action-${
                scope.$index
              }-1-${Math.random().toString().substring(3)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[4].disabled"
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
import NewScenario from './NewScenario'
import DeleteScenario from './DeleteScenario'
import AppDialog from '../AppDialog'
import {
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { checkPermission } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
import {
  deleteScenario,
  exportScenarios,
  getScenarioDataDetails,
  getScenarioPreviewContent,
  getScenariosList
} from '@/api/scenarios'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
export default {
  name: 'EmailTemplates',
  components: {
    DataTable,
    DeleteScenario,
    NewScenario,
    AppDialog
  },
  data() {
    return {
      scenarioDetailsLookup: null,
      methodItems: [],
      difficultyItems: [],
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null,
      labels,
      showAllRecords: false,
      totalNumberOfRecords: 0,
      tableData: [],
      showDeleteModal: false,
      storedTableSettings: null,
      selectedScenario: {},
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Scenario Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text'
          },
          {
            property: 'method',
            align: 'left',
            editable: false,
            label: 'Method',
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'select',
            filterableItems: [
              { text: 'Click Only', value: 'WNZt0sCVCWB3' },
              { text: 'Data Submission', value: 'DYC0gugxJMjT' },
              { text: 'Attachment', value: '7dLrW2kdBTDs' }
            ]
          },
          {
            property: PROPERTY_STORE.TAGS,
            align: 'left',
            editable: false,
            label: 'Tags',
            fixed: false,
            sortable: true,
            show: true,
            type: 'textArray',
            width: 150,
            hasTooltip: true,
            filterableType: 'text',
            filterableCustomFieldName: PROPERTY_STORE.TAGS
          },
          {
            property: 'difficulty',
            align: 'left',
            editable: false,
            label: labels.DIFFICULTY,
            sortable: true,
            show: true,
            type: 'status',
            filterableType: 'select',
            filterableItems: [
              { text: 'Easy', value: 'mT0CeYGgKsVb' },
              { text: 'Medium', value: 'Z5XeVlpw6Dps' },
              { text: 'Hard', value: 'c4LCGEB9MayB' }
            ],
            width: 180
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: 'left',
            editable: false,
            label: 'Created By',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 180
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
            filterableType: 'date'
          }
        ],
        rowActions: [
          {
            name: labels.FastLaunch,
            icon: 'mdi-send',
            action: 'handleFastLaunch',
            disabled: !this.checkPermissions(
              'phishing-simulator/phishing-scenario/preview/{resourceId}',
              'GET'
            )
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.checkPermissions(
              'phishing-simulator/phishing-scenario/{resourceId}',
              'PUT'
            )
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            disabled: !this.checkPermissions(
              'phishing-simulator/phishing-scenario/preview/{resourceId}',
              'GET'
            )
          },
          {
            name: 'Duplicate',
            icon: 'mdi-eye',
            action: 'handlePreview',
            disabled: !this.checkPermissions('phishing-simulator/phishing-scenario', 'POST')
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.checkPermissions(
              'phishing-simulator/phishing-scenario/{resourceId}',
              'DELETE'
            )
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.checkPermissions(
            'phishing-simulator/phishing-scenario/search/export',
            'POST'
          )
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_SCENARIO,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--scenarios'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Scenario',
          id: 'btn-add--scenarios',
          disabled: !this.checkPermissions('phishing-simulator/phishing-scenario', 'POST')
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
      serverSideProps: new ServerSideProps(),
      isScenarioDetails: false,
      selectedScenarioHeader: null,
      templateHTML: null
    }
  },
  methods: {
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.SCENARIOS, JSON.stringify(tableSettings))
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
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.SCENARIOS))
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refScenariosList.filterValues = savedFilter.filterValues
          this.$refs.refScenariosList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refScenariosList.filterValues = {}
      this.$refs.refScenariosList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.getDatatableList()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.SCENARIOS,
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
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.getDatatableList()
    },
    handleDelete(row) {
      this.$refs.refScenariosList.$refs.elTableRef.toggleRowSelection(row, false)
      deleteScenario(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleFastLaunch() {},
    handlePreview(row) {
      const id = row.resourceId
      getScenarioPreviewContent(id)
        .then((response) => {
          const data = response.data.data
          this.selectedScenarioHeader = data.landingPageTemplate.landingPages[0].name
          this.selectedScenarioURL = data.landingPageTemplate.urlTemplate
          this.templateHTML = data.landingPageTemplate.landingPages[0].content
          this.isScenarioDetails = true
          //window.open(data.landingPageTemplate.urlTemplate, '_blank').focus()
        })
        .catch((error) => {})
    },
    handleEdit(row, isDuplicate) {
      this.editableFormValues = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.scenarioId = row.resourceId
    },
    handleAdd() {},
    changeNewScenarioModalStatus(status, restart) {
      this.modalStatus = status
      this.scenarioId = null
      this.isEdit = false
      this.isDuplicate = false
      if (restart) {
        this.editableFormValues = {}
        this.scenarioId = null
        this.isEdit = false
        this.isDuplicate = false
        this.getDatatableList()
      }
    },
    exportScenario({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportScenarios(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Scenarios.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch((error) => {})
      })
    },
    getDatatableList() {
      this.loading = true
      if (this.checkPermissions('phishing-simulator/phishing-scenario/search', 'POST')) {
        getScenariosList(this.bodyData)
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
      this.selectedScenario = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.tableOptions.isColumnFilterActive =
        this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
      this.getDatatableList()
    }
  },
  created() {
    getScenarioDataDetails()
      .then((response) => {
        this.scenarioDetailsLookup = response.data.data
        this.$set(
          this.tableOptions.columns[1],
          'filterableItems',
          response.data.data.methodTypes.map((item) => {
            return { text: item.text, value: item.text }
          })
        )
        this.$set(
          this.tableOptions.columns[3],
          'filterableItems',
          response.data.data.difficultyTypes.map((item) => {
            return { text: item.text, value: item.text }
          })
        )
      })
      .finally(() => {
        this.getDefaultFilterAndSearch()
      })
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.setQueryValuesToPayload(this.$route.query)
    this.bodyData.pageSize = size
    this.bodyData.pageNumber = page
    this.serverSideProps.pageSize = size
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.SCENARIOS))
  }
}
</script>

<style lang="scss">
.scenarios__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
