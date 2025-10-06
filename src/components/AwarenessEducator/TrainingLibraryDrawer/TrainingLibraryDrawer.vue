<template>
  <div v-if="value">
    <div class="training-library-drawer-overlay" @click="handleOverlayClick"></div>
    <VNavigationDrawer
      :value="value"
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
        <TrainingLibraryDrawerContent :training-data="trainingData" :type="type" />
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
      default: 'Training Library'
    },
    trainingData: {
      type: Object,
      default: () => ({})
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
    // Drawer açıldığında animasyon için
    if (this.value) {
      this.openDrawer()
      this.disableBodyScroll()
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.openDrawer()
          this.disableBodyScroll()
        })
      } else {
        this.enableBodyScroll()
      }
    }
  },
  beforeDestroy() {
    this.enableBodyScroll()
  },
  methods: {
    handleOverlayClick() {
      this.closeDrawer()
    },
    handleClose() {
      this.closeDrawer()
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
      // Drawer'ı animasyonla kaydır
      const drawerElement = document.querySelector('.training-library-drawer')
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }

      // Animasyon bitince drawer'ı kapat
      setTimeout(() => {
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
