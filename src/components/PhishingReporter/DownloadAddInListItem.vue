<template>
  <div
    :class="[
      'download-add-in__list-item',
      hideBorder ? 'download-add-in__list-item--hide-border' : ''
    ]"
  >
    <div>
      <img v-if="src" :src="src" :alt="alt" />
      <slot name="logo-bottom-content"></slot>
      <div v-if="title" :class="['download-add-in__list-item-title', titleClass]">
        {{ title }}
      </div>
      <div class="download-add-in__list-item-desc">
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </div>
    <slot name="buttons">
      <v-btn
        id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
        class="white--text btn-util btn-download-add-in"
        :style="getButtonStyle"
        color="#2196f3"
        rounded
        :loading="isLoading"
        @click="handleClickButton"
      >
        <v-icon left>mdi-download</v-icon>
        Download
        <template #loader>
          <img src="../../assets/img/spinner.svg" class="add-in-settings__spinner" alt="spinner" />
          <span style="font-size: 14px; text-transform: capitalize;">
            Generating...
          </span>
        </template>
      </v-btn>
    </slot>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DownloadAddInListItem',
  props: {
    src: {
      type: String || Object
    },
    alt: {
      type: String,
      default: 'Logo'
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    hideBorder: {
      type: Boolean,
      default: false
    },
    isButtonDisabled: {
      type: Boolean,
      default: false
    },
    titleClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    getButtonStyle() {
      const style = {
        marginLeft: '5px !important',
        textTransform: 'capitalize'
      }
      if (this.isButtonDisabled) {
        style.opacity = 0.5
        style.pointerEvents = 'none'
      }
      return style
    }
  },
  methods: {
    handleClickButton() {
      this.$emit('button-click')
    }
  }
}
</script>
