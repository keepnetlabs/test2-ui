<template>
  <div>
    <div
      v-if="status"
      class="agentic-ai-confirm-dialog__overlay"
      @click.stop="$emit('cancel')"
    ></div>
    <AppDialog
      :status="status"
      :icon="dialogIcon"
      :title="dialogTitle"
      class-name="agentic-ai-confirm-dialog"
      custom-size="560"
      hide-overlay
      @changeStatus="handleChangeStatus"
    >
      <template #app-dialog-body>
        <p class="agentic-ai-reject-dialog__description">
          {{ dialogDescription }}
        </p>
        <div class="agentic-ai-reject-dialog__suggestions">
          <div class="agentic-ai-reject-dialog__suggestions-label">Suggested responses</div>
          <div class="agentic-ai-reject-dialog__chips">
            <v-chip
              v-for="reasonOption in suggestedReasons"
              :key="reasonOption.key"
              outlined
              small
              label
              class="agentic-ai-reject-dialog__chip"
              :class="{
                'agentic-ai-reject-dialog__chip--selected': isSuggestedReasonSelected(reasonOption.key)
              }"
              @click="handleSuggestedReasonClick(reasonOption)"
            >
              {{ reasonOption.label }}
            </v-chip>
          </div>
        </div>
        <v-textarea
          v-model="reason"
          outlined
          dense
          no-resize
          rows="5"
          :placeholder="textareaPlaceholder"
          class="agentic-ai-reject-dialog__textarea mt-2"
          :counter="maxLength"
          :rules="[rules.minLength]"
          hide-details="auto"
        />
      </template>
      <template #app-dialog-footer>
        <AppDialogFooter
          :cancel-button-id="cancelButtonId"
          :confirm-button-id="confirmButtonId"
          cancel-button-text="CANCEL"
          :action-button-text="confirmButtonText"
          :action-button-color="actionButtonColor"
          cancel-button-color="#383b41"
          :confirm-button-disabled="!isValid || loading"
          @handleClose="$emit('cancel')"
          @handleConfirm="handleConfirm"
        />
      </template>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from "@/components/AppDialog.vue";
import AppDialogFooter from "@/components/SmallComponents/AppDialogFooter.vue";

const MIN_LENGTH = 15;
const MAX_LENGTH = 500;

/** Shown for **Retry** — user feedback; API receives `declineForRetry: true` before the autonomous retry step. */
const RETRY_SUGGESTED_REASONS = [
  {
    key: "delivery-or-technical",
    label: "Delivery / technical",
    template:
      "The previous attempt did not deliver or render correctly (for example the message or landing page failed to load). Requesting a new run with corrected delivery."
  },
  {
    key: "language-or-locale",
    label: "Language / locale",
    template:
      "The recommendation did not match this recipient’s language or regional settings. Requesting a regenerated version with the correct localization."
  },
  {
    key: "audience-or-risk-fit",
    label: "Audience / risk fit",
    template:
      "The scenario or training is not appropriate for this recipient’s role, department, or risk profile. Requesting a better-aligned recommendation."
  },
  {
    key: "quality-or-tone",
    label: "Quality / tone",
    template:
      "The output did not meet our standards for quality, tone, or alignment with organizational messaging. Requesting a new recommendation."
  }
];

/** Shown for **Decline** — permanent decline only; API sends `declineForRetry: false`. */
const DECLINE_SUGGESTED_REASONS = [
  {
    key: "not-relevant",
    label: "Not a fit",
    template:
      "This recommendation does not match the recipient’s role, department, or risk level. Declining per our review criteria."
  },
  {
    key: "policy-or-compliance",
    label: "Policy / compliance",
    template:
      "The proposed content or approach does not meet our security awareness or compliance requirements. Declining this recommendation."
  },
  {
    key: "wrong-channel-or-timing",
    label: "Channel / timing",
    template:
      "The suggested delivery channel or schedule is not appropriate for this recipient. Declining this recommendation."
  },
  {
    key: "manual-handling",
    label: "Manual handling",
    template:
      "This case will be managed outside of automated recommendations. Declining this automated action."
  }
];

export default {
  name: "AgenticAIRejectDialog",
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    /** `retry` | `decline` | `declineAll` — copy and primary action only. */
    action: {
      type: String,
      default: "retry"
    }
  },
  data() {
    return {
      reason: "",
      selectedSuggestedReasonKey: null,
      maxLength: MAX_LENGTH,
      rules: {
        minLength: (v) =>
          (v && v.trim().length >= MIN_LENGTH) ||
          `Enter at least ${MIN_LENGTH} characters.`
      }
    };
  },
  computed: {
    isRetryAction() {
      return this.action === "retry";
    },
    dialogIcon() {
      return this.isRetryAction ? "mdi-refresh" : "mdi-close";
    },
    dialogTitle() {
      if (this.isRetryAction) return "Provide feedback to retry";
      if (this.action === "declineAll") return "Decline all pending recommendations";
      return "Decline recommendation";
    },
    dialogDescription() {
      if (this.isRetryAction) {
        return "Briefly describe why this recommendation should be regenerated. Your feedback is used to request a new run and to improve future suggestions.";
      }
      if (this.action === "declineAll") {
        return "Provide a reason for declining every pending item in this batch. Declined items will not be executed.";
      }
      return "Provide a reason for declining. The recommendation will not run and will be recorded as declined.";
    },
    textareaPlaceholder() {
      if (this.isRetryAction) {
        return "For example: content did not match the recipient’s department, or the preview failed to load.";
      }
      return "For example: content is not appropriate for this audience, or it conflicts with our awareness program policy.";
    },
    suggestedReasons() {
      return this.isRetryAction ? RETRY_SUGGESTED_REASONS : DECLINE_SUGGESTED_REASONS;
    },
    confirmButtonText() {
      if (this.isRetryAction) return "RETRY";
      if (this.action === "declineAll") return "DECLINE ALL";
      return "DECLINE";
    },
    actionButtonColor() {
      return this.isRetryAction ? "#a45716" : "#c62828";
    },
    cancelButtonId() {
      if (this.isRetryAction) return "btn-retry-feedback-dialog-cancel";
      if (this.action === "declineAll") return "btn-decline-all-feedback-dialog-cancel";
      return "btn-decline-feedback-dialog-cancel";
    },
    confirmButtonId() {
      if (this.isRetryAction) return "btn-retry-feedback-dialog-confirm";
      if (this.action === "declineAll") return "btn-decline-all-feedback-dialog-confirm";
      return "btn-decline-feedback-dialog-confirm";
    },
    isValid() {
      return this.reason.trim().length >= MIN_LENGTH;
    }
  },
  watch: {
    status(val) {
      if (!val) this.resetDialogState();
    },
    action() {
      this.resetDialogState();
    }
  },
  methods: {
    resetDialogState() {
      this.reason = "";
      this.selectedSuggestedReasonKey = null;
    },
    isSuggestedReasonSelected(reasonKey) {
      return this.selectedSuggestedReasonKey === reasonKey;
    },
    handleSuggestedReasonClick(reasonOption) {
      if (!reasonOption) return;
      this.selectedSuggestedReasonKey = reasonOption.key;
      this.reason = reasonOption.template;
    },
    handleChangeStatus(value) {
      if (!value) this.$emit("cancel");
    },
    handleConfirm() {
      if (!this.isValid) return;
      const trimmed = this.reason.trim();
      /** Retry: `declineForRetry: true` for the reject leg; Decline: `false` only (no retry path in this dialog). */
      this.$emit("confirm", {
        reason: trimmed,
        declineForRetry: this.isRetryAction
      });
    }
  }
};
</script>
