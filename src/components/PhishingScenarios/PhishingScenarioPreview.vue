<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <ElTabs v-show="!isLoading" v-model="tab">
        <ElTabPane id="campaign-manager-info--email-content" name="email" :label="labels.JustEmail">
          <div class="template-preview pt-4">
            <div class="template-preview__text" v-if="!!emailTemplate">
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body"
                  >{{ emailTemplateParams.name }}
                  <VTooltip v-if="emailTemplateParams.isAssistedByAI" bottom>
                    <template #activator="{ on }">
                      <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
                    </template>
                    <span>This template was generated with AI</span>
                  </VTooltip></span
                >
              </div>
              <div>
                <span class="template-preview__text--title">From Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
              </div>
              <div>
                <span class="template-preview__text--title">From Email Address: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div>
                <span
                  class="template-preview__text--title"
                  style="
                    font-style: normal;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 24px;
                    color: #383b41;
                  "
                  >Subject:
                </span>
                <span
                  class="template-preview__text--body"
                  style="
                    font-style: normal;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 24px;
                    color: #383b41;
                  "
                  >{{ emailTemplateParams.subject }}</span
                >
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
            class="tabs-with-mfa-settings"
            :isMethodMfa="isMethodMfa"
            :landing-page-params="landingPageParams"
            :landing-page-templates="landingPageTemplates"
          />
        </ElTabPane>
      </ElTabs>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--scenario-preview"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getPhishingScenarioLandingPageAndEmailTemplate } from '@/api/phishingsimulator'
import labels from '@/model/constants/labels'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings'
export default {
  name: 'PhishingScenarioPreview',
  components: {
    TabsWithMfaSettings,
    KEmailPreview,
    DatatableLoading,
    AppDialog,
    AttachmentsPreview
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
      emailTemplate: null,
      landingPageTemplates: [],
      isMethodMfa: false,
      selectedLandingPageIndex: 0,
      emailTemplateParams: {},
      landingPageParams: {},
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: ''
    }
  },
  computed: {
    isAttachmentBasedScenario() {
      return this.selectedRow?.method ? this.selectedRow?.method === 'Attachment' : false
    },
    getTitle() {
      return 'Scenario Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    hasLandingPageTemplate() {
      return this.landingPageTemplates.length > 0
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates[this.selectedLandingPageIndex]?.content
    },
    hasNextTemplate() {
      return this.landingPageTemplates.length - 1 > this.selectedLandingPageIndex
    },
    hasPreviousTemplate() {
      return this.selectedLandingPageIndex > 0
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
      getPhishingScenarioLandingPageAndEmailTemplate(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { emailTemplate, landingPageTemplate } = data
          const {
            template,
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            phishingFileName,
            subject,
            isAssistedByAI
          } = emailTemplate || {}

          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            subject,
            isAssistedByAI,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null
          }
          this.emailTemplate = template

          const {
            name: landingPageName,
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            methodTypeId
          } = landingPageTemplate || []

          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            isAttachmentBasedTemplate: methodTypeId === 3,
            mfaTextTemplate: data.mfaTextTemplate,
            mfaSmsSenderNumber: data.mfaSmsSenderNumber
          }
          this.landingPageTemplates = landingPages
          this.isMethodMfa = data.methodTypeId === 4
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleClose() {
      this.$emit('on-close')
    },
    handlePreviousTemplate() {
      this.selectedLandingPageIndex--
    },
    handleNextTemplate() {
      this.selectedLandingPageIndex++
    }
  }
}
</script>
