<template>
  <AppDialog
    title-id="text--campaign-manager-opened-attachment-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-attachment-detail-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    :title="getTitle"
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
        <template #datatable-custom-column="{ scope, col }">
          <CampaignManagerReportUserAgentColumn
            v-if="col.property === COLUMNS.USER_AGENT_SLOT.property"
            :scope="scope"
          />
          <CampaignManagerReportIPColumn
            v-if="col.property === COLUMNS.IP_SLOT.property"
            :scope="scope"
          />
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose
        id="btn--close-campaign-manager-opened-attachment-detail-popup"
        @on-close="handleClose"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { searchCampaignJobUserAttachmentOpenedDetaiils } from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CampaignManagerReportIPColumn from '@/components/CampaignManagerReport/CampaignManagerReportIPColumn'
import CampaignManagerReportUserAgentColumn from '@/components/CampaignManagerReport/CampaignManagerReportUserAgentColumn.vue'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'

export default {
  name: 'CampaignManagerReportOpenedItemDetailDialog',
  components: {
    AppDialogFooterWithClose,
    CampaignManagerReportUserAgentColumn,
    CampaignManagerReportIPColumn,
    DataTable,
    AppDialog
  },
  mixins: [useLoading, useDefaultTableFunctions],
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
      COLUMNS,
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'campaign-manager-opened-attachment-detail-item-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'OpenedTime' }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.DATE_OPENED,
          COLUMNS.USER_AGENT_SLOT,
          COLUMNS.BROWSER,
          COLUMNS.GEOLOCATION,
          COLUMNS.IP_SLOT
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
    getTitle() {
      return `Opened Attachment ${this.item?.['attachmentOpenedCount'] || 0} Time(s)`
    },
    getSubtitle() {
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserAttachmentOpenedDetaiils(this.axiosPayload, this.item?.resourceId)
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
