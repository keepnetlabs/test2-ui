<template>
  <div id="domains">
    <NewEditDomain
      v-if="modalStatus"
      :status="modalStatus"
      @changeStatus="changeStatus"
      :resourceId="resourceId"
      :isEdit="isEdit"
      :domainData="domainData"
    />
    <DeleteServiceModal
      :status="showDeleteModal"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      :selectedDomain="selectedDomain"
    />
    <data-table
      v-if="checkPermissions('phishing-simulator/domain-records', 'POST')"
      id="domains-data-table"
      ref="refDomainsListList"
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :show-all-records="showAllRecords"
      :refName="'domainsList'"
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
      @deleteAction="handleActionDelete"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @downloadEvent="exportDomains"
      @delete="handleActionDelete"
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
      @addAction="handleAdd"
    >
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { checkPermission } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDomainsList, deleteEmailTemplate, exportDnsService, getDomainData } from '@/api/domains'
import DeleteServiceModal from '@/components/Domains/DeleteServiceModal'
import NewEditDomain from '@/components/Domains/NewEditDomain'

export default {
  name: 'DomainList',
  components: {
    NewEditDomain,
    DataTable,
    DeleteServiceModal
  },
  data() {
    return {
      domainData: null,
      resourceId: null,
      methodItems: [],
      difficultyItems: [],
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      labels,
      showAllRecords: false,
      totalNumberOfRecords: 0,
      tableData: [],
      showDeleteModal: false,
      storedTableSettings: null,
      selectedDomain: null,
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: 'domain',
            align: 'left',
            editable: false,
            label: 'Domain',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 180
          },
          {
            property: 'dnsServiceProviderName',
            align: 'left',
            editable: false,
            label: 'DNS Name',
            fixed: false,
            sortable: true,
            show: true,
            width: 240,
            hasTooltip: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: 'dnsRecord',
            align: 'left',
            editable: false,
            label: 'DNS Record',
            sortable: true,
            show: true,
            fixed: false,
            width: 240,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: 'createdBy',
            align: 'left',
            editable: false,
            label: labels.CreatedBy,
            sortable: true,
            show: true,
            fixed: false,
            width: 240,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: labels.CreateTime,
            sortable: true,
            show: true,
            type: 'date',
            filterableType: 'date',
            width: 180
          }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.checkPermissions(
              'phishing-simulator/domain-records/{resourceId}',
              'PUT'
            )
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.checkPermissions(
              'phishing-simulator/domain-records/{resourceId}',
              'DELETE'
            )
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.checkPermissions(
            'phishing-simulator/domain-records/search/export',
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
          message: 'You do not have any domains',
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--domainList'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Domain',
          id: 'btn-add--DomainList',
          disabled: !this.checkPermissions('phishing-simulator/domain-records', 'POST')
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
      isTemplateDetails: false,
      templateHTML: null
    }
  },
  methods: {
    changeStatus(value, restart) {
      this.modalStatus = !this.modalStatus
      if (!value) this.resourceId = ''
      if (restart) {
        this.getDatatableList()
      }
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.DOMAINS, JSON.stringify(tableSettings))
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
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.bodyData.pageNumber = pageNumber
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
      this.getDatatableList()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.DOMAINS))
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refDomainsListList.filterValues = savedFilter.filterValues
          this.$refs.refDomainsListList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refDomainsListList.filterValues = {}
      this.$refs.refDomainsListList.columnKey = `column-key${Math.random()
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
        DEFAULT_SEARCH_CONTAINER_KEYS.DOMAINS,
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
      this.$refs.refDomainsListList.$refs.elTableRef.toggleRowSelection(row, false)
      deleteEmailTemplate(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleEdit(row, isDuplicate) {
      this.resourceId = row.resourceId
      this.isEdit = true
      this.modalStatus = true
    },
    handleAdd() {
      this.isEdit = false
      this.modalStatus = true
    },
    exportDomains({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportDnsService(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Domains.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch((error) => {})
      })
    },
    getDatatableList() {
      this.loading = true
      if (this.checkPermissions('phishing-simulator/domain-records', 'POST')) {
        getDomainsList(this.bodyData)
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
      this.selectedDomain = row
      this.showDeleteModal = true
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
      this.bodyData.filter.FilterGroups[0].FilterItems = requestBody
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName.toLowerCase() !== fieldName.toLowerCase()) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyData.filter.FilterGroups[0].FilterItems = filterPayload

      this.tableOptions.isColumnFilterActive =
        this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
      this.getDatatableList()
    }
  },
  created() {
    getDomainData().then((response) => {
      this.domainData = response.data.data
      this.getDefaultFilterAndSearch()
    })
    this.serverSideProps.pageSize = size
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.DOMAINS))
  }
}
</script>

<style lang="scss">
.dnsServiceList {
  min-height: 90vh;
}
.dnsServiceList__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
