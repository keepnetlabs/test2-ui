<template>
  <div>
    <SmishingPreviewDrawer
      v-if="isShowTextMessageTemplate"
      :status="isShowTextMessageTemplate"
      title="Text Message Template Preview"
      is-nested
      :should-control-html-overflow="false"
      @on-close="isShowTextMessageTemplate = false"
    >
      <div v-if="previewName" class="email-template-preview">
        <div class="email-template-preview__title">{{ previewName }}</div>
        <div class="email-template-preview__container">
          <div class="common-simulator-preview__text">
            <div class="template-preview__text">
              <span class="template-preview__text--title">Text Message</span>
              <span class="template-preview__text--body d-block mt-1">{{ previewTemplate }}</span>
            </div>
          </div>
        </div>
      </div>
    </SmishingPreviewDrawer>
    <CampaignManagerSummaryCard
      class="mt-4"
      detailable
      is-training
      icon="mdi-message-alert"
      detailable-button-id="btn-preview--campaign-report-text-message-template"
      :isLoading="isFetchingSummary"
      :show-body-detail.sync="isShowTextMessageTemplate"
      :title="getTitle"
    />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import SmishingPreviewDrawer from '@/components/Common/Simulator/SmishingPreviewDrawer.vue'
import SmishingService from '@/api/smishing'

export default {
  name: 'CampaignManagerReportSummaryTextTemplate',
  components: {
    SmishingPreviewDrawer,
    CampaignManagerSummaryCard
  },
  props: {
    formData: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean
    }
  },
  data() {
    return {
      isShowTextMessageTemplate: false,
      previewName: '',
      previewTemplate: ''
    }
  },
  computed: {
    getTitle() {
      const templateName = this.formData?.name || ''
      return `Text Message: ${templateName}`
    }
  },
  watch: {
    isShowTextMessageTemplate(val) {
      if (val && this.formData?.resourceId) {
        this.loadTextPreview()
      }
    },
    'formData.resourceId': {
      handler() {
        this.previewName = ''
        this.previewTemplate = ''
      }
    }
  },
  methods: {
    loadTextPreview() {
      this.previewName = this.formData?.name || ''
      return SmishingService.getTextMessageTemplate(this.formData.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        this.previewTemplate = data?.template ?? ''
      })
    }
  }
}
</script>
