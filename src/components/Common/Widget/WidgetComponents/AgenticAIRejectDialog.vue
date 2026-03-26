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
      :title="action === 'retry' ? 'Why are you retrying this action?' : 'Why are you rejecting this action?'"
      class-name="agentic-ai-confirm-dialog"
      custom-size="560"
      hide-overlay
      @changeStatus="handleChangeStatus"
    >
      <template #app-dialog-body>
        <p class="agentic-ai-reject-dialog__description">
          Please explain in 1–2 sentences. Your feedback helps improve AI recommendations.
        </p>
        <v-textarea
          v-model="reason"
          outlined
          dense
          no-resize
          rows="5"
          :placeholder="action === 'retry' ? 'e.g. The previous attempt failed due to a temporary issue.' : 'e.g. This user already completed this training last month.'"
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
          :action-button-color="action === 'retry' ? '#2196F3' : '#f56c6c'"
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
      return this.action === "retry" ? "RETRY" : "REJECT";
    },
    isValid() {
      return this.reason.trim().length >= MIN_LENGTH;
    }
  },
  watch: {
    status(val) {
      if (!val) this.reason = "";
    }
  },
  methods: {
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
