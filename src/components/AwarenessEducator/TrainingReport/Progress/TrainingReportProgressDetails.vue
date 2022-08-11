<template>
  <AppDialog
    title-id="text--training-report-progress-details-popup-title"
    subtitle-id="text--training-report-progress-details-popup-subtitle"
    :maxHeightSize="'665'"
    :custom-size="'1000'"
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
        <template v-slot:datatable-custom-column="{ scope }">
          <div class="training-report-progress__progress-column">
            <v-btn style="display: none;" />
            <Badge v-bind="getStatusBadgeProps(scope.row.progress)" size="medium" />
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
            align: 'left',
            fixed: 'left',
            editable: false,
            label: 'Session',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 120,
            filterableType: 'number'
          },
          {
            property: 'progress',
            align: 'center',
            editable: false,
            label: 'Progress',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'badge',
            width: 180,
            filterableType: 'text'
          },
          {
            property: 'sessionStartDate',
            align: 'left',
            editable: false,
            label: 'Session Started',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'date'
          },
          {
            property: 'sessionEndDate',
            align: 'left',
            editable: false,
            label: 'Session Ended',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'date'
          },
          {
            property: 'userAgent',
            align: 'left',
            editable: false,
            label: 'User Agent',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 220,
            filterableType: 'text'
          },
          {
            property: 'browserName',
            align: 'left',
            editable: false,
            label: 'Browser',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'text'
          },
          {
            property: 'userGeolocation',
            align: 'left',
            editable: false,
            label: 'Geolocation',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text'
          },
          {
            property: 'userIpAddresslist',
            align: 'left',
            fixed: 'right',
            editable: false,
            label: 'IP',
            sortable: true,
            hideSort: false,
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text'
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
    getStatusBadgeProps(progress) {
      if (progress === 'In Progress')
        return {
          color: '#B6791D',
          text: 'In Progress'
        }

      if (progress === 'Completed')
        return {
          color: '#217124',
          text: 'Completed'
        }
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
