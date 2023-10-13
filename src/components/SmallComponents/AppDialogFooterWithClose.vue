<template>
  <div class="d-flex justify-end">
    <VBtn :id="id" class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose">
      CLOSE
    </VBtn>
  </div>
</template>

<script>
export default {
  name: 'AppDialogFooterWithClose',
  props: {
    id: {
      type: String
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
