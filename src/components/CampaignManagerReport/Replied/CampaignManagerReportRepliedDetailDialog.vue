<template>
  <AppDialog
    title-id="text--campaign-manager-opened-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-detail-popup-subtitle"
    maxHeightSize="665"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    :title="getTitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose
        id="btn-close--campaign-report-submitted-detail-popup"
        @on-close="handleClose"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { searchCampaignJobUserEmailSubmittedDetails } from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
export default {
  name: 'CampaignManagerReportRepliedDetailDialog',
  components: {
    AppDialogFooterWithClose,
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
        id: 'campaign-manager-submitted-detail-item-data-table',
        ascending: 'ascending'
      },
      isLoading: false,
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'SubmittedTime' }),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        addButton: {
          show: false
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
      return `Out of Office Reply Preview`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserEmailSubmittedDetails(this.axiosPayload, this.item?.resourceId)
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
