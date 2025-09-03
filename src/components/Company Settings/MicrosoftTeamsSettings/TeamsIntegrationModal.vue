<template>
  <AppDialog
    icon="mdi-link"
    title="Enable Microsoft Teams Integration"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="text-primary-color">
        <div class="mb-4">
          If you are the owner or admin of Teams, click "Enable Now" to grant access immediately.
        </div>
        <div>
          To have someone else grant access later, click "Copy Link" and send it to an admin.
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex justify-space-between">
        <VBtn
          text
          color="error"
          class="mr-2 fw-600"
          @click="handleCancel"
        >
          CANCEL
        </VBtn>
        <div>
        <VBtn
          text
          color="#00BCD4"
          class="mr-2 fw-600"
          @click="handleCopyLink"
        >
          COPY LINK
        </VBtn>
        <VBtn
          text
          color="#2196F3"
          class="fw-600"
          :disabled="isActionButtonDisabled"
          @click="handleEnableNow"
        >
          ENABLE NOW
        </VBtn>
      </div>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'

export default {
  name: 'TeamsIntegrationModal',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isActionButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleCancel() {
      this.$emit('on-cancel')
    },
    handleCopyLink() {
      this.$emit('on-copy-link')
    },
    handleEnableNow() {
      this.$emit('on-enable')
    }
  }
}
</script>