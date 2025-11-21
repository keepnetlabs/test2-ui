<template>
  <div>
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isShowLandingPageTemplate && landingPagePreviewSelectedRow"
      :status="isShowLandingPageTemplate"
      :selected-row="landingPagePreviewSelectedRow"
      :languages="languageOptions"
      is-nested
      :should-control-html-overflow="true"
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
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

export default {
  name: 'CampaignManagerReportSummaryLandingPage',
  components: {
    CommonSimulatorLandingPageTemplatesPreviewDialog,
    CampaignManagerSummaryCard
  },
  mixins: [useLoading],
  props: {
    formData: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean
    },
    difficulties: {
      type: Array,
      default: () => []
    },
    methods: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      labels,
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
