/**
 * HTML overflow kontrolü için mixin
 * Drawer/Modal açıldığında HTML scroll'unu kapatır
 * Kapandığında geri açar
 */
export default {
  props: {
    shouldControlHtmlOverflow: {
      type: Boolean,
      default: true
    }
  },
  created() {
    if (this.shouldControlHtmlOverflow) {
      this._setHtmlOverflow('hidden')
    }
  },
  beforeDestroy() {
    if (this.shouldControlHtmlOverflow) {
      // Animasyon için bekle
      setTimeout(() => {
        this._setHtmlOverflow('auto')
      }, 250)
    }
  },
  methods: {
    _setHtmlOverflow(value) {
      const htmlElement = document.querySelector('html')
      if (htmlElement) {
        htmlElement.style.overflowY = value
      }
    }
  }
}
