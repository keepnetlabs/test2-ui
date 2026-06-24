<template>
  <iframe
    :key="iframeKey"
    ref="iframe"
    class="k-email-preview"
    width="100%"
    title="Email Preview"
    :srcdoc="html"
    :style="{
      height,
      pointerEvents: isRedFlaggedTemplate ? 'auto !important' : 'none'
    }"
    :height="height"
    @load="handleLoad"
  />
</template>

<script>
import { createRandomCryptStringNumber, handleIsSafari } from '@/utils/functions'
export default {
  name: 'KEmailPreview',
  props: {
    html: {
      type: String
    },
    isExtraHeight: {
      type: Boolean,
      default: false
    },
    isLandingPage: {
      type: Boolean,
      default: false
    },
    isRedFlaggedTemplate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: this.isLandingPage ? 660 : 300,
      defaultHeight: this.isLandingPage ? 660 : 300,
      iframeKey: `key-${createRandomCryptStringNumber()}`,
      animationFrame: null,
      isBodyHeightUsed: false,
      stopCalculateFrame: false,
      isInitialResize: true,
      numberHeight: this.isLandingPage ? 660 : 300,
      resizeObserver: null,
      lastObservedWidth: 0,
      settleTimeouts: []
    }
  },
  watch: {
    html() {
      this.iframeKey = `key-${createRandomCryptStringNumber()}`
      this.resizeIframe()
    }
  },
  mounted() {
    globalThis.addEventListener('message', this.handleWindowMessage)
    this.observeIframeVisibility()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrame)
    globalThis.removeEventListener('message', this.handleWindowMessage)
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.settleTimeouts.length) {
      this.settleTimeouts.forEach((t) => clearTimeout(t))
      this.settleTimeouts = []
    }
  },
  methods: {
    // When the iframe lives inside a v-show/display:none container (e.g. the Double Barrel
    // payload editor while the Lure tab is shown), it has zero layout width. Any height
    // measured then is meaningless and gets locked via stopCalculateFrame, leaving empty
    // space + a scrollbar once the panel is finally shown. Watch for the hidden→visible
    // (0 → >0 width) transition and re-measure at the real width. Height changes we make
    // ourselves don't alter width, so this never loops.
    observeIframeVisibility() {
      const iframe = this.$refs.iframe
      if (!iframe || typeof globalThis.ResizeObserver !== 'function') return
      this.lastObservedWidth = iframe.clientWidth || 0
      this.resizeObserver = new globalThis.ResizeObserver(() => {
        const width = iframe.clientWidth || 0
        if (width > 0 && this.lastObservedWidth === 0) {
          this.stopCalculateFrame = false
          this.isInitialResize = true
          cancelAnimationFrame(this.animationFrame)
          this.animationFrame = null
          this.resizeIframe()
        }
        this.lastObservedWidth = width
      })
      this.resizeObserver.observe(iframe)
    },
    handleLoad() {
      if (handleIsSafari()) {
        setTimeout(() => {
          this.resizeIframe()
        }, 500)
      } else {
        this.resizeIframe()
      }
    },
    handleWindowMessage(e) {
      if (e && e.data && e.data.type === 'redflag:languageChanged') {
        this.stopCalculateFrame = false
        this.isInitialResize = true
        cancelAnimationFrame(this.animationFrame)
        this.animationFrame = null
        this.resizeIframe()
        // Safari may under-measure iframe height; add small bump
        const iframe = this.$refs.iframe
        if (iframe && typeof this.height === 'string' && this.height.endsWith('px')) {
          const current = Number.parseInt(this.height.replace('px', ''), 10) || 0
          this.height = current + 30 + 'px'
        }
      }
    },
    resizeIframe() {
      const iframe = this.$refs.iframe
      // A display:none ancestor gives the iframe zero layout width; body.scrollHeight is
      // then wildly wrong and would get locked. Bail without measuring or locking —
      // observeIframeVisibility() re-measures once the iframe is actually shown.
      if (iframe && iframe.clientWidth === 0) {
        return
      }
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
        // Ensure minimum height for landing pages
        if (this.isLandingPage && height < 660) {
          height = 660
        }
        if (height > this.numberHeight && height > 300) {
          if (
            globalThis.navigator &&
            globalThis.navigator.userAgent &&
            globalThis.navigator.userAgent.toLowerCase().includes('windows')
          ) {
            height += 20
          }
          height = height + 18
          if (handleIsSafari()) {
            height = height + 30
          }
          this.height = height + 'px'
          this.stopCalculateFrame = true
          cancelAnimationFrame(this.animationFrame)
          this.scheduleSettleRemeasure()
        }
        if (!this.stopCalculateFrame) {
          this.numberHeight = height
          if (handleIsSafari()) {
            height = height + 30
          }
          this.height = iframe.contentWindow.document.body ? height + 18 + 'px' : iframe.height
          this.animationFrame = globalThis.requestAnimationFrame(() => this.resizeIframe())
        }
      }
    },
    // After locking the height, web fonts / late images can reflow the email taller,
    // leaving the content higher than the locked iframe (a thin scrollbar). Re-measure at
    // a few increasing delays and GROW the height to fit. Monotonic by design (only ever
    // increases): it can never clip content, never shrinks, and never touches templates
    // that already fit. The multiple passes catch assets that settle late, so the height
    // ends up fitting the full content — which is also what makes scrolling="no" safe
    // (nothing left to clip). body.scrollHeight still reports the true content height even
    // when scrolling is disabled, so the measurement stays correct.
    scheduleSettleRemeasure() {
      ;[250, 800, 1600].forEach((delay) => {
        this.settleTimeouts.push(setTimeout(() => this.growToFitContent(), delay))
      })
    },
    growToFitContent() {
      const iframe = this.$refs.iframe
      if (
        !iframe ||
        !iframe.contentWindow ||
        !iframe.contentWindow.document ||
        !iframe.contentWindow.document.body ||
        iframe.clientWidth === 0
      ) {
        return
      }
      let desired = iframe.contentWindow.document.body.scrollHeight + 18
      if (
        globalThis.navigator &&
        globalThis.navigator.userAgent &&
        globalThis.navigator.userAgent.toLowerCase().includes('windows')
      ) {
        desired += 20
      }
      if (handleIsSafari()) {
        desired += 30
      }
      const current =
        typeof this.height === 'string'
          ? Number.parseInt(this.height.replace('px', ''), 10) || 0
          : Number(this.height) || 0
      if (desired > current) {
        this.height = desired + 'px'
        this.numberHeight = desired
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
            return 710
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
