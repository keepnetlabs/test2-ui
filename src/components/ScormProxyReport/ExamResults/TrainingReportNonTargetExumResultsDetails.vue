<template>
  <AppDialog
    title-id="text--training-report-user-interactions-popup-title"
    title="Exam Results"
    subtitle-id="text--training-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <p v-if="isShowMessage">
        {{ getMessage }}
      </p>
      <DataTable
        v-if="!isShowMessage"
        :id="CONSTANTS.id"
        ref="refTable"
        selectable
        filterable
        options
        no-padding-bottom
        is-server-side
        :show-filter-options="false"
        :is-settings-popup="false"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        :server-side-props="serverSideProps"
        :count-row="5"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
      >
        <template #datatable-custom-column="{ scope, col }">
          <div class="training-report-users-interactions__interaction-column">
            <v-btn style="display: none;" />
            <Badge v-bind="getStatusBadgeProps(scope.row.isPassed)" :col="col" size="medium" />
          </div>
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
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
import Badge from '@/components/Badge'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'

export default {
  name: 'TrainingReportNonTargetExumResultsDetails',
  components: { AppDialogFooterWithClose, DataTable, AppDialog, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    },
    interactionType: {
      type: String
    },
    firstColumnLabel: {
      type: String,
      default: 'Date'
    }
  },
  data() {
    const columns = [
      {
        property: 'status',
        align: 'center',
        fixed: 'left',
        editable: false,
        label: 'Status',
        show: true,
        type: 'slot',
        props: {
          style: {
            maxWidth: '110px !important'
          }
        },
        hideSort: true
      },
      {
        property: 'sessionDate',
        align: 'left',
        fixed: false,
        editable: false,
        label: labels.Date,
        show: true,
        type: 'text',
        hideSort: true
      },
      {
        property: 'score',
        align: 'left',
        fixed: 'right',
        editable: false,
        label: labels.Score,
        show: true,
        type: 'text',
        hideSort: true
      }
    ]

    return {
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'training-report-user-interactions-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'sessionDate' }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns,
        addButton: {
          show: false
        },
        iEmpty: {
          message: 'No details for the user who hasn’t responded yet'
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
      return `${this.item?.targetUserResourceId}`
    },
    getMessage() {
      if (['In Queue', 'InQueue'].includes(this.item.status)) {
        return 'The email for this user is in the queue to send. Please check again after a while.'
      }
      if (['Not Delivered', 'NotDelivered'].includes(this.item.status)) {
        return 'The email could not be delivered to this user. Therefore there isn’t any action by the user. You can check the details about this error on the “Sending Report” tab.'
      }
      if (['Sending Error', 'SendingError', 'Error'].includes(this.item.status)) {
        return 'The email could not be delivered to this user. Therefore there isn’t any action by the user. You can check the details about this error on the “Sending Report” tab.'
      }
      if (['Cancelled'].includes(this.item.status)) {
        return 'The training enrollment was cancelled while sending emails. For this reason the email could not be delivered to this user. Therefore there isn’t any action by the user.'
      }
      if (['Processing'].includes(this.item.status)) {
        return 'This user hasn’t interacted with the enrollment email or the training, yet. Please check again after a while.'
      }
      return ''
    },
    isShowMessage() {
      return [
        'In Queue',
        'InQueue',
        'Not Delivered',
        'NotDelivered',
        'Error',
        'SendingError',
        'Sending Error',
        'Processing',
        'Cancelled'
      ].includes(this.item.status)
    }
  },
  created() {
    this.serverSideProps.pageSize = 5
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(isPassed) {
      if (isPassed) {
        return {
          color: '#217124',
          text: 'Passed'
        }
      } else {
        return {
          color: '#B83A3A',
          text: 'Failed'
        }
      }
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.examTrainingNonTargetUserTrainingDetails(
        this.axiosPayload,
        this.item.enrollmentId,
        this.item.targetUserResultId
      )
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
        .finally(this.setLoading)
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
