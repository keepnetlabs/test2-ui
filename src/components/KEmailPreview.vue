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
      defaultHeight: 300,
      iframeKey: `key-${Math.random().toString().substring(8)}`,
      animationFrame: null,
      isBodyHeightUsed: false,
      stopCalculateFrame: false,
      isInitialResize: true
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
        let height = iframe.contentWindow.document.body.scrollHeight
        if (this.isInitialResize) {
          this.defaultHeight = iframe.contentWindow.document.body.scrollHeight
          this.isInitialResize = false
        }
        if (height < 200) {
          this.isBodyHeightUsed = true
          const firstBodyElement = getComputedStyle(
            iframe.contentWindow.document.querySelector('body *')
          )
          if (firstBodyElement) {
            height = Number(firstBodyElement.height.replace('px', ''))
          }
        }
        if (this.isBodyHeightUsed) {
          height += 16
        }
        if (height > 5000) {
          this.height = this.defaultHeight + 'px'
          this.stopCalculateFrame = true
          cancelAnimationFrame(this.animationFrame)
        }
        if (!this.stopCalculateFrame) {
          this.height = iframe.contentWindow.document.body ? height + 24 + 'px' : iframe.height
          this.animationFrame = window.requestAnimationFrame(() => this.resizeIframe())
        }
      }
    }
  }
}
</script>

<style lang="scss">
.k-email-preview {
  border: none !important;
  pointer-events: none !important;
  * {
    padding: 0;
    margin: 0;
  }
}
</style>
