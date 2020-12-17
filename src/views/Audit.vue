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
            property: PROPERTY_STORE.LOGID,
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
            property: PROPERTY_STORE.USERID,
            align: 'left',
            editable: false,
            label: LABEL_STORE.USERNAME,
            sortable: true,
            show: true,
            type: 'text',
            width: 160
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
            width: 160
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
            width: 185
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
            width: 185
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
            width: 185
          },
          {
            property: PROPERTY_STORE.OLDVALUE,
            align: 'left',
            editable: false,
            label: LABEL_STORE.OLDVALUE,
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
        ascending: false
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
