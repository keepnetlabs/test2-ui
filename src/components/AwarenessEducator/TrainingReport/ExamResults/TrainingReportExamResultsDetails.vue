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
        no-padding-bottom
        :show-filter-options="false"
        :is-settings-popup="false"
        :count-row="5"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        @refreshAction="callForData"
      />
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'TrainingReportExamResultsDetails',
  components: { DataTable, AppDialog },
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
      tableData: []
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
    callForData() {
      AwarenessEducatorService.getTrainingReportExamResultsDetails(
        this.item.enrollmentId,
        this.item.userEmailId
      ).then((response) => {
        this.tableData = response?.data?.data
      })
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
