<template>
  <div id="auditLogs" class="audit-logs">
    <div class="audit-logs__container">
      <div class="audit-logs__datatable">
        <data-table
          id="audit-data-list"
          ref="refAuditList"
          :loading="loading"
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :table="tableData"
          :refName="'auditList'"
          :columns="tableOptions.columns"
          :total-number-of-records="totalNumberOfRecords"
          :selectable="true"
          :filterable="true"
          :options="true"
          :sizeable="true"
          :pageSizes="tableOptions.pageSizes"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :show-all-records="showAllRecords"
          :addButton="tableOptions.addButton"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :isServerSide="false"
          @refreshAction="getDatatableList"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @on-all-records-button-click="handleAllRecordsClick"
          @set-default-search="handleSetDefaultSearch"
          @restore-default-search="handleRestoreDefaultSearch"
          @clear-filters="handleClearFilters"
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
  DEFAULT_SEARCH_CONTAINER_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { getAuditLogs } from '@/api/dashboard'

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
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.RESOURCEID,
            align: 'left',
            editable: false,
            label: LABEL_STORE.LOGID,
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
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
            property: PROPERTY_STORE.LOGDATE,
            align: 'left',
            editable: false,
            label: LABEL_STORE.LOGDATE,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'date'
          },
          {
            property: PROPERTY_STORE.ENTITYID,
            align: 'left',
            editable: false,
            label: LABEL_STORE.ENTITYID,
            fixed: false,
            sortable: true,
            show: true,
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
      bodyData: {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: 'LogDate',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      defaultRequestBody: {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: 'LogDate',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
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
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refAuditList.filterValues = {}
      this.$refs.refAuditList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.AUDIT)
      this.getDatatableList()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.AUDIT,
        JSON.stringify({
          filter: this.bodyData.filter,
          filterValues
        })
      )
    },
    getDatatableList() {
      this.loading = true
      getAuditLogs(this.bodyData)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords = 0 } = data
          this.totalNumberOfRecords = totalNumberOfRecords

          if (this.bodyData.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }

          if (totalNumberOfRecords <= 1000 && this.bodyData.pageSize === 1000) {
            this.showAllRecords = false
          }

          this.tableData = data.results
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
  mounted() {
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
