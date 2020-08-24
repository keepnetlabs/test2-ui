<template>
  <app-dialog
    :status="status"
    icon="mdi-account-multiple-plus"
    :title="title"
    subtitle="Select groups to add companies to"
    @changeStatus="changeStatus"
    size="maximum"
  >
    <template v-slot:app-dialog-body>
      <v-form ref="refFormAddToGroup" lazy-validation>
        <Datatable
          v-show="showTable"
          :isDownloadable="false"
          :columns="tableOptions.columns"
          :countRow="5"
          :empty="tableOptions.iEmpty"
          :filterable="true"
          :options="true"
          :pageSizes="tableOptions.pageSizes"
          :rowActions="tableOptions.rowActions"
          :selectEvent="tableOptions.selectEvent"
          :selectable="true"
          ref="refTableAddToGroup"
          refName="refNameTableAddToGroup"
          @handleSelectionChange="handleSelectionChange"
        >
          <template v-slot:datatable-custom-column="{ scope }">
            <span class="datatable-link" v-if="scope.row.name">
              {{ scope.row.name }}
            </span>
          </template>
        </Datatable>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn @click="changeStatus(false)" color="#f56c6c" class="delete-user__footer-button" text
          >CANCEL</v-btn
        >
        <v-btn
          @click="confirm"
          :disabled="selectedArray && selectedArray.length === 0"
          color="#2196f3"
          class="delete-user__footer-button"
          text
          >CONFIRM</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import { getCompanyGroups, updateCompanyGroup } from '../../api/company'
import Datatable from '../../components/DataTable'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'AddGroupToModal',
  props: {
    status: {
      type: Boolean
    },
    companyIdArray: {
      type: Array
    }
  },
  components: {
    AppDialog,
    Datatable
  },
  data() {
    return {
      selectedArray: [],
      showTable: false,
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
            type: 'slot'
          },
          {
            property: 'companyCount',
            align: 'right',
            editable: false,
            label: 'Companies',
            sortable: true,
            show: true,
            type: 'text',
            width: 130
          },
          {
            property: 'addedTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            width: 160
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        selectEvent: {
          clipboard: false,
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
          show: false
        }
      }
    }
  },
  computed: {
    title() {
      const len = this.companyIdArray.length
      return len > 1 ? `Add ${len} companies to company groups` : `Add a company to company groups`
    }
  },
  created() {},
  mounted() {
    this.getTableData()
  },
  methods: {
    changeStatus(value) {
      this.$emit('changeStatus', value)
      if (value === false) {
        this.showTable = false
      }
    },
    confirm() {
      if (this.selectedArray && this.selectedArray.length > 0) {
        const companyIdArray = this.companyIdArray
        this.selectedArray.forEach((x) => {
          debugger
          const payload = {
            name: x.name,
            companyResourceIdArray: companyIdArray
          }
          updateCompanyGroup(x.resourceId, payload)
            .then((response) => {
              if (response.data && response.data.message) {
                this.$store.dispatch('common/createSnackBar', {
                  message: response.data.message,
                  color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                  icon: 'mdi-check-circle-outline'
                })
              }
            })
            .catch((error) => {})
        })
        this.changeStatus(false)
      }
    },
    getTableData() {
      getCompanyGroups()
        .then((response) => {
          this.showTable = true
          this.$refs.refTableAddToGroup.loadWithDataArray(
            response.data.data.hasOwnProperty('companyGroups') &&
              response.data.data.companyGroups.length > 0
              ? response.data.data.companyGroups
              : []
          )
        })
        .catch((error) => {
          this.$refs.refTableAddToGroup.loadWithDataArray([])
        })
    },
    handleSelectionChange(value) {
      this.selectedArray = value
    }
  }
}
</script>

<style lang="scss">
.create-company-group {
  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 23px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px !important;
    &--sub {
      font-size: 14px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px !important;
    }
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }
}
</style>
