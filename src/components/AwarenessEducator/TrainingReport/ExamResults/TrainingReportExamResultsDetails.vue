<template>
  <AppDialog
    title-id="text--training-report-exam-results-details-popup-title"
    subtitle-id="text--training-report-exam-results-details-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'1000'"
    :icon="CONSTANTS.icon"
    title="Exam Results"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        selectable
        filterable
        options
        is-server-side
        no-padding-bottom
        :show-filter-options="false"
        :is-settings-popup="false"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :server-side-props="serverSideProps"
        :server-side-events="tableOptions.serverSideEvents"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
      >
        <template v-slot:datatable-custom-column="{ scope }">
          <div class="training-report-status__status-column">
            <v-btn style="display: none;" />
            <Badge v-bind="getStatusBadgeProps(scope.row.status)" size="medium" />
          </div>
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import Badge from '@/components/Badge'

export default {
  name: 'TrainingReportExamResultsDetails',
  components: { DataTable, AppDialog, Badge },
  mixins: [useLoading],
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'training-report-exam-results-details-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'examStatus',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'badge',
            width: 180
          },
          {
            property: 'sessionEndDate',
            align: 'left',
            editable: false,
            label: 'Session End Date',
            fixed: false,
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 200
          },
          {
            property: 'userAgent',
            align: 'left',
            editable: false,
            label: 'User Agent',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 180
          },
          {
            property: 'browser',
            align: 'left',
            editable: false,
            label: 'Browser',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 180
          },
          {
            property: 'userGeolocation',
            align: 'left',
            editable: false,
            label: 'Geolocation',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 180
          },
          {
            property: 'userIpAddresslist',
            align: 'left',
            editable: false,
            label: 'IP',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 180
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportOpenedDetail
        },
        rowActions: [],
        downloadButton: {
          show: false
        }
      },
      tableData: [
        {
          sessions: 1,
          status: 'Success',
          date: '31.05.2021 16:31:33',
          score: '75%',
          userAgent:
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0',
          browser: 'Chrome',
          geolocation: 'NY, USA',
          ip: '128.125.67.89'
        },
        {
          sessions: 2,
          status: 'Failed',
          date: '31.05.2021 16:31:33',
          score: '100%',
          userAgent:
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0',
          browser: 'Chrome',
          geolocation: 'NY, USA',
          ip: '128.125.67.89'
        }
      ]
    }
  },
  computed: {
    getSubtitle() {
      return `${this.item?.firstName} ${this.item?.lastName}`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(status) {
      if (status === 'Failed')
        return {
          color: '#B83A3A',
          text: 'Failed'
        }

      if (status === 'Success')
        return {
          color: '#217124',
          text: 'Success'
        }
    },
    callForData() {
      //   this.setLoading(true)
      //   searchCampaignJobUserEmailOpenedDetails(this.axiosPayload, this.item?.resourceId)
      //     .then((response) => {
      //       const {
      //         data: {
      //           data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
      //         }
      //       } = response
      //       this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
      //       this.serverSideProps.totalNumberOfPages = totalNumberOfPages
      //       this.serverSideProps.pageNumber = pageNumber
      //       this.tableData = results
      //     })
      //     .finally(this.setLoading)
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
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
