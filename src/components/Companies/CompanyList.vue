<template>
  <div class="company-list">
    <ConfigureNewCompanyModal
      v-if="isShowConfigureCompanyModal"
      :status="isShowConfigureCompanyModal"
      :created-company-resource-id="createdCompanyResourceIdForConfigureCompany"
      @on-close="toggleConfigureNewCompanyModal"
    />
    <app-modal
      v-if="isShowCreateOrEditModal"
      :status="isShowCreateOrEditModal"
      :show-footer="false"
      class-name="company-create-edit"
      :show-header="false"
    >
      <template v-slot:overlay-body>
        <CompanyCreateOrEdit
          ref="refCreateOrEditModal"
          :selectedRow="selectedRow"
          :selectedExtend="selectedExtend"
          :edit="editModal"
          @cancelForm="cancelCreateOrEditForm"
          @closeFormConfigureNewCompanyModal="closeFormConfigureNewCompanyModal"
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
      v-if="showAddGroupToModal"
      :companyIdArray="companyIdArray"
      :status="showAddGroupToModal"
      @changeStatus="handleStatusAddGroupToModal"
    />
    <create-item-modal
      :is-show="showCreateNewGroupWithCompany"
      v-if="showCreateNewGroupWithCompany"
      :selectedRow="selectedRow"
      :forCompany="true"
      @changeModalStatus="changeGroupModalStatus"
    />

    <datatable
      v-bind="bindPropsIsSafari"
      id="companies-data-table"
      ref="refDataList"
      is-server-side
      toggle-all-row-expansion
      selectable
      groupable
      filterable
      options
      row-key="companyName"
      :loading="loading"
      :table="tableData"
      :server-side-props="serverSideProps"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :selectEvent="tableOptions.selectEvent"
      :clusterItems="[{ name: 'Company Name' }]"
      :rowActions="tableOptions.rowActions"
      :axios-payload.sync="payload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      active-cluster=""
      @clusterChanged="clusterChanged"
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
          :id="`text--company-name-${scope.$index}`"
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
                >{{ ` ${scope.row['numberOfUsers']} ` }}</span
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
import Datatable from '@/components/DataTable'
import { deleteCompany, exportCompanies, getCompanyByID, searchCompanies } from '@/api/company'
import DeleteModal from './DeleteModal'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CompanyListExtend from '@/components/Companies/CompanyListExtend'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit'
import AddGroupToModal from '@/components/Companies/AddToGroupModal'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import AppModal from '@/components/AppModal'
import { getDefaultAxiosPayload, handleIsSafari, setSafariClusterFix } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import ConfigureNewCompanyModal from '@/components/Companies/ConfigureNewCompanyModal'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
export default {
  name: 'CompanyList',
  components: {
    ConfigureNewCompanyModal,
    AppModal,
    CreateItemModal,
    AddGroupToModal,
    CompanyCreateOrEdit,
    CompanyListExtend,
    Datatable,
    DeleteModal
  },
  data() {
    return {
      loading: true,
      tableData: [],
      createdCompanyResourceIdForConfigureCompany: '',
      isShowConfigureCompanyModal: false,
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
            property: 'targetUserCount',
            align: 'right',
            editable: false,
            label: labels.TargetUsers,
            fixed: false,
            sortable: true,
            show: true,
            type: 'number',
            width: 160,
            filterableType: 'number',
            emptyText: 0
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
            width: 180,
            filterOptionProps: [
              { text: 'Contains', value: 'Contains' },
              { text: 'Equal', value: '=' },
              { text: 'Not Equal', value: '!=' },
              { text: 'Between', value: 'between' }
            ]
          },
          {
            property: PROPERTY_STORE.LICENSEENDDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LICENSEENDDATE),
            sortable: true,
            show: true,
            type: 'date',
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
            type: 'date',
            width: 180
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.COMPANY_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          message: labels.EmptyCompany,
          btn: labels.New,
          id: 'btn-empty--company',
          icon: 'mdi-plus'
        },
        addButton: {
          show: true,
          id: 'btn-add--company',
          action: 'addButton',
          tooltip: 'Add Company',
          disabled: !this.$store.getters['permissions/getCompaniesCreatePermissions']
        },
        rowActions: [
          {
            name: 'Edit this row',
            id: 'btn-edit--company-row-actions',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true,
            disabled: !this.$store.getters['permissions/getCompaniesEditPermissions']
          },
          {
            id: 'btn-add--company-add-to-a-group-row-actions',
            name: 'Add to a company group',
            icon: 'mdi-account-multiple-plus',
            action: 'AddGroupToModal',
            disabled: !this.$store.getters['permissions/getCompanyGroupsSearchPermissions']
          },
          {
            id: 'btn-add--company-create-new-company-group-with-company-row-actions',
            name: 'Create a new company group with company',
            icon: 'mdi-account-multiple',
            action: 'createNewGroupWithCompany',
            disabled: !this.$store.getters['permissions/getCompaniesSearchPermissions']
          },
          {
            id: 'btn-switch--company-switch-to-company-row-actions',
            name: 'Switch to company',
            icon: 'mdi-swap-horizontal',
            action: 'switchCompany',
            disabled: !this.$store.getters['permissions/getCompaniesSearchPermissions']
          },
          {
            id: 'btn-delete--company-row-actions',
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            disabled: !this.$store.getters['permissions/getCompaniesDeletePermissions']
          }
        ]
      },
      payload: getDefaultAxiosPayload(),
      defaultPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  watch: {
    isShowCreateOrEditModal() {
      document.querySelector('html').classList.toggle('overflow-y-hidden')
    }
  },
  created() {
    this.getLookUpDatas()
    if (handleIsSafari()) {
      this.bindPropsIsSafari['handleSetCellClass'] = (obj) => {
        return setSafariClusterFix(obj, 'companyName')
      }
    }
  },
  methods: {
    toggleConfigureNewCompanyModal() {
      if (this.isShowConfigureCompanyModal) {
        this.getTableData()
      }
      this.isShowConfigureCompanyModal = !this.isShowConfigureCompanyModal
      if (!this.isShowConfigureCompanyModal) {
        this.createdCompanyResourceIdForConfigureCompany = ''
      }
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
      this.payload.pageNumber = pageNumber
      this.getTableData()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getTableData()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    isNumberOfUsersExceed({ numberOfUsers, targetUserCount, isNumberOfUsersLimited } = {}) {
      return isNumberOfUsersLimited && targetUserCount > Number(numberOfUsers)
    },
    handleChangeIsSettingsOpen(val) {
      if (val) {
        this.isShowExtended = false
      }
    },
    handleSearchChange(searchFilter = {}) {
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.getTableData()
    },
    handleCellClick({ column, event }) {
      if (column.property === 'companyName') {
        this.extendTop = event.offsetTop
      }
    },
    getLookUpDatas() {
      LookupLocalStorage.getMultiple([2, 3])
        .then((response) => {
          const res = response
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
          this?.$refs?.refDataList?.reRenderFilters()
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
      this?.$refs?.refDataList?.reRenderFilters({})
    },
    handleTableItemDelete(selectedItem) {
      this.selectedRow = selectedItem
      this.changeDeleteModalStatus(true)
    },
    deleteConfirmedItem(selectedItem) {
      deleteCompany(selectedItem.companyResourceId).then((response) => {
        this?.$refs?.refDataList?.unSelectRow(selectedItem)
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
        .catch(() => {
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
    closeFormConfigureNewCompanyModal(createdCompanyResourceId = '') {
      this.createdCompanyResourceIdForConfigureCompany = createdCompanyResourceId
      this.cancelCreateOrEditForm()
      this.toggleConfigureNewCompanyModal()
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
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.payload)
      this.getTableData()
    },
    columnFilterCleared(fieldName) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterCleared(fieldName, this.payload)
      this.getTableData()
    }
  }
}
</script>

<style lang="scss">
.company-list {
  margin-top: 24px;
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
