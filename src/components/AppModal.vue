<template>
  <v-overlay
    :value="status"
    :opacity="1"
    v-if="status"
    :z-index="999"
    color="white"
    class="k-overlay"
    :class="className"
  >
    <v-card light class="k-overlay__container">
      <v-form lazy-validation ref="refForm">
        <slot name="overlay-header">
          <v-list-item class="k-overlay__list-item">
            <div class="v-btn v-cart-icon-wrapper">
              <v-icon class="ml-2" color="blue" left medium>{{ iconName }}</v-icon>
            </div>
            <v-list-item-content>
              <v-list-item-title class="k-overlay__title">{{ title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </slot>
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
/*
**** props ****
status --> modal status
iconName--> Header icon (must start with mdi)
title --> Title
className --> ClassName for overlay

**** slots ****
overlay-header
overlay-body
overlay-footer

 */
export default {
  name: 'AppModal',
  props: {
    status: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String
    },
    title: {
      type: String
    },
    className: {
      type: String
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {}
  },
  created() {
    document.querySelector('html').style.overflowY = 'hidden'
  },
  beforeDestroy() {
    document.querySelector('html').style.overflowY = ''
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
    padding: 32px 96px 68px 96px !important;
    @media (max-width: 500px) {
      padding: 10px 24px 68px 24px !important;
    }
    box-shadow: none !important;
  }
  &__title {
    white-space: normal;
    color: #2196f3 !important;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: normal;
  }

  .v-list-item {
    padding: 0;
    &__content {
      padding: 0;
      overflow: visible;
    }
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
    @media (max-width: 500px) {
      padding: 16px 24px !important;
    }
    z-index: 9;
  }
}
</style>
