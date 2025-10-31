export default {
  data() {
    return {
      isVisible: false,
      drawerId: `drawer-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer': true,
        'nested-drawer': this.isNested
      }
    }
  },
  watch: {
    status: {
      handler(newVal) {
        if (newVal && !this.isVisible) {
          // Açılma
          this.isVisible = true
          this.$nextTick(() => {
            this.openDrawer()
          })
        } else if (!newVal && this.isVisible) {
          // Kapanma
          this.closeDrawer()
        }
      },
      immediate: false
    }
  },
  mounted() {
    if (this.status) {
      this.isVisible = true
      this.$nextTick(() => {
        this.openDrawer()
      })
    }
  },
  methods: {
    handleOverlayClick() {
      this.closeDrawer()
    },
    openDrawer() {
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
        setTimeout(() => {
          drawerElement.style.right = '0'
        }, 10)
      }
    },
    closeDrawer() {
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }

      setTimeout(() => {
        this.isVisible = false
        this.$emit('on-close')
      }, 250)
    }
  }
}
