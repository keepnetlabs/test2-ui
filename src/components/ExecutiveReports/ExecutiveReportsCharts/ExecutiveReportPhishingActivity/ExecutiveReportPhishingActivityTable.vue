<template>
  <div class="phishing-activity-table-wrapper">
    <DataTable
      ref="refPhishingActivityTable"
      class="phishing-activity-table"
      is-server-side
      append-tooltip-to-body
      :columns="currentColumns"
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
import { searchPhishingActivityUsers } from '@/api/reports'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'ExecutiveReportPhishingActivityTable',
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
          property: 'campaignName',
          label: 'Campaign Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 200
        },
        {
          property: 'templateName',
          label: 'Scenario Name',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 200
        },
        {
          property: 'categoryName',
          label: 'Category',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'text',
          width: 150
        },
        {
          property: 'difficulty',
          label: 'Difficulty',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'select',
          filterableItems: ['Easy', 'Medium', 'Hard'],
          width: 150
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
          minWidth: 120
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
          property: 'attachmentOpened',
          label: 'Attachment Opened',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          width: 190
        },
        {
          property: 'dataSubmitted',
          label: 'Data Submitted',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          width: 180
        },
        {
          property: 'reported',
          label: 'Reported',
          align: 'left',
          show: true,
          type: 'text',
          sortable: true,
          filterableType: 'number',
          minWidth: 130
        }
      ],
      empty: {
        message: 'No phishing activity data available'
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
  },
  methods: {
    callForData() {
      if (!this.dateRange?.length) return

      this.isLoading = true
      this.axiosPayload.startDate = this.dateRange[0]
      this.axiosPayload.endDate = this.dateRange[1]

      searchPhishingActivityUsers(this.axiosPayload)
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
          opened: item.opened,
          clicked: item.clicked,
          attachmentOpened: item.attachmentOpened,
          dataSubmitted: item.dataSubmitted,
          reported: item.reported
        }))
      } else {
        this.tableData = results.map((item) => ({
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          email: item.email || '',
          campaignName: item.campaignName || '',
          templateName: item.templateName || '',
          categoryName: item.categoryName || '',
          difficulty: item.difficulty || '',
          opened: item.opened,
          clicked: item.clicked
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
      this.resetPageNumber()
      this.callForData()
    },
    handleGroupedClick() {
      this.isGrouped = true
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
