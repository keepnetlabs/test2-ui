<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getTitle"
    icon-name="mdi-send"
    confirm-button-id="btn-save--certificates-template-modal"
    cancel-button-id="btn-cancel--certificates-template-modal"
    title-id="text--certificates-template-modal-title"
    :save-disable="isDownloading"
    @closeOverlay="handleClose"
    @submit="handleSubmit"
  >
    <template #overlay-body>
      <AppModalBodyHeader :title="getTitle" :sub-title="getSubtitle" />
      <v-form ref="refForm" lazy-validation>
        <FormGroup has-hint title="Pdf Name">
          <InputEntityName v-model.trim="downloadName" id="input--pdf-name" entity-name="pdf" />
        </FormGroup>
        <div v-if="isDownloading" class="d-flex items-center gap-2">
          <img
            src="../../assets/img/spinner-blue.svg"
            class="add-in-settings__spinner"
            alt="spinner"
          />
          <span style="font-size: 14px; text-transform: capitalize;">
            Your PDF file is generating...
          </span>
        </div>
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import AppModal from '@/components/AppModal.vue'

export default {
  name: 'ExecutiveReportDownloadModal',
  components: {
    AppModal,
    FormGroup,
    AppModalBodyHeader,
    InputEntityName
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
    }
  },
  data() {
    return {
      downloadName: 'Executive Report'
    }
  },
  computed: {
    getTitle() {
      return this.isPreview ? 'Preview Executive Report' : 'Download Executive Report'
    },
    getSubtitle() {
      return this.isPreview ? 'Preview Executive Report' : 'Download Executive Report'
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleSubmit() {
      this.$emit('on-submit', this.downloadName)
    }
  }
}
</script>
