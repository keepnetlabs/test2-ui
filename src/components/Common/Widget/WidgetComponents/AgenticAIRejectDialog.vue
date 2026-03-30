<template>
  <div>
    <div
      v-if="status"
      class="agentic-ai-confirm-dialog__overlay"
      @click.stop="$emit('cancel')"
    ></div>
    <AppDialog
      :status="status"
      :icon="action === 'retry' ? 'mdi-refresh' : 'mdi-close'"
      :title="action === 'retry' ? 'Why are you retrying this action?' : 'Why are you declining this action?'"
      class-name="agentic-ai-confirm-dialog"
      custom-size="560"
      hide-overlay
      @changeStatus="handleChangeStatus"
    >
      <template #app-dialog-body>
        <p class="agentic-ai-reject-dialog__description">
          Please explain in 1–2 sentences. Your feedback helps improve AI recommendations.
        </p>
        <div v-if="action === 'retry'" class="agentic-ai-reject-dialog__suggestions">
          <div class="agentic-ai-reject-dialog__suggestions-label">Quick reasons</div>
          <div class="agentic-ai-reject-dialog__chips">
            <v-chip
              v-for="reasonOption in suggestedReasons"
              :key="reasonOption.key"
              :outlined="!isSuggestedReasonSelected(reasonOption.key)"
              small
              label
              class="agentic-ai-reject-dialog__chip"
              :color="getSuggestedReasonColor(reasonOption.key)"
              :text-color="getSuggestedReasonTextColor(reasonOption.key)"
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
          :placeholder="action === 'retry' ? 'e.g. The previous attempt failed due to a temporary issue.' : 'e.g. This user already completed this training last month'"
          class="agentic-ai-reject-dialog__textarea mt-2"
          :counter="maxLength"
          :rules="[rules.minLength]"
          hide-details="auto"
        />
      </template>
      <template #app-dialog-footer>
        <AppDialogFooter
          cancel-button-id="btn-reject-dialog-cancel"
          confirm-button-id="btn-reject-dialog-confirm"
          cancel-button-text="CANCEL"
          :action-button-text="confirmButtonText"
          :action-button-color="action === 'retry' ? '#a45716' : '#f56c6c'"
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
    key: "temporary-issue",
    label: "Temporary issue",
    template:
      "Please retry this action because the previous attempt appears to have failed due to a temporary issue."
  },
  {
    key: "wrong-language",
    label: "Wrong language",
    template:
      "Please retry this action with the correct language because the previous version did not match the user's preferred language."
  },
  {
    key: "scenario-mismatch",
    label: "Scenario mismatch",
    template:
      "Please retry this action with a more suitable scenario because the previous recommendation did not match the user's context."
  },
  {
    key: "needs-regeneration",
    label: "Needs regeneration",
    template:
      "Please retry this action and generate a fresh recommendation because the previous output was not suitable."
  }
];

export default {
  name: "AgenticAIRejectDialog",
  components: { AppDialog, AppDialogFooter },
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
      default: "reject"
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
    confirmButtonText() {
      return this.action === "retry" ? "RETRY" : "DECLINE";
    },
    suggestedReasons() {
      return this.action === "retry" ? RETRY_SUGGESTED_REASONS : [];
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
    getSuggestedReasonColor(reasonKey) {
      return this.isSuggestedReasonSelected(reasonKey) ? "#a45716" : "#D0D5DD";
    },
    getSuggestedReasonTextColor(reasonKey) {
      return this.isSuggestedReasonSelected(reasonKey) ? "#FFFFFF" : "#475467";
    },
    handleSuggestedReasonClick(reasonOption) {
      if (!reasonOption) return;

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

<style scoped>
.agentic-ai-reject-dialog__description {
  margin-bottom: 0;
}

.agentic-ai-reject-dialog__suggestions {
  margin-top: 16px;
}

.agentic-ai-reject-dialog__suggestions-label {
  margin-bottom: 10px;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
}

.agentic-ai-reject-dialog__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.agentic-ai-reject-dialog__chip {
  font-weight: 600;
}
</style>
