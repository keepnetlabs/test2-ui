<template>
  <div>
    <EmailTemplatePreview
      v-if="isShowEmailTemplatePreview"
      :status="isShowEmailTemplatePreview"
      :selectedRow="emailTemplatePreviewSelectedRow"
      :templateHTML="emailTemplate"
      :emailTemplateParams="emailTemplatePreviewParams"
      is-nested
      @on-close="isShowEmailTemplatePreview = false"
    />
    <CampaignManagerSummaryCard
      class="mt-4"
      icon="mdi-email"
      :isLoading="isFetchingSummary"
      :title="labels.EmailThatWill"
    >
      <template #header-right>
        <v-btn
          id="btn-preview--campaign-report-email-template"
          class="campaign-manager-summary-card__button mr-6 pr-4"
          rounded
          outlined
          color="#2196f3"
          :disabled="!emailTemplate"
          @click="isShowEmailTemplatePreview = true"
        >
          <v-icon style="font-size: 20px; margin-right: 4px;">mdi-eye</v-icon>
          Preview
        </v-btn>
      </template>
      <template #body><div></div></template>
    </CampaignManagerSummaryCard>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import EmailTemplatePreview from '@/components/CallbackScenarios/EmailTemplatePreview'
import CallbackService from '@/api/callback'
export default {
  name: 'CampaignManagerReportSummaryEmail',
  components: {
    EmailTemplatePreview,
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
      isShowEmailTemplatePreview: false,
      labels,
      emailTemplate: null,
      name: '',
      fromName: '',
      fromAddress: '',
      subject: ''
    }
  },
  computed: {
    emailTemplatePreviewSelectedRow() {
      return {
        ...(this.formData || {}),
        name: this.name
      }
    },
    emailTemplatePreviewParams() {
      return {
        name: this.name,
        fromName: this.fromName,
        fromAddress: this.fromAddress,
        subject: this.subject,
        attachment: this.formData?.attachment || null
      }
    }
  },
  watch: {
    'formData.resourceId'() {
      this.callForTemplate()
    }
  },
  created() {
    this.callForTemplate()
  },
  methods: {
    callForTemplate() {
      if (!this.formData?.resourceId) return
      CallbackService.getEmailTemplate(this.formData.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        this.emailTemplate = data.template
        this.fromName = data.fromName
        this.fromAddress = data.fromAddress
        this.subject = data.subject
        this.name = data.name
      })
    }
  }
}
</script>
