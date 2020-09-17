<template>
  <div class="app-modal-footer">
    <v-btn class="app-modal-footer__btn-cancel" @click="closeOverlay" rounded>
      CANCEL
    </v-btn>
    <div class="app-modal-footer__right-col">
      <v-btn class="app-modal-footer__btn-save" color="#2196f3" rounded @click="submit">
        SAVE
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppModalFooter',
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss">
.app-modal-footer {
  &__btn-cancel {
  }

  &__btn-save {
  }
  &__right-col {
  }
}
</style>
