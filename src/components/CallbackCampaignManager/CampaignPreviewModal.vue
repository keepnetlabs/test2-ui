<template>
  <div v-if="isVisible">
    <div
      class="common-simulator-preview-overlay"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="[
        getNavigationDrawerClass,
        'common-simulator-preview-dialog'
      ]"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div
          class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header"
        >
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  Callback Campaign Preview
                </VListItemTitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#757575" @click="handleClose">
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>
      <div
        class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body"
      >
        <div
          class="d-flex align-center justify-space-between mt-4 mb-1"
          style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;"
        >
          <div>
            <span class="text-primary-color fs-5 fw-600">{{ getSubtitle }}</span>
          </div>
          <div class="d-flex align-center gap-2">
            <VTooltip bottom>
              <template #activator="{ on }">
                <div v-on="on">
                  <VBtn icon outlined color="#2196F3" small @click="handleEditCampaign">
                    <VIcon small>mdi-pencil</VIcon>
                  </VBtn>
                </div>
              </template>
              <span>Edit</span>
            </VTooltip>
          </div>
        </div>
        <ElTabs
          v-if="!isLoading"
          v-model="selectedScenario.text"
          class="campaign-manager-last-step__phishing-scenario-tab mt-4"
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
              <template v-else>{{ template.text }}</template>
            </span>
          </ElTabPane>
        </ElTabs>
        <DatatableLoading v-if="isLoadingScenario" :loading="isLoadingScenario" />
        <ElTabs v-if="!isLoadingScenario" v-model="tab" class="k-sub-tab">
          <ElTabPane id="campaign-preview-modal--email" name="email" :label="labels.JustEmail">
            <div class="text-primary-color fs-4 fw-600 mb-2 mt-n4">
              {{ emailTemplateParams.name }}
            </div>
            <div
              class="template-preview"
              style="
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 16px;
              "
            >
              <div
                v-if="!!emailTemplate"
                class="d-flex align-center justify-end gap-2 mb-3"
              >
                <VTooltip bottom>
                  <template #activator="{ on }">
                    <div v-on="on">
                      <VBtn icon outlined color="#2196F3" small @click="handleExternalLink">
                        <VIcon small>mdi-open-in-new</VIcon>
                      </VBtn>
                    </div>
                  </template>
                  <span>Open in New Tab</span>
                </VTooltip>
              </div>
              <hr class="ml-n4 mr-n4 mb-3" v-if="!!emailTemplate" />
              <div class="common-simulator-preview__text" v-if="!!emailTemplate">
                <div>
                  <span class="template-preview__text--title text-primary-color">Subject: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.subject
                  }}</span>
                </div>
                <div>
                  <span class="template-preview__text--title text-primary-color">From Name: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.fromName
                  }}</span>
                </div>
                <div>
                  <span class="template-preview__text--title text-primary-color">From Email: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.fromAddress
                  }}</span>
                </div>
              </div>
              <div
                v-if="emailTemplateParams.attachment"
                class="attachment-wrapper mt-2 position-relative"
              >
                <div class="attachment blue-attach mb-0">
                  <AttachmentsPreview
                    :deletable="false"
                    :att="emailTemplateParams.attachment"
                    :isEmailTemplate="true"
                  />
                </div>
              </div>
              <hr class="mt-4 ml-n4 mr-n4 mb-2" v-if="!!emailTemplate" />
              <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
            </div>
          </ElTabPane>
          <ElTabPane
            id="campaign-preview-modal--callback"
            name="callback"
            label="Callback Template"
          >
            <div class="text-primary-color fs-4 fw-600 mb-2 mt-n4">
              {{ callbackTemplateParams.name }}
            </div>
            <CallbackTemplatePreviewSteps
              :template="callbackTemplateParams"
              :isTextToSpeechCompatible="isTextToSpeechCompatible"
              :voiceResourceId="callbackTemplateParams.vishingLanguageResourceId"
            />
          </ElTabPane>
          <template v-if="!!isRenderTrainingTab">
            <ElTabPane id="campaign-preview-modal--training" name="training" label="Training">
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
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import CallbackService from '@/api/callback'
import labels from '@/model/constants/labels'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import { createRandomCryptStringNumber, openHtmlInNewWindow } from '@/utils/functions'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'

export default {
  name: 'CampaignManagerPreviewDialog',
  components: {
    AttachmentsPreview,
    KEmailPreview,
    DatatableLoading,
    CallbackTemplatePreviewSteps,
    TrainingLibraryPreview
  },
  mixins: [useDrawerAnimation],
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
    },
    isNested: {
      type: Boolean,
      default: false
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
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': this.isNested
      }
    },
    isRenderTrainingTab() {
      return false
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
          const { emailTemplate, callbackTemplate } = res?.data?.data || {
            emailTemplate: {},
            callbackTemplate: {}
          }
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
          this.isTextToSpeechCompatible = [2, 3].includes(
            this.languages[languageIndex].voiceProviderTypeId
          )
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
      this.setActiveScenario(this.phishingScenarios[Number.parseInt(event.index)])
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleClose() {
      this.closeDrawer()
    },
    handleEditCampaign() {
      this.$emit('on-edit-campaign', this.selectedRow)
    },
    handleExternalLink() {
      openHtmlInNewWindow(this.emailTemplate)
    }
  }
}
</script>
