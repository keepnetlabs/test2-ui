<template>
  <div class="training-library-lightbox-content" :class="{ 'is-pdf': isPdf }">
    <div class="training-library-lightbox-content__iframe-wrapper" :class="{ 'is-pdf': isPdf }">
      <div v-if="isLoading" class="training-library-lightbox-content__loading">
        <VProgressCircular indeterminate size="64" color="primary" />
      </div>
      <template v-else-if="previewUrl">
        <img
          v-if="isImageType && !isPdf"
          :src="previewUrl"
          class="training-library-lightbox-content__image"
          alt="Preview"
        />
        <pdf
          v-else-if="isPdf"
          :src="pdfSrc"
          class="training-library-lightbox-content__pdf"
        />
        <iframe
          v-else
          :src="previewUrl"
          frameborder="0"
          allowfullscreen
          title="Training Preview"
          class="training-library-lightbox-content__iframe"
        ></iframe>
      </template>
      <div v-else class="training-library-lightbox-content__no-content">
        <VIcon size="64" color="grey">mdi-alert-circle-outline</VIcon>
        <p>No preview available</p>
      </div>
    </div>
  </div>
</template>

<script>
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingLibraryLightboxContent',
  components: {
    pdf: () => import('vue-pdf')
  },
  props: {
    previewData: {
      type: [Object, String],
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: null
    }
  },
  computed: {
    isImageType() {
      return (
        this.type === TRAINING_LIBRARY_TYPES.POSTER ||
        this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC ||
        this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER
      )
    },
    isPdf() {
      if (!this.previewUrl) return false
      const isPdf = this.previewUrl.toLowerCase().includes('.pdf') || this.previewUrl.startsWith('blob:')
      return isPdf
    },
    pdfSrc() {
      return this.previewUrl
    },
    previewUrl() {
      if (!this.previewData) return null

      // String ise direkt döndür
      if (typeof this.previewData === 'string') {
        return this.previewData
      }

      // SCORM training ise player URL oluştur
      if (this.previewData.scormPlayerUrl && this.previewData.trainingUrl) {
        return `${this.previewData.scormPlayerUrl}?isPreview=true&scoAddress=${this.previewData.trainingUrl}`
      }

      // Sadece trainingUrl varsa
      if (this.previewData.trainingUrl) {
        return this.previewData.trainingUrl
      }

      return null
    }
  }
}
</script>
