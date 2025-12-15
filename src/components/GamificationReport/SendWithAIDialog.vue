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
          Select the actions to perform for this user. This process will take 3-5 minutes and the
          selected user will receive notifications via email:
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
              Automatically assign personalized training based on the user's security level and
              weaknesses
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
          <div
            v-if="localOptions.training && localOptions.phishing"
            class="send-with-ai-dialog__switch-container"
          >
            <v-switch
              v-model="sendAfterPhishingSimulation"
              label="Send training after simulation fails"
              color="#2196f3"
              class="send-with-ai-dialog__switch"
              hide-details
            />
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
      },
      sendAfterPhishingSimulation: false
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
      const confirmData = {
        ...this.localOptions,
        sendAfterPhishingSimulation: this.sendAfterPhishingSimulation
      }
      this.$emit('confirm', confirmData)

      // Close dialog
      this.$emit('closeOverlay', false)

      // Show success toast after dialog closes
      this.$nextTick(() => {
        this.$store.dispatch('common/createSnackBar', {
          message:
            'Autonomous AI process started. The selected user will receive emails within 3-5 minutes.',
          icon: 'mdi-check-circle',
          color: '#4caf50'
        })
      })
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

  &__checkbox {
    margin: 0;
  }

  &__option-description {
    font-size: 12px;
    color: #666d75;
    margin: 0;
    line-height: 1.5;
    margin-left: 32px;
  }

  &__switch-container {
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
  }

  &__switch {
    margin: 0;
    max-width: 100%;
  }
}
</style>
