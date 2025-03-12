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
              persistent-hint
              hint="This template is available in 35 languages."
              @input="handleLanguageChange"
            />
            <div>
              <span class="template-preview__text--title">From: </span>
              <span class="template-preview__text--body">{{
                emailTemplateParams.fromAddress
              }}</span>
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
            <div v-if="isPhishing && emailTemplateParams.ccAddresses.length > 0">
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
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import QuishingService from '@/api/quishing'
import InputLanguagePreview from '../../Inputs/InputLanguagePreview.vue'

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
      isIndividualPrintoutButtonDisabled: false
    }
  },
  computed: {
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
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
            subject
          } = data
          this.emailTemplateParams = {
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
            isAssistedByAI: data.isAssistedByAI
          }
          if (this.type === SCENARIO_TYPES.QUISHING)
            data.template = data?.template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.templateHTML = data.template
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
    handleLanguageChange(val) {
      console.log('val', val)
    }
  }
}
</script>
