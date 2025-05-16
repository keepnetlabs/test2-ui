<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-email"
    detailable-button-id="btn-preview--campaign-report-email-template"
    :isLoading="isFetchingSummary"
    :show-body-detail.sync="isShowEmailTemplate"
    :title="labels.EmailThatWill"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__email-template-body pb-4">
        <div class="campaign-manager-last-step__email-template-body-header">
          <div class="campaign-manager-last-step__email-template-body-header-left">
            <span>{{ name }}</span>
            <VTooltip v-if="isAssistedByAI" bottom>
              <template #activator="{ on }">
                <VIcon v-on="on" class="ml-1" style="margin-top: -2px;" color="#2196F3" small
                  >mdi-creation</VIcon
                >
              </template>
              <span>This template was generated with AI</span>
            </VTooltip>
          </div>
          <div class="campaign-manager-last-step__email-template-body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              size="mini"
              :color="getBadgeColor(difficulty)"
              :text="getBadgeText(difficulty)"
              :outline="false"
            />
            <Badge
              size="mini"
              color="#E0E0E0"
              class-name="badge-middle px-2 py-2"
              :text="getBadgeText(method)"
              :outline="false"
            />
            <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
              <template #content>
                <v-icon>mdi-web</v-icon>{{ formData.languageShortCode }}
              </template>
            </Badge>
          </div>
        </div>
      </div>
      <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div>
          <InputLanguagePreview
            v-model="languagePreview"
            style="max-width: 554px; min-width: 554px;"
            persistent-hint
            class="max-w-554"
            :hint="getEmailTemplatePreviewLanguageHint"
            :items="selectedTemplateLanguages"
            @input="handleEmailTemplatePreviewLanguageChange"
          />
        </div>
        <div class="template-preview__text--title">
          <span class="fw-600 text-primary-color fs-medium">Subject: </span>
          <span class="fw-400 text-primary-color fs-medium">{{ subject }}</span>
        </div>
        <div>
          <span class="template-preview__text--title fw-600 text-primary-color fs-medium"
            >From Name:
          </span>
          <span class="template-preview__text--body fw-400 text-primary-color fs-medium">{{
            fromName
          }}</span>
        </div>
        <div>
          <span class="template-preview__text--title fw-600 text-primary-color fs-medium"
            >From Address:
          </span>
          <span class="template-preview__text--body fw-400 text-primary-color fs-medium">{{
            fromAddress
          }}</span>
        </div>
        <div v-if="ccAddresses.length > 0">
          <span class="template-preview__text--title fw-600 text-primary-color fs-medium"
            >CC:
          </span>
          <span class="template-preview__text--body fw-400 text-primary-color fs-medium">{{
            ccAddresses.join(', ')
          }}</span>
        </div>
        <div v-if="formData.attachment" class="attachment-wrapper mt-2 position-relative">
          <div class="attachment blue-attach mb-0">
            <AttachmentsPreview
              :deletable="false"
              :att="formData.attachment"
              :isEmailTemplate="true"
            />
          </div>
        </div>
        <div class="campaign-manager-last-step__email-template-body-preview mt-6">
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <KEmailPreview v-else :html="emailTemplate" is-extra-height />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
import KEmailPreview from '@/components/KEmailPreview'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'
import { getCampaignManagerEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import { getDifficultyBadgeColor } from '@/utils/functions'
import InputLanguagePreview from '../../Common/Inputs/InputLanguagePreview.vue'

export default {
  name: 'CampaignManagerReportSummaryPhishingEmail',
  components: {
    InputLanguagePreview,
    AttachmentsPreview,
    DatatableLoading,
    KEmailPreview,
    Badge,
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
      labels,
      emailTemplate: null,
      difficulty: '',
      method: '',
      name: '',
      fromName: '',
      fromAddress: '',
      subject: '',
      isAssistedByAI: false,
      languagePreview: '',
      selectedTemplateLanguages: [],
      phishingEmailTemplates: [],
      ccAddresses: []
    }
  },
  computed: {
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    isFormData() {
      return Object.keys(this.formData).length
    }
  },
  watch: {
    isShowEmailTemplate(val = false) {
      if (val && !this.emailTemplate) {
        this.callForTemplate()
      }
    },
    'formData.resourceId'() {
      this.callForTemplate(false)
    }
  },
  methods: {
    callForTemplate(showLoader = true) {
      if (showLoader) this.setLoading(true)
      if (
        this.formData?.resourceId &&
        this.formData?.campaignResourceId &&
        this.formData?.instanceGroup
      )
        getCampaignManagerEmailTemplatePreviewContent(
          this.formData.resourceId,
          this.formData.campaignResourceId,
          this.formData.instanceGroup
        )
          .then((response) => {
            const {
              data: { data }
            } = response
            this.phishingEmailTemplates = []
            this.selectedTemplateLanguages = []
            this.emailTemplate = data.template
            this.difficulty =
              this.difficulties.find((item) => item.value === data.difficultyResourceId)?.text || ''
            this.method =
              this.methods.find((item) => item.value === data.categoryResourceId)?.text || ''
            this.fromName = data.fromName
            this.fromAddress = data.fromAddress
            this.subject = data.subject
            this.name = data.name
            this.ccAddresses = data?.ccAddresses || []
            this.isAssistedByAI = data?.isAssistedByAI || false
            this.selectedTemplateLanguages.push({
              value: data.languageTypeResourceId,
              text: data.languageTypeName
            })
            this.phishingEmailTemplates.push({
              fromName: this.fromName,
              fromAddress: this.fromAddress,
              subject: this.subject,
              template: this.emailTemplate,
              ccAddresses: this.ccAddresses,
              languageTypeName: data.languageTypeName,
              languageTypeResourceId: data.languageTypeResourceId
            })
            this.languagePreview = data.languageTypeResourceId
            console.log('data', data)
            if (!data?.languages?.length) return
            data.languages.forEach((item) => {
              this.selectedTemplateLanguages.push({
                value: item.languageTypeResourceId,
                text: item.languageTypeName
              })
              this.phishingEmailTemplates.push({
                fromName: item.fromName,
                fromAddress: item.fromAddress,
                subject: item.subject,
                template: item.template,
                ccAddresses: item.ccAddresses,
                languageTypeName: item.languageTypeName,
                languageTypeResourceId: item.languageTypeResourceId
              })
            })
          })
          .finally(() => {
            if (showLoader) this.setLoading()
          })
    },
    getBadgeColor(text = '') {
      return getDifficultyBadgeColor(text)
    },
    getBadgeText(text = '') {
      return text
    },
    handleEmailTemplatePreviewLanguageChange(val) {
      const findedTemplate = this.phishingEmailTemplates.find(
        (item) => item.languageTypeResourceId === val
      )
      if (!findedTemplate) return
      this.fromName = findedTemplate.fromName
      this.fromAddress = findedTemplate.fromAddress
      this.subject = findedTemplate.subject
      this.emailTemplate = findedTemplate.template
      this.ccAddresses = findedTemplate.ccAddresses
    }
  }
}
</script>
