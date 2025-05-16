<template>
  <div :class="`d-flex download-buttons flex-row flex-wrap justify-${justify}`">
    <v-btn
      type="button"
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
    justify: {
      type: String,
      default: 'end'
    },
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
    },
    isForceActionButtonText: {
      type: Boolean,
      default: false
    }
  },
  emits: ['handleClose', 'handleConfirm'],
  data() {
    return { labels }
  },
  computed: {
    getActionButtonColor() {
      let actionButtonColor
      if (this.type === 'delete') {
        actionButtonColor = '#f56c6c'
      } else {
        actionButtonColor = this.actionButtonColor
      }
      return actionButtonColor
    },
    getCancelButtonColor() {
      let cancelButtonColor
      if (this.type === 'delete') {
        cancelButtonColor = '#383b41'
      } else {
        cancelButtonColor = this.cancelButtonColor
      }
      return cancelButtonColor
    },
    getActionButtonText() {
      let actionButtonText
      if (this.type === 'delete') {
        actionButtonText = this.isForceActionButtonText ? this.actionButtonText : 'DELETE'
      } else {
        actionButtonText = this.actionButtonText
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
