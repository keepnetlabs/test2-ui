<template>
  <AppDialog
    v-if="status"
    :status="status"
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :title="getTitle"
    :subtitle="subtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <EmailTemplatesAILoader
        v-if="isRedFlagsLoading"
        :title="getLoaderTitle"
        :description="getLoaderDescription"
        :loaderTime="20"
      />
      <div v-if="!isPreviewLoading && !isRedFlagsLoading" class="template-preview">
        <div class="template-preview__text" v-if="!!templateHTML && !isRedFlagsLoading">
          <template>
            <InputLanguagePreview
              :value="activeLanguage"
              class="max-w-554"
              persistent-hint
              :hint="getLanguagePreviewHint"
              :items="selectedLanguages"
              @input="handleLanguageChange"
            />
            <div class="d-flex align-center justify-space-between" style="max-height: 22px;">
              <div
                :class="
                  redFlags && redFlags.fromAddress && redFlags.fromAddress.isRedFlagged
                    ? 'red-flag-preview-active'
                    : ''
                "
                style="width: calc(100% - 200px);"
              >
                <VIcon
                  v-if="redFlags && redFlags.fromAddress && redFlags.fromAddress.isRedFlagged"
                  color="#f56c6c"
                  style="font-size: 16px;"
                  >mdi-flag</VIcon
                >
                <span class="template-preview__text--title">From: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.fromAddress
                }}</span>
                <RedFlagTooltip
                  v-if="redFlags && redFlags.fromAddress && redFlags.fromAddress.tooltipMessage"
                  :tooltipContent="redFlags.fromAddress.tooltipMessage"
                />
              </div>
              <VBtn
                :ripple="false"
                lass="fw-600"
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
            <div
              :class="
                redFlags && redFlags.fromName && redFlags.fromName.isRedFlagged
                  ? 'red-flag-preview-active'
                  : ''
              "
              style="width: calc(100% - 200px);"
            >
              <VIcon
                v-if="redFlags && redFlags.fromName && redFlags.fromName.isRedFlagged"
                color="#f56c6c"
                style="font-size: 16px;"
                >mdi-flag</VIcon
              >
              <span class="template-preview__text--title">From Name: </span>
              <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
              <RedFlagTooltip
                v-if="redFlags && redFlags.fromName && redFlags.fromName.tooltipMessage"
                :tooltipContent="redFlags.fromName.tooltipMessage"
              />
            </div>
            <div
              :class="
                redFlags && redFlags.name && redFlags.name.isRedFlagged
                  ? 'red-flag-preview-active'
                  : ''
              "
              style="width: calc(100% - 200px);"
            >
              <VIcon
                v-if="redFlags && redFlags.name && redFlags.name.isRedFlagged"
                color="#f56c6c"
                style="font-size: 16px;"
                >mdi-flag</VIcon
              >
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
            <div v-if="emailTemplateParams.ccAddresses.length > 0">
              <span class="template-preview__text--title">CC: </span>
              <span class="template-preview__text--body">{{
                emailTemplateParams.ccAddresses.join(', ')
              }}</span>
              <RedFlagTooltip
                v-if="redFlags && redFlags.ccAddresses && redFlags.ccAddresses.tooltipMessage"
                :tooltipContent="redFlags.ccAddresses.tooltipMessage"
              />
            </div>
            <div
              :class="
                redFlags && redFlags.subject && redFlags.subject.isRedFlagged
                  ? 'red-flag-preview-active'
                  : ''
              "
              style="width: calc(100% - 200px);"
            >
              <VIcon
                v-if="redFlags && redFlags.subject && redFlags.subject.isRedFlagged"
                color="#f56c6c"
                style="font-size: 16px;"
                >mdi-flag</VIcon
              >
              <span class="template-preview__text--subject">Subject: </span>
              <span class="template-preview__text--subject">{{ emailTemplateParams.subject }}</span>
              <RedFlagTooltip
                v-if="redFlags && redFlags.subject && redFlags.subject.tooltipMessage"
                :tooltipContent="redFlags.subject.tooltipMessage"
              />
            </div>
          </template>
        </div>
        <div
          v-if="emailTemplateParams.attachment"
          class="attachment-wrapper position-relative mt-2"
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
        <hr class="mt-4" v-if="!!templateHTML" />
        <div :class="isShowRedFlags ? 'email-template-preview-phishing' : ''">
          <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import KEmailPreview from '@/components/KEmailPreview.vue'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import labels from '@/model/constants/labels'
import { getEmailTemplatePreviewContent, checkRedFlags } from '@/api/phishingsimulator'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import InputLanguagePreview from '../../Inputs/InputLanguagePreview.vue'
import { defaultRedFlags } from '@/components/PhishingScenarios/utils'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'
import EmailTemplatesAILoader from '@/components/EmailTemplates/EmailTemplatesAILoader.vue'
export default {
  name: 'EmailTemplateMultipleLanguagePreviewDialog',
  components: {
    InputLanguagePreview,
    AppDialogFooterWithClose,
    AppDialog,
    AttachmentsPreview,
    KEmailPreview,
    DatatableLoading,
    RedFlagTooltip,
    EmailTemplatesAILoader
  },
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
    }
  },
  data() {
    return {
      labels,
      isPreviewLoading: false,
      emailTemplateParams: {},
      templateHTML: null,
      isIndividualPrintoutButtonDisabled: false,
      selectedLanguages: [],
      activeLanguage: '',
      templates: [],
      redFlags: JSON.parse(JSON.stringify(defaultRedFlags)),
      lastRedFlags: {},
      isShowRedFlags: false,
      isFlaggedStylesEnabled: false,
      isRedFlagsLoading: false,
      flaggedAreaCss: `
        <style>
          .flagged-area {
            position: relative;
            display: inline-block;
            border: 1px solid #e00;
            border-radius: 4px;
            padding-left:2em !important;
            margin: 0.5em 0.1em;
          }
           .flagged-area:not(a):not(button):not(.button) {
            background-color: rgba(255, 0, 0, 0.1);
            padding: 0.2em 2em;
          }

          .flagged-area::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0.5em;
            transform: translateY(-50%);
            width: 1em;
            height: 1em;
            background: url('https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/2ef43b16-8d47-46c6-2d2c-e861a3bb6500/public') no-repeat center/contain;
          }
          .flagged-area:hover::after {
            content: attr(data-flag-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, 0);
            margin-top: 0.4em;
            padding: 4px 8px;
            background:#B83A3A;
            color: #fff;
            font-size: 12px;
            line-height: 1.33;
            font-family:"Open Sans", sans-serif;
            white-space: normal;
            word-break: break-word;
            max-width: 240px;
            min-width: 240px;
            border-radius: 4px;
            z-index: 9999;
          }
          .email-container,.container,.email-container-wrapper{
            overflow:visible !important;
          }
        </style>
      `
    }
  },
  computed: {
    redFlagsText() {
      return this.isShowRedFlags ? 'Hide Red Flags' : 'Show Red Flags'
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
      return this?.isIndividualPrintoutTemplate
        ? labels.IndividualPrintoutTemplatePreview
        : this.title
    },
    subtitle() {
      return this?.selectedRow?.name || ''
    },
    getLanguagePreviewHint() {
      return `This template is available in ${this.selectedLanguages.length || 0} language${
        this.selectedLanguages.length > 1 ? 's' : ''
      }.`
    },
    activeFileName() {
      return this.emailTemplateParams?.attachment?.name || ''
    },
    getSelectedLanguagePayload() {
      return (
        this.templates.find(
          (template) => template.languageTypeResourceId === this.activeLanguage
        ) || {}
      )
    },
    getLoaderTitle() {
      return 'AI Ally is analyzing your email template for red flags'
    },
    getLoaderDescription() {
      return 'The scan may take some time depending on the localization. Please stay on the page while the scan is completed.'
    }
  },
  created() {
    this.callForData()
  },
  methods: {
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
            languages,
            languageTypeName,
            languageTypeResourceId
          } = data
          this.selectedLanguages.push({
            text: languageTypeName,
            value: languageTypeResourceId
          })
          this.activeLanguage = languageTypeResourceId
          this.templates.push({
            languageTypeResourceId,
            fromName,
            fromAddress,
            ccAddresses,
            subject,
            template: data.template,
            isAssistedByAI: data.isAssistedByAI
          })
          if (languages.length) {
            this.selectedLanguages.push(
              ...languages.map((item) => ({
                text: item.languageTypeName,
                value: item.languageTypeResourceId
              }))
            )
            this.templates.push(
              ...languages.map((item) => ({
                languageTypeResourceId: item.languageTypeResourceId,
                fromName: item.fromName,
                fromAddress: item.fromAddress,
                ccAddresses: item.ccAddresses,
                subject: item.subject,
                template: item.template,
                isAssistedByAI: item.isAssistedByAI
              }))
            )
          }
          this.emailTemplateParams = {
            ...this.templates[0],
            name,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null,
            isAssistedByAI: data.isAssistedByAI
          }
          this.templateHTML = this.templates[0].template
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.isPreviewLoading = false
          }, 500)
        })
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleShowRedFlagsClick() {
      this.isShowRedFlags = !this.isShowRedFlags
      this.isFlaggedStylesEnabled = !this.isFlaggedStylesEnabled
      if (this.isShowRedFlags) {
        // Bu dil için red flags daha önce çağrıldı mı kontrol et
        if (
          this.lastRedFlags[this.activeLanguage] &&
          this.lastRedFlags[this.activeLanguage].flags
        ) {
          // Var olan red flags'leri restore et
          this.redFlags = JSON.parse(JSON.stringify(this.lastRedFlags[this.activeLanguage].flags))
          this.updateTemplateWithFlaggedStyles()
          return
        }

        // İlk kez red flags çağrılıyor
        this.isRedFlagsLoading = true
        if (this.$refs.refPreview) {
          this.$refs.refPreview.isEmailGenerating = true
        }
        const currentLanguageData = this.selectedLanguages.find(
          (lang) => lang.value === this.activeLanguage
        )
        const payload = {
          template: this.emailTemplateParams.template || this.templateHTML,
          subject: this.emailTemplateParams.subject,
          fromName: this.emailTemplateParams.fromName,
          fromEmail: this.emailTemplateParams.fromAddress,
          cc: this.emailTemplateParams.ccAddresses,
          attachmentFileName: this.activeFileName,
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
            this.templateHTML = template
            this.lastRedFlags[this.activeLanguage] = {
              flags: JSON.parse(JSON.stringify(redFlags)),
              templates: [],
              textfieldValues: {
                fromName: this.emailTemplateParams.fromName,
                fromAddress: this.emailTemplateParams.fromAddress,
                subject: this.emailTemplateParams.subject,
                attachmentFileName: this.activeFileName
              }
            }

            this.redFlags = JSON.parse(JSON.stringify(redFlags))
            this.updateTemplateWithFlaggedStyles()
          })
          .catch((e) => {
            this.$store.dispatch('common/createSnackBar', {
              message: e?.response?.data?.detail || e?.response?.data?.message,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
            this.isShowRedFlags = false
            this.isFlaggedStylesEnabled = false
            this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
          })
          .finally(() => {
            if (this.$refs.refPreview) {
              this.$refs.refPreview.isEmailGenerating = false
            }
            this.isRedFlagsLoading = false
          })
      } else {
        // CSS stillerini template'den kaldır
        this.lastRedFlags[this.activeLanguage] = {
          flags: JSON.parse(JSON.stringify(this.redFlags)),
          templates: [],
          textfieldValues: {
            fromName: this.emailTemplateParams.fromName,
            fromAddress: this.emailTemplateParams.fromAddress,
            subject: this.emailTemplateParams.subject,
            attachmentFileName: this.activeFileName
          }
        }
        this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
        this.updateTemplateWithFlaggedStyles()
      }
    },
    handleLanguageChange(val) {
      // Eski activeLanguage için red flags'leri kaydet
      if (this.activeLanguage && this.isShowRedFlags) {
        this.lastRedFlags[this.activeLanguage] = {
          flags: JSON.parse(JSON.stringify(this.redFlags)),
          templates: [],
          textfieldValues: {
            fromName: this.emailTemplateParams.fromName,
            fromAddress: this.emailTemplateParams.fromAddress,
            subject: this.emailTemplateParams.subject,
            attachmentFileName: this.activeFileName
          }
        }
      }

      // Yeni language data'sını set et
      this.emailTemplateParams = {
        ...this.emailTemplateParams,
        ...this.templates.find((item) => item.languageTypeResourceId === val)
      }
      this.templateHTML = this.emailTemplateParams.template

      // Yeni dil için red flags durumunu kontrol et
      if (this.isShowRedFlags) {
        // Red flags aktif ise, yeni dil için red flags varsa restore et
        if (this.lastRedFlags[val] && this.lastRedFlags[val].flags) {
          this.redFlags = JSON.parse(JSON.stringify(this.lastRedFlags[val].flags))
          this.isFlaggedStylesEnabled = true
          this.updateTemplateWithFlaggedStyles()
        } else {
          // Yeni dilde red flags yok, isShowRedFlags'i false yap
          this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
          this.isFlaggedStylesEnabled = false
          this.isShowRedFlags = false
        }
      } else {
        // Red flags aktif değil, default state
        this.redFlags = JSON.parse(JSON.stringify(defaultRedFlags))
        this.isFlaggedStylesEnabled = false
      }
      this.activeLanguage = val
    },
    compareRedFlags() {
      let differentProperties = {}
      if (Object.keys(this.lastRedFlags).length === 0) return false
      const { templates = [], textfieldValues = {} } = this.lastRedFlags[this.activeLanguage] || {}
      const { fromName, fromAddress, subject, attachmentFileName } = textfieldValues

      if (fromName !== this.emailTemplateParams.fromName) {
        differentProperties.fromName = this.emailTemplateParams.fromName
      }
      if (fromAddress !== this.emailTemplateParams.fromAddress) {
        differentProperties.fromAddress = this.emailTemplateParams.fromAddress
      }
      if (subject !== this.emailTemplateParams.subject) {
        differentProperties.subject = this.emailTemplateParams.subject
      }
      if (attachmentFileName !== this.activeFileName) {
        differentProperties.attachmentFileName = this.activeFileName
      }
      const currentTemplate = this.emailTemplateParams.template || this.templateHTML
      const templateExists = templates.find(
        (template) => template.trim() === currentTemplate?.trim()
      )
      if (!templateExists) {
        differentProperties.template = currentTemplate
      }
      if (Object.keys(differentProperties).length === 0) {
        return true
      }

      return differentProperties
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
      if (!this.templateHTML) return

      if (this.isFlaggedStylesEnabled) {
        this.templateHTML = this._addFlaggedStylesToTemplate(this.templateHTML)
      } else {
        this.templateHTML = this._removeFlaggedStylesFromTemplate(this.templateHTML)
        if (this.lastRedFlags[this.activeLanguage]) {
          this.lastRedFlags[this.activeLanguage].templates.push(this.templateHTML)
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
      if (template.includes(this.flaggedAreaCss.trim())) {
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
        let templateWithCss = template.replace(/<\/head>/i, `${this.flaggedAreaCss}</head>`)
        return this._injectScriptIntoBody(templateWithCss)
      }
      let templateWithCss = template.replace(
        /<html[\s\S]*?>/i,
        `$&<head>${this.flaggedAreaCss}</head>`
      )
      return this._injectScriptIntoBody(templateWithCss)
    },
    _prependCssToBodyContent(template) {
      let templateWithCss = `${this.flaggedAreaCss}${template}`
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
      const cssToRemove = this.flaggedAreaCss.trim()
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
    }
  }
}
</script>
