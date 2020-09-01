<template>
  <div class="company-list">
    <delete-modal
      :is-show="isShowDeleteModal"
      :selectedRow="selectedRow"
      @confirmDelete="deleteConfirmedItem"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <create-item-modal
      :is-show="isShowAddModal"
      :selectedRow="selectedRow"
      :isEdit="editAddModal"
      @changeModalStatus="changeAddModalStatus"
      @companyGroupCreated="companyGroupCreated"
    />
    <datatable
      ref="refGroupDataList"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'companyList'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      :is-downloadable="false"
      @delete="handleTableItemDelete"
      @addButton="addButton"
      @onEmptyBtnClicked="addButton"
      @editAction="editAction"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span :class="{ 'datatable-link': scope.row.companyCount !== 0 }" v-if="scope.row.name">
          <span @click="goToDetails(scope.row)" v-if="scope.row.companyCount !== 0">{{
            scope.row.name
          }}</span>
          <span v-else>{{ scope.row.name }}</span>
        </span>
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import {
  getCompanyGroups,
  deleteCompanyGroup,
  deleteCompany,
  getCompanyByID
} from '../../api/company'
import DeleteModal from './DeleteModal'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import CreateItemModal from '@/components/CompanyGroups/CreateItemModal'

export default {
  name: 'CompanyGroupList',
  components: {
    CreateItemModal,
    Datatable,
    DeleteModal
  },
  data() {
    return {
      isShowDeleteModal: false,
      isShowAddModal: false,
      editAddModal: false,
      selectedExtend: {},
      selectedRow: null,
      tableOptions: {
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
            width: 250
          },
          {
            property: 'companyCount',
            align: 'right',
            editable: false,
            label: 'Companies',
            sortable: true,
            show: true,
            type: 'text',
            width: 150
          },
          {
            property: 'addedTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            width: 190
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        selectEvent: {
          clipboard: true,
          edit: true,
          delete: true,
          download: true
        },
        iEmpty: {
          message: 'No company groups defined',
          btn: 'ADD A COMPANY GROUP',
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          action: 'addButton',
          tooltip: 'Add Company Group'
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'editAction',
            isNotShow: true
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete'
          }
        ]
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      getCompanyGroups()
        .then((response) => {
          this.$refs.refGroupDataList.loadWithDataArray(
            response.data.data.hasOwnProperty('companyGroups') &&
              response.data.data.companyGroups.length > 0
              ? response.data.data.companyGroups
              : []
          )
        })
        .catch((error) => {
          this.$refs.refGroupDataList.loadWithDataArray([])
        })
    },
    handleTableItemDelete(selectedItem) {
      this.selectedRow = selectedItem
      this.changeDeleteModalStatus(true)
    },
    deleteConfirmedItem(selectedItem) {
      deleteCompanyGroup(selectedItem.resourceId)
        .then((response) => {
          if (response.data && response.data.message) {
            this.$store.dispatch('common/createSnackBar', {
              message: response.data.message,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle-outline'
            })
            this.getTableData()
          }
        })
        .catch((error) => {})
    },
    changeDeleteModalStatus(status) {
      this.isShowDeleteModal = status
    },
    changeAddModalStatus(status) {
      this.isShowAddModal = status
    },
    addButton() {
      this.changeAddModalStatus(true)
    },
    companyGroupCreated() {
      this.selectedRow = null
      this.editAddModal = false
      this.getTableData()
    },
    editAction(row) {
      console.log(this)
      this.changeAddModalStatus(true)
      this.selectedRow = row
      this.editAddModal = true
      console.log(this)
    },
    goToDetails(selectedRow) {
      localStorage.setItem('companyGroupName', selectedRow.name)
      localStorage.setItem('companyGroupResouceId', selectedRow.resourceId)
      this.$router.push({
        name: 'Company Group Details',
        params: { groupId: selectedRow.resourceId }
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
