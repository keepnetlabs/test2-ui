<template>
  <AppDialog
    title-id="text--training-report-user-interactions-popup-title"
    title="Details"
    subtitle-id="text--training-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'850'"
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
        :count-row="5"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
      >
        <template v-slot:datatable-custom-column="{ scope, col }">
          <div class="training-report-users-interactions__interaction-column">
            <v-btn style="display: none;" />
            <Badge v-bind="getStatusBadgeProps(scope.row.interaction)" :col="col" size="medium" />
          </div>
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn--action-training-report-user-intractions-modal"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
        >
          {{ isShowMessage ? 'OKAY' : 'CLOSE' }}
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
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import Badge from '@/components/Badge'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingReportUserInteractionsModal',
  components: { DataTable, AppDialog, Badge },
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
    },
    isAddTrainingTypeKeyToPayload: {
      type: Boolean,
      default: false
    },
    trainingSummary: {
      type: Object
    }
  },
  data() {
    const columns = [
      {
        property: 'eventTime',
        align: 'left',
        fixed: this.interactionType ? 'left' : false,
        editable: false,
        label: this.firstColumnLabel,
        show: true,
        type: 'text',
        width: 160,
        hideSort: true
      },
      {
        property: 'userAgent',
        align: 'left',
        editable: false,
        label: 'User Agent',
        hideSort: true,
        show: true,
        type: 'text',
        width: 250
      },
      {
        property: 'browserName',
        align: 'left',
        label: labels.Browser,
        fixed: false,
        show: true,
        type: 'text',
        width: 180,
        isEditable: false,
        hideSort: true
      },
      {
        property: 'userGeolocation',
        align: 'left',
        editable: false,
        label: 'Geolocation',
        hideSort: true,
        show: true,
        type: 'text',
        width: 180
      },
      {
        property: 'userIpAddresslist',
        align: 'left',
        fixed: 'right',
        editable: false,
        label: 'IP',
        hideSort: true,
        show: true,
        type: 'text',
        width: 160
      }
    ]
    if (!this.interactionType)
      columns.unshift({
        property: 'interaction',
        align: 'center',
        fixed: 'left',
        editable: false,
        label: 'Interaction',
        show: true,
        type: 'slot',
        width: 180,
        props: {
          style: {
            maxWidth: '110px !important'
          }
        },
        hideSort: true
      })
    else {
      columns[columns.length - 1].width = 160
    }
    if (
      this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
      this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
    ) {
      columns[0].fixed = false
      columns.splice(0, 0, {
        property: 'currentStep',
        align: 'left',
        fixed: 'left',
        editable: false,
        label: 'Current Step',
        sortable: false,
        hideSort: true,
        show: true,
        type: 'text',
        width: 180
      })
    }
    return {
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'training-report-user-interactions-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'Date' }),
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
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
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
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    callForData() {
      this.setLoading(true)
      let type = 0
      let textType = this.isAddTrainingTypeKeyToPayload
        ? this.trainingSummary.trainingTypeName.replaceAll(' ', '')
        : null
      if (textType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) type = 1
      else if (textType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) type = 2
      else if (textType === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) type = 3
      else if (
        textType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        textType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        type = 4
      AwarenessEducatorService.getTrainingReportInteractions(
        this.item.enrollmentId,
        this.item.targetUserResourceId,
        this.interactionType,
        type
      )
        .then((response) => {
          this.tableData = response?.data?.data.map((item) => ({
            interaction: item.interaction,
            eventTime: item.eventTime,
            currentStep: item.currentStep,
            ...item.trackingInfo
          }))
        })
        .finally(this.setLoading)
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
