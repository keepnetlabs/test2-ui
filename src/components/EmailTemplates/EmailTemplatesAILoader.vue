<template>
  <div class="email-template-ai-loader">
    <div class="email-template-ai-loader__title">{{ title }}</div>
    <div class="email-template-ai-loader__container">
      <div class="email-template-ai-loader-bar"></div>
      <div
        class="email-template-ai-loader-bar--active"
        :style="{ width: `${activeLoaderWidth}%` }"
      ></div>
    </div>
    <div class="email-template-ai-loader__description">{{ description }}</div>
  </div>
</template>
<script>
export default {
  name: 'EmailTemplatesAILoader',
  props: {
    title: {
      type: String,
      default: 'AI Assisted Email Creation in Progress'
    },
    description: {
      type: String,
      default:
        'This process may take approximately 20 seconds. Please stay on the page during this time.'
    },
    loaderTime: {
      type: Number,
      default: 20
    },
    isLoadingFinished: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeoutId: null,
      activeLoaderWidth: 0
    }
  },
  created() {
    this.handleActiveLoader()
  },
  methods: {
    handleActiveLoader() {
      const interval = 100 / this.loaderTime
      this.timeoutId = setInterval(() => {
        if (this.isLoadingFinished) this.activeLoaderWidth = 100
        else {
          let activeLoaderWidth = this.activeLoaderWidth + interval
          if (activeLoaderWidth >= 100 && !this.isLoadingFinished) this.activeLoaderWidth = 99
          else this.activeLoaderWidth = activeLoaderWidth
        }
      }, 1000)
    }
  }
}
</script>
