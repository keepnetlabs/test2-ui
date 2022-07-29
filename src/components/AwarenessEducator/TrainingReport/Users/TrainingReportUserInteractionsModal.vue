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
            align: 'left',
            editable: false,
            label: 'Interaction',
            sortable: true,
            show: true,
            type: 'slot',
            width: 150,
            filterableType: 'select',
            filterableItems: [
              'Not Responded',
              'Opened Email',
              'Clicked Link',
              'In Progress',
              'Completed',
              'In Queue',
              'Sending Error',
              'Cancelled',
              'Excluded'
            ]
          },
          {
            property: 'date',
            align: 'left',
            editable: false,
            label: 'Date',
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: 'date',
            filterableCustomFieldName: 'date'
          },
          {
            property: 'userAgent',
            align: 'left',
            editable: false,
            label: 'User Agent',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 213
          },
          {
            property: 'browser',
            align: 'left',
            editable: false,
            label: 'Browser',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 120
          },
          {
            property: 'geolocation',
            align: 'left',
            editable: false,
            label: 'Geolocation',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'ip',
            align: 'left',
            editable: false,
            label: 'IP',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 120
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
          interaction: 'Completed',
          date: '31.05.2021 16:43:12',
          userAgent:
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0',
          browser: 'Chrome',
          geolocation: 'NY, USA',
          ip: '128.125.67.89'
        },
        {
          interaction: 'Clicked Link',
          date: '31.05.2021 16:43:12',
          userAgent:
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0',
          browser: 'Chrome',
          geolocation: 'NY, USA',
          ip: '128.125.67.89'
        },
        {
          interaction: 'Opened Email',
          date: '31.05.2021 16:43:12',
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
      return getStatusBadgeProps(status)
    },
    callForData() {
      AwarenessEducatorService.getTrainingReportInteractions(
        this.selectedRow.enrollmentId,
        this.selectedRow.userEmailId
      ).then((response) => {
        debugger
      })
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
