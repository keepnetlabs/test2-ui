<template>
  <AppDialog
    :status="status"
    title="Autonomous AI"
    icon="mdi-creation"
    icon-color="#2196f3"
    @changeStatus="$emit('closeOverlay', $event)"
  >
    <template #app-dialog-body>
      <div class="send-with-ai-dialog__body">
        <p class="send-with-ai-dialog__text">
          Select the actions to perform for this user. This process will take 3-5 minutes and the selected user will receive notifications via email:
        </p>
        <div class="send-with-ai-dialog__options">
          <div class="send-with-ai-dialog__option-item">
            <div class="send-with-ai-dialog__option-checkbox">
              <v-checkbox
                v-model="localOptions.training"
                label="Training"
                color="#2196f3"
                class="send-with-ai-dialog__checkbox"
              />
            </div>
            <p class="send-with-ai-dialog__option-description">
              Automatically assign personalized training based on the user's security level and weaknesses
            </p>
          </div>
          <div class="send-with-ai-dialog__option-item">
            <div class="send-with-ai-dialog__option-checkbox">
              <v-checkbox
                v-model="localOptions.phishing"
                label="Phishing Simulation"
                color="#2196f3"
                class="send-with-ai-dialog__checkbox"
              />
            </div>
            <p class="send-with-ai-dialog__option-description">
              Automatically send targeted phishing emails to help users identify and report threats
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--send-with-ai"
        confirm-button-id="btn-confirm--send-with-ai"
        action-button-text="Start Autonomous AI"
        :confirm-button-disabled="!localOptions.training && !localOptions.phishing"
        @handleClose="$emit('closeOverlay', false)"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

export default {
  name: 'SendWithAIDialog',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({
        training: true,
        phishing: true
      })
    }
  },
  data() {
    return {
      localOptions: {
        training: true,
        phishing: true
      }
    }
  },
  watch: {
    options: {
      handler(newVal) {
        this.localOptions = { ...newVal }
      },
      deep: true
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm', this.localOptions)

      // Show success toast
      this.$store.commit('snackbar/setSnackbar', {
        show: true,
        message: 'Autonomous AI process started. The selected user will receive emails within 3-5 minutes.',
        type: 'success',
        timeout: 5000
      })

      // Close dialog
      this.$emit('closeOverlay', false)
    }
  }
}
</script>

<style scoped>
.send-with-ai-dialog {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__text {
    font-size: 14px;
    color: #383b41;
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.4px;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f5f7fa;
    padding: 16px;
    border-radius: 8px;
  }

  &__option-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__option-checkbox {
    ::v-deep .v-input__slot {
      margin-bottom: 0;
    }
  }

  &__checkbox {
    margin: 0;

    ::v-deep .v-input__slot {
      margin-bottom: 0;
    }

    ::v-deep .v-input--checkbox {
      margin-top: 0;
    }
  }

  &__option-description {
    font-size: 12px;
    color: #666d75;
    margin: 0;
    line-height: 1.5;
    margin-left: 32px;
  }
}
</style>
