<template>
  <AppDialog
    title-id="text--training-report-user-interactions-popup-title"
    subtitle-id="text--training-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'1000'"
    :icon="CONSTANTS.icon"
    title="Details"
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import Badge from '@/components/Badge'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

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
    }
  },
  data() {
    const columns = [
      {
        property: 'eventTime',
        align: 'left',
        fixed: this.interactionType ? 'left' : false,
        editable: false,
        label: 'Date Opened',
        sortable: true,
        show: true,
        type: 'text',
        width: 180,
        hideSort: false,
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
        width: 250,
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
        width: 180,
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
        width: 160,
        filterableType: 'text'
      }
    ]
    if (!this.interactionType)
      columns.unshift({
        property: 'interaction',
        align: 'center',
        fixed: 'left',
        editable: false,
        label: 'Interaction',
        sortable: true,
        show: true,
        type: 'badge',
        width: 180,
        hideSort: false,
        filterableType: 'text'
      })
    else {
      columns[columns.length - 1].width = 325
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
        this.item.targetUserResourceId,
        this.interactionType
      )
        .then((response) => {
          this.tableData = response?.data?.data.map((item) => ({
            interaction: item.interaction,
            eventTime: item.eventTime,
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
