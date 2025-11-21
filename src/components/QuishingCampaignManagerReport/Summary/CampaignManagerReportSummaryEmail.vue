<template>
  <div>
    <CommonSimulatorEmailTemplatePreviewDialog
      v-if="isShowEmailTemplate && previewSelectedRow"
      :status="isShowEmailTemplate"
      :selected-row="previewSelectedRow"
      :type="type"
      :is-individual-printout-template="isQuishingPrintout"
      :api-func="getPreviewApiFunc"
      :languages="languageOptions"
      :should-control-html-overflow="true"
      @on-close="isShowEmailTemplate = false"
    />
    <CampaignManagerSummaryCard
      class="mt-4"
      detailable
      is-training
      detailable-button-id="btn-preview--campaign-report-email-template"
      :icon="getIcon"
      :isLoading="isFetchingSummary"
      :show-body-detail.sync="isShowEmailTemplate"
      :title="getTitle"
    />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
export default {
  name: 'CampaignManagerReportSummaryEmail',
  components: {
    CampaignManagerSummaryCard,
    CommonSimulatorEmailTemplatePreviewDialog
  },
  props: {
    formData: {
      type: Object
    },
    difficulties: {
      type: Array,
      default: () => []
    },
    methods: {
      type: Array,
      default: () => []
    },
    isFetchingSummary: {
      type: Boolean
    },
    isQuishingPrintout: {
      type: Boolean
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.QUISHING
    }
  },
  data() {
    return {
      isShowEmailTemplate: false,
      previewSelectedRow: null,
      labels,
      languageOptions: []
    }
  },
  computed: {
    getIcon() {
      return this.isQuishingPrintout ? '$pdf-file' : 'mdi-email'
    },
    getTitle() {
      const name = this.formData?.name || ''
      return this.isQuishingPrintout
        ? `Individual Printout Template: ${name}`
        : `Email Template: ${name}`
    },
    getPreviewApiFunc() {
      return (resourceId) => {
        const { campaignResourceId, instanceGroup } = this.previewSelectedRow || {}
        if (this.isQuishingPrintout) {
          return QuishingService.getQuishingTemplatePreviewContent(resourceId)
        }
        return QuishingService.getCampaignManagerEmailTemplatePreviewContent(
          resourceId,
          campaignResourceId,
          instanceGroup
        )
      }
    }
  },
  created() {
    this.callForLanguages()
  },
  watch: {
    isShowEmailTemplate(val = false) {
      if (val && this.formData?.resourceId) {
        this.previewSelectedRow = {
          resourceId: this.formData.resourceId,
          name: this.formData.name,
          campaignResourceId: this.formData.campaignResourceId,
          instanceGroup: this.formData.instanceGroup
        }
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
