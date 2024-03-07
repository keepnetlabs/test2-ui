<template>
  <div class="d-flex justify-end">
    <VBtn class="pa-0 k-dialog__button mr-6" text color="#00BCD4" @click="handleSend">
      SEND
    </VBtn>
    <VBtn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose">
      CLOSE
    </VBtn>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryPreviewDialogFooter',
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleSend() {
      this.$emit('on-send')
    }
  }
}
</script>
