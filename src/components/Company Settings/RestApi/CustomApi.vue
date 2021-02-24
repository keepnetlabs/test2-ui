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
        id="company-settings-rest-api-data-table"
        ref="refCustomApiList"
        :refName="'smtpSettingsList'"
        :loading="loading"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :filterable="true"
        :isServerSide="false"
        :show-all-records="showAllRecords"
        :total-number-of-records="totalNumberOfRecords"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :row-actions="tableOptions.rowActions"
        :selectable="true"
        :sizeable="true"
        :table="tableData"
        @editAction="handleEdit"
        @downloadEvent="exportRestApi"
        @deleteAction="handleDelete"
        @onEmptyBtnClicked="toggleNewCustomApiStatus"
        @handleAddNewCustomApi="toggleNewCustomApiStatus"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearch"
        @on-all-records-button-click="handleAllRecordsClick"
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
import { deleteRestApi, exportRestApi, searchRestApi } from '@/api/restApi'
import DeleteCustomApi from '@/components/Company Settings/RestApi/DeleteCustomApi'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
export default {
  name: 'CustomApi',
  data() {
    return {
      showAllRecords: false,
      totalNumberOfRecords: 0,
      axiosPayload: {
        pageNumber: 1,
        pageSize: 1000,
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
            width: 150,
            filterableType: 'select',
            filterableCustomFieldName: 'StatusId',
            filterableItems: [
              { text: labels.Active, value: '1' },
              { text: labels.InActive, value: '0' }
            ]
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
            id: 'btn-edit--rest-api-row-actions',
            action: 'editAction'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            id: 'btn-delete--rest-api-row-actions',
            action: 'deleteAction'
          }
        ],
        empty: {
          message: labels.EmptyCustomApiMessage,
          subMes: labels.SubMesCustomApiMessage,
          btn: labels.NewCustomApiBtnMessage,
          icon: 'mdi-plus',
          id: 'btn-empty--rest-api'
        },
        addButton: {
          show: true,
          action: 'handleAddNewCustomApi',
          tooltip: labels.NewCustomApiBtnTooltip,
          id: 'btn-add--rest-api'
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
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords = 0 } = data
          this.totalNumberOfRecords = totalNumberOfRecords
          if (this.axiosPayload.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }
          if (totalNumberOfRecords <= 1000 && this.axiosPayload.pageSize === 1000) {
            this.showAllRecords = false
          }
          this.tableData = data.results || []
        })
        .finally(() => {
          this.loading = false
        })
    },
    exportRestApi({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.axiosPayload.filter)),
        this.$refs.refCustomApiList,
        'CreateTime'
      )
      if (this.$refs.refCustomApiList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
        clientTableExportHelper.filter.FilterGroups[1].FilterItems.find(
          (item) => item.FieldName === 'StatusName'
        ).FieldName = 'StatusId'
      }
      if (this.$refs.refCustomApiList.sortProps && this.$refs.refCustomApiList.sortProps.order) {
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
        exportRestApi(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Rest Api.${exportType.toLocaleLowerCase()}`
          link.click()
        })
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
    handleAllRecordsClick() {
      this.axiosPayload.pageSize = 75000
      this.showAllRecords = false
      this.callForSearch()
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
          this.callForSearch()
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
