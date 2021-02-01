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
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :loading="loading"
      :table="tableData"
      ref="refGroupDataList"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :is-downloadable="true"
      @downloadEvent="handleTableDownload"
      id="company-groups-data-table"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'companyList'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      @addButton="addButton"
      @delete="handleTableItemDelete"
      @editAction="editAction"
      @onEmptyBtnClicked="addButton"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getTableData"
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
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import { checkPermission } from '@/utils/functions'

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
      loading: false,
      tableData: [],
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
          message: 'No company groups defined',
          btn: 'ADD A COMPANY GROUP',
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          action: 'addButton',
          tooltip: 'Add Company Group',
          disabled: !this.checkPermissions('company-groups', 'POST')
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true,
            disabled: !this.checkPermissions('company-groups/{resourceId}', 'PUT')
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this.checkPermissions('company-groups/{resourceId}', 'DELETE')
          }
        ]
      },
      payload: {
        pageSize: 30000,
        orderBy: 'createTime',
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
      tableState: null
    }
  },
  created() {
    if (this.isLoadState) {
      const tableState =
        this.$store.state['datatable'].tables['CompanyGroups'] &&
        this.$store.state['datatable'].tables['CompanyGroups'].tableState
      if (tableState) {
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
        this.tableState = { persistentState: tableState }
      }
    } else {
      this.getTableData()
    }
  },
  methods: {
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
        console.log('copyOfFilter', copyOfFilter)
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
            link.download = `Companies.${item.toLocaleLowerCase()}`
            link.click()
          })
          .catch(() => {})
      })
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    getTableData() {
      this.loading = true
      searchCompanyGroups(this.payload)
        .then((response) => {
          this.tableData = response.data.data.results.length > 0 ? response.data.data.results : []
        })
        .catch((error) => {
          this.tableData = []
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
    const tableState = this.$refs.refGroupDataList.getState()
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
