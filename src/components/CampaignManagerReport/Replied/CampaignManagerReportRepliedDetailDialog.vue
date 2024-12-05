<template>
  <AppDialog
    title-id="text--campaign-manager-opened-detail-popup-title"
    subtitle-id="text--campaign-manager-opened-detail-popup-subtitle"
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :title="getTitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <div v-else>
        <div>
          <div class="campaign-report-replied-detail-popup-item">
            <span>From:</span><span>{{ activeFormData.fromName }}</span> -
            <span>{{ activeFormData.from }}</span>
          </div>
          <div class="campaign-report-replied-detail-popup-item">
            <span>To:</span> <span>{{ activeFormData.to }}</span>
          </div>
          <div class="campaign-report-replied-detail-popup-item">
            <span>Subject:</span> <span>{{ activeFormData.subject }} </span>
          </div>
          <div
            class="campaign-report-replied-detail-popup-item campaign-report-replied-detail-popup-item-paginated"
          >
            <div>
              <span>Reply Sent:</span> <span>{{ activeFormData.replySent }}</span>
            </div>
            <div>
              <div class="d-flex align-center">
                <span v-if="repliedTemplates.length"
                  >Replied email 1 of {{ repliedTemplates.length }}}</span
                >
                <div class="landing-page-template-preview__control-buttons">
                  <v-btn
                    class="mr-2"
                    icon
                    :disabled="!hasPreviousTemplate"
                    @click="handlePreviousTemplate"
                  >
                    <v-icon> mdi-chevron-left </v-icon>
                  </v-btn>
                  <v-btn icon :disabled="!hasNextTemplate" @click="handleNextTemplate">
                    <v-icon> mdi-chevron-right </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr class="my-4" />
        <div class="campaign-manager-report-replied-detail-content">
          <KEmailPreview
            v-if="!!getCurrentReplyTemplate"
            ref="refPreview"
            :html="getCurrentReplyTemplate"
          />
        </div>
      </div>
    </template>
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
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import { searchCampaignJobUserEmailSubmittedDetails } from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import KEmailPreview from '@/components/KEmailPreview.vue'
export default {
  name: 'CampaignManagerReportRepliedDetailDialog',
  components: {
    KEmailPreview,
    DatatableLoading,
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
        id: 'campaign-manager-submitted-detail-item-data-table',
        ascending: 'ascending'
      },
      isLoading: false,
      repliedTemplates: [],
      selectedTemplateIndex: 0,
      activeFormData: {
        from: '',
        fromName: '',
        to: '',
        subject: '',
        replySent: ''
      }
    }
  },
  computed: {
    getTitle() {
      return `Out of Office Reply Preview`
    },
    hasReplyTemplate() {
      return this?.repliedTemplates?.length > 0
    },
    getCurrentReplyTemplate() {
      return this?.repliedTemplates[this.selectedTemplateIndex]?.content
    },
    hasNextTemplate() {
      return this?.repliedTemplates?.length - 1 > this.selectedTemplateIndex
    },
    hasPreviousTemplate() {
      return this.selectedTemplateIndex > 0
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
    },
    handlePreviousTemplate() {
      this.selectedTemplateIndex--
    },
    handleNextTemplate() {
      this.selectedTemplateIndex++
    }
  }
}
</script>
