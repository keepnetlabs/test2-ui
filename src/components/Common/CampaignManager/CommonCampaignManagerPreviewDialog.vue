<template>
  <div v-if="isVisible">
    <div class="common-campaign-manager-preview-overlay" @click="handleOverlayClick"></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  {{ getTitle }}
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
      <div class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body">
        <EmailTemplatePreviewSkeleton v-if="isLoading" />
        <div
          v-if="!isLoading"
          class="d-flex align-center justify-space-between mt-4"
          style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;"
        >
          <div>
            <span class="text-primary-color fs-5 fw-600">{{ selectedRow?.name }}</span>
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
          v-model="selectedScenario"
          class="campaign-manager-last-step__phishing-scenario-tab mb-4"
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
          <ElTabPane
            id="campaign-manager-info--email-content"
            name="email"
            :label="getFirstSubTabLabel"
          >
            <div class="text-primary-color fs-4 fw-600 mb-2 mt-n4">
              {{ emailTemplateParams.name }}
              <VTooltip v-if="emailTemplateParams.isAssistedByAI" bottom>
                <template #activator="{ on }">
                  <span v-on="on">
                    <VIcon color="#2196F3" small>mdi-creation</VIcon>
                  </span>
                </template>
                <span>This template was generated with AI</span>
              </VTooltip>
            </div>
            <div
              class="template-preview"
              style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;"
            >
              <div class="common-simulator-preview__text" v-if="!!emailTemplate">
                <div v-if="isQuishing">
                  <span class="template-preview__text--title">Quishing Type: </span>
                  <span class="template-preview__text--body">{{
                    emailTemplateParams.type || 'Email'
                  }}</span>
                </div>
                <div
                  v-if="isPhishing"
                  class="email-template-preview__header d-flex align-center justify-space-between mb-4"
                >
                  <InputLanguagePreview
                    :value="languagePreview"
                    :items="selectedTemplateLanguages"
                    :label="`Template Language (${selectedTemplateLanguages.length})`"
                    class="email-template-preview__language-select"
                    style="max-width: 320px;"
                    hide-details
                    @input="handleEmailTemplatePreviewLanguageChange"
                  />
                  <div class="email-template-preview__actions d-flex align-center gap-2">
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
                </div>
                <hr class="ml-n4 mb-3 mr-n4" v-if="!!emailTemplate && isPhishing" />
                <div v-if="!isQuishingTypeIndividualPrintOut">
                  <span class="template-preview__text--title text-primary-color">Subject: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.subject
                  }}</span>
                </div>

                <div v-if="!isQuishingTypeIndividualPrintOut">
                  <span class="template-preview__text--title text-primary-color">From Name: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.fromName
                  }}</span>
                </div>

                <div v-if="!isQuishingTypeIndividualPrintOut">
                  <span class="template-preview__text--title text-primary-color">From Email: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.fromAddress
                  }}</span>
                </div>
                <div v-if="isPhishing && emailTemplateParams.ccAddresses.length > 0">
                  <span class="template-preview__text--title text-primary-color">CC: </span>
                  <span class="template-preview__text--body text-primary-color">{{
                    emailTemplateParams.ccAddresses.join(', ')
                  }}</span>
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
            v-if="!isAttachmentBasedScenario"
            :label="labels.LandingPageTemplate"
            name="landing-page"
            id="campaign-manager-info--landing-content"
          >
            <TabsWithMfaSettingsMultipleLanguages
              :key="getLandingPageKey"
              :type="type"
              :is-method-mfa="isMethodMfa"
              :landing-page-params="landingPageParams"
              :landing-page-templates="landingPageTemplates"
              :languages="globalLanguages"
              :phishing-url="landingPageParams.urlTemplate"
              :is-phishing-scenario="isPhishing"
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
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import EmailTemplatePreviewSkeleton from '@/components/SkeletonLoading/EmailTemplatePreviewSkeleton.vue'
import { getCampaignManagerPreview } from '@/api/phishingsimulator'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import TabsWithMfaSettingsMultipleLanguages from '@/components/PhishingScenarios/TabsWithMfaSettingsMultipleLanguages.vue'
import { createRandomCryptStringNumber } from '@/utils/functions'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import QuishingService from '@/api/quishing'
import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import InputLanguagePreview from '../Inputs/InputLanguagePreview.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import { openHtmlInNewWindow } from '@/utils/functions'

export default {
  name: 'CommonCampaignManagerPreviewDialog',
  components: {
    InputLanguagePreview,
    TrainingLibraryPreview,
    TabsWithMfaSettingsMultipleLanguages,
    AttachmentsPreview,
    KEmailPreview,
    EmailTemplatePreviewSkeleton
  },
  mixins: [useDrawerAnimation],
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
      globalLanguages: [],
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
      selectedLanguages: [],
      phishingEmailTemplates: []
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--campaign-manager-preview': true
      }
    },
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    getFirstSubTabLabel() {
      return this.isQuishing ? labels.QuishingTemplate : labels.EmailTemplate
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
    },
    getLandingPageKey() {
      return this.tab === 'landing-page' ? `key-${createRandomCryptStringNumber()}` : ''
    }
  },
  created() {
    this.callForLanguages()
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForLanguages() {
      AwarenessEducatorService.getLanguages().then((res) => {
        this.languages = res?.data?.data || []
      })
      LookupLocalStorage.getSingle(21).then((response) => {
        this.globalLanguages =
          response?.map((language) => ({
            text: language.isoFriendlyName || language.name,
            isoFriendlyName: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId
          })) || []
      })
    },
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
      // Reset training languages array before populating
      this.selectedLanguages = []
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
      // Reset arrays before populating with new scenario data
      this.selectedTemplateLanguages = []
      this.phishingEmailTemplates = []
      if (this.isPhishing) {
        const mainLanguage = this.globalLanguages.find(
          (lang) => lang.value === phishingScenarioPreviewDto?.[templateKey]?.languageTypeResourceId
        )
        this.selectedTemplateLanguages.push({
          text:
            mainLanguage?.isoFriendlyName ||
            phishingScenarioPreviewDto?.[templateKey]?.languageTypeName,
          value: phishingScenarioPreviewDto?.[templateKey]?.languageTypeResourceId
        })
        this.languagePreview = this.selectedTemplateLanguages[0].value
        this.phishingEmailTemplates.push({
          ...this.emailTemplateParams,
          template: phishingScenarioPreviewDto?.[templateKey]?.template,
          languageTypeResourceId: this.languagePreview
        })
        if (phishingScenarioPreviewDto?.[templateKey]?.languages?.length) {
          phishingScenarioPreviewDto?.[templateKey]?.languages?.forEach((item) => {
            this.phishingEmailTemplates.push({
              template: item.template,
              fromName: item.fromName,
              fromAddress: item.fromAddress,
              subject: item.subject,
              ccAddresses: item.ccAddresses,
              languageTypeResourceId: item.languageTypeResourceId
            })
            const language = this.globalLanguages.find(
              (lang) => lang.value === item.languageTypeResourceId
            )
            this.selectedTemplateLanguages.push({
              text: language?.isoFriendlyName || item.languageTypeName,
              value: item.languageTypeResourceId
            })
          })
        }
      }
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || []
      const landingPageLanguageTypeResourceId =
        phishingScenarioPreviewDto?.landingPageTemplate?.languageTypeResourceId
      this.landingPageParams = {
        mfaSmsSenderNumber: phishingScenarioPreviewDto?.mfaSmsSenderNumber || '',
        mfaTextTemplate: phishingScenarioPreviewDto?.mfaTextTemplate || '',
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || '',
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || '',
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || '',
        isAssistedByAI:
          phishingScenarioPreviewDto?.landingPageTemplate?.isAssistedByAI ||
          phishingScenarioPreviewDto?.landingPageTemplate?.isAssistedbyAI,
        languages: landingPageLanguageTypeResourceId
          ? this.globalLanguages.filter((lang) => {
              return (
                lang.value === landingPageLanguageTypeResourceId ||
                lang.value?.toString() === landingPageLanguageTypeResourceId?.toString()
              )
            }) || []
          : []
      }
      this.isMethodMfa = phishingScenarioPreviewDto?.methodTypeId?.toString() === '4'
      this.tab = 'email'
    },
    callForScenarioDetail(event) {
      this.setActiveScenario(this.phishingScenarios[event.index])
    },
    setLoading(flag = false) {
      this.isLoading = flag
    },
    handleOverlayClick() {
      this.closeDrawer()
    },
    handleClose() {
      this.closeDrawer()
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
      const languageIds = trainingContents.reduce((acc, item) => {
        acc.push(item.languageId)
        return acc
      }, [])
      // Reset trainingParams.languages array
      this.trainingParams.languages = []
      languageIds.forEach((lang) => {
        const language = this.languages.find((item) => item.id === lang)
        if (language) {
          this.selectedLanguages.push({
            text: language.isoFriendlyName || language.name,
            value: language.id
          })
          this.trainingParams.languages.push(language.isoFriendlyName || language.name)
        }
      })
      if (this.trainingParams.languages.length > 0)
        this.trainingParams.languages = this.trainingParams.languages.join(', ')
    },
    handleEditCampaign() {
      this.$emit('on-edit-campaign', this.selectedRow)
    },
    handleEmailTemplatePreviewLanguageChange(newLanguageId) {
      this.languagePreview = newLanguageId

      const findedTemplate = this.phishingEmailTemplates.find(
        (item) => item.languageTypeResourceId === newLanguageId
      )
      if (!findedTemplate) return
      this.emailTemplateParams = {
        ...this.emailTemplateParams,
        ccAddresses: findedTemplate.ccAddresses,
        fromName: findedTemplate.fromName,
        fromAddress: findedTemplate.fromAddress,
        subject: findedTemplate.subject,
        template: findedTemplate.template
      }
      this.emailTemplate = findedTemplate.template
    },
    handleExternalLink() {
      openHtmlInNewWindow(this.emailTemplate)
    }
  }
}
</script>
