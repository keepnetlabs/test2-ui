const scrollState = {
  isEventAttached: false,
  event: null,
  handleScroll({ target }, vNode, callback) {
    const { scrollTop, scrollHeight, offsetHeight } = target
    const { isInfiniteLoading, maximumApiCount, apiCount } = vNode.context
    if (
      scrollTop - (scrollHeight - offsetHeight) < 10 &&
      scrollTop - (scrollHeight - offsetHeight) > -10 &&
      !isInfiniteLoading &&
      apiCount < maximumApiCount
    ) {
      callback()
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
  }
}

const infiniteScroll = {
  componentUpdated(el, { value }, vNode) {
    const { target, callback } = value
    if (scrollState.isEventAttached) {
      return
    }
    scrollState.attachEvent(target, vNode, callback)
  },
  unbind(el, { value }) {
    const { target } = value
    scrollState.isEventAttached = false
    scrollState.event = null
    if (scrollState.isEventAttached) {
      const target = document.querySelector(target)
      if (target) {
        target.removeEventListener('scroll', scrollState.event)
      }
    }
  }
}

export default infiniteScroll
