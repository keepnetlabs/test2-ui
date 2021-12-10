<template>
  <iframe
    :key="iframeKey"
    ref="iframe"
    class="k-email-preview"
    :srcdoc="html"
    :style="{ height }"
    width="100%"
    :height="height"
    @load="resizeIframe"
  />
</template>

<script>
export default {
  name: 'KEmailPreview',
  props: {
    html: {
      type: String
    },
    isExtraHeight: {
      type: Boolean,
      default: false
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
      isInitialResize: true,
      numberHeight: 300
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
      if (
        iframe &&
        iframe.contentWindow &&
        iframe.contentWindow.document &&
        iframe.contentWindow.document.body &&
        !this.stopCalculateFrame
      ) {
        cancelAnimationFrame(this.animationFrame)
        let height = iframe.contentWindow.document.body.scrollHeight
        if (this.isInitialResize) {
          this.setDefaultHeight()
        }
        if (height < 200) {
          this.isBodyHeightUsed = true
          height = this.getFirstValidHeight(height, iframe)
        }
        if (this.isBodyHeightUsed) {
          height += 16
        }
        if (height > this.numberHeight && height > 300) {
          height = height - 12
          if (this.isExtraHeight) {
            height += 16
          }
          this.height = height + 'px'
          this.stopCalculateFrame = true
          cancelAnimationFrame(this.animationFrame)
        }
        if (!this.stopCalculateFrame) {
          this.numberHeight = height
          this.height = iframe.contentWindow.document.body ? height + 12 + 'px' : iframe.height
          this.animationFrame = window.requestAnimationFrame(() => this.resizeIframe())
        }
      }
    },
    setDefaultHeight() {
      const iframe = this.$refs.iframe
      if (iframe.contentWindow.document.body) {
        if (iframe.contentWindow.document.body.scrollHeight > 200) {
          this.defaultHeight = iframe.contentWindow.document.body.scrollHeight
        } else {
          this.defaultHeight = this.getFirstValidHeight(150, iframe)
        }
      }
      this.isInitialResize = false
    },
    getValidElementHeight(style, height) {
      if (!style.height.includes('%') && !style.height.includes('vh')) {
        return Number(style.height.replace('px', ''))
      }

      return height
    },
    getFirstValidHeight(height, iframe) {
      if (height < 200) {
        let body = iframe.contentWindow.document.querySelector('body')
        let bodyStyle
        if (body) {
          bodyStyle = getComputedStyle(body)
        }
        if (body) {
          height = this.getValidElementHeight(bodyStyle, height)
          if (height < 200) {
            const elements = body.querySelectorAll('*')
            for (const element of elements) {
              let tempHeight = 0
              if (element) {
                let elementStyle = getComputedStyle(element)
                if (elementStyle) {
                  tempHeight = this.getValidElementHeight(elementStyle, height)
                  if (tempHeight > height) {
                    height = tempHeight
                    break
                  }
                }
              }
            }
          }
        }
      }
      return height
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
