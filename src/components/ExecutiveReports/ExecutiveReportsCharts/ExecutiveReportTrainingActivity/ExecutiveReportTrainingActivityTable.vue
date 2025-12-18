<template>
  <div class="training-activity-table-wrapper">
    <DataTable
      ref="refTrainingActivityTable"
      class="training-activity-table"
      is-server-side
      append-tooltip-to-body
      :columns="columns"
      :table="tableData"
      :empty="empty"
      :loading="isLoading"
      :server-side-props="serverSideProps"
      :server-side-events="serverSideEvents"
      :show-pagination="true"
      :show-page-size="true"
      :show-filter-options="true"
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
    />
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { searchTrainingActivityUsers } from '@/api/reports'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'ExecutiveReportTrainingActivityTable',
  components: {
    DataTable
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
      axiosPayload: getDefaultAxiosPayload(
        {
          pageSize: 10,
          groupByUser: false
        },
        'firstName'
      ),
      serverSideProps: new ServerSideProps('', false, 10),
      serverSideEvents: { pagination: true, search: true, sort: true },
      tableData: [],
      columns: [
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
          property: 'trainingContentName',
          label: 'Material Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 200
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
        }
      ],
      empty: {
        message: 'No training activity data available'
      }
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
    fetchTrainingTypes() {
      AwarenessEducatorService.getTrainingTypes().then((response) => {
        const types = response?.data?.data || []
        this.$set(
          this.columns[4],
          'filterableItems',
          types.map((t) => t.displayName)
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

      this.tableData = results.map((item) => ({
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.email || '',
        enrollmentName: item.enrollmentName || '',
        contentType: item.contentType || '',
        trainingContentName: item.trainingContentName || '',
        openedTrainingEmail: item.openedTrainingEmail ?? 0,
        clickedTrainingEmail: item.clickedTrainingEmail ?? 0
      }))
    },
    serverSideSizeChanged(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    handleListBulleted() {
      this.axiosPayload.groupByUser = false
      this.resetPageNumber()
      this.callForData()
    },
    handleGroupedClick() {
      this.axiosPayload.groupByUser = true
      this.resetPageNumber()
      this.callForData()
    },
    emitPaginationChange() {
      const actualRowCount = Math.min(this.axiosPayload.pageSize, this.tableData.length)
      this.$emit('on-pagination-change', this.card, actualRowCount)
    }
  }
}
</script>
