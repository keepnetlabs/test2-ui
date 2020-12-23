<template>
  <div class="custom-api">
    <div class="custom-apis__container">
      <new-custom-api
        v-if="showNewCustomApi"
        :selectedRow="selectedRow"
        :status="showNewCustomApi"
        @closeOverlay="toggleNewCustomApiStatus"
        @closeOverlayWithUpdate="closeNewCustomApiWithUpdate"
      />
      <delete-custom-api
        v-if="showDeleteCustomApi"
        :selected-row="selectedRow"
        :status="showDeleteCustomApi"
        :save-disable="saveDisableDelete"
        @closeDialog="toggleShowDeleteCustomApi"
        @handleDelete="handleDeleteCustomApi"
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
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import NewCustomApi from '@/components/Company Settings/RestApi/NewCustomApi'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { deleteRestApi, searchRestApi } from '@/api/restApi'
import DeleteCustomApi from '@/components/Company Settings/RestApi/DeleteCustomApi'
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
      selectedRow: null,
      saveDisableDelete: false,
      showNewCustomApi: false,
      showDeleteCustomApi: false,
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
            filterableType: 'text',
            width: 260
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
            filterableType: 'text',
            width: 280
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
            filterableType: 'select',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }],
            width: 150
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
            filterableType: 'date'
          }
        ],
        pageSizes: [5, 10, 25],
        isColumnFilterActive: false,
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
    DeleteCustomApi,
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
    closeNewCustomApiWithUpdate() {
      this.callForSearch()
      this.toggleNewCustomApiStatus()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.axiosPayload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.axiosPayload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForSearch()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.axiosPayload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForSearch()

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleEdit(row = {}) {
      this.selectedRow = row
      this.toggleNewCustomApiStatus()
    },
    handleDelete(row = {}) {
      this.selectedRow = row
      this.toggleShowDeleteCustomApi()
    },
    handleDeleteCustomApi(resourceId = '') {
      this.saveDisableDelete = true
      deleteRestApi(resourceId)
        .then(() => {
          this.toggleShowDeleteCustomApi()
        })
        .finally(() => {
          this.saveDisableDelete = false
        })
    },
    toggleNewCustomApiStatus() {
      if (this.showNewCustomApi) {
        this.selectedRow = null
      }
      this.showNewCustomApi = !this.showNewCustomApi
    },
    toggleShowDeleteCustomApi() {
      if (this.showDeleteCustomApi) {
        this.selectedRow = null
      }
      this.showDeleteCustomApi = !this.showDeleteCustomApi
    }
  }
}
</script>

<style></style>
