<template>
  <AppDialog
    :status="status"
    :title="dialogTitle"
    class-name="send-with-ai-dialog-popup"
    custom-size="760"
    icon="mdi-creation"
    icon-color="#2196f3"
    @changeStatus="$emit('closeOverlay', $event)"
  >
    <template #app-dialog-body>
      <div class="send-with-ai-dialog__body">
        <p class="send-with-ai-dialog__text">
          {{ dialogDescription }}
        </p>
        <div class="send-with-ai-dialog__options">
          <div class="send-with-ai-dialog__option-item">
            <v-checkbox
              v-model="localOptions.training"
              color="#2196f3"
              class="send-with-ai-dialog__checkbox"
              hide-details
              aria-label="Training"
            />
            <div class="send-with-ai-dialog__option-content">
              <p class="send-with-ai-dialog__option-label">Training</p>
              <p class="send-with-ai-dialog__option-description">
                Automatically assign personalized training based on the user's security level and
                weaknesses
              </p>
            </div>
          </div>
          <div class="send-with-ai-dialog__option-item">
            <v-checkbox
              v-model="localOptions.phishing"
              color="#2196f3"
              class="send-with-ai-dialog__checkbox"
              hide-details
              :aria-label="simulationOptionLabel"
            />
            <div class="send-with-ai-dialog__option-content">
              <p class="send-with-ai-dialog__option-label">{{ simulationOptionLabel }}</p>
              <p class="send-with-ai-dialog__option-description">
                {{ simulationOptionDescription }}
              </p>
            </div>
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
        :action-button-text="confirmButtonText"
        :confirm-button-disabled="!localOptions.training && !localOptions.phishing"
        :confirm-button-loading="submitLoading"
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
    },
    mode: {
      type: String,
      default: 'autonomous'
    },
    targetType: {
      type: String,
      default: 'user'
    },
    /** Parent sets true while autonomous / batch API is in flight (disables confirm + shows loading). */
    submitLoading: {
      type: Boolean,
      default: false
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
  computed: {
    isApprovalMode() {
      return this.mode === 'approval'
    },
    targetContextLabel() {
      return this.targetType === 'group' ? 'group' : 'user'
    },
    deliveryTargetLabel() {
      return this.targetType === 'group' ? 'users in the selected group' : 'the selected user'
    },
    deliveryTargetLabelForSentence() {
      return this.targetType === 'group' ? 'Users in the selected group' : 'The selected user'
    },
    personalizationDescription() {
      return this.targetType === 'group'
        ? "each user's individual risk signals, behavior, and weaknesses"
        : "the user's risk signals, behavior, and weaknesses"
    },
    dialogTitle() {
      return this.isApprovalMode ? 'Send with AI for Approval' : 'Run with AI'
    },
    dialogDescription() {
      if (this.isApprovalMode) {
        return `Select the actions to submit for approval for this ${this.targetContextLabel}. Agentic AI will personalize the selected actions based on ${this.personalizationDescription}. No emails will be sent until the request is approved.`
      }

      return `Select the actions to generate for this ${this.targetContextLabel}. Agentic AI will personalize the selected actions based on ${this.personalizationDescription}. This process will take 3-5 minutes and ${this.deliveryTargetLabel} will receive notifications via email.`
    },
    simulationOptionLabel() {
      return 'Phishing or Quishing Simulation'
    },
    simulationOptionDescription() {
      return 'Automatically send personalized phishing or quishing simulations to help users identify and report threats'
    },
    confirmButtonText() {
      return this.isApprovalMode ? 'Send with AI for Approval' : 'Run with AI'
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
    }
  }
}
</script>
