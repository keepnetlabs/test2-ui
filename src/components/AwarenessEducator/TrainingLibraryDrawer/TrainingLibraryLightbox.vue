<template>
  <div v-if="isVisible" class="training-library-lightbox">
    <div class="training-library-lightbox__overlay" @click="handleClose"></div>
    <VBtn icon class="training-library-lightbox__close" @click="handleClose">
      <VIcon size="32">mdi-close</VIcon>
    </VBtn>
    <div class="training-library-lightbox__container" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryLightbox',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal && !this.isVisible) {
          this.isVisible = true
          this.$nextTick(() => {
            this.disableBodyScroll()
          })
        } else if (!newVal && this.isVisible) {
          this.isVisible = false
          this.enableBodyScroll()
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.enableBodyScroll()
  },
  methods: {
    handleClose() {
      this.$emit('input', false)
      this.$emit('close')
    },
    disableBodyScroll() {
      if (document.querySelector('html')) {
        document.querySelector('html').style.overflowY = 'hidden'
      }
      if (document.querySelector('body')) {
        document.querySelector('body').style.overflowY = 'hidden'
      }
    },
    enableBodyScroll() {
      if (document.querySelector('html')) {
        document.querySelector('html').style.overflowY = ''
      }
      if (document.querySelector('body')) {
        document.querySelector('body').style.overflowY = ''
      }
    }
  }
}
</script>
