<template>
  <div class="d-flex download-buttons flex-row flex-wrap justify-end">
    <v-btn
      type="but"
      text
      :color="getCancelButtonColor"
      :id="cancelButtonId"
      class="k-dialog__button mr-4"
      @click="closeButtonClick"
    >
      {{ cancelButtonText }}
    </v-btn>
    <v-btn
      text
      :color="getActionButtonColor"
      :id="confirmButtonId"
      class="k-dialog__button"
      @click="confirmButtonClick"
      :disabled="confirmButtonDisabled"
    >
      {{ getActionButtonText }}
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
    cancelButtonId: {
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
    },
    type: {
      type: String
    }
  },
  emits: ['handleClose', 'handleConfirm'],
  data() {
    return { labels }
  },
  computed: {
    getActionButtonColor() {
      let actionButtonColor
      switch (this.type) {
        case 'delete':
          actionButtonColor = '#f56c6c'
          break
        default:
          actionButtonColor = this.actionButtonColor
          break
      }
      return actionButtonColor
    },
    getCancelButtonColor() {
      let cancelButtonColor
      switch (this.type) {
        case 'delete':
          cancelButtonColor = '#383b41'
          break
        default:
          cancelButtonColor = this.cancelButtonColor
          break
      }
      return cancelButtonColor
    },
    getActionButtonText() {
      let actionButtonText
      switch (this.type) {
        case 'delete':
          actionButtonText = 'DELETE'
          break
        default:
          actionButtonText = this.actionButtonText
          break
      }
      return actionButtonText
    }
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
