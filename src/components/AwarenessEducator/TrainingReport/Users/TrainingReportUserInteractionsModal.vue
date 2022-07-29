<template>
  <AppDialog
    title-id="text--training-report-user-interactions-popup-title"
    subtitle-id="text--training-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'1000'"
    :icon="CONSTANTS.icon"
    title="Interactions"
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
          <div class="training-report-users-interactions__interaction-column">
            <v-btn style="display: none;" />
            <Badge v-bind="getStatusBadgeProps(scope.row.interaction)" size="medium" />
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
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import Badge from '@/components/Badge'
import AwarenessEducator from '@/views/AwarenessEducator'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingReportUserInteractionsModal',
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
        id: 'training-report-user-interactions-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'Date' }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'interaction',
            align: 'center',
            editable: false,
            label: 'Interaction',
            sortable: false,
            show: true,
            type: 'badge',
            width: 180,
            hideSort: true
          },
          {
            property: 'eventTime',
            align: 'left',
            editable: false,
            label: 'Date',
            sortable: false,
            show: true,
            type: 'text',
            width: 180,
            hideSort: true
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
            width: 220
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
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.getTrainingReportInteractions(
        this.item.enrollmentId,
        this.item.userEmailId || this.item.resourceId
      )
        .then((response) => {
          this.tableData = [
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data,
            ...response?.data?.data
          ]
        })
        .finally(this.setLoading)
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
