import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  data() {
    return {
      isVisible: false,
      drawerId: `drawer-${createRandomCryptStringNumber()}`
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
      // Nested drawer'lar HTML overflow'u kontrol etmemeli (parent drawer zaten kontrol ediyor)
      if (!this.isNested) {
        document.querySelector('html').style.overflowY = 'hidden'
      }
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
        // Nested drawer'lar HTML overflow'u restore etmemeli
        if (!this.isNested) {
          document.querySelector('html').style.overflowY = ''
        }
        this.$emit('on-close')
      }, 250)
    }
  }
}
