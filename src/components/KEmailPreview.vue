<template>
  <iframe
    :key="iframeKey"
    ref="iframe"
    class="k-email-preview"
    width="100%"
    title="Email Preview"
    :srcdoc="html"
    :style="{ height }"
    :height="height"
    @load="resizeIframe"
  />
</template>

<script>
import { createRandomCryptStringNumber } from '@/utils/functions'

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
      iframeKey: `key-${createRandomCryptStringNumber()}`,
      animationFrame: null,
      isBodyHeightUsed: false,
      stopCalculateFrame: false,
      isInitialResize: true,
      numberHeight: 300
    }
  },
  watch: {
    html() {
      this.iframeKey = `key-${createRandomCryptStringNumber()}`
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
          height = this.setDefaultHeight(height)
        }
        if (height < 200) {
          this.isBodyHeightUsed = true
          height = this.getFirstValidHeight(height, iframe)
        }
        if (this.isBodyHeightUsed) {
          height += 8
        }
        if (height > this.numberHeight && height > 300) {
          if (
            window.navigator &&
            window.navigator.userAgent &&
            window.navigator.userAgent.toLowerCase().includes('windows')
          ) {
            height += 20
          }
          height = height + 18
          this.height = height + 'px'
          this.stopCalculateFrame = true
          cancelAnimationFrame(this.animationFrame)
        }
        if (!this.stopCalculateFrame) {
          this.numberHeight = height
          this.height = iframe.contentWindow.document.body ? height + 18 + 'px' : iframe.height
          this.animationFrame = window.requestAnimationFrame(() => this.resizeIframe())
        }
      }
    },
    setDefaultHeight(height) {
      const iframe = this.$refs.iframe
      if (iframe.contentWindow.document.body) {
        if (iframe.contentWindow.document.body.scrollHeight > 200) {
          if (
            iframe?.contentWindow?.document?.querySelector('body') &&
            iframe?.contentWindow?.document?.querySelector('#emailCredentials.container')
          ) {
            this.defaultHeight = iframe.contentWindow.document.body.scrollHeight + 275
            height = this.defaultHeight
          } else {
            this.defaultHeight = iframe.contentWindow.document.body.scrollHeight
          }
        } else {
          this.defaultHeight = this.getFirstValidHeight(150, iframe)
        }
      }
      this.isInitialResize = false
      return height
    },
    getValidElementHeight(style, height) {
      if (
        !style.height.includes('auto') &&
        !style.height.includes('%') &&
        !style.height.includes('vh')
      ) {
        return Number(style.height.replace('px', ''))
      }

      return height
    },
    getFirstValidHeight(height, iframe) {
      if (height < 200) {
        let body = iframe.contentWindow.document.querySelector('body')
        const microsoftEmailContainer = body.querySelector('#emailCredentials.container')
        if (microsoftEmailContainer) {
          const microsoftEmailContainerStyle = getComputedStyle(microsoftEmailContainer)
          const numberHeight =
            Number(microsoftEmailContainerStyle.height.replace('px', '')) +
            Number(microsoftEmailContainerStyle.marginTop.replace('px', '')) +
            Number(microsoftEmailContainerStyle.marginBottom.replace('px', ''))
          if (Number.isNaN(numberHeight)) {
            return 690
          } else {
            return numberHeight
          }
        }
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
                const { minHeight } = element?.style || {}
                if (minHeight) {
                  element.style.minHeight = minHeight.replace('vh', '') + '%'
                }
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
