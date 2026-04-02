<template>
  <div>
    <div
      v-if="status"
      class="agentic-ai-confirm-dialog__overlay"
      @click="$emit('cancel')"
    ></div>
    <AppDialog
      :status="status"
      :icon="icon"
      :title="title"
      class-name="agentic-ai-confirm-dialog"
      custom-size="560"
      hide-overlay
      @changeStatus="handleChangeStatus"
    >
      <template #app-dialog-body>
        <p class="agentic-ai-confirm-dialog__message">{{ message }}</p>
        <p
          v-if="recommendation"
          class="agentic-ai-confirm-dialog__recommendation"
        >
          {{ recommendation }}
        </p>
      </template>
      <template #app-dialog-footer>
        <AppDialogFooter
          cancel-button-id="btn-confirm-cancel"
          :confirm-button-id="`btn-confirm-${action}`"
          cancel-button-text="Cancel"
          :action-button-text="confirmText"
          :confirm-button-disabled="loading"
          @handleClose="$emit('cancel')"
          @handleConfirm="$emit('confirm')"
        />
      </template>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from "@/components/AppDialog.vue";
import AppDialogFooter from "@/components/SmallComponents/AppDialogFooter.vue";

export default {
  name: "AgenticAIConfirmDialog",
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: "mdi-information"
    },
    title: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: ""
    },
    recommendation: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChangeStatus(value) {
      if (!value) {
        this.$emit("cancel");
      }
    }
  }
};
</script>