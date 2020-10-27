<template>
  <div class="company-list">
    <v-dialog
      v-if="isShowCreateOrEditModal"
      v-model="isShowCreateOrEditModal"
      fullscreen
      scrollable
      persistent
      no-click-animation
      hide-overlay
    >
      <CompanyCreateOrEdit
        @cancelForm="cancelCreateOrEditForm"
        :selectedRow="selectedRow"
        :selectedExtend="selectedExtend"
        :edit="editModal"
      />
    </v-dialog>
    <remove-modal
      :is-show="isShowRemoveModal"
      :selectedRow="selectedRow"
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
      :is-show="showCreateNewGroupWithCompany"
      :selectedRow="selectedRow"
      :forCompany="forCompany"
      @changeModalStatus="handleCreateItemModal"
      :is-edit="editCreateGroup"
    />

    <datatable
      :loading="loading"
      :table="tableData"
      ref="refDataList"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      :empty="tableOptions.iEmpty"
      id="company-groups-details-data-table"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'companyList'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      :is-downloadable="false"
      @addButton="addButton"
      @edit="handleTableItemEdit"
      @remove="handleTableItemRemove"
      @editAction="editAction"
      @AddGroupToModal="handleAddGroupToModal"
      @createNewGroupWithCompany="handleCreateNewGroupWithCompany"
    />
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import { getCompanyByID, searchGroupCompanies, updateCompanyGroup } from '@/api/company'
import RemoveModal from './RemoveModal'
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit'
import AddGroupToModal from '@/components/Companies/AddToGroupModal'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import DatatableLoading from '../SkeletonLoading/DatatableLoading'
export default {
  name: 'CompanyGroupDetails',
  components: {
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
          type: 'text',
          minWidth: 180
        },
        {
          property: PROPERTY_STORE.INDUSTRYNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.INDUSTRYNAME),

          sortable: true,
          show: true,
          type: 'text',
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
          width: 150
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
          type: 'text',
          width: 180
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
        message: 'No company defined',
        btn: 'ADD A COMPANY',
        icon: 'mdi-account-plus'
      },
      addButton: {
        show: true,
        action: 'addButton',
        tooltip: 'Add Company to Company Group'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'editAction',
          isNotShow: true
        },
        {
          name: 'Add to a company group',
          icon: 'mdi-account-multiple-plus',
          action: 'AddGroupToModal'
        },
        {
          name: 'Create a new company group with company',
          icon: 'mdi-account-multiple',
          action: 'createNewGroupWithCompany'
        },
        {
          name: 'Remove from group',
          icon: 'mdi-minus-circle',
          action: 'remove'
        }
      ]
    },
    payload: {
      pageSize: 3000,
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
    }
  }),
  watch: {
    isShowCreateOrEditModal() {
      document.querySelector('html').classList.toggle('overflow-y-hidden')
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      searchGroupCompanies(this.groupId, this.payload)
        .then((response) => {
          this.tableData =
            response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
              ? response.data.data.results
              : []
        })
        .catch(() => {
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
      const arr = []
      this.tableData.map(
        (x) =>
          x.companyResourceId !== selectedItem.companyResourceId && arr.push(x.companyResourceId)
      )
      const payload = {
        name: localStorage.getItem('companyGroupName'),
        companyResourceIdArray: arr
      }
      updateCompanyGroup(this.groupId, payload)
        .then((response) => {
          if (response.data && response.data.message) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Company group has been updated',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle-outline'
            })
            this.getTableData()
          }
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Company group can not be updated'
          })
        })
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
        .catch((error) => {
          this.isShowExtended = false
          this.$store.dispatch('common/createSnackBar', {
            message: error.data.message,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
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
      this.showCreateNewGroupWithCompany = true
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
