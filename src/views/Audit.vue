<template>
  <div id="auditLogs" class="audit-logs">
    <div class="audit-logs__container">
      <div class="audit-logs__datatable">
        <data-table
          :loading="loading"
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :table="tableData"
          id="audit-data-list"
          ref="refAuditList"
          :refName="'auditList'"
          :columns="tableOptions.columns"
          :countRow="5"
          :selectable="true"
          :filterable="true"
          :options="true"
          :sizeable="true"
          :pageSizes="tableOptions.pageSizes"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :addButton="tableOptions.addButton"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :isServerSide="false"
          @refreshAction="getDatatableList"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
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
  LABEL_STORE
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
            width: 160,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.LOGDATE,
            align: 'center',
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
            filterableType: 'text'
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
            width: 185,
            filterableType: 'text'
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
            filterableType: 'text'
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
            width: 185
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
        pageSize: 75000,
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
    getDatatableList() {
      this.loading = true
      getAuditLogs(this.bodyData)
        .then((response) => {
          this.tableData = response.data.data.results
        })
        .finally(() => {
          this.loading = false
        })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      requestBody.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
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
    this.getDatatableList()
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
