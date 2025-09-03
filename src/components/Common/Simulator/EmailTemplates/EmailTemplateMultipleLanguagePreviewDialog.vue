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
      <div v-if="!isPreviewLoading" class="template-preview">
        <div class="template-preview__text" v-if="!!templateHTML">
          <template>
            <InputLanguagePreview
              v-model="activeLanguage"
              class="max-w-554"
              persistent-hint
              :hint="getLanguagePreviewHint"
              :items="selectedLanguages"
              @input="handleLanguageChange"
            />
            <div class="d-flex align-center justify-space-between">
              <div :class="redFlags && redFlags.fromAddress && redFlags.fromAddress.isRedFlagged ? 'red-flag-active' : ''">
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
              :style="getRedFlagButtonStyle"
              @click="handleShowRedFlagsClick"
            >
              <VIcon>mdi-flag</VIcon>
              <span class="button-new__text fw-600 ml-1" style="text-transform: none;">{{
                redFlagsText
              }}</span>
            </VBtn>
            </div>
            <div>
              <span class="template-preview__text--title">From Name: </span>
              <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
            </div>
            <div>
              <span class="template-preview__text--title">Template Name: </span>
              <span class="template-preview__text--body">{{ emailTemplateParams.name }}</span>
              <VTooltip v-if="false" bottom>
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
            </div>
            <div>
              <span class="template-preview__text--subject">Subject: </span>
              <span class="template-preview__text--subject">{{ emailTemplateParams.subject }}</span>
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
              :isEmailTemplate="true"
            />
          </div>
        </div>
        <hr class="mt-4" v-if="!!templateHTML" />
        <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
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
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { difficulties } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import InputLanguagePreview from '../../Inputs/InputLanguagePreview.vue'
import { defaultRedFlags } from '@/components/PhishingScenarios/utils'
export default {
  name: 'EmailTemplateMultipleLanguagePreviewDialog',
  components: {
    InputLanguagePreview,
    AppDialogFooterWithClose,
    AppDialog,
    AttachmentsPreview,
    KEmailPreview,
    DatatableLoading
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
      isFlaggedStylesEnabled:false
    }
  },
  computed: {
    getRedFlagButtonStyle() {
      return {
        opacity: this.isShowRedFlags ? 0.5 : 1,
        pointerEvents: this.isShowRedFlags ? 'none' : ''
      }
    },
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
    },
    handleLanguageChange(val) {
      this.emailTemplateParams = {
        ...this.emailTemplateParams,
        ...this.templates.find((item) => item.languageTypeResourceId === val)
      }
      this.templateHTML = this.emailTemplateParams.template
    }
  }
}
</script>
