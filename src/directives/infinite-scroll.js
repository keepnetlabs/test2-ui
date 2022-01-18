const scrollState = {
  isEventAttached: false,
  event: null,
  isMenuOpen: false,
  timeoutId: null,
  lastScrollTop: null,
  handleScroll({ target }, vNode, callback) {
    const { scrollTop, scrollHeight, offsetHeight } = target
    if (
      scrollTop - (scrollHeight - offsetHeight) < 10 &&
      scrollTop - (scrollHeight - offsetHeight) > -10
    ) {
      if (!this.lastScrollTop) {
        this.lastScrollTop = scrollTop
      }
      if (scrollTop < this.lastScrollTop) return

      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        callback(true)
        this.lastScrollTop = scrollTop
      }, 500)
    }
  },
  attachEvent(targetString, vNode, callback) {
    if (targetString && callback) {
      const target = document.querySelector(targetString)
      if (target) {
        scrollState.event = target.addEventListener('scroll', (e) => {
          this.handleScroll(e, vNode, callback)
        })
        this.isEventAttached = true
      }
    }
  },
  detachEvent(targetString) {
    const target = document.querySelector(targetString)
    if (!target) return
    target.removeEventListener('scroll', this.event)
  }
}

const infiniteScroll = {
  bind(el, { value }, vNode) {
    const { isOriginalVuetifyComponent = false } = value
    const objRef = isOriginalVuetifyComponent
      ? vNode.componentInstance
      : vNode.componentInstance.$refs['refComponent']
    objRef.$watch(
      (vm) => vm.$_menuProps.value,
      (val) => {
        const { target, callback } = value
        if (val && !scrollState.isEventAttached) {
          scrollState.attachEvent(target, vNode, callback)
        }
      }
    )
  },
  unbind(el, { value }) {
    const { target } = value
    scrollState.isEventAttached = false
    scrollState.event = null
    scrollState.lastScrollTop = null
    scrollState.detachEvent(target)
    clearTimeout(scrollState.timeoutId)
  }
}

export default infiniteScroll
