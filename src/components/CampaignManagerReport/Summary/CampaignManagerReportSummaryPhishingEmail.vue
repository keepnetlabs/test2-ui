<template>
  <div>
    <EmailTemplateMultipleLanguagePreviewDialog
      v-if="isShowEmailTemplate && emailTemplatePreviewSelectedRow"
      :status="isShowEmailTemplate"
      :selected-row="emailTemplatePreviewSelectedRow"
      :languages="languageOptions"
      is-nested
      :should-control-html-overflow="true"
      @on-close="isShowEmailTemplate = false"
    />
    <CampaignManagerSummaryCard
      class="mt-4"
      detailable
      is-training
      icon="mdi-email"
      detailable-button-id="btn-preview--campaign-report-email-template"
      :isLoading="isFetchingSummary"
      :show-body-detail.sync="isShowEmailTemplate"
      :title="getTitle"
    />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import EmailTemplateMultipleLanguagePreviewDialog from '@/components/Common/Simulator/EmailTemplates/EmailTemplateMultipleLanguagePreviewDialog.vue'
import labels from '@/model/constants/labels'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'CampaignManagerReportSummaryPhishingEmail',
  components: {
    EmailTemplateMultipleLanguagePreviewDialog,
    CampaignManagerSummaryCard
  },
  mixins: [useLoading],
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
    }
  },
  data() {
    return {
      isShowEmailTemplate: false,
      emailTemplatePreviewSelectedRow: null,
      labels,
      languageOptions: []
    }
  },
  computed: {
    getTitle() {
      const templateName = this.formData?.name || ''
      return `Email Template: ${templateName}`
    }
  },
  watch: {
    isShowEmailTemplate(val = false) {
      if (val && this.formData?.resourceId) {
        this.emailTemplatePreviewSelectedRow = {
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
