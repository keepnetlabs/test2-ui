<template>
  <AppDialog
    v-if="status"
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    title="Email Template Preview"
    :subtitle="selectedTemplateHeader"
    :status="status"
    @changeStatus="$emit('close')"
  >
    <template v-slot:app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <div v-show="!isPreviewLoading" class="template-preview">
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
            <span
              class="template-preview__text--title"
              style="
                font-style: normal;
                font-weight: 600;
                font-size: 20px;
                line-height: 24px;
                color: #383b41;
              "
              >Subject:
            </span>
            <span
              class="template-preview__text--body--bold"
              style="
                font-style: normal;
                font-weight: 600;
                font-size: 20px;
                line-height: 24px;
                color: #383b41;
              "
              >{{ emailTemplateParams.subject }}</span
            >
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
        <hr class="mt-2" v-if="!!templateHTML" />
        <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
      </div>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--email-preview-popup"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="$emit('close')"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import KEmailPreview from '@/components/KEmailPreview'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'

export default {
  name: 'CallbackEmailTemplatePreview',
  components: { AppDialog, DatatableLoading, KEmailPreview, AttachmentsPreview },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isPreviewLoading: {
      type: Boolean,
      default: false
    },
    selectedTemplateHeader: {
      type: String
    },
    templateHTML: {
      type: String
    },
    emailTemplateParams: {
      type: Object
    }
  }
}
</script>
