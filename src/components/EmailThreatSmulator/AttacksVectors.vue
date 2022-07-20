<template>
  <data-table
    id="attacks-vectors-list"
    ref="refAttacksVectorsList"
    is-server-side
    selectable
    filterable
    options
    :loading="loading"
    :table="tableData"
    :columns="tableOptions.columns"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :empty="tableOptions.empty"
    :select-event="tableOptions.selectEvent"
    :addButton="tableOptions.addButton"
    :download="downloadOptions"
    :axios-payload="bodyData"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @refreshAction="getDatatableList"
    @downloadEvent="exportAuditLog"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @searchChangedEvent="handleSearchChange"
    @sortChangedEvent="sortChanged"
  ></data-table>
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  COMMON_CONSTANTS,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { exportAuditLog, getAuditLogs } from '@/api/dashboard'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload, getTimeZoneForMoment } from '@/utils/functions'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

export default {
  name: 'AttacksVectors',
  components: {
    DataTable
  },
  data() {
    return {
      loading: true,
      labels,
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.AUDIT,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.AUDIT,
        columns: [
          /*{
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
          },*/
          {
            property: PROPERTY_STORE.USERNAME,
            align: 'left',
            editable: false,
            label: 'Attack Vector Name',
            sortable: true,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.USERNAME,
            align: 'left',
            editable: false,
            label: 'Type',
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
            label: 'Hash',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 140,
            filterableType: 'text',
            filterProps: { items: ['Include'] }
          },
          {
            property: PROPERTY_STORE.ENTITYNAME,
            align: 'left',
            editable: false,
            label: 'Severity',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 130,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: LABEL_STORE.CREATEDATE,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.OPERATION_ITEMS
          }
        ],

        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_AUDIT
        }
      },
      downloadOptions: {
        xls: true,
        csv: true,
        pdf: true
      },
      bodyData: getDefaultAxiosPayload({
        orderBy: 'LogDate',
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                { Value: '', FieldName: 'logDate', Operator: '>=' },
                { Value: '', FieldName: 'logDate', Operator: '<=' }
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
      }),
      defaultRequestBody: getDefaultAxiosPayload({
        orderBy: 'LogDate',
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                { Value: '', FieldName: 'logDate', Operator: '>=' },
                { Value: '', FieldName: 'logDate', Operator: '<=' }
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
      }),
      serverSideProps: new ServerSideProps()
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
    this.getDatatableList()
  },
  methods: {
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.bodyData.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    exportAuditLog({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber,
          pageSize,
          orderBy: this.bodyData.orderBy,
          ascending: this.bodyData.ascending,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
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
    columnFilterChanged(filter) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.getDatatableList()
    }
  }
}
</script>
