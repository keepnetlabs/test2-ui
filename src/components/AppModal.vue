<template>
  <v-overlay :value="status" :opacity="1" :z-index="999" color="white" class="k-overlay">
    <v-card light class="k-overlay__container">
      <v-form lazy-validation>
        <slot name="overlay-body"> </slot>
        <div class="k-overlay__footer">
          <slot name="overlay-footer">
            <v-btn class="add-user-overlay__footer-btn-cancel" rounded @click="closeOverlay">
              CANCEL
            </v-btn>
            <v-btn
              class="add-user-overlay__footer-btn-save white--text"
              color="#2196f3"
              rounded
              @click="submit"
            >
              SAVE
            </v-btn>
          </slot>
        </div>
      </v-form>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {},
    created() {
      debugger
      document.querySelector('html').style.overflowY = 'hidden'
    },
    beforeDestroy() {
      document.querySelector('html').style.overflowY = ''
    }
  }
}
</script>

<style lang="scss">
.k-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100%;
    background-color: white;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: auto;
  }
  &__container {
    padding: 32px 96px 68px 96px;
    box-shadow: none;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 9;
  }
}
</style>
