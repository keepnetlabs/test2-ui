<template>
  <div>
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isShowLandingPageTemplate && landingPagePreviewSelectedRow"
      :status="isShowLandingPageTemplate"
      :selected-row="landingPagePreviewSelectedRow"
      :languages="languageOptions"
      is-nested
      is-smishing
      :should-control-html-overflow="false"
      @on-close="isShowLandingPageTemplate = false"
    />
    <CampaignManagerSummaryCard
      class="mt-4"
      detailable
      icon="$domain"
      detailable-button-id="btn-preview--campaign-report-landing-page-template"
      is-training
      :isLoading="isFetchingSummary"
      :show-body-detail.sync="isShowLandingPageTemplate"
      :title="getTitle"
    />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

export default {
  name: 'CampaignManagerReportSummaryLandingPage',
  components: {
    CommonSimulatorLandingPageTemplatesPreviewDialog,
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
      isShowLandingPageTemplate: false,
      landingPagePreviewSelectedRow: null,
      languageOptions: []
    }
  },
  computed: {
    getTitle() {
      return `Landing Page: ${this.formData?.name || ''}`
    }
  },
  watch: {
    isShowLandingPageTemplate(val = false) {
      if (val && this.formData?.resourceId) {
        this.landingPagePreviewSelectedRow = {
          resourceId: this.formData.resourceId,
          name: this.formData?.name || ''
        }
      }
    }
  },
  created() {
    this.callForLanguages()
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId,
            code: language.description
          })) || []
      })
    }
  }
}
</script>
