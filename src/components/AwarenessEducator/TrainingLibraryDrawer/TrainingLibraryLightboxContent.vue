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
        <div
          v-else-if="isPdf && pdfSrc && pdfReady"
          class="training-library-lightbox-content__pdf-wrapper"
        >
          <template v-if="numPages > 0">
            <pdf
              v-for="page in numPages"
              :key="`${pdfSrc}-page-${page}`"
              :src="pdfSrc"
              :page="page"
              :resize="false"
              class="training-library-lightbox-content__pdf"
              :style="{ width: pdfWidth + 'px' }"
              @error="handlePdfError"
            />
          </template>
          <pdf
            v-else
            :key="pdfSrc"
            :src="pdfSrc"
            :page="1"
            :resize="false"
            class="training-library-lightbox-content__pdf"
            :style="{ width: pdfWidth + 'px' }"
            @error="handlePdfError"
            @num-pages="handlePdfLoaded"
          />
        </div>
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
  errorCaptured(err) {
    // Suppress vue-pdf resize sensor errors
    if (
      err.message &&
      err.message.includes("Cannot read properties of undefined (reading 'catch')")
    ) {
      return false
    }
    return true
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
  data() {
    return {
      currentPage: 1,
      numPages: 0,
      pdfReady: false,
      pdfWidth: 800
    }
  },
  mounted() {
    this.pdfWidth = Math.floor(window.innerWidth * 0.3)
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
      const isPdf =
        this.previewUrl.toLowerCase().includes('.pdf') || this.previewUrl.startsWith('blob:')
      return isPdf
    },
    pdfSrc() {
      if (!this.previewUrl) return null

      // Return URL string directly - vue-pdf will handle the loading task internally
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
  },
  watch: {
    pdfSrc: {
      handler(newVal) {
        // Reset state when PDF source changes
        if (newVal && this.isPdf) {
          this.pdfReady = false
          this.currentPage = 1
          this.numPages = 0
          // Use nextTick to ensure DOM is ready before setting pdfReady
          this.$nextTick(() => {
            this.pdfReady = true
          })
        } else {
          this.pdfReady = false
        }
      },
      immediate: true
    }
  },
  methods: {
    handlePdfError(error) {
      this.pdfReady = false
      // Optionally emit error to parent component
      this.$emit('pdf-error', error)
    },
    handlePdfLoaded(numPages) {
      this.numPages = numPages
    }
  }
}
</script>
