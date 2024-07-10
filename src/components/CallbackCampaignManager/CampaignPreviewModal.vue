<template>
  <AppDialog
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :status="status"
    title="Callback Campaign Preview"
    :subtitle="getSubtitle"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <ElTabs
        v-if="!isLoading"
        v-model="selectedScenario.text"
        class="campaign-manager-last-step__phishing-scenario-tab mb-6"
        @tab-click="callForScenarioDetail"
      >
        <ElTabPane
          v-for="template in phishingScenarios"
          :key="template.customKey"
          :name="template.text"
          :label="template.text"
          :disabled="isLoading"
        >
          <span slot="label">
            <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="chip" />
            <template v-else> {{ template.text }} </template>
          </span>
        </ElTabPane>
      </ElTabs>
      <DatatableLoading v-if="isLoadingScenario" :loading="isLoadingScenario" />
      <ElTabs v-if="!isLoadingScenario" v-model="tab" class="k-sub-tab">
        <ElTabPane id="campaign-manager-info--email-content" name="email" :label="labels.JustEmail">
          <div class="template-preview pt-4">
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
            <hr class="mt-4" v-if="!!emailTemplate" />
            <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
          </div>
        </ElTabPane>
        <ElTabPane
          id="campaign-manager-info--email-content"
          name="callback"
          label="Callback Template"
        >
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
        <template v-if="!!isRenderTrainingTab">
          <ElTabPane id="campaign-manager-info--email-content" name="training" label="Training">
            <div class="template-preview pt-4">
              <TrainingLibraryPreview
                v-if="selectedLanguages.length"
                v-show="!isPreviewLoading"
                :is-loading.sync="isPreviewLoading"
                :name="trainingParams.name"
                :training-id="trainingParams.trainingId"
                :languages="selectedLanguages"
                :training-params="trainingParams"
              />
            </div>
          </ElTabPane>
        </template>
      </ElTabs>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import CallbackService from '@/api/callback'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import { createRandomCryptStringNumber } from '@/utils/functions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'CampaignManagerPreviewDialog',
  components: {
    AppDialogFooterWithClose,
    AttachmentsPreview,
    KEmailPreview,
    DatatableLoading,
    AppDialog,
    CallbackTemplatePreviewSteps,
    TrainingLibraryPreview
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
      isAttachmentBasedScenario: false,
      emailTemplate: null,
      emailTemplateParams: {},
      callbackTemplateParams: {},
      trainingParams: null,
      isTextToSpeechCompatible: false,
      tab: 'email',
      isLoading: false,
      isLoadingScenario: false,
      labels,
      timeoutId: '',
      selectedScenario: null,
      phishingScenarios: [],
      isPreviewLoading: false,
      selectedLanguages: [],
      trainingLanguages: [],
      trainingDetails: null
    }
  },
  computed: {
    isRenderTrainingTab() {
      return false
      // return this.trainingParams
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
    this.callForLanguages()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForLanguages() {
      this.isPreviewLoading = true
      AwarenessEducatorService.getLanguages().then((res) => {
        this.trainingLanguages = res?.data?.data || []
      })
    },
    callForTrainingDetail() {
      this.selectedLanguages = []
      this.trainingParams.trainingLanguageIds.forEach((lang) => {
        const language = this.trainingLanguages.find((item) => item.id === lang)
        if (language)
          this.selectedLanguages.push({
            text: language.name,
            value: language.id
          })
      })
      AwarenessEducatorService.getTraining(this.trainingParams.trainingId).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingParams = {
          ...this.trainingParams,
          ...data,
          languages: this.selectedLanguages.map((lang) => lang.text).join(', ')
        }
      })
    },
    callForData() {
      this.setLoading(true)
      CallbackService.getCallbackCampaign(this.selectedRow.resourceId)
        .then((response) => {
          const { data: { data } = {} } = response
          const scenarioPreviewList = data.phishingScenarios
          this.phishingScenarios = scenarioPreviewList.map((pScenario) => ({
            ...pScenario,
            customKey: createRandomCryptStringNumber()
          }))
          const phishingScenarioPreviewDto = scenarioPreviewList[0] || {}
          this.selectedScenario = phishingScenarioPreviewDto
          this.setActiveScenario(this.selectedScenario)
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    setActiveScenario(scenario) {
      this.isLoadingScenario = true
      CallbackService.getCallbackScenarioPreview(scenario.value)
        .then((res) => {
          const { emailTemplate, callbackTemplate } = res?.data?.data
          this.emailTemplate = emailTemplate?.template
          this.emailTemplateParams = {
            name: emailTemplate?.name || '',
            fromName: emailTemplate?.fromName || '',
            fromAddress: emailTemplate?.fromAddress || '',
            subject: emailTemplate?.subject || '',
            attachment: emailTemplate?.phishingFileName
              ? {
                  name: emailTemplate?.phishingFileName
                }
              : null
          }

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
          this.callbackTemplateParams.callGreeting = {
            ...this.callbackTemplateParams.steps[0]
          }
          this.callbackTemplateParams.steps.splice(0, 1)
          this.callbackTemplateParams.language = this.languages[languageIndex].language
          this.callbackTemplateParams.voice = this.languages[languageIndex].name
          this.isTextToSpeechCompatible = this.languages[languageIndex].voiceProviderTypeId === 2
          if (scenario.trainingId) {
            this.trainingParams = {
              trainingId: scenario.trainingId,
              trainingLanguageIds: scenario.trainingLanguageIds
            }
            this.callForTrainingDetail()
          } else {
            this.trainingParams = null
          }
          this.tab = 'email'
        })
        .finally(() => {
          this.isLoadingScenario = false
        })
    },
    callForScenarioDetail(event) {
      this.setActiveScenario(this.phishingScenarios[parseInt(event.index)])
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
