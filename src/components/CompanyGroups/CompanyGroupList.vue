<template>
  <div class="company-list">
    <delete-modal
      v-if="isShowDeleteModal"
      :is-show="isShowDeleteModal"
      :selectedRow="selectedRow"
      @changeModalStatus="changeDeleteModalStatus"
      @confirmDelete="deleteConfirmedItem"
    />
    <create-item-modal
      :is-show="isShowAddModal"
      :isEdit="editAddModal"
      :selectedRow="selectedRow"
      @changeModalStatus="changeAddModalStatus"
      @companyGroupCreated="companyGroupCreated"
    />

    <datatable
      v-bind="tableState"
      id="company-groups-data-table"
      ref="refGroupDataList"
      is-server-side
      :key="tableKey"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :loading="loading"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :stored-table-settings="storedTableSettings"
      :total-number-of-records="totalNumberOfRecords"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :is-downloadable="true"
      :show-all-records="showAllRecords"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'companyList'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      @addButton="addButton"
      @downloadEvent="handleTableDownload"
      @delete="handleTableItemDelete"
      @editAction="editAction"
      @onEmptyBtnClicked="addButton"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getTableData"
      @on-all-records-button-click="handleAllRecordsClick"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @on-table-settings-change="handleSetRenderedColumns"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @searchChangedEvent="handleSearchChange"
      @sortChangedEvent="sortChanged"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span v-if="scope.row.name" class="datatable-link">
          <span @click="goToDetails(scope.row)">{{ scope.row.name }}</span>
        </span>
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import { deleteCompanyGroup, exportCompanyGroup, searchCompanyGroups } from '../../api/company'
import DeleteModal from './DeleteModal'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '../../model/constants/commonConstants'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import { checkPermission } from '@/utils/functions'
import QueryHelperForTable from '@/helper-classes/query-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'

export default {
  name: 'CompanyGroupList',
  components: {
    CreateItemModal,
    Datatable,
    DeleteModal
  },
  props: {
    isLoadState: {
      type: Boolean
    }
  },
  data() {
    return {
      tableKey: 'key-table-company-group',
      loading: false,
      tableData: [],
      storedTableSettings: null,
      isShowDeleteModal: false,
      isShowAddModal: false,
      editAddModal: false,
      selectedExtend: {},
      selectedRow: null,
      isCompanyGroupListLoaded: false,
      tableOptions: {
        isColumnFilterActive: false,
        downloadButton: { show: false, disable: false },
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'text'
          },
          {
            property: 'companyCount',
            align: 'right',
            editable: false,
            label: 'Companies',
            sortable: true,
            show: true,
            type: 'text',
            width: 140
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          }
        ],
        pageSizes: [5, 10, 25],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          id: 'btn-empty--company-group',
          message: 'No company groups defined',
          btn: 'ADD A COMPANY GROUP',
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          id: 'btn-add--company-group',
          action: 'addButton',
          tooltip: 'Add Company Group',
          disabled: !this.checkPermissions('company-groups', 'POST')
        },
        rowActions: [
          {
            id: 'btn-edit--company-group-row-actions',
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true,
            disabled: !this.checkPermissions('company-groups/{resourceId}', 'PUT')
          },
          {
            id: 'btn-delete--company-group-row-actions',
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this.checkPermissions('company-groups/{resourceId}', 'DELETE')
          }
        ]
      },
      showAllRecords: false,
      totalNumberOfRecords: 0,
      payload: {
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
      defaultPayload: {
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
      tableState: null,
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.setDefaultValues()
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.payload.pageSize = size
    this.serverSideProps.pageSize = size
    this.payload.pageNumber = page
    if (this.isLoadState) {
      const tableState =
        this.$store.state['datatable'].tables['CompanyGroups'] &&
        this.$store.state['datatable'].tables['CompanyGroups'].tableState
      if (tableState) {
        this.serverSideProps = tableState.serverSideProps
        const { filterValues = {} } = tableState
        if (Object.keys(filterValues).length) {
          this.tableOptions.isColumnFilterActive = true
          for (const [key, value] of Object.entries(filterValues)) {
            if (value.selectValue === 'between') {
              this.payload.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue[0],
                FieldName: key,
                Operator: '>='
              })
              this.payload.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue[1],
                FieldName: key,
                Operator: '<='
              })
            } else {
              this.payload.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue,
                FieldName: key,
                Operator: value.selectValue
              })
            }
          }
        }
        this.loading = true
        searchCompanyGroups(this.payload)
          .then((response) => {
            const {
              data: { data }
            } = response
            tableState.initialData = data.results

            let maxPage = Math.ceil(tableState.initialData.length / tableState.rowCount)
            if (maxPage > tableState.currentPage) {
              maxPage = tableState.currentPage
            }
            tableState.tableData = tableState.initialData.slice(
              (maxPage - 1) * tableState.rowCount,
              maxPage * tableState.rowCount
            )
            tableState.multipleSelection = tableState.multipleSelection.reduce((acc, selection) => {
              const index = tableState.initialData.findIndex(
                (item) => item.resourceId === selection.resourceId
              )
              if (index === -1) {
                acc.push(selection)
              } else {
                acc.push(tableState.initialData[index])
              }
              return acc
            }, [])
            if (tableState.search) {
              tableState.filteredData = tableState.initialData.filter((row) => {
                return tableState.filteredData.find((filteredRow) => {
                  return filteredRow.resourceId === row.resourceId
                })
              })
            }

            this.tableState = { persistentState: tableState }
            this.tableKey = Math.random().toString().substring(0, 5)
          })
          .finally(() => (this.loading = false))
      }
    } else {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.COMPANY_GROUP_LIST)
      )
      this.getDefaultFilterAndSearch()
      this.getTableData()
    }
  },
  methods: {
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.getTableData()
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.tableOptions.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.payload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
      this.getTableData()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.getTableData()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_LIST,
        JSON.stringify({
          filter: this.payload.filter,
          filterValues
        })
      )
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.COMPANY_GROUP_LIST, JSON.stringify(tableSettings))
    },
    handleRestoreDefaultSearch() {
      this.getDefaultFilterAndSearch()
      this.getTableData()
    },
    handleClearFilters() {
      this.payload = JSON.parse(JSON.stringify(this.defaultPayload))
      this.$refs.refGroupDataList.filterValues = {}
      this.$refs.refGroupDataList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_LIST)
      this.getTableData()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_LIST)
      )
      if (savedFilter) {
        this.payload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refGroupDataList.filterValues = savedFilter.filterValues
          this.$refs.refGroupDataList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
    },
    handleTableDownload(downloadTypes) {
      const searchFilter = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      const copyOfFilter = JSON.parse(JSON.stringify(this.payload.filter))
      if (this.$refs.refGroupDataList && this.$refs.refGroupDataList.search) {
        searchFilter.FilterItems = this.$refs.refGroupDataList
          .getSearchFilterItems()
          .filter((item) => item.FieldName.toLowerCase() !== 'companycount')
        copyOfFilter.FilterGroups.push(searchFilter)
      }
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: copyOfFilter
        }
        exportCompanyGroup(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Company Groups.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch(() => {})
      })
    },
    handleAllRecordsClick() {
      this.payload.pageSize = 75000
      this.showAllRecords = false
      this.getTableData()
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    getTableData() {
      this.loading = true
      searchCompanyGroups(this.payload)
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
        .finally(() => (this.loading = false))
    },
    handleTableItemDelete(selectedItem) {
      this.selectedRow = selectedItem
      this.changeDeleteModalStatus(true)
    },
    deleteConfirmedItem(selectedItem) {
      deleteCompanyGroup(selectedItem.resourceId).then((response) => {
        if (response.data && response.data.message) {
          this.getTableData()
        }
      })
    },
    changeDeleteModalStatus(status) {
      this.isShowDeleteModal = status
    },
    changeAddModalStatus(status) {
      this.isShowAddModal = status
    },
    addButton() {
      this.selectedRow = null
      this.editAddModal = false
      this.changeAddModalStatus(true)
    },
    companyGroupCreated() {
      this.selectedRow = null
      this.editAddModal = false
      this.getTableData({ orderBy: 'createdTime', ascending: false })
    },
    editAction(row) {
      this.changeAddModalStatus(true)
      this.selectedRow = row
      this.editAddModal = true
    },
    goToDetails(selectedRow) {
      localStorage.setItem('companyGroupName', selectedRow.name)
      localStorage.setItem('companyGroupResourceId', selectedRow.resourceId)
      this.$router.push({
        name: 'Company Group Details',
        params: { groupId: selectedRow.resourceId }
      })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.payload.filter.FilterGroups[0].FilterItems
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

      this.payload.filter.FilterGroups[0].FilterItems = requestBody
      this.getTableData()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.payload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.payload.filter.FilterGroups[0].FilterItems = filterPayload
      this.getTableData()

      this.tableOptions.isColumnFilterActive =
        this.payload.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },
  beforeDestroy() {
    const tableState = {
      ...this.$refs.refGroupDataList.getState(),
      serverSideProps: this.serverSideProps
    }
    this.$store.dispatch('datatable/setTable', {
      key: 'CompanyGroups',
      tableState
    })
  }
}
</script>

<style lang="scss">
.people {
  padding-top: 24px;

  .add-users__title {
    font-size: 14px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .edit-fields {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    margin-top: 10px;
    cursor: pointer;
    color: #2196f3;
  }

  .btn-add {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5);
    background-color: #2196f3;
    color: white;

    .v-icon {
      font-size: 18px !important;
      color: white;
    }
  }
}

.clock-wise {
  .cell {
    * {
      visibility: visible !important;
    }
  }

  i {
    animation: antiClockwiseSpin 1s infinite ease-in;
    animation-delay: 0s;
    color: #2196f3 !important;
  }
}

@keyframes antiClockwiseSpin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
