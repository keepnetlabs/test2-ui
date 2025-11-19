<template>
  <div>
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isShowPreviewDrawer && previewSelectedRow"
      :status="isShowPreviewDrawer"
      :selected-row="previewSelectedRow"
      :type="type"
      :api-func="getPreviewApiFunc"
      :languages="languageOptions"
      :should-control-html-overflow="true"
      :is-quishing="isQuishing"
      @on-close="isShowPreviewDrawer = false"
    />
    <CampaignManagerSummaryCard
      class="mt-4"
      detailable
      is-training
      icon="$domain"
      detailable-button-id="btn-preview--campaign-report-landing-page-template"
      :isLoading="isFetchingSummary"
      :show-body-detail.sync="isShowLandingPageTemplate"
      :title="getTitle"
    />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
export default {
  name: 'CampaignManagerReportSummaryLandingPage',
  components: {
    CampaignManagerSummaryCard,
    CommonSimulatorLandingPageTemplatesPreviewDialog
  },
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
      default: SCENARIO_TYPES.QUISHING
    }
  },
  data() {
    return {
      labels,
      isShowLandingPageTemplate: false,
      isShowPreviewDrawer: false,
      previewSelectedRow: null,
      languageOptions: []
    }
  },
  created() {
    this.callForLanguages()
  },
  computed: {
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    getTitle() {
      return `Landing Page: ${this.formData?.name || ''}`
    },
    getPreviewApiFunc() {
      return (resourceId) => {
        const { jobResourceId, instanceGroup } = this.previewSelectedRow || {}
        return QuishingService.getCampaignManagerLandingPageTemplatePreviewContent(
          resourceId,
          jobResourceId,
          instanceGroup
        )
      }
    }
  },
  watch: {
    isShowLandingPageTemplate(val = false) {
      if (val && this.formData?.resourceId) {
        this.previewSelectedRow = {
          resourceId: this.formData.resourceId,
          name: this.formData.name,
          jobResourceId: this.formData.jobResourceId,
          instanceGroup: this.formData.instanceGroup
        }
        this.$nextTick(() => {
          this.isShowPreviewDrawer = true
        })
      } else {
        this.isShowPreviewDrawer = false
      }
    }
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
