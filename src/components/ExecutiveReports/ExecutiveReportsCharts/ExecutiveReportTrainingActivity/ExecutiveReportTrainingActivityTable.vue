<template>
  <div class="training-activity-table-wrapper">
    <DataTable
      ref="refTrainingActivityTable"
      class="training-activity-table"
      is-server-side
      append-tooltip-to-body
      :columns="currentColumns"
      :table="tableData"
      :empty="empty"
      :loading="isLoading"
      :server-side-props="serverSideProps"
      :server-side-events="serverSideEvents"
      :axios-payload.sync="axiosPayload"
      :show-pagination="true"
      :show-page-size="true"
      :show-filter-options="false"
      :show-datatable-row-actions="false"
      :download-button="{ show: false }"
      :filterable="true"
      :groupable="true"
      :show-cluster-menu="false"
      :show-cluster-tooltips="true"
      :options="true"
      :show-refresh-button="true"
      :is-settings-popup="false"
      :count-row="10"
      @server-side-size-changed="serverSideSizeChanged"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @sortChangedEvent="sortChanged"
      @refreshAction="callForData"
      @handleListBulleted="handleListBulleted"
      @handleGroupedClick="handleGroupedClick"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @searchChangedEvent="handleSearchChange"
    >
      <template #datatable-custom-column="{ scope, col }">
        <div v-if="col.property === 'status'" class="training-activity-table__status-column">
          <v-btn style="display: none;" />
          <Badge
            :color="getStatusColor(scope.row.status)"
            :text="getStatusText(scope.row.status)"
            :col="col"
            size="medium"
          />
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { searchTrainingActivityUsers } from '@/api/reports'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { columnFilterChanged } from '@/utils/helperFunctions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import Badge from '@/components/Badge'

export default {
  name: 'ExecutiveReportTrainingActivityTable',
  components: {
    DataTable,
    Badge
  },
  mixins: [useDefaultTableFunctions],
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      default: () => ({})
    },
    dateRange: {
      type: Array,
      default: () => []
    },
    datePeriod: {
      type: Number,
      default: 1
    },
    defaultWidgetData: {
      type: [Object, Array]
    },
    dateFormat: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      axiosPayload: (() => {
        const payload = getDefaultAxiosPayload(
          {
            pageSize: 10,
            groupByUser: false
          },
          'firstName'
        )
        payload.ascending = true
        return payload
      })(),
      serverSideProps: new ServerSideProps('', false, 10),
      serverSideEvents: { pagination: true, search: true, sort: true },
      tableData: [],
      isGrouped: false,
      ungroupedColumns: [
        {
          property: 'firstName',
          label: 'First Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 150
        },
        {
          property: 'lastName',
          label: 'Last Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 150
        },
        {
          property: 'email',
          label: 'Email',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 250
        },
        {
          property: 'enrollmentName',
          label: 'Enrollment Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 200
        },
        {
          property: 'contentType',
          label: 'Type',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'select',
          filterableItems: [],
          width: 120
        },
        {
          property: 'openedTrainingEmail',
          label: 'Opened Training Email',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          width: 220
        },
        {
          property: 'clickedTrainingEmail',
          label: 'Clicked Training Link',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          minWidth: 220
        },
        {
          property: 'status',
          label: 'Status',
          align: 'center',
          show: true,
          type: 'slot',
          sortable: true,
          width: 150,
          props: {
            style: {
              maxWidth: '110px !important'
            }
          },
          overrideWidth: true,
          filterableType: 'text',
          filterableCustomFieldName: 'trainingStatus'
        },
        {
          property: 'examScore',
          label: 'Exam Score',
          align: 'left',
          show: true,
          type: 'number',
          sortable: true,
          filterableType: 'number',
          minWidth: 150
        }
      ],
      groupedColumns: [
        {
          property: 'firstName',
          label: 'First Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 150
        },
        {
          property: 'lastName',
          label: 'Last Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 150
        },
        {
          property: 'email',
          label: 'Email',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 250
        },
        {
          property: 'opened',
          label: 'Opened',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          width: 120
        },
        {
          property: 'clicked',
          label: 'Clicked',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          width: 120
        },
        {
          property: 'completed',
          label: 'Completed',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          width: 150
        },
        {
          property: 'incomplete',
          label: 'Incomplete',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          minWidth: 150
        }
      ],
      empty: {
        message: 'No training activity data available'
      }
    }
  },
  computed: {
    currentColumns() {
      return this.isGrouped ? this.groupedColumns : this.ungroupedColumns
    }
  },
  watch: {
    dateRange() {
      this.callForData()
    }
  },
  created() {
    this.callForData()
    this.fetchTrainingTypes()
  },
  methods: {
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    fetchTrainingTypes() {
      AwarenessEducatorService.getTrainingTypes().then((response) => {
        const types = response?.data?.data || []
        this.$set(
          this.ungroupedColumns[4],
          'filterableItems',
          types.map((t) => ({ text: t.displayName, value: t.id }))
        )
        this.$refs.refTrainingActivityTable?.reRenderFilters()
      })
    },
    callForData() {
      if (!this.dateRange?.length) return

      this.isLoading = true
      this.axiosPayload.startDate = this.dateRange[0]
      this.axiosPayload.endDate = this.dateRange[1]

      searchTrainingActivityUsers(this.axiosPayload)
        .then((response) => {
          const { data } = response || {}
          const responseData = data?.data || {}
          this.serverSideProps.totalNumberOfRecords = responseData.totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = responseData.totalNumberOfPages
          this.serverSideProps.pageNumber = responseData.pageNumber
          this.setTableData(responseData.results || [])
          this.emitPaginationChange()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setTableData(results) {
      if (!results || !results.length) {
        this.tableData = []
        return
      }

      if (this.isGrouped) {
        this.tableData = results.map((item) => ({
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          email: item.email || '',
          opened: item.openedTrainingEmail ?? 0,
          clicked: item.clickedTrainingEmail ?? 0,
          completed: item.completedCount ?? 0,
          incomplete: item.notCompletedCount ?? 0
        }))
      } else {
        this.tableData = results.map((item) => ({
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          email: item.email || '',
          enrollmentName: item.enrollmentName || '',
          contentType: item.contentType || '',
          trainingContentName: item.trainingContentName || '',
          openedTrainingEmail: item.openedTrainingEmail ?? 0,
          clickedTrainingEmail: item.clickedTrainingEmail ?? 0,
          status: item.trainingStatus || '',
          examScore: item.examScore,
          isMainScore: item.isMainScore
        }))
      }
    },
    serverSideSizeChanged(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    handleListBulleted() {
      this.isGrouped = false
      this.axiosPayload.groupByUser = false
      // Clear filters for columns that exist only in grouped mode
      const groupedOnlyColumns = ['completed', 'incomplete']
      const filterItems = this.axiosPayload.filter.FilterGroups[0].FilterItems
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterItems.filter(
        (item) => !groupedOnlyColumns.includes(item.FieldName)
      )
      // Check if current orderBy exists in ungrouped columns
      const ungroupedColumnProperties = this.ungroupedColumns.map((col) => col.property)
      if (!ungroupedColumnProperties.includes(this.axiosPayload.orderBy)) {
        this.axiosPayload.orderBy = 'firstName'
        this.axiosPayload.ascending = true
      }
      this.resetPageNumber()
      this.callForData()
    },
    handleGroupedClick() {
      this.isGrouped = true
      this.axiosPayload.groupByUser = true
      // Clear filters for columns that exist only in ungrouped mode
      const ungroupedOnlyColumns = [
        'enrollmentName',
        'contentType',
        'openedTrainingEmail',
        'clickedTrainingEmail',
        'status',
        'examScore'
      ]
      const filterItems = this.axiosPayload.filter.FilterGroups[0].FilterItems
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterItems.filter(
        (item) => !ungroupedOnlyColumns.includes(item.FieldName)
      )
      // Check if current orderBy exists in grouped columns
      const groupedColumnProperties = this.groupedColumns.map((col) => col.property)
      if (!groupedColumnProperties.includes(this.axiosPayload.orderBy)) {
        this.axiosPayload.orderBy = 'firstName'
        this.axiosPayload.ascending = true
      }
      this.resetPageNumber()
      this.callForData()
    },
    emitPaginationChange() {
      const actualRowCount = Math.min(this.axiosPayload.pageSize, this.tableData.length)
      this.$emit('on-pagination-change', this.card, actualRowCount)
    },
    getStatusColor(status) {
      if (!status) return '#757575'
      const trimmedStatus = status.replaceAll(/\s/g, '')
      if (trimmedStatus === 'Completed') {
        return '#217124'
      }
      if (trimmedStatus === 'Incomplete' || trimmedStatus === 'NotCompleted') {
        return '#B6791D'
      }
      return '#757575'
    },
    getStatusText(status) {
      if (!status) return ''
      const trimmedStatus = status.replaceAll(/\s/g, '')
      if (trimmedStatus === 'Completed') {
        return 'Completed'
      }
      if (trimmedStatus === 'Incomplete' || trimmedStatus === 'NotCompleted') {
        return 'Incomplete'
      }
      return status
    }
  }
}
</script>
