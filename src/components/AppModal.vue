<template>
  <v-overlay
    v-if="status"
    :value="status"
    :opacity="1"
    :id="id"
    :z-index="zIndex || 99"
    color="white"
    class="k-overlay"
    :class="className"
  >
    <v-card light class="k-overlay__container" :class="{ 'p-0': !showHeader }">
      <v-form lazy-validation ref="refForm">
        <slot v-if="showHeader" name="overlay-header">
          <v-list-item class="k-overlay__list-item k-overlay__header">
            <div class="v-btn v-cart-icon-wrapper">
              <v-icon class="ml-2" color="blue" left medium>{{ iconName }}</v-icon>
            </div>
            <v-list-item-content>
              <v-list-item-title class="k-overlay__title" :id="titleId">{{
                title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </slot>
        <slot name="overlay-body"> </slot>
        <div v-if="showFooter" class="k-overlay__footer">
          <slot name="overlay-footer">
            <v-btn class="k-overlay__btn-cancel" :id="cancelButtonId" rounded @click="closeOverlay">
              {{ labels.Cancel }}
            </v-btn>
            <v-btn
              class="k-overlay__btn-save white--text"
              color="#2196f3"
              rounded
              @click="submit"
              :id="confirmButtonId"
              :disabled="saveDisable"
            >
              {{ labels.Save }}
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
import labels from '@/model/constants/labels'

export default {
  name: 'AppModal',
  props: {
    cancelButtonId: {
      type: String
    },
    confirmButtonId: {
      type: String
    },
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
    },
    zIndex: {
      type: String
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    saveDisable: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
    titleId: {
      type: String
    }
  },
  emits: ['closeOverlay', 'submit'],
  data() {
    return { labels }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      this.$emit('submit')
    }
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
    padding: 32px 96px 92px 96px !important;
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
    z-index: 1000;
  }
  &__btn-cancel {
    color: #f56c6c !important;
    border: 1px solid #f56c6c !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    width: 86px;
    height: 36px !important;
  }
  &__btn-save {
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    width: 65px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
    height: 36px !important;
    border-radius: 18px;
    background-color: #2196f3;
  }
}
</style>
