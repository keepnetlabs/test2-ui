<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    is-server-side
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :server-side-props="serverSideProps"
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :show-filter-options="false"
    :axios-payload.sync="axiosPayload"
    :add-row-class-name="addRowClassName"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @row-click="handleRowClick"
    @handleSelectionChange="$emit('handle-selection-change', $event)"
  >
    <template #datatable-custom-column="{ scope, col }">
      <span v-if="col.property === 'name'">
        {{ scope.row[col.property] }}
      </span>
      <VTooltip v-if="isTooltipRenderable(scope.row)" bottom max-width="320" z-index="100">
        <template #activator="{ on }">
          <v-icon v-on="on" class="ml-2" size="20" color="#757575">mdi-information</v-icon>
        </template>
        <span>
          {{ getGroupNameTooltipMessage(scope.row) }}
        </span>
      </VTooltip>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { searchAllTargetGroups, searchTargetGroups } from '@/api/targetUsers'
import CallbackService from '@/api/callback'
import { getDefaultAxiosPayload } from '@/utils/functions'

export default {
  name: 'CampaignManagerTargetGroupsTable',
  components: {
    DataTable
  },
  props: {
    empty: {
      type: Boolean
    },
    search: {
      type: String
    },
    isLoading: {
      type: Boolean
    },
    responseOfTargetGroupsItems: {
      type: Object
    },
    isAllGroups: {
      type: Boolean,
      default: false
    },
    isShowCompanyColumn: {
      type: Boolean,
      default: true
    },
    isCallApiWhenCreated: {
      type: Boolean,
      default: false
    },
    isCallback: {
      type: Boolean,
      default: false
    },
    defaultSelectedTargetGroupResourceIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const columns = [
      {
        property: PROPERTY_STORE.NAME,
        align: 'left',
        editable: false,
        label: 'Group Name',
        fixed: false,
        sortable: true,
        show: true,
        type: 'slot',
        width: 340,
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
        showSelectSearch: false,
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
        minWidth: 150,
        isEditable: true,
        overrideWidth: true
      }
    ]
    if (this.isShowCompanyColumn)
      columns.splice(1, 0, {
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
      })
    return {
      axiosPayload: getDefaultAxiosPayload(),
      CONSTANTS: {
        id: 'campaign-manager-target-groups-data-table',
        ascending: 'ascending'
      },
      tableData: [],
      tableOptions: {
        columns,
        iEmpty: {
          message: labels.EmptyTargetGroup,
          subMes: 'Go to Company > Target Users to add Target Groups',
          id: 'btn-empty--campaign-manager-empty-target-group'
        },
        serverSideEvents: { pagination: true, search: true, sort: true }
      },
      serverSideProps: new ServerSideProps(),
      defaultServerSideProps: { ...new ServerSideProps(), results: [] },
      highlightedRow: {}
    }
  },
  watch: {
    highlightedRow(val) {
      this.$emit('on-highlighted-row-change', val)
    },
    responseOfTargetGroupsItems(val) {
      this.setDefaultResponseParams(val)
    }
  },
  created() {
    if (this.isCallApiWhenCreated) this.callForData()
  },
  methods: {
    getGroupNameTooltipMessage(row) {
      if (!row?.name) return ''
      if (row.name === 'Repeat Offenders') {
        return 'Users who fail two or more phishing campaigns are automatically added to the Repeat Offenders group, posing a higher security risk. Prioritize targeted training and simulations for their adaptation to your security culture, and they will be automatically removed once the risk is reduced.'
      }
      if (row.name === 'New Hires') {
        return 'New hires are automatically added to this group for 90 days to receive targeted training and simulations, prioritizing their adaptation to your security culture, before being automatically removed.'
      }
      return ''
    },
    isTooltipRenderable(row) {
      return row?.name && ['Repeat Offenders', 'New Hires'].includes(row.name)
    },
    callForData() {
      this.$nextTick(() => {
        this.setLoading(true)
        if (this.defaultSelectedTargetGroupResourceIds.length)
          this.axiosPayload.selectTargetUserResourceIds = this.defaultSelectedTargetGroupResourceIds.join(
            ','
          )
        if (this.isCallback) {
          CallbackService.getTargetGroupsForCurrentCompany(this.axiosPayload)
            .then((response) => {
              this.setDefaultResponseParams(response)
            })
            .finally(() => {
              this.$refs?.refTable?.getSelectedObjectAndSelectRowsByRowKey()
            })
        } else if (this.isAllGroups) {
          searchAllTargetGroups(this.axiosPayload)
            .then((response) => {
              this.setDefaultResponseParams(response)
            })
            .finally(() => {
              this.$refs?.refTable?.getSelectedObjectAndSelectRowsByRowKey()
            })
        } else {
          searchTargetGroups(this.axiosPayload, true)
            .then((response) => {
              this.setDefaultResponseParams(response)
            })
            .finally(() => {
              this.$refs?.refTable?.getSelectedObjectAndSelectRowsByRowKey()
            })
        }
      })
    },
    setDefaultResponseParams(response) {
      const { totalNumberOfRecords, totalNumberOfPages, pageNumber, results } = response?.data?.data
        ? response.data.data
        : this.defaultServerSideProps
      this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
      this.serverSideProps.totalNumberOfPages = totalNumberOfPages
      this.serverSideProps.pageNumber = pageNumber
      this.totalNumberOfRecords = totalNumberOfRecords
      this.tableData = results
      if (results.length) {
        this.highlightedRow = this.tableData[0]
        this.$emit('update:empty', false)
      } else {
        this.highlightedRow = {}
        if (!this.$refs?.refTable?.isColumnFilterActive) this.$emit('update:empty', true)
      }
      this.$refs?.refTable?.getSelectedObjectAndSelectRowsByRowKey()
      this.setLoading(false)
    },
    setLoading(val = false) {
      this.$emit('update:is-loading', val)
    },
    columnFilterChanged(filter) {
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
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.axiosPayload.orderBy = prop
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleRowClick(row) {
      this.highlightedRow = row
    },
    addRowClassName({ row }) {
      return row.resourceId === this.highlightedRow.resourceId
        ? ' campaign-manager-highlighted-row'
        : ''
    }
  }
}
</script>
