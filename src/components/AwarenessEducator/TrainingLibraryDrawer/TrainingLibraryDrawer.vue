<template>
  <div v-if="isVisible">
    <div class="training-library-drawer-overlay" @click="handleOverlayClick"></div>
    <VNavigationDrawer
      :value="isVisible"
      class="k-navigation-drawer training-library-drawer"
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
          @delete-success="handleDeleteSuccess"
          @duplicate-success="handleDuplicateSuccess"
          @send-clicked="handleSendClicked"
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
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  computed: {
    getTitle() {
      if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) return labels.LearningPathPreview
      if (this.type === TRAINING_LIBRARY_TYPES.POSTER) return labels.PosterPreview
      if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) return labels.InfographicPreview
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) return labels.ScreensaverPreview
      if (this.type === TRAINING_LIBRARY_TYPES.SURVEY) return labels.SurveyPreview
      return labels.TrainingPreview
    }
  },
  mounted() {
    console.log('🎬 TrainingLibraryDrawer mounted with value:', this.value)
    console.log('📦 TrainingLibraryDrawer type prop:', this.type)
    console.log('📦 TrainingLibraryDrawer trainingData:', this.trainingData)
    // Drawer açıldığında animasyon için
    if (this.value) {
      this.isVisible = true
      this.$nextTick(() => {
        this.openDrawer()
        this.disableBodyScroll()
      })
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        console.log('👁️ Value changed:', { old: oldVal, new: newVal, isVisible: this.isVisible })

        if (newVal && !this.isVisible) {
          // Açılma
          this.isVisible = true
          this.$nextTick(() => {
            this.openDrawer()
            this.disableBodyScroll()
          })
        } else if (!newVal && this.isVisible) {
          // Kapanma (dışarıdan kapatılırsa)
          this.isVisible = false
          this.enableBodyScroll()
        }
      },
      immediate: false
    }
  },
  beforeDestroy() {
    this.enableBodyScroll()
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
    handleSendClicked() {
      // Send modal açıldığında drawer'ı kapat ama store'u reset etme
      const drawerElement = document.querySelector('.training-library-drawer')
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }

      setTimeout(() => {
        this.isVisible = false
        this.$emit('input', false)
      }, 250)
    },
    openDrawer() {
      // Drawer'ı başta ekranın dışında başlat
      const drawerElement = document.querySelector('.training-library-drawer')
      if (drawerElement) {
        drawerElement.style.right = '-100%'
        // Bir sonraki frame'de animasyonla içeri getir
        setTimeout(() => {
          drawerElement.style.right = '0'
        }, 10)
      }
    },
    closeDrawer() {
      console.log('🚪 Closing drawer...')
      // Drawer'ı animasyonla kaydır
      const drawerElement = document.querySelector('.training-library-drawer')
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }

      // Animasyon bitince drawer'ı ve overlay'i kapat
      setTimeout(() => {
        console.log('✅ Drawer closed, emitting events')
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
        document.querySelector('html').style.overflowY = 'auto'
      }
      if (document.querySelector('body')) {
        document.querySelector('body').style.overflowY = 'auto'
      }
    }
  }
}
</script>
