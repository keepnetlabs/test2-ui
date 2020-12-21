<template>
  <div class="custom-api">
    <div class="custom-apis__container">
      <new-custom-api
        v-if="showNewCustomApi"
        :status="showNewCustomApi"
        @closeOverlay="toggleNewCustomApiStatus"
      />
      <company-settings-header
        title="Rest API"
        sub-title="Create API Key to your customers for integration"
      />
      <data-table
        id="custom-api-data-table"
        ref="refCustomApiList"
        :refName="'smtpSettingsList'"
        :loading="loading"
        :columns="tableOptions.columns"
        :countRow="5"
        :empty="tableOptions.empty"
        :filterable="true"
        :isServerSide="false"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :sizeable="true"
        :table="tableData"
        @editAction="handleEdit"
        @deleteAction="handleDelete"
        @onEmptyBtnClicked="toggleNewCustomApiStatus"
        @handleAddNewCustomApi="toggleNewCustomApiStatus"
        @refreshAction="callForSearch"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import NewCustomApi from '@/components/Company Settings/NewCustomApi'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { searchRestApi } from '@/api/restApi'
export default {
  name: 'CustomApi',
  data() {
    return {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'CreateTime',
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
      loading: false,
      showNewCustomApi: false,
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.CLIENTNAME,
            align: 'left',
            editable: false,
            label: labels.ClientName,
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 140
          },
          {
            property: PROPERTY_STORE.CLIENTID,
            align: 'left',
            editable: false,
            label: labels.ApiKey,
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 240
          },
          {
            property: PROPERTY_STORE.STATUSNAME,
            align: 'center',
            editable: false,
            label: labels.Status,
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            width: 180
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: labels.CreateTime,
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            width: 180
          }
        ],
        pageSizes: [5, 10, 25],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'editAction'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ],
        empty: {
          message: labels.EmptyCustomApiMessage,
          subMes: labels.SubMesCustomApiMessage,
          btn: labels.NewCustomApiBtnMessage,
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          action: 'handleAddNewCustomApi',
          tooltip: labels.NewCustomApiBtnTooltip
        }
      }
    }
  },
  components: {
    CompanySettingsHeader,
    DataTable,
    NewCustomApi
  },
  created() {
    this.callForSearch()
  },
  methods: {
    callForSearch() {
      this.loading = true
      searchRestApi(this.axiosPayload)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          this.tableData = data.results || []
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleEdit(row = {}) {},
    handleDelete(row = {}) {},
    toggleNewCustomApiStatus() {
      this.showNewCustomApi = !this.showNewCustomApi
    }
  }
}
</script>

<style></style>
