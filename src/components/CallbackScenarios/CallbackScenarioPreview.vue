<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="callback-scenario-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <ElTabs v-show="!isLoading" v-model="tab">
        <ElTabPane
          id="callback-scenario-info--email-content"
          name="email"
          :label="labels.JustEmail"
        >
          <div class="template-preview pt-4">
            <div class="template-preview__text" v-if="!!emailTemplate">
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
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
        <ElTabPane label="Callback Template" name="callbackTemplate">
          <div class="template-preview pt-4">
            <div class="template-preview__text mb-4">
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body">{{ callbackTemplateParams.name }}</span>
              </div>
            </div>
            <CallbackTemplatePreviewSteps
              :template="callbackTemplateParams"
              :isTextToSpeechCompatible="isTextToSpeechCompatible"
              :voiceResourceId="callbackTemplateParams.vishingLanguageResourceId"
            />
          </div>
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
import CallbackService from '@/api/callback'
import labels from '@/model/constants/labels'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
export default {
  name: 'CallbackScenarioPreview',
  components: {
    KEmailPreview,
    DatatableLoading,
    AppDialog,
    AttachmentsPreview,
    CallbackTemplatePreviewSteps
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isTextToSpeechCompatible: false,
      emailTemplate: null,
      landingPageTemplates: [],
      isMethodMfa: false,
      selectedLandingPageIndex: 0,
      emailTemplateParams: {},
      callbackTemplateParams: {},
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: ''
    }
  },
  computed: {
    getTitle() {
      return 'Callback Scenario Preview'
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
      CallbackService.getCallbackScenarioPreview(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { emailTemplate, callbackTemplate } = data
          const {
            template,
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            phishingFileName,
            subject
          } = emailTemplate || {}

          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            subject,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null
          }
          this.emailTemplate = template

          const languageIndex = this.languages.findIndex(
            (language) => language.resourceId === callbackTemplate.vishingLanguageResourceId
          )

          this.callbackTemplateParams = {
            ...callbackTemplate
          }

          this.callbackTemplateParams.invalidDialingNotice = {
            ...this.callbackTemplateParams.steps[0]
          }
          this.callbackTemplateParams.steps.splice(0, 1)
          this.callbackTemplateParams.callGreeting = { ...this.callbackTemplateParams.steps[0] }
          this.callbackTemplateParams.steps.splice(0, 1)
          this.callbackTemplateParams.language = this.languages[languageIndex].language
          this.callbackTemplateParams.voice = this.languages[languageIndex].name
          this.isTextToSpeechCompatible = this.languages[languageIndex].voiceProviderTypeId === 2
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
