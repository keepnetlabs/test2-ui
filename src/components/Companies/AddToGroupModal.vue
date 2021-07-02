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
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :show-filter-options="false"
          :loading="isLoading"
          :count-row="countRow"
          :download-button="{ show: true, disabled: false }"
          :show-all-records="showAllRecords"
          :total-number-of-records="totalNumberOfRecords"
          :columns="tableOptions.columns"
          :empty="tableOptions.iEmpty"
          :filterable="true"
          :options="true"
          :pageSizes="tableOptions.pageSizes"
          :rowActions="tableOptions.rowActions"
          :selectEvent="tableOptions.selectEvent"
          :selectable="true"
          :table="tableData"
          :server-side-props="serverSideProps"
          :server-side-events="{ pagination: true, search: true, sort: true }"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
          @downloadEvent="handleTableDownload"
          @handleSelectionChange="handleSelectionChange"
          @refreshAction="getTableData"
          @on-all-records-button-click="handleAllRecordsClick"
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
import {
  addCompanyToCompanyGroup,
  exportCompanyGroup,
  getCompanyGroups,
  searchCompanyGroups,
  updateCompanyGroup
} from '../../api/company'
import Datatable from '../../components/DataTable'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

import ServerSideProps from '@/helper-classes/server-side-table-props'

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
      showAllRecords: false,
      totalNumberOfRecords: 0,
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
        pageSizes: [5, 10, 25],
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
      payload: {
        pageSize: 5,
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
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.tableOptions.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.payload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
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
    handleAllRecordsClick() {
      this.payload.pageSize = 75000
      this.showAllRecords = false
      this.getTableData()
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
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.payload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
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
