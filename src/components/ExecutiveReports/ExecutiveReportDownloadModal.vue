<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getTitle"
    :icon-name="getIcon"
    class-name="executive-report-download-modal"
    confirm-button-id="btn-save--certificates-template-modal"
    cancel-button-id="btn-cancel--certificates-template-modal"
    title-id="text--certificates-template-modal-title"
    :save-disable="isDownloading"
    @closeOverlay="handleClose"
    @submit="handleSubmit"
  >
    <template #overlay-body>
      <div class="executive-report-wait">
        <div class="executive-report-wait-icon">
          <div v-if="!isCreated" class="d-flex items-center gap-2">
            <img
              src="../../assets/img/spinner-blue.svg"
              class="add-in-settings__spinner"
              alt="spinner"
            />
          </div>
          <div v-else>
            <VIcon color="#2196f3">mdi-checkbox-marked-circle</VIcon>
          </div>
        </div>
        <div class="executive-report-wait-title">{{ getWaitTitle }}</div>
        <div class="executive-report-wait-text">{{ getWaitSubtitle }}</div>
        <div class="executive-report-wait-text">{{ getWaitDescription }}</div>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal.vue'

export default {
  name: 'ExecutiveReportDownloadModal',
  components: {
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    isDownloading: {
      type: Boolean,
      default: false
    },
    isCreated: {
      type: Boolean,
      default: false
    },
    isParentLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    getTitle() {
      return this.isPreview ? 'Preview PDF' : 'Download PDF'
    },
    getSubtitle() {
      return this.isPreview ? 'Preview Executive Report' : 'Download Executive Report'
    },
    getIcon() {
      return this.isPreview ? 'mdi-eye' : 'mdi-download'
    },
    getWaitTitle() {
      if (this.isPreview) return this.isCreated ? 'PDF Preparation Complete' : 'PDF Preparation'
      return this.isCreated ? 'PDF Generated' : 'PDF Generating'
    },
    getWaitSubtitle() {
      if (this.isPreview)
        return this.isCreated
          ? 'Your PDF report has been successfully prepared and is ready for preview.'
          : 'We are preparing your PDF report. This might take a few moments.'
      return this.isCreated
        ? 'Your PDF report has been successfully prepared and is ready for download.'
        : 'We are generating your PDF report. This might take a few moments.'
    },
    getWaitDescription() {
      return 'Thank you for your patience.'
    }
  },
  watch: {
    isParentLoading(isLoading) {
      if (!this.$route.params.showDownloadModal && !isLoading) return
      this.handleSubmit()
    }
  },
  mounted() {
    if (this.$route.params.showDownloadModal) return
    this.handleSubmit()
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleSubmit() {
      this.$emit('on-submit')
    }
  }
}
</script>
