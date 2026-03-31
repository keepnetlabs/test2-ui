<template>
  <div>
    <div
      v-if="status"
      class="agentic-ai-confirm-dialog__overlay"
      @click.stop="$emit('cancel')"
    ></div>
    <AppDialog
      :status="status"
      icon="mdi-refresh"
      title="Why are you retrying?"
      class-name="agentic-ai-confirm-dialog"
      custom-size="560"
      hide-overlay
      @changeStatus="handleChangeStatus"
    >
      <template #app-dialog-body>
        <p class="agentic-ai-reject-dialog__description">
          Please explain in 1–2 sentences what went wrong. Your feedback helps improve AI recommendations.
        </p>
        <div class="agentic-ai-reject-dialog__suggestions">
          <div class="agentic-ai-reject-dialog__suggestions-label">Suggested reasons</div>
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
          placeholder="e.g. The scenario did not match this user’s department, or the content failed to load in preview."
          class="agentic-ai-reject-dialog__textarea mt-2"
          :counter="maxLength"
          :rules="[rules.minLength]"
          hide-details="auto"
        />
      </template>
      <template #app-dialog-footer>
        <AppDialogFooter
          cancel-button-id="btn-retry-feedback-dialog-cancel"
          confirm-button-id="btn-retry-feedback-dialog-confirm"
          cancel-button-text="CANCEL"
          action-button-text="RETRY"
          action-button-color="#a45716"
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

const RETRY_SUGGESTED_REASONS = [
  {
    key: "delivery-or-technical",
    label: "Delivery / technical issue",
    template:
      "The previous attempt failed to deliver or render correctly (for example the message or landing page did not load). Please retry with a fresh run."
  },
  {
    key: "language-or-locale",
    label: "Language or locale mismatch",
    template:
      "The recommended content did not match this user’s preferred language or regional settings. Please regenerate with the correct localization."
  },
  {
    key: "audience-or-risk-fit",
    label: "Wrong fit for user or risk level",
    template:
      "The scenario or training was not appropriate for this user’s role, department, or risk profile. Please retry with a better-matched recommendation."
  },
  {
    key: "regenerate-quality",
    label: "Regenerate (quality or tone)",
    template:
      "The previous output was not suitable in quality, tone, or alignment with our standards. Please generate a new recommendation for this user."
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
          `Please write at least ${MIN_LENGTH} characters`
      }
    };
  },
  computed: {
    suggestedReasons() {
      return RETRY_SUGGESTED_REASONS;
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
      this.$emit("confirm", this.reason.trim());
    }
  }
};
</script>
