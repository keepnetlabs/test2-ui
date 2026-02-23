<template>
  <div style="padding-top: 14px;">
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
      v-if="showAddGroupToModal"
      :companyIdArray="companyIdArray"
      :status="showAddGroupToModal"
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
      is-server-side
      filterable
      options
      selectable
      :loading="loading"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @addButton="addButton"
      @onEmptyBtnClicked="addButton"
      @remove="handleTableItemRemove"
      @editAction="editAction"
      @AddGroupToModal="handleAddGroupToModal"
      @createNewGroupWithCompany="handleCreateNewGroupWithCompany"
      @refreshAction="getTableData"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @downloadEvent="handleTableDownload"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
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
import RemoveModal from './RemoveModal'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
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
  mixins: [useDefaultTableFunctions],
  props: {
    groupId: {
      type: String,
      require: true
    }
  },
  data: () => ({
    showAddCompanyModal: false,
    loading: true,
    editCreateGroup: false,
    forCompany: true,
    tableData: [],
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
      savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.COMPANY_GROUP_DETAILS,
      savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.COMPANY_GROUP_DETAILS,
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
    axiosPayload: getDefaultAxiosPayload(),
    industries: [],
    licenceTypes: [],
    serverSideProps: new ServerSideProps()
  }),
  watch: {
    isShowCreateOrEditModal() {
      document.querySelector('html').classList.toggle('overflow-y-hidden')
    },
    groupId() {
      this.callForData()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.getIndustries().then(() => {
        this.getLicenceTypes().then(() => {
          this?.$refs?.refDataList?.reRenderFilters()
          this.getTableData()
        })
      })
    },
    async getIndustries() {
      await LookupLocalStorage.getSingle(2).then((data) => {
        this.$set(
          this.tableOptions.columns[1],
          'filterableItems',
          data.map((x) => {
            return { text: x.name, value: x.resourceId }
          })
        )
      })
    },
    async getLicenceTypes() {
      await LookupLocalStorage.getSingle(3).then((data) => {
        this.$set(
          this.tableOptions.columns[2],
          'filterableItems',
          data.map((x) => {
            return { text: x.name, value: x.resourceId }
          })
        )
      })
    },
    handleTableDownload(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }

        exportCompanyGroupDetails(payload, this.$route.params.groupId)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = globalThis.URL.createObjectURL(data)
            link.download = `Company Group Details.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch(() => {})
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
      searchGroupCompanies(this.groupId, this.axiosPayload)
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
      this.selectedRow = { ...row, name: null, resourceId: row.companyResourceId }
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
        name: localStorage.getItem('companyGroupName'),
        resourceId: this.groupId
      }
      this.showAddCompanyModal = true
    },
    handleSubmit(resourceId, groupName) {
      localStorage.setItem('companyGroupResourceId', resourceId)
      localStorage.setItem('companyGroupName', groupName)
      this.$router.push({ name: 'Company Group Details', params: { groupId: resourceId } })
    }
  }
}
</script>
