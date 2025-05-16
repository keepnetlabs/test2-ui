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
      <div v-if="isPhishing && !isLoading" class="my-6">
        <span class="template-preview__text--title">Category: </span>
        <span class="template-preview__text--body">{{ category }}</span>
      </div>
      <ElTabs v-if="!isLoading" v-model="tab" class="k-sub-tab">
        <ElTabPane
          id="campaign-manager-info--email-content"
          name="email"
          :label="getFirstSubTabLabel"
        >
          <div class="template-preview pt-4">
            <div v-if="isQuishing" class="mb-2">
              <span class="template-preview__text--title">Quishing Type: </span>
              <span class="template-preview__text--body">{{
                emailTemplateParams.type || 'Email'
              }}</span>
            </div>
            <div v-if="isPhishing">
              <InputLanguagePreview
                v-model="languagePreview"
                persistent-hint
                class="max-w-554 campaign-manager-phishing-scenario-input-language"
                :hint="getEmailTemplatePreviewLanguageHint"
                :items="selectedTemplateLanguages"
                :hide-details="false"
                @input="handleEmailTemplatePreviewLanguageChange"
              />
            </div>
            <div v-if="!!emailTemplate" class="template-preview__text">
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
                <VTooltip v-if="emailTemplateParams.isAssistedByAI" bottom>
                  <template #activator="{ on }">
                    <VIcon v-on="on" class="ml-1" style="margin-top: -2px;" color="#2196F3" small
                      >mdi-creation</VIcon
                    >
                  </template>
                  <span>This template was generated with AI</span>
                </VTooltip>
              </div>
              <div v-if="!isQuishingTypeIndividualPrintOut">
                <span class="template-preview__text--title text-primary-color">From Name: </span>
                <span class="template-preview__text--body fw-400 text-primary-color">{{
                  emailTemplateParams.fromName
                }}</span>
              </div>
              <div v-if="!isQuishingTypeIndividualPrintOut">
                <span class="template-preview__text--title text-primary-color"
                  >From Email Address:
                </span>
                <span class="template-preview__text--body fw-400 text-primary-color">{{
                  emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div v-if="isPhishing && emailTemplateParams.ccAddresses.length > 0">
                <span class="template-preview__text--title text-primary-color">CC: </span>
                <span class="template-preview__text--body fw-400 text-primary-color">{{
                  emailTemplateParams.ccAddresses.join(', ')
                }}</span>
              </div>
              <div v-if="!isQuishingTypeIndividualPrintOut" class="template-preview__text--title">
                <span class="fw-600 text-primary-color">Subject: </span>
                <span class="fw-400 text-primary-color">{{ emailTemplateParams.subject }}</span>
              </div>
              <div
                v-if="isQuishingTypeIndividualPrintOut"
                class="d-flex justify-space-between align-center"
              >
                <div class="text-primary-color fs-4">
                  Example Individual Printout
                </div>
                <VBtn
                  id="btn-preview-indiviual-printout"
                  class="white--text btn-util btn-download-add-in"
                  color="#2196F3"
                  rounded
                  :style="getIndividualPrintoutStyle"
                  @click="handlePreviewIndividualPrintout"
                >
                  <v-icon left>mdi-file-eye</v-icon>
                  {{ labels.PrintPreview }}
                </VBtn>
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
          v-if="!isAttachmentBasedScenario"
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <TabsWithMfaSettings
            :type="type"
            :is-method-mfa="isMethodMfa"
            :landing-page-params="landingPageParams"
            :landing-page-templates="landingPageTemplates"
          />
        </ElTabPane>
        <ElTabPane
          v-if="isTrainingScenario"
          :label="labels.Training"
          name="training"
          id="campaign-manager-info--training-content"
        >
          <TrainingLibraryPreview
            v-if="selectedLanguages.length"
            v-show="!isLoading"
            class="mt-6 campaign-manager-phishing-training-preview"
            iframe-class="w-100"
            :has-api="false"
            :name="getTrainingName"
            :training-id="getTrainingId"
            :languages="selectedLanguages"
            :training-params="trainingParams"
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
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings.vue'
import { createRandomCryptStringNumber } from '@/utils/functions'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import QuishingService from '@/api/quishing'
import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import InputLanguagePreview from '../Inputs/InputLanguagePreview.vue'

export default {
  name: 'CommonCampaignManagerPreviewDialog',
  components: {
    InputLanguagePreview,
    TrainingLibraryPreview,
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
    },
    apiFunc: {
      type: Function,
      default: getCampaignManagerPreview
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING
    }
  },
  data() {
    return {
      isAttachmentBasedScenario: false,
      languages: [],
      emailTemplate: null,
      landingPageTemplates: [],
      emailTemplateParams: {},
      landingPageParams: {},
      trainingParams: {},
      languagePreview: '',
      selectedTemplateLanguages: [],
      category: '',
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: '',
      selectedScenario: null,
      phishingScenarios: [],
      isMethodMfa: false,
      isIndividualPrintoutButtonDisabled: false,
      isTrainingScenario: false,
      selectedLanguages: []
    }
  },
  computed: {
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    getFirstSubTabLabel() {
      return this.isQuishing ? labels.QuishingTemplate : labels.JustEmail
    },
    getIndividualPrintoutStyle() {
      const style = {
        textTransform: 'capitalize'
      }
      if (this.isIndividualPrintoutButtonDisabled) {
        style.cursor = 'default'
        style.opacity = 0.5
      }
      return style
    },
    getTitle() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
        ? 'Phishing Campaign Preview'
        : 'Quishing Campaign Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    isPhishing() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
    },
    isQuishing() {
      return this.type === PREVIEW_DIALOG_TYPES.QUISHING
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false
      return (
        this.selectedRow?.templateType?.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      )
    },
    getTrainingName() {
      return this?.trainingParams?.name || ''
    },
    getTrainingId() {
      return this?.trainingParams?.trainingId || ''
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
      this.apiFunc(this.selectedRow.resourceId)
        .then((response) => {
          const objKey =
            this.type === PREVIEW_DIALOG_TYPES.PHISHING
              ? 'phishingScenarioPreviewList'
              : 'quishingScenarioPreviewList'

          const { data: { data } = {} } = response
          const scenarioPreviewList = data[objKey]
          this.phishingScenarios = scenarioPreviewList.map((pScenario) => ({
            ...pScenario,
            customKey: createRandomCryptStringNumber()
          }))
          const phishingScenarioPreviewDto = scenarioPreviewList[0] || {}
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
      const templateKey = this.isQuishingTypeIndividualPrintOut
        ? 'quishingTemplate'
        : 'emailTemplate'
      this.isAttachmentBasedScenario = phishingScenarioPreviewDto?.methodTypeId?.toString() === '3'
      let template = phishingScenarioPreviewDto?.[templateKey]?.template || ''
      if (this.type === PREVIEW_DIALOG_TYPES.QUISHING)
        template = template.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
      this.emailTemplate = template
      this.isTrainingScenario = !!phishingScenarioPreviewDto?.trainingDetail
      this.trainingParams = phishingScenarioPreviewDto?.trainingDetail
      this.category = phishingScenarioPreviewDto?.category
      if (this.isTrainingScenario)
        this.callForTrainingLanguages(this.trainingParams.trainingContents)
      this.emailTemplateParams = {
        resourceId: phishingScenarioPreviewDto?.[templateKey]?.resourceId || '',
        name: phishingScenarioPreviewDto?.[templateKey]?.name || '',
        ccAddresses: phishingScenarioPreviewDto?.[templateKey]?.ccAddresses || [],
        fromName: phishingScenarioPreviewDto?.[templateKey]?.fromName || '',
        fromAddress: phishingScenarioPreviewDto?.[templateKey]?.fromAddress || '',
        subject: phishingScenarioPreviewDto?.[templateKey]?.subject || '',
        attachment: phishingScenarioPreviewDto?.[templateKey]?.phishingFileName
          ? {
              name: phishingScenarioPreviewDto?.[templateKey]?.phishingFileName
            }
          : null,
        type: phishingScenarioPreviewDto?.[templateKey]?.type || '',
        isAssistedByAI: phishingScenarioPreviewDto?.[templateKey]?.isAssistedByAI
      }
      this.selectedTemplateLanguages.push({
        text: phishingScenarioPreviewDto?.[templateKey]?.languageTypeName,
        value: phishingScenarioPreviewDto?.[templateKey]?.languageTypeResourceId
      })
      this.languagePreview = phishingScenarioPreviewDto?.[templateKey]?.languageTypeResourceId

      this.languages = phishingScenarioPreviewDto?.[templateKey]?.languages || []
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || []
      this.landingPageParams = {
        mfaSmsSenderNumber: phishingScenarioPreviewDto?.mfaSmsSenderNumber || '',
        mfaTextTemplate: phishingScenarioPreviewDto?.mfaTextTemplate || '',
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || '',
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || '',
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || '',
        isAssistedByAI:
          phishingScenarioPreviewDto?.landingPageTemplate?.isAssistedByAI ||
          phishingScenarioPreviewDto?.landingPageTemplate?.isAssistedbyAI
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
    },
    handlePreviewIndividualPrintout() {
      this.isIndividualPrintoutButtonDisabled = true
      QuishingService.getQuishingPdfPreviewContent(this.emailTemplateParams.resourceId)
        .then((response) => {
          const file = new File([response.data], 'Quishing PDF Preview', {
            type: 'application/pdf'
          })
          const fileURL = URL.createObjectURL(file)
          const newWindow = window.open(fileURL)
          newWindow.onload = function () {
            setTimeout(() => {
              newWindow.document.title = 'Quishing PDF Preview'
            }, 250)
          }
        })
        .finally(() => {
          this.isIndividualPrintoutButtonDisabled = false
        })
    },
    callForTrainingLanguages(trainingContents = []) {
      const languages = trainingContents.reduce((acc, item) => {
        acc.push(item.languageId)
        return acc
      }, [])
      AwarenessEducatorService.getLanguages().then((res) => {
        languages.forEach((lang) => {
          const language = res?.data?.data?.find((item) => item.id === lang)
          if (language) {
            this.selectedLanguages.push({
              text: language.name,
              value: language.id
            })
            if (!this.trainingParams.languages) this.trainingParams.languages = [language.name]
            else this.trainingParams.languages.push(language.name)
          }
        })
        if (this.trainingParams.languages)
          this.trainingParams.languages = this.trainingParams.languages.join(', ')
      })
    },
    handleEmailTemplatePreviewLanguageChange() {
      this.emailTemplateParams.languages = this.languages.find(
        (item) => item.resourceId === this.languagePreview
      )
    }
  }
}
</script>
