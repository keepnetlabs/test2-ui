<template>
  <div class="d-flex download-buttons flex-row flex-wrap justify-end">
    <v-btn text color="#f56c6c" class="k-dialog__button mr-4" @click="closeButtonClick">
      {{ labels.Cancel }}
    </v-btn>
    <v-btn
      text
      color="#2196f3"
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
