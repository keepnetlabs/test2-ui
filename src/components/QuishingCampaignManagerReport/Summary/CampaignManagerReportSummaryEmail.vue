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
            {{ name }}
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
        <div class="campaign-manager-last-step__email-template-body-header-sub">
          From: {{ fromName }}
          <span>&#60;</span>
          {{ fromAddress }} <span>&#62;</span>
        </div>
        <div v-if="formData.attachment" class="attachment-wrapper mt-2" style="position: relative;">
          <div class="attachment blue-attach mb-0">
            <AttachmentsPreview
              :deletable="false"
              :att="formData.attachment"
              :isEmailTemplate="true"
            />
          </div>
        </div>
        <div></div>
      </div>
      <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
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
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import { getDifficultyBadgeColor } from '@/utils/functions'
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
export default {
  name: 'CampaignManagerReportSummaryEmail',
  components: {
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
      fromAddress: ''
    }
  },
  computed: {
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
        QuishingService.getCampaignManagerEmailTemplatePreviewContent(
          this.formData.resourceId,
          this.formData.campaignResourceId,
          this.formData.instanceGroup
        )
          .then((response) => {
            const {
              data: { data }
            } = response
            this.emailTemplate = data.template.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
            this.difficulty =
              this.difficulties.find((item) => item.value === data.difficultyResourceId)?.text || ''
            this.method =
              this.methods.find((item) => item.value === data.categoryResourceId)?.text || ''
            this.fromName = data.fromName
            this.fromAddress = data.fromAddress
            this.name = data.name
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
    }
  }
}
</script>
