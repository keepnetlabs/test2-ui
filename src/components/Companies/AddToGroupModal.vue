<template>
  <app-dialog
    :status="status"
    icon="mdi-account-multiple-plus"
    :title="title"
    subtitle="Select groups to add companies to"
    size="ultraMaximum"
    maxHeightSize="auto"
    class-name="add-to-group-modal"
    title-id="text--company-add-to-group-popup-title"
    subtitle-id="text--company-add-to-group-delete-popup-subtitle"
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <v-form ref="refFormAddToGroup" lazy-validation>
        <Datatable
          ref="refGroupDataList"
          refName="refNameTableAddToGroup"
          is-server-side
          filterable
          options
          selectable
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :show-filter-options="false"
          :loading="isLoading"
          :count-row="countRow"
          :download-button="{ show: true, disabled: false }"
          :columns="tableOptions.columns"
          :empty="tableOptions.iEmpty"
          :rowActions="tableOptions.rowActions"
          :selectEvent="tableOptions.selectEvent"
          :table="tableData"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @downloadEvent="handleTableDownload"
          @handleSelectionChange="handleSelectionChange"
          @refreshAction="getTableData"
          @server-side-page-number-changed="serverSidePageNumberChanged"
          @server-side-size-changed="serverSideSizeChanged"
          @searchChangedEvent="handleSearchChange"
          @sortChangedEvent="sortChanged"
        />
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn
          id="btn-back--company-add-to-group-modal"
          @click="changeStatus(false)"
          color="#f56c6c"
          class="delete-user__footer-button"
          text
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-save--company-add-to-group-modal"
          @click="confirm"
          :disabled="(selectedArray && selectedArray.length === 0) || saveDisable"
          color="#2196f3"
          class="delete-user__footer-button"
          text
          >{{ labels.Confirm }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import { addCompanyToCompanyGroup, exportCompanyGroup, searchCompanyGroups } from '@/api/company'
import Datatable from '../../components/DataTable'
import labels from '@/model/constants/labels'

import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'

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
      countRow: 5,
      isLoading: false,
      saveDisable: false,
      labels,
      tableData: [],
      selectedArray: [],
      showTable: false,
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
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
            width: 130
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            width: 212,
            overrideWidth: true,
            filterableType: 'date'
          }
        ],
        selectEvent: {
          clipboard: false,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          message: labels.EmptyCompany,
          btn: labels.New,
          icon: 'mdi-plus'
        },
        addButton: {
          show: false
        }
      },
      payload: getDefaultAxiosPayload({ pageSize: 5 }),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    title() {
      const len = this.companyIdArray.length
      return len > 1 ? `Add ${len} companies to company groups` : `Add a company to company groups`
    }
  },
  created() {
    this.payload.pageSize = 5
    this.serverSideProps.pageSize = 5
    this.payload.pageNumber = 1
    this.getTableData()
  },
  methods: {
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber
      this.getTableData()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.countRow = pageSize
      this.resetPageNumber()
      this.getTableData()
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.payload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.calculateIsFilterColumnActive()
      this.getTableData()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.getTableData()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    changeStatus(value) {
      this.$emit('changeStatus', value)
      if (value === false) {
        this.saveDisable = false
        this.showTable = false
      }
    },
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
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: copyOfFilter
        }
        exportCompanyGroup(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Add to Company Group.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    confirm() {
      if (this.selectedArray && this.selectedArray.length > 0) {
        this.saveDisable = true
        const companyIdArray = this.companyIdArray
        this.selectedArray.forEach((x) => {
          const payload = {
            companyResourceIdArray: companyIdArray
          }
          addCompanyToCompanyGroup(x.resourceId, payload).finally(() => (this.saveDisable = false))
        })
        this.changeStatus(false)
      }
    },
    getTableData() {
      this.isLoading = true
      searchCompanyGroups(this.payload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber

          this.tableData = results
        })
        .finally(() => (this.isLoading = false))
    },
    handleSelectionChange(value) {
      this.selectedArray = value
    },
    columnFilterChanged(filter) {
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = true
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.payload)
      this.getTableData()
    },
    columnFilterCleared(fieldName) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterCleared(fieldName, this.payload)
      this.calculateIsFilterColumnActive()
      this.getTableData()
    },
    calculateIsFilterColumnActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.payload)
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
.add-to-group-modal {
  .k-table__wrapper {
    padding-bottom: 0;
  }
}
</style>
