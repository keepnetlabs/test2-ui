<template>
  <transition name="agentic-ai-confirm-dialog-fade">
    <div v-if="status" class="agentic-ai-confirm-dialog">
      <div class="agentic-ai-confirm-dialog__overlay" @click="$emit('cancel')"></div>
      <transition name="agentic-ai-confirm-dialog-scale">
        <div v-if="status" class="agentic-ai-confirm-dialog__content">
          <v-card class="k-dialog__card" light>
            <v-form lazy-validation onSubmit="return false;">
              <v-list-item class="k-dialog__header">
                <div class="v-btn v-cart-icon-wrapper">
                  <v-icon color="blue" class="ml-2" left medium>{{ icon }}</v-icon>
                </div>
                <div>
                  <v-list-item-title class="k-dialog__title">{{ title }}</v-list-item-title>
                </div>
              </v-list-item>
              <div class="k-dialog__body">
                <p class="agentic-ai-confirm-dialog__message">{{ message }}</p>
                <p class="agentic-ai-confirm-dialog__recommendation">{{ recommendation }}</p>
              </div>
              <div class="agentic-ai-confirm-dialog__footer">
                <button
                  id="btn-confirm-preview-first"
                  class="agentic-ai-confirm-dialog__btn agentic-ai-confirm-dialog__btn--preview"
                  type="button"
                  :disabled="loading"
                  @click="$emit('preview-first')"
                >PREVIEW FIRST</button>
                <div class="agentic-ai-confirm-dialog__footer-right">
                  <button
                    id="btn-confirm-cancel"
                    class="agentic-ai-confirm-dialog__btn agentic-ai-confirm-dialog__btn--cancel"
                    type="button"
                    :disabled="loading"
                    @click="$emit('cancel')"
                  >CANCEL</button>
                  <button
                    :id="`btn-confirm-${action}`"
                    class="agentic-ai-confirm-dialog__btn agentic-ai-confirm-dialog__btn--confirm"
                    type="button"
                    :disabled="loading"
                    @click="$emit('confirm')"
                  >{{ loading ? 'Processing...' : confirmText }}</button>
                </div>
              </div>
            </v-form>
          </v-card>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AgenticAIConfirmDialog",
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
  }
};
</script>