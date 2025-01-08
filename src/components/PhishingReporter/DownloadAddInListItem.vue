<template>
  <div
    :class="[
      'download-add-in__list-item',
      hideBorder ? 'download-add-in__list-item--hide-border' : ''
    ]"
  >
    <div>
      <img v-if="src" :src="src" :alt="alt" />
      <div class="download-add-in__list-item-title" v-if="title">{{ title }}</div>
      <div class="download-add-in__list-item-desc">
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </div>
    <div>
      <slot name="buttons">
        <v-btn
          id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
          class="white--text btn-util btn-download-add-in"
          style="margin-left: 5px !important; text-transform: capitalize;"
          color="#2196f3"
          rounded
          :loading="isLoading"
          @click="handleClickButton"
        >
          <v-icon left>mdi-download</v-icon>
          Download
          <template #loader>
            <img
              src="../../assets/img/spinner.svg"
              class="add-in-settings__spinner"
              alt="spinner"
            />
            <span style="font-size: 14px; text-transform: capitalize;">
              Generating...
            </span>
          </template>
        </v-btn>
      </slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DownloadAddInListItem',
  props: {
    src: {
      type: Object || String
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
    }
  },
  methods: {
    handleClickButton() {
      this.$emit('button-click')
    }
  }
}
</script>
