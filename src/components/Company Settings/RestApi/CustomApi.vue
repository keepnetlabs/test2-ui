<template>
  <div class="custom-api">
    <div class="custom-apis__container">
      <new-custom-api
        v-if="showNewCustomApi"
        ref="newCustomApi"
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
        filterable
        options
        selectable
        is-server-side
        :loading="loading"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :addButton="tableOptions.addButton"
        :row-actions="tableOptions.rowActions"
        :table="tableData"
        :select-event="tableOptions.selectEvent"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        @editAction="handleEdit"
        @downloadEvent="exportRestApi"
        @deleteAction="handleDelete"
        @onEmptyBtnClicked="toggleNewCustomApiStatus"
        @handleAddNewCustomApi="toggleNewCustomApiStatus"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
      />
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import NewCustomApi from '@/components/Company Settings/RestApi/NewCustomApi'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { deleteRestApi, exportRestApi, searchRestApi } from '@/api/restApi'
import DeleteCustomApi from '@/components/Company Settings/RestApi/DeleteCustomApi'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'CustomApi',
  components: {
    DeleteCustomApi,
    CompanySettingsHeader,
    DataTable,
    NewCustomApi
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      axiosPayload: getDefaultAxiosPayload(),
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

        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.REST_API,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.REST_API,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
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
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--rest-api'
        },
        addButton: {
          show: true,
          action: 'handleAddNewCustomApi',
          tooltip: labels.NewCustomApiBtnTooltip,
          id: 'btn-add--rest-api'
        }
      },
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      searchRestApi(this.axiosPayload)
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
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'StatusId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop === 'statusName' ? 'StatusId' : prop
      this.callForData()
    },
    exportRestApi(downloadTypes) {
      downloadTypes.exportTypes.map((exportType) => {
        const payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportRestApi(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Rest Api.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    closeNewCustomApiWithUpdate() {
      this.callForData()
      this.toggleNewCustomApiStatus()
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
          this.$refs.refCustomApiList.unSelectRow(this.selectedRow)
          this.toggleShowDeleteCustomApi()
          this.callForData()
        })
        .finally(() => {
          this.saveDisableDelete = false
        })
    },
    checkIfCanCloseCustomApiModal() {
      if (this.$refs.newCustomApi) {
        this.$refs.newCustomApi.closeOverlay()
      }
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
