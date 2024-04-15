<template>
  <AppDialog
    title-id="text--training-report-user-interactions-popup-title"
    title="Details"
    subtitle-id="text--training-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
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
          CLOSE
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
import { getStatusBadgeProps } from '@/components/SmishingReport/Users/utils'
import Badge from '@/components/Badge'
import SmishingService from '@/api/smishing'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'CampaignReportUserInteractionsModal',
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
    }
  },
  data() {
    const columns = [
      {
        property: 'interaction',
        align: 'center',
        fixed: 'left',
        editable: false,
        label: 'Last Interaction',
        show: true,
        type: 'slot',
        width: 180,
        props: {
          style: {
            maxWidth: '110px !important'
          }
        },
        hideSort: true
      },
      {
        property: 'eventTime',
        align: 'left',
        fixed: this.interactionType ? 'left' : false,
        editable: false,
        label: 'Date',
        show: true,
        type: 'text',
        width: 200,
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
      SmishingService.searchCampaignJobTypeDetails(
        'search-sms-all',
        this.axiosPayload,
        this.item?.resourceId
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
