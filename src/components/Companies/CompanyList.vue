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

    <delete-modal
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
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      :groupable="true"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :selectEvent="tableOptions.selectEvent"
      :refName="'companyList'"
      :clusterItems="[{ name: 'Company Name' }]"
      @clusterChanged="clusterChanged"
      row-key="companyName"
      :rowActions="tableOptions.rowActions"
      @edit="handleTableItemEdit"
      @delete="handleTableItemDelete"
      @cellClick="handleCompanyNameClick"
      @downloadEvent="handleTableDownload"
      @addButton="addButton"
      @handleListBulleted="handleListBulletedClick"
      @onEmptyBtnClicked="addButton"
      @editAction="editAction"
      @AddGroupToModal="handleAddGroupToModal"
      @createNewGroupWithCompany="handleCreateNewGroupWithCompany"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span class="datatable-link" v-if="scope.row.companyName">
          {{ scope.row.companyName }}
        </span>
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
import { deleteCompany, exportCompanies, getCompanyByID, searchCompanies } from '../../api/company'
import DeleteModal from './DeleteModal'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import CompanyListExtend from '@/components/Companies/CompanyListExtend'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit'
import AddGroupToModal from '@/components/Companies/AddToGroupModal'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'
import AppModal from '@/components/AppModal'

export default {
  name: 'CompanyList',
  components: {
    AppModal,
    CreateItemModal,
    AddGroupToModal,
    CompanyCreateOrEdit,
    CompanyListExtend,
    Datatable,
    DeleteModal
  },
  data: () => ({
    loading: true,
    tableData: [],
    tableHeight: 0,
    extendTop: 0,
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
        tooltip: 'Add Company'
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
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'delete'
        }
      ]
    },
    payload: {
      pageSize: 3000,
      orderBy: 'CreateTime',
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
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData(payload) {
      const _payload = { ...this.payload, ...payload, isClustered: this.isClustered }

      this.loading = true
      searchCompanies(_payload)
        .then((response) => {
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
      this.getTableData()
    },
    handleListBulletedClick() {
      this.isClustered = false
      this.getTableData()
    },
    handleClusterLoad({ tree, treeNode, resolve, callback }) {},
    handleTableItemEdit(row) {},
    handleTableItemDelete(selectedItem) {
      this.selectedRow = selectedItem
      this.changeDeleteModalStatus(true)
    },
    deleteConfirmedItem(selectedItem) {
      deleteCompany(selectedItem.companyResourceId)
        .then((response) => {
          if (response.data && response.data.message) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Company has been deleted',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle-outline'
            })
            this.getTableData()
          }
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            message: 'Company can not be deleted',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-check-circle-outline'
          })
        })
    },
    changeDeleteModalStatus(status) {
      this.isShowDeleteModal = status
    },
    changeCreateOrEditModalStatus(status) {
      this.isShowCreateOrEditModal = status
    },
    handleCompanyNameClick({ row, column, event }) {
      if (column.property === 'companyName') {
        this.$refs.extend.clickClose()
        this.selectedRow = row
        this.selectedExtend = {}
        this.isShowExtended = true
        this.tableHeight = this.$refs.refDataList.$el.clientHeight
        this.extendTop = event.offsetTop
        getCompanyByID(row.companyResourceId, false)
          .then((response) => {
            this.selectedExtend = response.data.data
          })
          .catch((error) => {
            this.isShowExtended = false
            this.$store.dispatch('common/createSnackBar', {
              message: error.data.message,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
          })
      }
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
        exportCompanies(payload)
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
      this.getTableData({ orderBy: 'createTime', ascending: false })
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
</style>
