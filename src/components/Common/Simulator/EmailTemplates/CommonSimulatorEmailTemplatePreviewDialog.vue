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
            <span class="template-preview__text--body">{{ emailTemplateParams.fromAddress }}</span>
          </div>
          <div>
            <span class="template-preview__text--subject">Subject: </span>
            <span class="template-preview__text--subject">{{ emailTemplateParams.subject }}</span>
          </div>
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

export default {
  name: 'CommonSimulatorEmailTemplatePreviewDialog',
  components: {
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
      isPreviewLoading: false,
      emailTemplateParams: {},
      templateHTML: null
    }
  },
  computed: {
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
            name,
            difficultyResourceId,
            phishingFileName,
            subject
          } = data
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
    }
  }
}
</script>
