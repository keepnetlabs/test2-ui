<template>
  <div id="auditLogs" class="audit-logs">
    <div class="audit-logs__container">
      <div class="audit-logs__datatable">
        <data-table
          id="audit-data-list"
          ref="refAuditList"
          is-server-side
          :loading="loading"
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :table="tableData"
          :refName="'auditList'"
          :columns="tableOptions.columns"
          :total-number-of-records="totalNumberOfRecords"
          :stored-table-settings="storedTableSettings"
          :selectable="true"
          :filterable="true"
          :options="true"
          :sizeable="true"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          :pageSizes="tableOptions.pageSizes"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :show-all-records="showAllRecords"
          :addButton="tableOptions.addButton"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :download="downloadOptions"
          @refreshAction="getDatatableList"
          @downloadEvent="exportAuditLog"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @on-all-records-button-click="handleAllRecordsClick"
          @set-default-search="handleSetDefaultSearch"
          @restore-default-search="handleRestoreDefaultSearch"
          @clear-filters="handleClearFilters"
          @server-side-page-number-changed="serverSidePageNumberChanged"
          @server-side-size-changed="serverSideSizeChanged"
          @searchChangedEvent="handleSearchChange"
          @sortChangedEvent="sortChanged"
          @on-table-settings-change="handleSetRenderedColumns"
        ></data-table>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { exportAuditLog, getAuditLogs } from '@/api/dashboard'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import { exportSmtpSettings } from '@/api/smtpSettings'
import QueryHelperForTable from '@/helper-classes/query-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getTimeZoneForMoment } from '@/utils/functions'

export default {
  name: 'Audit',
  components: {
    DataTable
  },
  data() {
    return {
      loading: true,
      labels,
      showAllRecords: false,
      totalNumberOfRecords: 0,
      storedTableSettings: null,
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.LOGDATE,
            align: 'left',
            editable: false,
            label: LABEL_STORE.LOGDATE,
            sortable: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'date',
            showSelect: false,
            filterableOptions: {
              exactDate: false,
              after: false,
              before: false,
              between: true,
              showSelect: false
            },
            defaultDate: {
              hours: 2,
              time: 'weeks',
              select: '>='
            },
            fixed: 'left'
          },
          {
            property: PROPERTY_STORE.RESOURCEID,
            align: 'left',
            editable: false,
            label: LABEL_STORE.LOGID,
            sortable: true,
            show: false,
            type: 'text',
            width: 160
          },
          {
            property: PROPERTY_STORE.USERNAME,
            align: 'left',
            editable: false,
            label: LABEL_STORE.USERNAME,
            sortable: true,
            show: true,
            type: 'text',
            width: 140,
            filterableType: 'text'
          },

          {
            property: PROPERTY_STORE.ENTITYID,
            align: 'left',
            editable: false,
            label: LABEL_STORE.ENTITYID,
            fixed: false,
            sortable: true,
            show: false,
            type: 'text',
            width: 185,
            filterableType: 'text',
            filterProps: { items: ['Include'] }
          },
          {
            property: PROPERTY_STORE.ENTITYNAME,
            align: 'left',
            editable: false,
            label: LABEL_STORE.ENTITYNAME,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 185,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.OPERATIOM,
            align: 'left',
            editable: false,
            label: LABEL_STORE.OPERATIOM,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 140,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.OPERATION_ITEMS
          },
          {
            property: PROPERTY_STORE.OLDVALUE,
            align: 'left',
            editable: false,
            label: LABEL_STORE.CHANGESET,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 185
          },
          {
            property: PROPERTY_STORE.NEWVALUE,
            align: 'left',
            editable: false,
            label: LABEL_STORE.NEWVALUE,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 185
          },
          {
            property: PROPERTY_STORE.IP,
            align: 'left',
            editable: false,
            label: LABEL_STORE.IP,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 185,
            filterableType: 'text',
            filterableCustomFieldName: 'IP'
          },
          {
            property: PROPERTY_STORE.USERAGENT,
            align: 'left',
            editable: false,
            label: LABEL_STORE.USERAGENT,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 185
          }
        ],

        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_AUDIT
        }
      },
      downloadOptions: {
        xls: false,
        csv: true,
        pdf: false
      },
      bodyData: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'LogDate',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                { Value: '', FieldName: 'logDate', Operator: '>=' },
                { Value: '', FieldName: 'logDate', Operator: '=<' }
              ],
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
        orderBy: 'LogDate',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                { Value: '', FieldName: 'logDate', Operator: '>=' },
                { Value: '', FieldName: 'logDate', Operator: '=<' }
              ],
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
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.AUDIT))
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refAuditList.filterValues = savedFilter.filterValues
          this.$refs.refAuditList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getDatatableList()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.AUDIT, JSON.stringify(tableSettings))
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.getDatatableList()
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.tableOptions.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.bodyData.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refAuditList.filterValues = {}
      this.$refs.refAuditList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.AUDIT)
      this.getDatatableList()
    },
    exportAuditLog({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.bodyData.filter)),
        this.$refs.refAuditList,
        'LogDate'
      )
      if (this.$refs.refAuditList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
      }
      if (this.$refs.refAuditList.sortProps && this.$refs.refAuditList.sortProps.order) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper

      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportAuditLog(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Audit Log.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      const copyOfFilter = JSON.parse(JSON.stringify(this.bodyData.filter))
      copyOfFilter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.AUDIT,
        JSON.stringify({
          filter: copyOfFilter,
          filterValues
        })
      )
    },
    getDatatableList() {
      this.loading = true
      getAuditLogs(this.bodyData)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAllRecordsClick() {
      this.bodyData.pageSize = 75000
      this.showAllRecords = false
      this.getDatatableList()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      this.resetPageNumber()
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
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
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

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName) {
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
    this.bodyData.filter.FilterGroups[0].FilterItems[0].Value = this.$moment(Date.now())
      .subtract(2, 'weeks')
      .format(getTimeZoneForMoment())
    this.defaultRequestBody.filter.FilterGroups[0].FilterItems[0].Value = this.$moment(Date.now())
      .subtract(2, 'weeks')
      .format(getTimeZoneForMoment())
    this.bodyData.filter.FilterGroups[0].FilterItems[1].Value = this.$moment(Date.now()).format(
      getTimeZoneForMoment()
    )
    this.defaultRequestBody.filter.FilterGroups[0].FilterItems[1].Value = this.$moment(
      Date.now()
    ).format(getTimeZoneForMoment())
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.AUDIT))
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.bodyData.pageSize = size
    this.bodyData.pageNumber = page
    this.serverSideProps.pageSize = size
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss">
.audit-logs {
  padding: 0 16px 24px 16px !important;
  width: 100%;
  min-height: 90vh;
  margin-top: 10px;
  &__container {
    border-radius: 20px !important;
    background: white;
  }
  &__datatable {
    padding: 16px 24px 0 24px;
  }
}
</style>
