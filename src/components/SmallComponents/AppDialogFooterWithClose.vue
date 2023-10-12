<template>
  <div class="d-flex justify-end">
    <VBtn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose">
      CLOSE
    </VBtn>
  </div>
</template>

<script>
export default {
  name: 'AppDialogFooterWithClose',
  methods: {
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
