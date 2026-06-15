<template>
  <div v-if="isVisible">
    <div
      class="email-template-preview-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      :width="drawerWidth"
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
        <EmailTemplatePreviewSkeleton v-if="isPreviewLoading" />
        <EmailTemplatesAILoader
          v-if="isRedFlagsLoading"
          :title="getLoaderTitle"
          :description="getLoaderDescription"
          :loaderTime="20"
        />
        <div v-if="!isPreviewLoading && !isRedFlagsLoading" class="email-template-preview">
          <div class="email-template-preview__title">
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
          <div class="email-template-preview__container">
            <template v-if="!isIndividualPrintoutTemplate">
              <!-- Barrel: Lure / Payload body toggle -->
              <ElTabs
                v-if="isBarrelTemplate"
                v-model="barrelPreviewMode"
                class="k-sub-tab barrel-mode-tabs mb-2"
              >
                <ElTabPane label="Lure Email" name="lure" />
                <ElTabPane label="Payload Email" name="payload" />
              </ElTabs>
              <!-- Actions Header -->
              <div class="email-template-preview__header d-flex align-center justify-space-between mb-4">
                <div></div>
                <div class="email-template-preview__actions d-flex align-center gap-2">
                  <VBtn
                    v-if="isQuishing"
                    :ripple="false"
                    class="fw-600"
                    rounded
                    outlined
                    color="#2196f3"
                    @click="handleShowRedFlagsClick"
                  >
                    <VIcon>mdi-flag</VIcon>
                    <span class="button-new__text fw-600 ml-1" style="text-transform: none;">{{
                      redFlagsText
                    }}</span>
                  </VBtn>
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
              <hr class="mt-4 ml-n4 mr-n4" v-if="!!templateHTML" />
              <div class="email-template-preview__text mt-4" v-if="!!templateHTML">
                <div v-if="isQuishing && emailTemplateParams.type">
                  <span class="email-template-preview__text--title">Quishing Type: </span>
                  <span class="email-template-preview__text--body">{{
                    emailTemplateParams.type || 'Email'
                  }}</span>
                </div>
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
                  <span class="email-template-preview__text--title">Subject: </span>
                  <span class="email-template-preview__text--body">{{
                    displayedSubject
                  }}</span>
                  <RedFlagTooltip
                    v-if="redFlags && redFlags.subject && redFlags.subject.tooltipMessage"
                    :tooltipContent="redFlags.subject.tooltipMessage"
                  />
                </div>

                <div
                  style="margin-top: 2px;"
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
                  <span class="email-template-preview__text--title">From Name: </span>
                  <span class="email-template-preview__text--body">{{
                    emailTemplateParams.fromName
                  }}</span>
                  <RedFlagTooltip
                    v-if="redFlags && redFlags.fromName && redFlags.fromName.tooltipMessage"
                    :tooltipContent="redFlags.fromName.tooltipMessage"
                  />
                </div>

                <div
                  style="margin-top: 2px;"
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
                  <span class="email-template-preview__text--title">From Email: </span>
                  <span class="email-template-preview__text--body">{{
                    emailTemplateParams.fromAddress
                  }}</span>
                  <RedFlagTooltip
                    v-if="redFlags && redFlags.fromAddress && redFlags.fromAddress.tooltipMessage"
                    :tooltipContent="redFlags.fromAddress.tooltipMessage"
                  />
                </div>

                <div
                  v-if="isPhishing && emailTemplateParams.ccAddresses.length > 0"
                  style="margin-top: 2px;"
                >
                  <span class="email-template-preview__text--title">CC: </span>
                  <span class="email-template-preview__text--body">{{
                    emailTemplateParams.ccAddresses.join(', ')
                  }}</span>
                </div>

                <div
                  v-if="emailTemplateParams.attachment"
                  class="attachment-wrapper position-relative mt-2"
                  :class="
                    redFlags &&
                    redFlags.attachmentFileName &&
                    redFlags.attachmentFileName.isRedFlagged
                      ? 'red-flag-preview-active'
                      : ''
                  "
                >
                  <VIcon
                    v-if="
                      redFlags &&
                      redFlags.attachmentFileName &&
                      redFlags.attachmentFileName.isRedFlagged
                    "
                    color="#f56c6c"
                    style="font-size: 16px;"
                    >mdi-flag</VIcon
                  >
                  <div class="attachment blue-attach mb-0">
                    <AttachmentsPreview
                      :deletable="false"
                      :att="emailTemplateParams.attachment"
                      :isEmailTemplate="true"
                    />
                  </div>
                  <RedFlagTooltip
                    v-if="
                      redFlags &&
                      redFlags.attachmentFileName &&
                      redFlags.attachmentFileName.tooltipMessage
                    "
                    :tooltipContent="redFlags.attachmentFileName.tooltipMessage"
                  />
                </div>
              </div>
            </template>
            <div v-else>
              <div class="d-flex align-center justify-space-between mb-4">
                <div v-if="isQuishing && emailTemplateParams.type" class="text-primary-color fs-4">
                  <span class="fw-600">Quishing Type: </span>
                  <span>{{ emailTemplateParams.type || 'Email' }}</span>
                </div>
                <VBtn
                  :ripple="false"
                  class="fw-600"
                  rounded
                  outlined
                  color="#2196f3"
                  @click="handleShowRedFlagsClick"
                >
                  <VIcon>mdi-flag</VIcon>
                  <span class="button-new__text fw-600 ml-1" style="text-transform: none;">{{
                    redFlagsText
                  }}</span>
                </VBtn>
              </div>
              <div class="d-flex justify-space-between align-center">
                <div class="text-primary-color fs-4">
                  Example Individual Printout
                </div>
                <VBtn
                  id="btn-preview-email-template-printout"
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
            <hr class="mt-4 ml-n4 mr-n4" v-if="!!templateHTML" />
            <div :class="isShowRedFlags ? 'email-template-preview-phishing mt-2' : 'mt-2'">
              <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="displayedTemplateHtml" />
            </div>
          </div>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import EmailTemplatePreviewSkeleton from '@/components/SkeletonLoading/EmailTemplatePreviewSkeleton.vue'
import EmailTemplatesAILoader from '@/components/EmailTemplates/EmailTemplatesAILoader.vue'
import KEmailPreview from '@/components/KEmailPreview.vue'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'
import labels from '@/model/constants/labels'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { checkQuishingRedFlags } from '@/api/quishing'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import {
  defaultRedFlags,
  BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID
} from '@/components/PhishingScenarios/utils'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import QuishingService from '@/api/quishing'
import { useLoading } from '@/hooks/useLoading'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'
import { createRandomCryptStringNumber, FLAGGED_AREA_CSS, openHtmlInNewWindow } from '@/utils/functions'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'CommonSimulatorEmailTemplatePreviewDialog',
  components: {
    AttachmentsPreview,
    KEmailPreview,
    EmailTemplatePreviewSkeleton,
    RedFlagTooltip,
    EmailTemplatesAILoader
  },
  mixins: [useLoading, useDrawerAnimation, useHtmlOverflowControl],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: labels.EmailTemplatePreview
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    },
    apiFunc: {
      type: Function,
      default: getEmailTemplatePreviewContent
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isIndividualPrintoutTemplate: {
      type: Boolean,
      default: false
    },
    isNested: {
      type: Boolean,
      default: false
    },
    languages: {
      type: Array,
      default: () => []
    },
    drawerWidth: {
      type: String,
      default: 'calc(100% - 72px)'
    },
    shouldControlHtmlOverflow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      labels,
      isPreviewLoading: false,
      emailTemplateParams: {},
      templateHTML: null,
      isIndividualPrintoutButtonDisabled: false,
      drawerId: `email-template-preview-drawer-${createRandomCryptStringNumber()}`,
      redFlags: structuredClone(defaultRedFlags),
      isShowRedFlags: false,
      isFlaggedStylesEnabled: false,
      isRedFlagsLoading: false,
      lastRedFlags: {},
      isBarrelTemplate: false,
      barrelPreviewMode: 'lure',
      barrelPayload: {}
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--email-template-preview': true,
        'nested-drawer': this.isNested
      }
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    },
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    isBarrelPayloadMode() {
      return this.isBarrelTemplate && this.barrelPreviewMode === 'payload'
    },
    // Subject shown: payload subject in payload mode, lure subject otherwise.
    displayedSubject() {
      return this.isBarrelPayloadMode
        ? this.barrelPayload?.subject || ''
        : this.emailTemplateParams.subject
    },
    // Body shown in KEmailPreview: raw payload html in payload mode, the (possibly
    // red-flag-styled) lure templateHTML otherwise.
    displayedTemplateHtml() {
      return this.isBarrelPayloadMode ? this.barrelPayload?.template || '' : this.templateHTML
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
    redFlagsText() {
      return this.isShowRedFlags ? 'Hide Red Flags' : 'Show Red Flags'
    },
    getLoaderTitle() {
      return 'AI Ally is analyzing your email template for red flags'
    },
    getLoaderDescription() {
      return 'The scan may take some time depending on the localization. Please stay on the page while the scan is completed.'
    },
    getTitle() {
      return this?.isIndividualPrintoutTemplate
        ? labels.IndividualPrintoutTemplatePreview
        : this.title
    },
    subtitle() {
      return this?.selectedRow?.name || ''
    }
  },
  watch: {
    status(val) {
      this.isVisible = val
      if (val) {
        this.redFlags = structuredClone(defaultRedFlags)
        this.isShowRedFlags = false
        this.isFlaggedStylesEnabled = false
        this.lastRedFlags = {}
        this.callForData()
      }
    }
  },
  created() {
    if (this.status) {
      this.callForData()
    }
  },
  methods: {
    handleOverlayClick(event) {
      event.stopPropagation()
      event.preventDefault()
      this.closeDrawer()
    },
    callForData() {
      this.isPreviewLoading = true
      this.apiFunc(this.selectedRow.resourceId)
        .then((response) => {
          const data = response.data.data
          const {
            fromName,
            fromAddress,
            ccAddresses,
            name,
            difficultyResourceId,
            phishingFileName,
            subject,
            type,
            languageTypeName,
            languageTypeResourceId
          } = data
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            ccAddresses,
            name,
            subject,
            type: type || this.selectedRow?.quishingType || '',
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null,
            isAssistedByAI: data.isAssistedByAI,
            languageTypeName,
            languageTypeResourceId
          }
          if (this.type === SCENARIO_TYPES.QUISHING)
            data.template = data?.template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.templateHTML = data.template
          // Barrel templates carry a second body (payload). Detect by category, falling back to
          // actual payload content so the Lure/Payload toggle only appears when a payload exists.
          const bp = data.barrelPayload
          this.barrelPayload = bp || {}
          this.isBarrelTemplate =
            data.categoryResourceId === BARREL_EMAIL_TEMPLATE_CATEGORY_RESOURCE_ID ||
            !!(bp && (bp.template || bp.subject))
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.isPreviewLoading = false
          }, 500)
        })
    },
    handleClose() {
      this.closeDrawer()
    },
    handleExternalLink() {
      openHtmlInNewWindow(this.displayedTemplateHtml)
    },
    handlePreviewIndividualPrintout() {
      this.isIndividualPrintoutButtonDisabled = true
      QuishingService.getQuishingPdfPreviewContent(this.selectedRow.resourceId)
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
    handleShowRedFlagsClick() {
      this.isShowRedFlags = !this.isShowRedFlags
      this.isFlaggedStylesEnabled = !this.isFlaggedStylesEnabled
      if (this.isShowRedFlags) {
        if (this.lastRedFlags.flags) {
          this.redFlags = structuredClone(this.lastRedFlags.flags)
          if (this.lastRedFlags.template) {
            this.templateHTML = this.lastRedFlags.template
          }
          this.updateTemplateWithFlaggedStyles()
          return
        }

        this.isRedFlagsLoading = true
        if (this.$refs.refPreview) {
          this.$refs.refPreview.isEmailGenerating = true
        }
        const currentLanguageData = this.languages.find(
          (lang) => lang.value === this.emailTemplateParams.languageTypeResourceId
        )
        const payload = {
          template: this.templateHTML || '',
          subject: this.emailTemplateParams.subject || '',
          fromName: this.emailTemplateParams.fromName || '',
          fromEmail: this.emailTemplateParams.fromAddress || '',
          cc: this.emailTemplateParams.ccAddresses || [],
          attachmentFileName: this.emailTemplateParams.attachment?.name || '',
          language: currentLanguageData?.code || currentLanguageData?.description || ''
        }

        this.checkRedFlagsWithRetry(payload)
          .then((res) => {
            const { cc, fromEmail, fromName, subject, template, attachmentFileName } =
              res?.data ?? {}
            const redFlags = {
              ccAddresses: cc,
              fromAddress: fromEmail,
              fromName: fromName,
              subject: subject,
              attachmentFileName: attachmentFileName
            }

            this.templateHTML = template
            this.lastRedFlags = {
              flags: structuredClone(redFlags),
              template: template
            }

            this.redFlags = structuredClone(redFlags)
            this.updateTemplateWithFlaggedStyles()
          })
          .catch((e) => {
            const redFlagServiceUrl =
              'quishing-red-flag.keepnet-labs-ltd-business-profile4086.workers.dev'
            if (!e?.response || e?.response?.status === 0) {
              this.$store.dispatch('common/createSnackBar', {
                message: `Network error while reaching https://${redFlagServiceUrl}. Status Code: 0`,
                color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                icon: 'mdi-alert-circle'
              })
              return
            }
            this.$store.dispatch('common/createSnackBar', {
              message:
                e?.response?.data?.detail ||
                e?.response?.data?.message ||
                `Network error while reaching https://${redFlagServiceUrl}. Status Code: ${
                  e?.response?.status || e?.response?.data?.status || 0
                }`,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
            this.isShowRedFlags = false
            this.isFlaggedStylesEnabled = false
            this.redFlags = structuredClone(defaultRedFlags)
          })
          .finally(() => {
            if (this.$refs.refPreview) {
              this.$refs.refPreview.isEmailGenerating = false
            }
            this.isRedFlagsLoading = false
          })
      } else {
        this.lastRedFlags = {
          flags: structuredClone(this.redFlags),
          template: null
        }
        this.redFlags = structuredClone(defaultRedFlags)
        this.updateTemplateWithFlaggedStyles()
      }
    },
    checkRedFlagsWithRetry(payload, maxRetries = 5, delay = 5000, currentAttempt = 1) {
      return new Promise((resolve, reject) => {
        checkQuishingRedFlags(payload)
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
      if (!this.templateHTML) return

      if (this.isFlaggedStylesEnabled) {
        this.templateHTML = this._addFlaggedStylesToTemplate(this.templateHTML)
      } else {
        this.templateHTML = this._removeFlaggedStylesFromTemplate(this.templateHTML)
      }
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
      } catch {
        return `${template}${script}`
      }
    },
    _removeFlaggedStylesFromTemplate(template) {
      if (!template) return template
      const cssToRemove = FLAGGED_AREA_CSS.trim()
      const scriptToRemove = this._getPreventClickScript().trim()

      let cleanedTemplate = template.replaceAll(new RegExp(this._escapeRegExp(cssToRemove), 'g'), '')
      cleanedTemplate = cleanedTemplate.replaceAll(
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
              const eventTypes = [
                'click', 'auxclick', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
                'keydown', 'keyup', 'keypress', 'submit', 'change',
                'focus', 'blur', 'input', 'select', 'dragstart',
                'contextmenu'
              ];

              eventTypes.forEach(eventType => {
                document.body.addEventListener(eventType, function(e) {
                  const flaggedElement = e.target.closest('.flagged-area');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, true);
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
              initializeEventPrevention();
            }
          })();`
      //@ts-ignore
      //eslint-disable-next-line no-use-before-define
      return '<script>' + method + '<\/script>'
    },
    _escapeRegExp(string) {
      return string.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/pages/phishing-scenarios/__all.scss';
</style>
