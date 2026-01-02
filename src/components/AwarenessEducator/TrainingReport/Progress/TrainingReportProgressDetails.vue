<template>
  <AppDialog
    title-id="text--training-report-progress-details-popup-title"
    subtitle-id="text--training-report-progress-details-popup-subtitle"
    :maxHeightSize="'665'"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    title="Details of the user’s progress"
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
      >
        <template v-slot:datatable-custom-column="{ scope, col }">
          <div class="training-report-progress__progress-column">
            <v-btn style="display: none;" />
            <Badge
              v-bind="getTrainingReportProgressStatusBadgeProps(scope.row.progress)"
              :col="col"
              size="medium"
            />
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
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import Badge from '@/components/Badge'
import { getTrainingReportProgressStatusBadgeProps } from './utils'
export default {
  name: 'TrainingReportProgressDetails',
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
        id: 'training-report-progress-details-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'sessionRank',
            align: 'right',
            fixed: 'left',
            editable: false,
            label: 'Session',
            hideSort: true,
            show: true,
            type: 'text',
            width: 120
          },
          {
            property: 'progress',
            align: 'center',
            editable: false,
            label: 'Progress',
            hideSort: true,
            show: true,
            type: 'slot',
            width: 180,
            props: {
              style: {
                maxWidth: '110px !important'
              }
            }
          },
          {
            property: 'sessionStartDate',
            align: 'left',
            editable: false,
            label: 'Session Started',
            hideSort: true,
            show: true,
            type: 'text',
            width: 180
          },
          {
            property: 'sessionEndDate',
            align: 'left',
            editable: false,
            label: 'Session Ended',
            hideSort: true,
            show: true,
            type: 'text',
            width: 180
          },
          {
            property: 'userAgent',
            align: 'left',
            editable: false,
            label: 'User Agent',
            hideSort: true,
            show: true,
            type: 'text',
            width: 220
          },
          {
            property: 'browserName',
            align: 'left',
            editable: false,
            label: 'Browser',
            hideSort: true,
            show: true,
            type: 'text',
            width: 160
          },
          {
            property: 'userGeolocation',
            align: 'left',
            editable: false,
            label: 'Geolocation',
            hideSort: true,
            show: true,
            type: 'text',
            width: 200
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
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
    }
  },
  mounted() {
    this.callForData()
  },
  methods: {
    getTrainingReportProgressStatusBadgeProps,
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.getProgressDetailsTable(
        this.item.enrollmentId,
        this.item.targetUserResourceId
      )
        .then((response) => {
          this.tableData = response?.data?.data.map((item) => ({
            ...item,
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
