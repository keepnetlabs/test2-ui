<template>
  <div class="d-flex download-buttons flex-row flex-wrap justify-end">
    <v-btn
      type="but"
      text
      :color="cancelButtonColor"
      class="k-dialog__button mr-4"
      @click="closeButtonClick"
    >
      {{ cancelButtonText }}
    </v-btn>
    <v-btn
      text
      :color="actionButtonColor"
      :id="confirmButtonId"
      class="k-dialog__button"
      @click="confirmButtonClick"
      :disabled="confirmButtonDisabled"
    >
      {{ actionButtonText }}
    </v-btn>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'

export default {
  name: 'AppDialogFooter',
  props: {
    actionButtonText: {
      type: String,
      default: labels.Confirm
    },
    actionButtonColor: {
      type: String,
      default: '#2196f3'
    },
    confirmButtonId: {
      type: String
    },
    cancelButtonText: {
      type: String,
      default: labels.Cancel
    },
    cancelButtonColor: {
      type: String,
      default: '#f56c6c'
    },
    confirmButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['handleClose', 'handleConfirm'],
  data() {
    return { labels }
  },
  methods: {
    closeButtonClick() {
      this.$emit('handleClose')
    },
    confirmButtonClick() {
      this.$emit('handleConfirm')
    }
  }
}
</script>
