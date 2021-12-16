<template>
  <div class="company-list">
    <app-modal
      :status="isShowCreateOrEditModal"
      v-if="isShowCreateOrEditModal"
      :show-footer="false"
      class-name="company-create-edit"
      :show-header="false"
    >
      <template v-slot:overlay-body>
        <CompanyCreateOrEdit
          @cancelForm="cancelCreateOrEditForm"
          :selectedRow="selectedRow"
          :selectedExtend="selectedExtend"
          :edit="editModal"
        />
      </template>
    </app-modal>
    <remove-modal
      v-if="isShowRemoveModal"
      :is-show="isShowRemoveModal"
      :selectedRow="selectedRow"
      :save-disable="removeModalDisable"
      @confirmRemove="removeConfirmedItem"
      @changeModalStatus="changeRemoveModalStatus"
    />
    <AddGroupToModal
      :companyIdArray="companyIdArray"
      :status="showAddGroupToModal"
      v-if="showAddGroupToModal"
      @changeStatus="handleStatusAddGroupToModal"
    />
    <create-item-modal
      v-if="showCreateNewGroupWithCompany"
      :is-show="showCreateNewGroupWithCompany"
      :selectedRow="selectedRow"
      :forCompany="forCompany"
      @changeModalStatus="handleCreateItemModal"
      :is-edit="editCreateGroup"
      @companyGroupCreated="handleSubmit"
    />

    <AddCompaniesToCompanyGroup
      v-if="showAddCompanyModal"
      :status="showAddCompanyModal"
      :selected-group="selectedRow"
      @close-overlay="toggleShowAddCompanyModal"
      @close-overlay-with-update="closeAddCompanyModalWithUpdate"
    />

    <datatable
      id="company-groups-details-data-table"
      ref="refDataList"
      row-key="companyName"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :loading="loading"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :total-number-of-records="totalNumberOfRecords"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :show-all-records="showAllRecords"
      :stored-table-settings="storedTableSettings"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'companyList'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      @addButton="addButton"
      @onEmptyBtnClicked="addButton"
      @edit="handleTableItemEdit"
      @remove="handleTableItemRemove"
      @editAction="editAction"
      @AddGroupToModal="handleAddGroupToModal"
      @createNewGroupWithCompany="handleCreateNewGroupWithCompany"
      @refreshAction="getTableData"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @downloadEvent="handleTableDownload"
      @on-all-records-button-click="handleAllRecordsClick"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @on-table-settings-change="handleSetRenderedColumns"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      :isServerSide="true"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
    />
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import {
  exportCompanyGroupDetails,
  getCompanyByID,
  removeCompanyToCompanyGroup,
  searchGroupCompanies
} from '@/api/company'
import { getLookupListByTypeId } from '@/api/common'
import RemoveModal from './RemoveModal'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit'
import AddGroupToModal from '@/components/Companies/AddToGroupModal'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import labels from '@/model/constants/labels'
import AppModal from '@/components/AppModal'
import AddCompaniesToCompanyGroup from '@/components/CompanyGroups/AddCompaniesToCompanyGroup'
import ServerSideProps from '@/helper-classes/server-side-table-props'
export default {
  name: 'CompanyGroupDetails',
  components: {
    AddCompaniesToCompanyGroup,
    AppModal,
    CreateItemModal,
    AddGroupToModal,
    CompanyCreateOrEdit,
    Datatable,
    RemoveModal
  },
  props: {
    groupId: {
      type: String,
      require: true
    }
  },
  data: () => ({
    showAddCompanyModal: false,
    loading: true,
    showAllRecords: false,
    totalNumberOfRecords: 0,
    editCreateGroup: false,
    forCompany: true,
    tableData: [],
    storedTableSettings: null,
    editModal: false,
    isShowRemoveModal: false,
    isShowExtended: false,
    isShowCreateOrEditModal: false,
    companyIdArray: [],
    showAddGroupToModal: false,
    showCreateNewGroupWithCompany: false,
    removeModalDisable: false,
    selectedExtend: {},
    selectedRow: {},
    tableOptions: {
      isColumnFilterActive: false,
      columns: [
        {
          property: PROPERTY_STORE.COMPANYNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          minWidth: 180,
          filterableType: 'text'
        },
        {
          property: PROPERTY_STORE.INDUSTRYNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.INDUSTRYNAME),
          sortable: true,
          show: true,
          type: 'text',
          width: 150,
          filterableCustomFieldName: 'IndustryResourceId',
          filterableType: 'select',
          filterableItems: []
        },
        {
          property: PROPERTY_STORE.LICENSETYPENAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LICENSETYPENAME),
          sortable: true,
          show: true,
          type: 'text',
          width: 150,
          filterableCustomFieldName: 'LicenseTypeResourceId',
          filterableType: 'select',
          filterableItems: []
        },
        {
          property: PROPERTY_STORE.NUMBEROFUSERS,
          align: 'right',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.NUMBEROFUSERS),
          sortable: true,
          show: true,
          type: 'text',
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
          width: 180,
          filterableType: 'date'
        },
        {
          property: 'createTime',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATEDATE),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: 180,
          filterableType: 'date'
        }
      ],
      pageSizes: [5, 10, 25],
      downloadButton: { show: false, disable: false },
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: false,
        download: false
      },
      iEmpty: {
        id: 'btn-empty--company-group-detail',
        message: labels.EmptyCompany,
        btn: labels.New,
        icon: 'mdi-plus'
      },
      addButton: {
        show: true,
        id: 'btn-add--company-group-detail',
        action: 'addButton',
        tooltip: 'Add Company to Company Group'
      },
      rowActions: [
        {
          name: 'Edit this row',
          id: 'btn-edit--company-group-detail-row-actions',
          icon: 'mdi-pencil',
          action: 'editAction',
          isNotShow: true
        },
        {
          name: 'Add to a company group',
          id: 'btn-add--company-group-detail-add-to-company-group-row-actions',
          icon: 'mdi-account-multiple-plus',
          action: 'AddGroupToModal'
        },
        {
          name: 'Create a new company group with company',
          id: 'btn-add--company-group-detail-create-new-company-row-actions',
          icon: 'mdi-account-multiple',
          action: 'createNewGroupWithCompany'
        },
        {
          id: 'btn-delete--company-group-detail-row-actions',
          name: 'Remove from group',
          icon: 'mdi-minus-circle',
          action: 'remove'
        }
      ]
    },
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
    industries: null,
    licenceTypes: null,
    serverSideProps: new ServerSideProps()
  }),
  watch: {
    isShowCreateOrEditModal() {
      document.querySelector('html').classList.toggle('overflow-y-hidden')
    },
    groupId() {
      this.initMethods()
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.COMPANY_GROUP_DETAILS)
    )
    this.getDefaultFilterAndSearch()
  },
  methods: {
    resetPageNumber() {
      //generic
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.initMethods()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.payload.pageNumber = pageNumber
      this.initMethods()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.initMethods()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.initMethods()
    },
    handleAllRecordsClick() {
      this.payload.pageSize = 75000
      this.showAllRecords = false
      this.getTableData()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.COMPANY_GROUP_DETAILS, JSON.stringify(tableSettings))
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_DETAILS,
        JSON.stringify({
          filter: this.payload.filter,
          filterValues
        })
      )
    },
    handleRestoreDefaultSearch() {
      this.getDefaultFilterAndSearch()
      this.initMethods()
    },
    handleClearFilters() {
      this.payload = JSON.parse(JSON.stringify(this.defaultPayload))
      this.$refs.refDataList.filterValues = {}
      this.$refs.refDataList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      this.initMethods()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_DETAILS)
      )
      if (savedFilter) {
        this.payload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refDataList.filterValues = savedFilter.filterValues
          this.$refs.refDataList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
        })
      }
      this.initMethods()
    },
    handleTableDownload(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.payload.filter
        }

        exportCompanyGroupDetails(payload, this.$route.params.groupId)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Company Group Details.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch(() => {})
      })
    },
    initMethods() {
      this.getIndustries().then(() => {
        this.getLicenceTypes().then(() => this.getTableData())
      })
    },
    toggleShowAddCompanyModal() {
      this.showAddCompanyModal = !this.showAddCompanyModal
    },
    closeAddCompanyModalWithUpdate() {
      this.getTableData()
      this.toggleShowAddCompanyModal()
    },
    getTableData() {
      this.loading = true
      searchGroupCompanies(this.groupId, this.payload)
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
          this.totalNumberOfRecords = totalNumberOfRecords
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$router.push({
              name: 'Companies',
              params: { tab: 'second', force: true }
            })
          }
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    handleTableItemEdit(row) {},
    handleTableItemRemove(selectedItem) {
      this.selectedRow = selectedItem
      this.changeRemoveModalStatus(true)
    },
    removeConfirmedItem(selectedItem) {
      const payload = {
        companyResourceIdArray: [selectedItem['companyResourceId']]
      }
      this.removeModalDisable = true
      removeCompanyToCompanyGroup(this.groupId, payload)
        .then((response) => {
          this.$refs.refDataList.unSelectRow(selectedItem)
          if (response.data && response.data.message) {
            this.getTableData()
          }
        })
        .finally(() => (this.removeModalDisable = false))
    },
    changeRemoveModalStatus(status) {
      this.isShowRemoveModal = status
    },
    changeCreateOrEditModalStatus(status) {
      this.isShowCreateOrEditModal = status
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
        .catch(() => {
          this.isShowExtended = false
        })
    },
    cancelCreateOrEditForm() {
      this.isShowCreateOrEditModal = false
      this.editModal = false
      this.selectedExtend = {}
      this.selectedRow = {}
      this.getTableData()
    },
    closeExtend() {
      this.isShowExtended = false
      this.selectedRow = {}
      this.selectedExtend = {}
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
      this.editCreateGroup = false
      this.forCompany = true
      this.selectedRow = { ...row, ...{ name: null }, ...{ resourceId: row.companyResourceId } }
      this.showCreateNewGroupWithCompany = true
    },
    handleCreateItemModal(status) {
      this.showCreateNewGroupWithCompany = status
      this.getTableData()
    },
    addButton() {
      this.forCompany = false
      this.editCreateGroup = true
      this.selectedRow = {
        ...{ name: localStorage.getItem('companyGroupName') },
        ...{ resourceId: this.groupId }
      }
      this.showAddCompanyModal = true
    },
    handleSubmit(resourceId, groupName) {
      localStorage.setItem('companyGroupResourceId', resourceId)
      localStorage.setItem('companyGroupName', groupName)
      this.$router.push({ name: 'Company Group Details', params: { groupId: resourceId } })
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
    },
    async getIndustries() {
      await getLookupListByTypeId(2).then((response) => {
        this.tableOptions.columns[1].filterableItems = response.data.data.map((x) => {
          return { text: x.name, value: x.resourceId }
        })
      })
    },
    async getLicenceTypes() {
      await getLookupListByTypeId(3).then((response) => {
        this.tableOptions.columns[2].filterableItems = response.data.data.map((x) => {
          return { text: x.name, value: x.resourceId }
        })
      })
    }
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
