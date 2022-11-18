export default {
  data() {
    return {
      timeout: null
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  },
  methods: {
    debounce(fn, delay = 750) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    }
  }
}
