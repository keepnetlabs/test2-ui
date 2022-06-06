<template>
  <div class="company-list">
    <delete-modal
      v-if="isShowDeleteModal"
      :is-show="isShowDeleteModal"
      :selectedRow="selectedRow"
      :groupCount="multipleDeleteGroupCount"
      :isMultiple="isMultipleDelete"
      :isActionButtonDisabled="isDeleting"
      @changeModalStatus="changeDeleteModalStatus"
      @confirmDelete="deleteConfirmedItem"
      @confirmMultipleDelete="deleteMultipleConfirmedItems"
    />
    <create-item-modal
      v-if="isShowAddModal"
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
      is-server-side-selection
      filterable
      options
      selectable
      :key="tableKey"
      :loading="loading"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="payload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @addButton="addButton"
      @downloadEvent="handleTableDownload"
      @delete="handleTableItemDelete"
      @editAction="editAction"
      @onEmptyBtnClicked="addButton"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getTableData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @searchChangedEvent="handleSearchChange"
      @sortChangedEvent="sortChanged"
      @handleMultipleDelete="handleMultipleDeleteOfCompanyGroups"
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
import { deleteCompanyGroup, exportCompanyGroup, searchCompanyGroups } from '@/api/company'
import DeleteModal from './DeleteModal'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

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
      isDeleting: false,
      tableKey: 'key-table-company-group',
      loading: false,
      tableData: [],
      isShowDeleteModal: false,
      isShowAddModal: false,
      editAddModal: false,
      selectedExtend: {},
      selectedRow: null,
      isCompanyGroupListLoaded: false,
      multipleDeletePayload: {},
      multipleDeleteGroupCount: 0,
      tableOptions: {
        downloadButton: { show: false, disable: false },
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.COMPANY_GROUP_LIST,
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
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        iEmpty: {
          id: 'btn-empty--company-group',
          message: labels.EmptyCompanyGroups,
          btn: labels.New,
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          id: 'btn-add--company-group',
          action: 'addButton',
          tooltip: 'Add Company Group',
          disabled: !this.$store.getters['permissions/getCompanyGroupsCreatePermissions']
        },
        rowActions: [
          {
            id: 'btn-edit--company-group-row-actions',
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true,
            disabled: !this.$store.getters['permissions/getCompanyGroupsEditPermissions']
          },
          {
            id: 'btn-delete--company-group-row-actions',
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this.$store.getters['permissions/getCompanyGroupsDeletePermissions']
          }
        ]
      },
      payload: getDefaultAxiosPayload(),
      defaultPayload: getDefaultAxiosPayload(),
      tableState: null,
      serverSideProps: new ServerSideProps()
    }
  },
  created() {
    if (this.isLoadState) {
      const tableState =
        this.$store.state['datatable'].tables['CompanyGroups'] &&
        this.$store.state['datatable'].tables['CompanyGroups'].tableState
      if (tableState) {
        this.serverSideProps = tableState.serverSideProps
        const { filterValues = {} } = tableState
        if (Object.keys(filterValues).length) {
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
      this.getTableData()
    }
  },
  methods: {
    handleMultipleDeleteOfCompanyGroups(items, excludedItems, selectAll) {
      const payload = {
        items: selectAll ? [] : items.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.payload.filter
      }
      this.multipleDeletePayload = payload
      this.multipleDeleteGroupCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : items.length
      this.isMultipleDelete = true
      this.changeDeleteModalStatus(true)
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getTableData()
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.payload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
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
      this.isMultipleDelete = false
      this.selectedRow = selectedItem
      this.changeDeleteModalStatus(true)
    },
    deleteConfirmedItem(selectedItem) {
      deleteCompanyGroup(selectedItem.resourceId).then((response) => {
        this.$refs.refGroupDataList.unSelectRow(selectedItem)
        if (response.data && response.data.message) {
          this.getTableData()
        }
      })
    },
    deleteMultipleConfirmedItems() {
      this.isDeleting = true
      return new Promise((res) =>
        setTimeout(() => {
          this.$nextTick(() => {
            this?.$refs?.refGroupDataList?.resetSelectableParams()
            this.getTableData()
          })
          res()
        }, 2500)
      ).finally(() => {
        this.isDeleting = false
      })
      // deleteCompanies(this.multipleDeletePayload)
      //   .then((response) => {
      //     nextTick(() => {
      //       if (this.$refs?.refGroupDataList) {
      //         this?.$refs?.refGroupDataList?.resetSelectableParams()
      //       }
      //     })
      //     if (response.data && response.data.message) {
      //       this.getTableData()
      //     }
      //   })
      //   .finally(() => {
      //     this.isDeleting = false
      //   })
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
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.payload)
      this.getTableData()
    },
    columnFilterCleared(fieldName) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterCleared(fieldName, this.payload)
      this.getTableData()
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
