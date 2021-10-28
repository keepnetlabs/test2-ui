<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    is-server-side
    :refName="'campaignManagerTargetGroupTable'"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :add-row-class-name="addRowClassName"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @row-click="handleRowClick"
    @handleSelectionChange="$emit('handle-selection-change', $event)"
  >
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { searchTargetGroups } from '@/api/targetUsers'

const axiosPayload = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'CreateTime',
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
}

export default {
  name: 'CampaignManagerTargetGroupsTable',
  components: {
    DataTable
  },
  props: {
    empty: {
      type: Boolean
    },
    isLoading: {
      type: Boolean
    }
  },
  data() {
    return {
      axiosPayload: JSON.parse(JSON.stringify(axiosPayload)),
      CONSTANTS: {
        id: 'campaign-manager-target-groups-data-table',
        ascending: 'ascending'
      },
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 340,
            isEditable: true,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: labels.CompanyName,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            fixed: false,
            isEditable: true,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
            editOptions: {
              component: 'select',
              props: {
                items: [
                  { text: 'Very Low', value: 'VeryLow' },
                  'Low',
                  'Medium',
                  'High',
                  { text: 'Very High', value: 'VeryHigh' }
                ]
              }
            },
            width: 260,
            overrideWidth: true
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            fixed: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            isEditable: true,
            overrideWidth: true
          }
        ],
        iEmpty: {
          message: labels.EmptyTargetGroup,
          subMes: 'Go to Company>Target Users to add Target Groups',
          id: 'btn-empty--campaign-manager-empty-target-group'
        },
        serverSideEvents: { pagination: true, search: true, sort: true }
      },
      serverSideProps: new ServerSideProps(),
      highlightedRow: {}
    }
  },
  watch: {
    highlightedRow(val) {
      this.$emit('on-highlighted-row-change', val)
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchTargetGroups(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.totalNumberOfRecords = totalNumberOfRecords
          this.tableData = data.results
          if (data.results.length) {
            this.highlightedRow = this.tableData[0]
            this.$emit('update:empty', false)
          } else {
            this.highlightedRow = {}
            if (!this.tableOptions.isColumnFilterActive) this.$emit('update:empty', true)
          }
        })
        .finally(this.setLoading)
    },
    setLoading(val = false) {
      this.$emit('update:is-loading', val)
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.checkIsColumnFilterActive()
      this.callForData()
    },
    searchChangedFilter(filter = []) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = filter
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    checkIsColumnFilterActive() {
      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleRowClick(row) {
      this.highlightedRow = row
    },
    addRowClassName({ row }) {
      return row.resourceId === this.highlightedRow.resourceId
        ? 'campaign-manager-highlighted-row'
        : ''
    }
  }
}
</script>

<style lang="scss">
#campaign-manager-target-groups-data-table.k-table__wrapper {
  padding-bottom: 0;
  .table-wrapper {
    padding-top: 0;
  }
  .card .table-wrapper .selection-row {
    top: 1px;
  }
}
.campaign-manager-highlighted-row {
  background-color: #fefdf2 !important;
  color: #2196f3 !important;
  font-weight: 600 !important;
  div,
  span {
    color: #2196f3 !important;
  }
}
</style>
