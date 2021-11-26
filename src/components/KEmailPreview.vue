<template>
  <iframe
    :key="iframeKey"
    :style="{ height }"
    ref="iframe"
    class="k-email-preview"
    :srcdoc="html"
    :height="height"
    width="100%"
    @load="resizeIframe"
  />
</template>

<script>
export default {
  name: 'KEmailPreview',
  props: {
    html: {
      type: String
    }
  },
  data() {
    return {
      height: 300,
      iframeKey: `key-${Math.random().toString().substring(8)}`,
      animationFrame: null
    }
  },
  watch: {
    html() {
      this.iframeKey = `key-${Math.random().toString().substring(8)}`
      this.resizeIframe()
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrame)
  },
  methods: {
    resizeIframe() {
      const iframe = this.$refs.iframe
      if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
        cancelAnimationFrame(this.animationFrame)
        this.height = iframe.contentWindow.document.body
          ? iframe.contentWindow.document.body.scrollHeight + 24 + 'px'
          : iframe.height
        this.animationFrame = window.requestAnimationFrame(() => this.resizeIframe())
      }
    }
  }
}
</script>

<style lang="scss">
.k-email-preview {
  border: none !important;
  pointer-events: none !important;
  max-height: 5000px;
  * {
    padding: 0;
    margin: 0;
  }
}
</style>
