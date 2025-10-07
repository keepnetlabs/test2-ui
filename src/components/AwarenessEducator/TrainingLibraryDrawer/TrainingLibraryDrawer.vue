<template>
  <div v-if="isVisible" :class="{ 'nested-drawer-wrapper': isNested }">
    <div
      class="training-library-drawer-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      :width="width"
      height="100%"
    >
      <div class="training-library-drawer__header">
        <slot name="header">
          <span class="training-library-drawer__header-title">
            {{ getTitle }}
          </span>
        </slot>
        <VIcon
          class="training-library-drawer__header-close"
          style="font-size: 32px;"
          color="#757575"
          @click="handleClose"
        >
          mdi-close
        </VIcon>
      </div>
      <div class="training-library-drawer__content">
        <TrainingLibraryDrawerContent
          :training-data="trainingData"
          :type="type"
          :is-nested="isNested"
          :only-preview="onlyPreview"
          @delete-success="handleDeleteSuccess"
          @duplicate-success="handleDuplicateSuccess"
          @send-clicked="handleSendClicked"
          @edit-clicked="handleEditClicked"
        />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import labels from '@/model/constants/labels'
import TrainingLibraryDrawerContent from './TrainingLibraryDrawerContent.vue'

export default {
  name: 'TrainingLibraryDrawer',
  components: {
    TrainingLibraryDrawerContent
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'calc(100% - 72px)'
    },
    type: {
      type: String,
      default: TRAINING_LIBRARY_TYPES.TRAINING
    },
    trainingData: {
      type: Object,
      default: () => ({})
    },
    isNested: {
      type: Boolean,
      default: false
    },
    onlyPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisible: false,
      drawerId: `drawer-${Math.random().toString(36).substr(2, 9)}`,
      skipBodyScrollOnClose: false
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer training-library-drawer': true,
        'nested-drawer': this.isNested
      }
    },
    getTitle() {
      console.log('🔍 trainingData?.hasQuiz:', this.trainingData?.hasQuiz)
      if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) return labels.LearningPathPreview
      if (this.type === TRAINING_LIBRARY_TYPES.POSTER) return labels.PosterPreview
      if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) return labels.InfographicPreview
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) return labels.ScreensaverPreview
      if (this.type === TRAINING_LIBRARY_TYPES.SURVEY || this.trainingData?.hasQuiz)
        return labels.SurveyPreview
      console.log(
        'this.type === TRAINING_LIBRARY_TYPES.SURVEY || this.trainingData?.hasQuiz:',
        this.type === TRAINING_LIBRARY_TYPES.SURVEY || this.trainingData?.hasQuiz
      )
      return labels.TrainingPreview
    }
  },
  mounted() {
    // Drawer açıldığında animasyon için
    if (this.value) {
      this.isVisible = true
      this.$nextTick(() => {
        this.openDrawer()
        if (!this.isNested) this.disableBodyScroll()
      })
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal && !this.isVisible) {
          // Açılma
          this.isVisible = true
          this.$nextTick(() => {
            this.openDrawer()
            if (!this.isNested) this.disableBodyScroll()
          })
        } else if (!newVal && this.isVisible) {
          // Kapanma (dışarıdan kapatılırsa)
          this.isVisible = false
          if (!this.isNested && !this.skipBodyScrollOnClose) this.enableBodyScroll()
        }
      },
      immediate: false
    }
  },
  beforeDestroy() {
    if (!this.isNested && !this.skipBodyScrollOnClose) this.enableBodyScroll()
    this.isVisible = false
  },
  methods: {
    handleOverlayClick() {
      this.closeDrawer()
    },
    handleClose() {
      this.closeDrawer()
    },
    handleDeleteSuccess() {
      this.$emit('delete-success')
      this.closeDrawer()
    },
    handleDuplicateSuccess() {
      this.$emit('duplicate-success')
      this.closeDrawer()
    },
    handleEditClicked() {
      // Edit modal açılırken drawer kapanır
      this.skipBodyScrollOnClose = true

      if (this.isNested) {
        // Nested drawer'daysa hem nested hem parent drawer'ı kapat
        this.isVisible = false
        this.$emit('input', false)
        this.$emit('close-parent')
      } else {
        // Parent drawer
        const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
        if (drawerElement) {
          drawerElement.style.right = '-100%'
        }
        setTimeout(() => {
          this.isVisible = false
          this.$emit('input', false)
        }, 250)
      }
    },
    handleSendClicked() {
      // Send modal açıldığında drawer'ı kapat ama store'u reset etme
      this.skipBodyScrollOnClose = true

      if (this.isNested) {
        // Nested drawer'daysa hem nested hem parent drawer'ı kapat
        this.isVisible = false
        this.$emit('input', false)
        this.$emit('close-parent')
      } else {
        // Parent drawer
        const drawerElement = document.querySelector('.training-library-drawer')
        if (drawerElement) {
          drawerElement.style.right = '-100%'
        }

        setTimeout(() => {
          this.isVisible = false
          this.$emit('input', false)
        }, 250)
      }
    },
    openDrawer() {
      // Drawer'ı başta ekranın dışında başlat
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
        // Bir sonraki frame'de animasyonla içeri getir
        setTimeout(() => {
          drawerElement.style.right = '0'
        }, 10)
      }
    },
    closeDrawer() {
      // Drawer'ı animasyonla kaydır
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }

      // Animasyon bitince drawer'ı kapat
      setTimeout(() => {
        this.isVisible = false
        this.$emit('input', false)
        this.$emit('close')
      }, 250)
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
