<template>
  <div v-if="isVisible">
    <div class="common-simulator-preview-overlay" @click="handleOverlayClick"></div>
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
        <EmailTemplatesAILoader
          v-if="isRedFlagsLoading"
          :title="getLoaderTitle"
          :description="getLoaderDescription"
          :loaderTime="20"
        />
        <ElTabs v-if="!isLoading && !isRedFlagsLoading" v-model="tab" class="mt-4">
          <ElTabPane
            id="campaign-manager-info--email-content"
            name="email"
            :label="getFirstTabLabel"
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
              <div
                class="common-simulator-preview__text"
                v-if="!!emailTemplate && !isRedFlagsLoading"
              >
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
                    <VTooltip bottom>
                      <template #activator="{ on }">
                        <div v-on="on">
                          <VBtn icon outlined color="#2196F3" small @click="handleEdit">
                            <VIcon small>mdi-pencil</VIcon>
                          </VBtn>
                        </div>
                      </template>
                      <span>Edit Template</span>
                    </VTooltip>
                  </div>
                </div>
                <hr class="ml-n4 mb-3 mr-n4" v-if="!!emailTemplate && isPhishing" />
                <div class="d-flex align-start justify-space-between" style="max-height: 22px;">
                  <div v-if="!isQuishingTypeIndividualPrintOut" style="width: calc(100% - 200px);">
                    <div
                      :class="
                        redFlags && redFlags.subject && redFlags.subject.isRedFlagged
                          ? 'red-flag-preview-active'
                          : ''
                      "
                    >
                      <VIcon
                        v-if="redFlags && redFlags.subject && redFlags.subject.isRedFlagged"
                        color="#f56c6c"
                        style="font-size: 16px;"
                        >mdi-flag</VIcon
                      >
                      <span class="template-preview__text--title text-primary-color"
                        >Subject:
                      </span>
                      <span class="template-preview__text--body text-primary-color">{{
                        emailTemplateParams.subject
                      }}</span>
                      <RedFlagTooltip
                        v-if="redFlags && redFlags.subject && redFlags.subject.tooltipMessage"
                        :tooltipContent="redFlags.subject.tooltipMessage"
                      />
                    </div>
                  </div>
                  <!-- Red Flags Button -->
                  <VBtn
                    v-if="isPhishing"
                    :ripple="false"
                    class="fw-600"
                    rounded
                    outlined
                    color="#2196f3"
                    @click="handleShowRedFlagsClick"
                    :loading="isRedFlagsLoading"
                  >
                    <VIcon>mdi-flag</VIcon>
                    <span class="button-new__text fw-600 ml-1" style="text-transform: none;">{{
                      redFlagsText
                    }}</span>
                  </VBtn>
                </div>

                <div v-if="!isQuishingTypeIndividualPrintOut">
                  <div
                    style="width: calc(100% - 200px);"
                    :class="
                      redFlags && redFlags.fromName && redFlags.fromName.isRedFlagged
                        ? 'red-flag-preview-active'
                        : ''
                    "
                  >
                    <VIcon
                      v-if="redFlags && redFlags.fromName && redFlags.fromName.isRedFlagged"
                      color="#f56c6c"
                      style="font-size: 16px;"
                      >mdi-flag</VIcon
                    >
                    <span class="template-preview__text--title text-primary-color"
                      >From Name:
                    </span>
                    <span class="template-preview__text--body text-primary-color">{{
                      emailTemplateParams.fromName
                    }}</span>
                    <RedFlagTooltip
                      v-if="redFlags && redFlags.fromName && redFlags.fromName.tooltipMessage"
                      :tooltipContent="redFlags.fromName.tooltipMessage"
                    />
                  </div>
                </div>

                <div v-if="!isQuishingTypeIndividualPrintOut">
                  <div
                    style="width: calc(100% - 200px);"
                    :class="
                      redFlags && redFlags.fromAddress && redFlags.fromAddress.isRedFlagged
                        ? 'red-flag-preview-active'
                        : ''
                    "
                  >
                    <VIcon
                      v-if="redFlags && redFlags.fromAddress && redFlags.fromAddress.isRedFlagged"
                      color="#f56c6c"
                      style="font-size: 16px;"
                      >mdi-flag</VIcon
                    >
                    <span class="template-preview__text--title text-primary-color"
                      >From Email:
                    </span>
                    <span class="template-preview__text--body text-primary-color">{{
                      emailTemplateParams.fromAddress
                    }}</span>
                    <RedFlagTooltip
                      v-if="redFlags && redFlags.fromAddress && redFlags.fromAddress.tooltipMessage"
                      :tooltipContent="redFlags.fromAddress.tooltipMessage"
                    />
                  </div>
                </div>
                <div v-if="isPhishing && emailTemplateParams.ccAddresses.length > 0">
                  <div
                    style="width: calc(100% - 200px);"
                    :class="
                      redFlags && redFlags.ccAddresses && redFlags.ccAddresses.isRedFlagged
                        ? 'red-flag-preview-active'
                        : ''
                    "
                  >
                    <VIcon
                      v-if="redFlags && redFlags.ccAddresses && redFlags.ccAddresses.isRedFlagged"
                      color="#f56c6c"
                      style="font-size: 16px;"
                      >mdi-flag</VIcon
                    >
                    <span class="template-preview__text--title text-primary-color">CC: </span>
                    <span class="template-preview__text--body text-primary-color">{{
                      emailTemplateParams.ccAddresses.join(', ')
                    }}</span>
                    <RedFlagTooltip
                      v-if="redFlags && redFlags.ccAddresses && redFlags.ccAddresses.tooltipMessage"
                      :tooltipContent="redFlags.ccAddresses.tooltipMessage"
                    />
                  </div>
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
                    :redFlags="redFlags"
                    :isEmailTemplate="true"
                  />
                </div>
              </div>
              <hr class="mt-4 ml-n4 mr-n4 mb-2" v-if="!!emailTemplate" />
              <KEmailPreview
                v-if="!!emailTemplate"
                ref="refPreview"
                :html="emailTemplate"
                :isRedFlaggedTemplate="isFlaggedStylesEnabled"
              />
            </div>
          </ElTabPane>
          <ElTabPane
            v-if="!isAttachmentBasedScenario"
            :label="labels.LandingPageTemplate"
            name="landing-page"
            id="campaign-manager-info--landing-content"
          >
            <TabsWithMfaSettings
              :key="getLandingPageKey"
              class="mt-n4"
              :type="type"
              :is-method-mfa="isMethodMfa"
              :landing-page-params="landingPageParams"
              :landing-page-templates="landingPageTemplates"
              :languages="languages"
              @edit-landing-page="handleEdit"
            />
          </ElTabPane>
        </ElTabs>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import EmailTemplatePreviewSkeleton from '@/components/SkeletonLoading/EmailTemplatePreviewSkeleton.vue'
import TabsWithMfaSettings from '@/components/PhishingScenarios/TabsWithMfaSettings.vue'
import KEmailPreview from '@/components/KEmailPreview.vue'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'
import EmailTemplatesAILoader from '@/components/EmailTemplates/EmailTemplatesAILoader.vue'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import labels from '@/model/constants/labels'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { defaultRedFlags } from '@/components/PhishingScenarios/utils'
import QuishingService from '@/api/quishing'
import { checkRedFlags } from '@/api/phishingsimulator'
import {
  createRandomCryptStringNumber,
  FLAGGED_AREA_CSS,
  openHtmlInNewWindow
} from '@/utils/functions'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'CommonSimulatorPreviewDialog',
  components: {
    InputLanguagePreview,
    AttachmentsPreview,
    KEmailPreview,
    TabsWithMfaSettings,
    EmailTemplatePreviewSkeleton,
    RedFlagTooltip,
    EmailTemplatesAILoader
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
      required: true
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      emailTemplate: null,
      landingPageTemplates: [],
      isMethodMfa: false,
      languagePreview: '',
      selectedTemplateLanguages: [],
      phishingEmailTemplates: [],
      selectedLandingPageIndex: 0,
      emailTemplateParams: {},
      landingPageParams: {},
      category: '',
      tab: 'email',
      isLoading: false,
      labels,
      timeoutId: '',
      isIndividualPrintoutButtonDisabled: false,
      redFlags: JSON.parse(JSON.stringify(defaultRedFlags)),
      isRedFlagsLoading: false,
      isShowRedFlags: false,
      isFlaggedStylesEnabled: false,
      lastRedFlags: {}
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true
      }
    },
    redFlagsText() {
      return this.isShowRedFlags ? 'Hide Red Flags' : 'Show Red Flags'
    },
    getLoaderTitle() {
      return 'AI Ally is analyzing your email template for red flags'
    },
    getLoaderDescription() {
      return 'The scan may take some time depending on the localization. Please stay on the page while the scan is completed.'
    },
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    getFirstTabLabel() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
        ? labels.EmailTemplate
        : labels.QuishingTemplate
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
    isQuishing() {
      return this.type === PREVIEW_DIALOG_TYPES.QUISHING
    },
    isPhishing() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false
      return (
        this?.emailTemplateParams?.type?.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    },
    isAttachmentBasedScenario() {
      return this.selectedRow?.method ? this.selectedRow?.method === 'Attachment' : false
    },
    getTitle() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
        ? labels.PhishingScenarioPreview
        : labels.QuishingScenarioPreview
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates[this.selectedLandingPageIndex]?.content
    },
    getLandingPageKey() {
      return this.tab === 'landing-page' ? `key-${createRandomCryptStringNumber()}` : ''
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
      const params = [this.selectedRow.resourceId]
      if (this.type === PREVIEW_DIALOG_TYPES.QUISHING)
        params.push(this.selectedRow.quishingType.toLowerCase())
      this.apiFunc(...params)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          let { emailTemplate, landingPageTemplate, quishingTemplate, category = '' } = data
          if (!emailTemplate) emailTemplate = quishingTemplate
          this.category = category
          let {
            template,
            fromName,
            fromAddress,
            ccAddresses,
            name,
            difficultyResourceId,
            phishingFileName,
            subject,
            type,
            resourceId,
            isAssistedByAI = false,
            languageTypeResourceId,
            languageTypeName
          } = emailTemplate || {}

          this.emailTemplateParams = {
            resourceId,
            fromName,
            fromAddress,
            ccAddresses,
            name,
            subject,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null,
            type,
            isAssistedByAI,
            languageTypeResourceId,
            languageTypeName
          }
          if (this.isPhishing) {
            this.phishingEmailTemplates.push({
              fromName,
              fromAddress,
              subject,
              template,
              languageTypeResourceId,
              languageTypeName:
                this.languages.find((item) => item.value === languageTypeResourceId)?.text ||
                languageTypeName,
              ccAddresses
            })
            this.selectedTemplateLanguages.push({
              value: languageTypeResourceId,
              text:
                this.languages.find((item) => item.value === languageTypeResourceId)?.text ||
                languageTypeName
            })
            this.languagePreview = languageTypeResourceId
            if (emailTemplate?.languages?.length) {
              emailTemplate?.languages?.forEach((item) => {
                this.phishingEmailTemplates.push({
                  ccAddresses: item.ccAddresses,
                  fromName: item.fromName,
                  fromAddress: item.fromAddress,
                  subject: item.subject,
                  template: item.template,
                  languageTypeResourceId: item.languageTypeResourceId,
                  languageTypeName:
                    this.languages.find((lang) => lang.value === item.languageTypeResourceId)
                      ?.text || item.languageTypeName
                })
                this.selectedTemplateLanguages.push({
                  value: item.languageTypeResourceId,
                  text:
                    this.languages.find((lang) => lang.value === item.languageTypeResourceId)
                      ?.text || item.languageTypeName
                })
              })
            }
          }
          if (this.type === PREVIEW_DIALOG_TYPES.QUISHING)
            template = template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.emailTemplate = template

          const {
            name: landingPageName,
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            methodTypeId,
            isAssistedByAI: isLandingPageAi = false,
            isAssistedbyAI: isLandingPageAi2 = false
          } = landingPageTemplate || []

          this.landingPageParams = {
            name: landingPageName,
            isAssistedByAI: isLandingPageAi || isLandingPageAi2,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            isAttachmentBasedTemplate: methodTypeId === 3,
            mfaTextTemplate: data.mfaTextTemplate,
            mfaSmsSenderNumber: data.mfaSmsSenderNumber,
            languages: this.languages.filter((lang) => {
              return lang.value === landingPageTemplate?.languageTypeResourceId
            }) || []
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
    handleExternalLink() {
      openHtmlInNewWindow(this.emailTemplate)
    },
    handleEdit() {
      this.$emit('edit-template')
    },
    handleEmailTemplatePreviewLanguageChange(newLanguageId) {
      // Eski languagePreview için red flags'leri kaydet (sadece red flags aktif ise)
      if (this.languagePreview && this.isShowRedFlags) {
        // Eğer red flags cached varsa, template'i güncelle
        if (this.lastRedFlags[this.languagePreview]) {
          this.lastRedFlags[this.languagePreview].flags = JSON.parse(JSON.stringify(this.redFlags))
          this.lastRedFlags[this.languagePreview].textfieldValues = {
            fromName: this.emailTemplateParams.fromName,
            fromAddress: this.emailTemplateParams.fromAddress,
            subject: this.emailTemplateParams.subject,
            attachmentFileName: this.emailTemplateParams.attachment?.name
          }
        }
      }

      // Yeni dili set et
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

      // Yeni dil için red flags durumunu kontrol et
      if (this.lastRedFlags[newLanguageId] && this.lastRedFlags[newLanguageId].flags) {
        // Yeni dilde red flags cached varsa template'i restore et ama form alanlarındaki flags'leri reset et
        // Cached template'i restore et
        if (
          this.lastRedFlags[newLanguageId].templates &&
          this.lastRedFlags[newLanguageId].templates[0]
        ) {
          this.emailTemplate = this.lastRedFlags[newLanguageId].templates[0]
        }
        // Form alanlarında gösterilmemesi için flags'leri reset et
        this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
        this.isFlaggedStylesEnabled = false
        this.isShowRedFlags = false
        // Cached template'den highlighting'leri kaldır
        this.$nextTick(() => {
          this.updateTemplateWithFlaggedStyles()
        })
      } else {
        // Yeni dilde red flags yok, default state
        this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
        this.isFlaggedStylesEnabled = false
        this.isShowRedFlags = false
        // Template'den highlighting'leri kaldır
        this.$nextTick(() => {
          this.updateTemplateWithFlaggedStyles()
        })
      }
    },

    handleShowRedFlagsClick() {
      this.isShowRedFlags = !this.isShowRedFlags
      this.isFlaggedStylesEnabled = !this.isFlaggedStylesEnabled
      if (this.isShowRedFlags) {
        // Bu dil için red flags daha önce çağrıldı mı kontrol et
        if (
          this.lastRedFlags[this.languagePreview] &&
          this.lastRedFlags[this.languagePreview].flags
        ) {
          // Var olan red flags'leri restore et
          this.redFlags = JSON.parse(JSON.stringify(this.lastRedFlags[this.languagePreview].flags))
          // Cached template'i restore et
          if (
            this.lastRedFlags[this.languagePreview].templates &&
            this.lastRedFlags[this.languagePreview].templates[0]
          ) {
            this.emailTemplate = this.lastRedFlags[this.languagePreview].templates[0]
          }
          this.updateTemplateWithFlaggedStyles()
          return
        }

        // İlk kez red flags çağrılıyor
        this.isRedFlagsLoading = true
        const currentLanguageData = this.selectedTemplateLanguages.find(
          (lang) => lang.value === this.languagePreview
        )
        const payload = {
          template: this.emailTemplate || '',
          subject: this.emailTemplateParams.subject || '',
          fromName: this.emailTemplateParams.fromName || '',
          fromEmail: this.emailTemplateParams.fromAddress || '',
          cc: this.emailTemplateParams.ccAddresses || [],
          attachmentFileName: this.emailTemplateParams.attachment?.name || '',
          language: currentLanguageData?.text || ''
        }

        this.checkRedFlagsWithRetry(payload)
          .then((res) => {
            const { cc, fromEmail, fromName, subject, template, attachmentFileName } = res?.data
            const redFlags = {
              ccAddresses: cc,
              fromAddress: fromEmail,
              fromName: fromName,
              subject: subject,
              attachmentFileName: attachmentFileName
            }

            // Update template HTML and store red flags data
            this.emailTemplate = template
            this.lastRedFlags[this.languagePreview] = {
              flags: JSON.parse(JSON.stringify(redFlags)),
              templates: [template],
              textfieldValues: {
                fromName: this.emailTemplateParams.fromName,
                fromAddress: this.emailTemplateParams.fromAddress,
                subject: this.emailTemplateParams.subject,
                attachmentFileName: this.emailTemplateParams.attachment?.name
              }
            }

            this.redFlags = JSON.parse(JSON.stringify(redFlags))
            this.updateTemplateWithFlaggedStyles()
          })
          .catch((e) => {
            if (!e?.response || e?.response?.status === 0) {
              this.$store.dispatch('common/createSnackBar', {
                message: `Network error while reaching https://r-flg.keepnetlabs.com. Status Code: 0`,
                color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                icon: 'mdi-alert-circle'
              })
              return
            }
            this.$store.dispatch('common/createSnackBar', {
              message:
                e?.response?.data?.detail ||
                e?.response?.data?.message ||
                `Network error while reaching https://r-flg.keepnetlabs.com. Status Code: ${
                  e?.response?.status || e?.response?.data?.status || 0
                }`,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
            this.isShowRedFlags = false
            this.isFlaggedStylesEnabled = false
            this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
          })
          .finally(() => {
            this.isRedFlagsLoading = false
          })
      } else {
        // CSS stillerini template'den kaldır
        // Önce bu dil için red flags'leri templates array'ine kaydet
        if (!this.lastRedFlags[this.languagePreview]) {
          this.lastRedFlags[this.languagePreview] = {}
        }
        this.lastRedFlags[this.languagePreview].flags = JSON.parse(JSON.stringify(this.redFlags))
        this.lastRedFlags[this.languagePreview].textfieldValues = {
          fromName: this.emailTemplateParams.fromName,
          fromAddress: this.emailTemplateParams.fromAddress,
          subject: this.emailTemplateParams.subject,
          attachmentFileName: this.emailTemplateParams.attachment?.name
        }

        this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
        this.updateTemplateWithFlaggedStyles()
      }
    },

    checkRedFlagsWithRetry(payload, maxRetries = 5, delay = 5000, currentAttempt = 1) {
      return new Promise((resolve, reject) => {
        checkRedFlags(payload)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            if (currentAttempt >= maxRetries) {
              reject(error)
              return
            }
            setTimeout(() => {
              this.checkRedFlagsWithRetry(payload, maxRetries, delay, currentAttempt + 1)
                .then(resolve)
                .catch(reject)
            }, delay)
          })
      })
    },

    updateTemplateWithFlaggedStyles() {
      if (!this.emailTemplate) return

      if (this.isFlaggedStylesEnabled) {
        this.emailTemplate = this._addFlaggedStylesToTemplate(this.emailTemplate)
      } else {
        this.emailTemplate = this._removeFlaggedStylesFromTemplate(this.emailTemplate)
        if (this.lastRedFlags[this.languagePreview]) {
          this.lastRedFlags[this.languagePreview].templates =
            this.lastRedFlags[this.languagePreview].templates || []
        }
      }
    },

    _isValidLanguagePayload(payload) {
      return payload && typeof payload.template === 'string' && payload.template.trim()
    },

    _isFullHtmlTemplate(template) {
      const htmlRegex = /<html[\s\S]*?>|<head[\s\S]*?>/i
      return htmlRegex.test(template)
    },

    _hasHeadTag(template) {
      return /<head[\s\S]*?>/i.test(template)
    },

    _addFlaggedStylesToTemplate(template) {
      if (template.includes(FLAGGED_AREA_CSS.trim())) {
        return template
      }

      if (this._isFullHtmlTemplate(template)) {
        return this._injectCssIntoHead(template)
      } else {
        return this._prependCssToBodyContent(template)
      }
    },

    _injectCssIntoHead(template) {
      if (this._hasHeadTag(template)) {
        let templateWithCss = template.replace(/<\/head>/i, `${FLAGGED_AREA_CSS}</head>`)
        return this._injectScriptIntoBody(templateWithCss)
      }
      let templateWithCss = template.replace(
        /<html[\s\S]*?>/i,
        `$&<head>${FLAGGED_AREA_CSS}</head>`
      )
      return this._injectScriptIntoBody(templateWithCss)
    },

    _prependCssToBodyContent(template) {
      let templateWithCss = `${FLAGGED_AREA_CSS}${template}`
      return this._injectScriptIntoBody(templateWithCss)
    },

    _injectScriptIntoBody(template) {
      const script = this._getPreventClickScript()
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(template, 'text/html')
        const body = doc.querySelector('body')

        if (body) {
          body.insertAdjacentHTML('beforeend', script)
          return doc.documentElement.outerHTML
        } else {
          const newBody = doc.createElement('body')
          newBody.innerHTML = template
          newBody.insertAdjacentHTML('beforeend', script)
          doc.documentElement.appendChild(newBody)
          return doc.documentElement.outerHTML
        }
      } catch (error) {
        return `${template}${script}`
      }
    },

    _removeFlaggedStylesFromTemplate(template) {
      const cssToRemove = FLAGGED_AREA_CSS.trim()
      const scriptToRemove = this._getPreventClickScript().trim()

      let cleanedTemplate = template.replace(new RegExp(this._escapeRegExp(cssToRemove), 'g'), '')
      cleanedTemplate = cleanedTemplate.replace(
        new RegExp(this._escapeRegExp(scriptToRemove), 'g'),
        ''
      )

      return cleanedTemplate
    },

    _getPreventClickScript() {
      // eslint-disable-next-line no-use-before-define
      const method = `(function() {
            'use strict';

            function initializeEventPrevention() {
              // Tüm event türlerini tanımla
              const eventTypes = [
                'click', 'auxclick', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
                'keydown', 'keyup', 'keypress', 'submit', 'change',
                'focus', 'blur', 'input', 'select', 'dragstart',
                'contextmenu'
              ];

              // Her event türü için body listener ekle
              eventTypes.forEach(eventType => {
                document.body.addEventListener(eventType, function(e) {
                  const flaggedElement = e.target.closest('.flagged-area');
                    // Event'i tamamen engelle
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, true); // Capture phase
              });
              ['click', 'auxclick'].forEach(anchorEvent => {
                document.body.addEventListener(anchorEvent, function(e) {
                  const anchor = e.target.closest('a');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    try { anchor.setAttribute('data-blocked', 'true'); } catch (_) {}
                    return false;
                }, true);
              });
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initializeEventPrevention);
            } else {
              // DOM zaten hazırsa hemen çalıştır
              initializeEventPrevention();
            }
          })();`
      //@ts-ignore
      //eslint-disable-next-line no-use-before-define
      return '<script>' + method + '<\/script>'
    },

    _escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },

    resetRedFlags() {
      this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
      this.isShowRedFlags = false
      this.isFlaggedStylesEnabled = false
      this._removeFlaggedStylesFromTemplate()
    }
  }
}
</script>
