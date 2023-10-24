<template>
  <AppDialog
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <ElTabs
        v-if="!isLoading"
        v-model="selectedScenario"
        class="campaign-manager-last-step__phishing-scenario-tab mb-6"
        @tab-click="callForScenarioDetail"
      >
        <ElTabPane
          v-for="template in phishingScenarios"
          :key="template.customKey"
          :name="template.name"
          :label="template.name"
        />
      </ElTabs>
      <ElTabs v-if="!isLoading" v-model="tab" class="k-sub-tab">
        <ElTabPane id="campaign-manager-info--email-content" name="email" :label="labels.JustEmail">
          <div class="template-preview pt-6">
            <div v-if="!!emailTemplate" class="template-preview__text">
              <div class="mb-1">
                <span class="template-preview__text--title">From: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div class="mb-1">
                <span class="template-preview__text--title">From Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
              </div>
              <div class="mb-1">
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
              </div>
              <div class="template-preview__text--subject">
                <span>Subject: </span>
                <span>{{ emailTemplateParams.subject }}</span>
              </div>
            </div>
            <div
              v-if="emailTemplateParams.attachment"
              class="attachment-wrapper mt-2"
              style="position: relative;"
            >
              <div class="attachment blue-attach mb-0">
                <AttachmentsPreview
                  :deletable="false"
                  :att="emailTemplateParams.attachment"
                  :isEmailTemplate="true"
                />
              </div>
            </div>
            <hr class="mt-2" v-if="!!emailTemplate" />
            <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
          </div>
        </ElTabPane>
        <ElTabPane
          v-if="!isAttachmentBasedScenario"
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <TabsWithMfaSettings
            :is-method-mfa="isMethodMfa"
            :landing-page-params="landingPageParams"
            :landing-page-templates="landingPageTemplates"
          />
        </ElTabPane>
      </ElTabs>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getCampaignManagerPreview } from '@/api/phishingsimulator'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import TabsWithMfaSettings from '../PhishingScenarios/TabsWithMfaSettings'
import { createRandomCryptStringNumber } from '../../utils/functions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'

export default {
  name: 'CampaignManagerPreview',
  components: {
    AppDialogFooterWithClose,
    TabsWithMfaSettings,
    AttachmentsPreview,
    KEmailPreview,
    DatatableLoading,
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      isAttachmentBasedScenario: false,
      emailTemplate: null,
      landingPageTemplates: [],
      emailTemplateParams: {},
      landingPageParams: {},
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: '',
      selectedScenario: null,
      phishingScenarios: [],
      isMethodMfa: false
    }
  },
  computed: {
    getTitle() {
      return 'Phishing Campaign Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForData() {
      this.setLoading(true)
      getCampaignManagerPreview(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data: { phishingScenarioPreviewList } = [] } = {} } = response
          this.phishingScenarios = phishingScenarioPreviewList.map((pScenario) => ({
            ...pScenario,
            customKey: createRandomCryptStringNumber()
          }))
          const phishingScenarioPreviewDto = phishingScenarioPreviewList[0] || {}
          this.selectedScenario = phishingScenarioPreviewDto.name
          this.setActiveScenario(phishingScenarioPreviewDto || {})
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    setActiveScenario(phishingScenarioPreviewDto = {}) {
      this.isAttachmentBasedScenario = phishingScenarioPreviewDto.methodTypeId.toString() === '3'
      this.emailTemplate = phishingScenarioPreviewDto?.emailTemplate?.template || ''
      this.emailTemplateParams = {
        name: phishingScenarioPreviewDto?.emailTemplate?.name || '',
        fromName: phishingScenarioPreviewDto?.emailTemplate?.fromName || '',
        fromAddress: phishingScenarioPreviewDto?.emailTemplate?.fromAddress || '',
        subject: phishingScenarioPreviewDto?.emailTemplate?.subject || '',
        attachment: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
          ? {
              name: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
            }
          : null
      }
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || []
      this.landingPageParams = {
        mfaSmsSenderNumber: phishingScenarioPreviewDto?.mfaSmsSenderNumber || '',
        mfaTextTemplate: phishingScenarioPreviewDto?.mfaTextTemplate || '',
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || '',
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || '',
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || ''
      }
      this.isMethodMfa = phishingScenarioPreviewDto?.methodTypeId.toString() === '4'
      this.tab = 'email'
    },
    callForScenarioDetail(event) {
      this.setActiveScenario(this.phishingScenarios[event.index])
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
