<template>
  <div class="company-list">
    <create-or-edit-system-user
      v-if="showCreateOrEditSystemUserModal"
      :status="showCreateOrEditSystemUserModal"
      @closeOverlayWithUpdate="toggleCreateOrEditSystemUser"
      @closeOverlay="toggleCreateOrEditSystemUser"
    />
    <app-modal
      :status="isShowCreateOrEditModal"
      v-if="isShowCreateOrEditModal"
      :show-footer="false"
      class-name="company-create-edit"
      :show-header="false"
    >
      <template v-slot:overlay-body>
        <CompanyCreateOrEdit
          :selectedRow="selectedRow"
          :selectedExtend="selectedExtend"
          :edit="editModal"
          @cancelForm="cancelCreateOrEditForm"
          @closeFormAndOpenSystemUserModal="closeFormAndOpenSystemUserModal"
        />
      </template>
    </app-modal>

    <delete-modal
      v-if="isShowDeleteModal"
      :is-show="isShowDeleteModal"
      :selectedRow="selectedRow"
      @confirmDelete="deleteConfirmedItem"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <AddGroupToModal
      :companyIdArray="companyIdArray"
      :status="showAddGroupToModal"
      v-if="showAddGroupToModal"
      @changeStatus="handleStatusAddGroupToModal"
    />
    <create-item-modal
      :is-show="showCreateNewGroupWithCompany"
      :selectedRow="selectedRow"
      :forCompany="true"
      @changeModalStatus="changeGroupModalStatus"
    />

    <datatable
      :loading="loading"
      :selectable="true"
      :table="tableData"
      id="companies-data-table"
      ref="refDataList"
      is-server-side
      :server-side-props="serverSideProps"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :groupable="true"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :selectEvent="tableOptions.selectEvent"
      :refName="'companyList'"
      :clusterItems="[{ name: 'Company Name' }]"
      @clusterChanged="clusterChanged"
      row-key="companyName"
      :rowActions="tableOptions.rowActions"
      active-cluster=""
      @edit="handleTableItemEdit"
      @delete="handleTableItemDelete"
      @cellClick="handleCellClick"
      @downloadEvent="handleTableDownload"
      @addButton="addButton"
      @handleListBulleted="handleListBulletedClick"
      @onEmptyBtnClicked="addButton"
      @editAction="editAction"
      @searchChangedEvent="handleSearchChange"
      @AddGroupToModal="handleAddGroupToModal"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      v-bind="bindPropsIsSafari"
      @switchCompany="handleSwitchCompany"
      @createNewGroupWithCompany="handleCreateNewGroupWithCompany"
      @refreshAction="getTableData"
      @handleChangeIsSettingsOpen="handleChangeIsSettingsOpen"
      @sortChangedEvent="sortChanged"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span
          v-if="scope.column.property === 'companyName'"
          class="datatable-link"
          @click="handleCompanyNameClick(scope.row)"
        >
          {{ scope.row.companyName }}
        </span>
        <template v-else-if="scope.column.property === 'numberOfUsers'">
          <v-tooltip bottom v-if="isNumberOfUsersExceed(scope.row)">
            <template #activator="{on}">
              <span
                v-on="on"
                :class="{ 'number-of-users-exceed': isNumberOfUsersExceed(scope.row) }"
                >{{ scope.row['numberOfUsers'] }}</span
              >
            </template>
            <span>{{
              `License limit is exceeded. Current target user count is ${scope.row['targetUserCount']}.`
            }}</span>
          </v-tooltip>
          <span v-else>
            {{ scope.row['numberOfUsers'] }}
          </span>
        </template>
      </template>
      <template v-slot:extended-custom-view-slot>
        <company-list-extend
          ref="extend"
          v-show="isShowExtended"
          :selectedRow="selectedRow"
          :top="extendTop"
          :tableHeight="tableHeight"
          :selectedExtend="selectedExtend"
          @editAction="editAction"
          @close="closeExtend"
        />
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import { deleteCompany, exportCompanies, getCompanyByID, searchCompanies } from '@/api/company'
import DeleteModal from './DeleteModal'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import CompanyListExtend from '@/components/Companies/CompanyListExtend'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit'
import AddGroupToModal from '@/components/Companies/AddToGroupModal'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import AppModal from '@/components/AppModal'
import { getLookupListByTypeIdList } from '@/api/common'
import { checkPermission, handleIsSafari, setSafariClusterFix } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser'
export default {
  name: 'CompanyList',
  components: {
    AppModal,
    CreateItemModal,
    AddGroupToModal,
    CompanyCreateOrEdit,
    CompanyListExtend,
    Datatable,
    CreateOrEditSystemUser,
    DeleteModal
  },
  data: () => ({
    loading: true,
    tableData: [],
    showCreateOrEditSystemUserModal: false,
    tableHeight: 0,
    extendTop: 0,
    bindPropsIsSafari: {},
    isClustered: false,
    editModal: false,
    isShowDeleteModal: false,
    isShowExtended: false,
    isShowCreateOrEditModal: false,
    companyIdArray: [],
    showAddGroupToModal: false,
    showCreateNewGroupWithCompany: false,
    selectedExtend: {},
    selectedRow: {},
    tableOptions: {
      columns: [
        {
          property: PROPERTY_STORE.COMPANYNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'slot',
          filterableType: 'text',
          width: 180
        },
        {
          property: PROPERTY_STORE.INDUSTRYNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.INDUSTRYNAME),
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'select',
          filterableItems: [],
          filterableCustomFieldName: 'IndustryResourceId',
          width: 150
        },
        {
          property: PROPERTY_STORE.LICENSETYPENAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LICENSETYPENAME),
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'select',
          filterableItems: [],
          filterableCustomFieldName: 'LicenseTypeResourceId',
          width: 150
        },
        {
          property: PROPERTY_STORE.NUMBEROFUSERS,
          align: 'right',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.NUMBEROFUSERS),
          sortable: true,
          show: true,
          type: 'slot',
          filterableType: 'text',
          width: 130
        },
        {
          property: PROPERTY_STORE.LICENSEENDDATE,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LICENSEENDDATE),
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'date',
          width: 180
        },
        {
          property: 'createTime',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATEDATE),
          fixed: false,
          sortable: true,
          show: true,
          filterableType: 'date',
          type: 'text',
          width: 180
        }
      ],
      pageSizes: [5, 10, 25],
      isColumnFilterActive: false,
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: false,
        download: false
      },
      iEmpty: {
        message: 'No company defined',
        btn: 'ADD A COMPANY',
        icon: 'mdi-account-plus'
      },
      addButton: {
        show: true,
        action: 'addButton',
        tooltip: 'Add Company',
        disabled: !checkPermission('companies', 'POST')
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'editAction',
          isNotShow: true,
          disabled: !checkPermission('companies/{resourceId}', 'PUT')
        },
        {
          name: 'Add to a company group',
          icon: 'mdi-account-multiple-plus',
          action: 'AddGroupToModal',
          disabled: !checkPermission('company-groups/search', 'POST')
        },
        {
          name: 'Create a new company group with company',
          icon: 'mdi-account-multiple',
          action: 'createNewGroupWithCompany',
          disabled: !checkPermission('companies/search', 'POST')
        },
        {
          name: 'Switch to company',
          icon: 'mdi-swap-horizontal',
          action: 'switchCompany',
          disabled: !checkPermission('companies/search', 'POST')
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'delete',
          disabled: !checkPermission('companies/{resourceId}', 'DELETE')
        }
      ]
    },
    payload: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'CreateTime',
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
    serverSideProps: new ServerSideProps()
  }),
  watch: {
    isShowCreateOrEditModal() {
      document.querySelector('html').classList.toggle('overflow-y-hidden')
    }
  },
  created() {
    //generic
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    this.setQueryValuesToPayload(this.$route.query)
    this.getLookUpDatas()
    if (handleIsSafari()) {
      this.bindPropsIsSafari['handleSetCellClass'] = (obj) => {
        return setSafariClusterFix(obj, 'companyName')
      }
    }
  },
  methods: {
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.payload.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.payload.pageSize = size
      this.serverSideProps.pageSize = size
    },
    toggleCreateOrEditSystemUser() {
      this.showCreateOrEditSystemUserModal = !this.showCreateOrEditSystemUserModal
    },
    handleSwitchCompany(account = {}) {
      this.$router.go(0)
      localStorage.setItem('isSelectCompany', true)
      localStorage.setItem('companyId', account.companyResourceId)
      localStorage.setItem('companyRequestId', account.companyResourceId)
      localStorage.setItem('selectedCompanyRequestId', account.companyResourceId)
      localStorage.setItem('selectedCompanyName', account.companyName)
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.payload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.getTableData()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.getTableData()
    },
    resetPageNumber() {
      //generic
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
      this.queryHelper.setRouterQuery('page', 1)
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    isNumberOfUsersExceed({ numberOfUsers, targetUserCount, isNumberOfUsersLimited } = {}) {
      return isNumberOfUsersLimited && targetUserCount > Number(numberOfUsers)
    },
    handleChangeIsSettingsOpen(val) {
      if (val) {
        this.isShowExtended = false
      }
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.getTableData()
    },
    handleCellClick({ column, event }) {
      if (column.property === 'companyName') {
        this.extendTop = event.offsetTop
      }
    },
    getLookUpDatas() {
      getLookupListByTypeIdList({ typeidlist: [2, 3] })
        .then((response) => {
          const res = response.data.data
          this.$set(
            this.tableOptions.columns[1],
            'filterableItems',
            res
              .filter((item) => item.genericCodeTypeId === 2)
              .map((item) => ({ text: item.name, value: item.resourceId }))
          )
          this.$set(
            this.tableOptions.columns[2],
            'filterableItems',
            res
              .filter((item) => item.genericCodeTypeId === 3)
              .map((item) => ({ text: item.name, value: item.resourceId }))
          )
        })
        .finally(() => this.getTableData())
    },
    getTableData(payload) {
      const _payload = { ...this.payload, ...payload, isClustered: this.isClustered }
      this.loading = true
      searchCompanies(_payload)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data

          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          //this.queryHelper.setRouterQuery('page', pageNumber)

          this.tableData =
            response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
              ? this.getManipulatedTableData(response.data.data.results)
              : []
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    getManipulatedTableData(data, isChild = false) {
      data.forEach((item) => {
        if (isChild) {
          item.isChild = true
        }
        if (item.children) {
          this.getManipulatedTableData(item.children, true)
        }
      })
      return data
    },
    clusterChanged() {
      this.isClustered = true
      this.resetPageNumber()
      this.resetTableFilters()
      this.getTableData()
    },
    handleListBulletedClick() {
      this.isClustered = false
      this.resetPageNumber()
      this.resetTableFilters()
      this.getTableData()
    },
    resetTableFilters() {
      this.payload.filter.FilterGroups[0].FilterItems = []
      this.$refs.refDataList.filterValues = {}
      this.queryHelper.setRouterQuery('page', 1)
      this.$refs.refDataList.columnKey = `key-${Math.random().toString().substring(0, 7)}`
    },
    handleClusterLoad({ tree, treeNode, resolve, callback }) {},
    handleTableItemEdit(row) {},
    handleTableItemDelete(selectedItem) {
      this.selectedRow = selectedItem
      this.changeDeleteModalStatus(true)
    },
    deleteConfirmedItem(selectedItem) {
      deleteCompany(selectedItem.companyResourceId).then((response) => {
        this.$refs.refDataList.$refs.elTableRef.toggleRowSelection(selectedItem, false)
        if (response.data && response.data.message) {
          this.getTableData()
        }
      })
    },
    changeDeleteModalStatus(status) {
      this.isShowDeleteModal = status
    },
    changeCreateOrEditModalStatus(status) {
      this.isShowCreateOrEditModal = status
    },
    handleCompanyNameClick(row) {
      this.$refs.extend.clickClose()
      this.selectedRow = row
      this.selectedExtend = {}
      if (this.$refs && this.$refs.refDataList && this.$refs.refDataList.isSettingsOpened) {
        this.$refs.refDataList.toggleIsSettingsOpened()
      }
      this.isShowExtended = true
      this.tableHeight = this.$refs.refDataList.$el.clientHeight
      getCompanyByID(row.companyResourceId, false)
        .then((response) => {
          this.selectedExtend = response.data.data
        })
        .catch(() => {
          this.isShowExtended = false
        })
    },
    handleTableDownload(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          isClustered: this.isClustered,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.payload.filter
        }
        exportCompanies(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Companies.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch(() => {})
      })
    },
    addButton() {
      this.changeCreateOrEditModalStatus(true)
    },
    editAction(row) {
      this.selectedRow = row
      this.editModal = true
      this.isShowExtended = false

      getCompanyByID(row.companyResourceId)
        .then((response) => {
          this.selectedExtend = response.data.data
          this.changeCreateOrEditModalStatus(true)
        })
        .catch((error) => {
          this.isShowExtended = false
        })
    },
    cancelCreateOrEditForm() {
      this.isShowCreateOrEditModal = false
      this.editModal = false
      this.selectedExtend = {}
      this.selectedRow = {}
      this.getTableData({ orderBy: 'createTime', ascending: false })
    },
    closeFormAndOpenSystemUserModal() {
      this.cancelCreateOrEditForm()
      this.toggleCreateOrEditSystemUser()
    },
    closeExtend() {
      this.selectedExtend = {}
      this.isShowExtended = false
      this.selectedRow = {}
    },
    handleAddGroupToModal(v) {
      if (Array.isArray(v)) {
        this.companyIdArray = v.map((x) => x.companyResourceId)
      } else {
        this.companyIdArray = [v.companyResourceId]
      }
      this.showAddGroupToModal = true
    },
    handleStatusAddGroupToModal(status) {
      this.showAddGroupToModal = status
      if (status === false) {
        this.getTableData()
      }
    },
    handleCreateNewGroupWithCompany(row) {
      this.changeGroupModalStatus(true)
      this.selectedRow = { ...row, ...{ name: null }, ...{ resourceId: row.companyResourceId } }
    },
    changeGroupModalStatus(status) {
      this.showCreateNewGroupWithCompany = status
    },
    columnFilterChanged(filter) {
      //generic
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.payload.filter.FilterGroups[0].FilterItems
      this.resetPageNumber()
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
      //generic
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
  }
}
</script>

<style lang="scss">
.company-list {
  margin-top: 24px;
}
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
.company-create-edit {
  .k-overlay__container {
    padding: 0 !important;
  }
  .v-overlay__content {
    overflow-x: hidden;
  }
  .v-stepper__items {
    min-height: 75vh;
  }
}
.number-of-users-exceed {
  color: red;
}
</style>
