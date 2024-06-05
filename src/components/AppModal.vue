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
              <v-icon v-if="iconName" class="ml-2" color="blue" left medium>{{ iconName }}</v-icon>
              <img v-if="customIcon" alt="" :src="require('@/assets/img/' + customIcon + '')" />
            </div>
            <v-list-item-content>
              <v-list-item-title class="k-overlay__title" :id="titleId">{{
                title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </slot>
        <slot name="overlay-body"> </slot>
        <div v-if="showFooter" :class="getFooterClass">
          <slot name="overlay-footer">
            <v-btn class="k-overlay__btn-cancel" :id="cancelButtonId" rounded @click="closeOverlay">
              {{ labels.Cancel }}
            </v-btn>
            <v-btn
              class="k-overlay__btn-save white--text"
              color="#2196f3"
              rounded
              :style="confirmButtonStyle"
              :id="confirmButtonId"
              :disabled="saveDisable"
              @click="submit"
            >
              {{ confirmButtonText }}
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
    shouldRemoveOverflow: {
      type: Boolean,
      default: true
    },
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
    customIcon: {
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
    },
    confirmButtonText: {
      type: String,
      default: labels.Save
    },
    confirmButtonStyle: {
      type: Object
    },
    footerClass: {
      type: String
    }
  },
  emits: ['closeOverlay', 'submit'],
  data() {
    return { labels }
  },
  created() {
    document.querySelector('html').style.overflowY = 'hidden'
  },
  beforeDestroy() {
    if (this.shouldRemoveOverflow) document.querySelector('html').style.overflowY = ''
  },
  computed: {
    getFooterClass() {
      if (!!this.footerClass) {
        return `k-overlay__footer ${this.footerClass}`
      }
      return `k-overlay__footer`
    }
  },
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
