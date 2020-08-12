<template>
  <div class="company-list">
    <delete-modal
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      @deleteAction="handleDeleteUser"
      v-if="isWantToShowDeleteUserModal"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <datatable
      ref="refDataList"
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
      @edit="handleEdit"
    >
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import { searchCompanies } from '../../api/company'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'

export default {
  name: 'CompanyList',
  components: {
    Datatable
  },
  data: () => ({
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
          type: 'text'
        },
        {
          property: PROPERTY_STORE.INDUSTRYNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.INDUSTRYNAME),
          fixed: 'left',
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
          fixed: 'left',
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
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: 150
        },
        {
          property: PROPERTY_STORE.LICENSEENDDATE,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LICENSEENDDATE),
          fixed: 'left',
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
      pageSizes: [5, 10, 25, 50, 100],
      selectEvent: {
        clipboard: true,
        edit: true,
        delete: true,
        download: true
      },
      iEmpty: {
        message: 'No company defined',
        btn: 'ADD A COMPANY',
        icon: 'mdi-account-plus'
      },
      addButton: {
        show: true,
        action: 'addButton'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'edit',
          isNotShow: true
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'delete'
        }
      ]
    },
    payload: {
      pageNumber: 1,
      pageSize: 3,
      orderBy: 'LicenseTypeName',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'OR',
            FilterItems: [
              {
                FieldName: 'CompanyName',
                Operator: 'Contains',
                Value: ''
              },
              {
                FieldName: 'IndustryName',
                Operator: 'Contains',
                Value: ''
              },
              {
                FieldName: 'LicenseTypeName',
                Operator: 'Contains',
                Value: ''
              }
            ],
            FilterGroups: []
          }
        ]
      }
    }
  }),
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      searchCompanies(this.payload)
        .then((response) => {
          this.$refs.refDataList.loadWithDataArray(
            response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
              ? response.data.data.results
              : []
          )
        })
        .catch((error) => {
          this.$refs.refDataList.loadWithDataArray([])
        })
    },
    handleEdit(row) {},
    handleDelete(row) {}
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
