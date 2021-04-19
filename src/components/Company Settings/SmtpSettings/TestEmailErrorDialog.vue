<template>
  <app-dialog
    v-if="isShowErrorMessage"
    title="Error Occurred"
    icon="mdi-alert"
    className="integration-error-message-popup"
    title-id="text--smtp-settings-test-email-error-popup-title"
    :status="isShowErrorMessage"
    :body="errorMessage"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn-close--phishing-reporter-settings-download-history-modal"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleCloseDialog"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'TestEmailErrorDialog',
  components: { AppDialog },
  props: {
    isShowErrorMessage: {
      type: Boolean
    },
    errorMessage: {
      type: String
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss">
.integration-error-message-popup {
  .k-dialog__header .v-cart-icon-wrapper {
    display: block;
    justify-content: center;
    align-items: center;
    display: flex;
    background: #f56c6c !important;
    border-color: #f56c6c !important;
    i {
      color: white !important;
    }
  }
}
</style>
