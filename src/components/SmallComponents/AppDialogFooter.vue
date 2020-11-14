<template>
  <div class="d-flex download-buttons flex-row flex-wrap justify-end">
    <v-btn text color="#f56c6c" class="k-dialog__button mr-4" @click="closeButtonClick">
      CANCEL
    </v-btn>
    <v-btn text color="#2196f3" class="k-dialog__button" @click="confirmButtonClick">
      {{ actionButtonText }}
    </v-btn>
  </div>
</template>

<script>
//todo bu satırı sil
export default {
  name: 'AppDialogFooter',
  props: {
    actionButtonText: {
      type: String,
      default: 'CONFIRM'
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
