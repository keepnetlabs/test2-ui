<template>
  <div class="training-library-drawer-content-summary">
    <!-- Sol taraf: Image -->
    <div class="training-library-drawer-content-summary__image-section">
      <div class="training-library-drawer-content-summary__image-wrapper">
        <img
          v-if="getTrainingImage"
          :src="getTrainingImage"
          alt="Training Cover"
          class="training-library-drawer-content-summary__image"
        />
        <div v-else class="training-library-drawer-content-summary__no-image">
          <VIcon size="82" color="#fff">mdi-image</VIcon>
          <div class="training-library-drawer-content-summary__no-image-text">
            No Cover Image
          </div>
        </div>
      </div>
      <VBtn
        block
        color="#2196F3"
        class="training-library-drawer-content-summary__preview-btn"
        dark
        rounded
        depressed
        :ripple="false"
      >
        <VIcon left>mdi-eye</VIcon>
        {{ getPreviewButtonText }}
      </VBtn>
      <div class="training-library-drawer-content-summary__send-wrapper">
        <VBtn
          outlined
          color="#fff"
          class="training-library-drawer-content-summary__send-btn"
          rounded
          :ripple="false"
        >
          <VIcon left color="#757575">mdi-send</VIcon>
          {{ getSendButtonText }}
        </VBtn>
        <VBtn
          icon
          color="#fff"
          :ripple="false"
          class="training-library-drawer-content-summary__action-icon"
        >
          <VIcon color="#757575" style="font-size: 20px;">mdi-bookmark-outline</VIcon>
        </VBtn>
        <VBtn
          icon
          color="#fff"
          :ripple="false"
          class="training-library-drawer-content-summary__action-icon"
        >
          <VIcon color="#757575" style="font-size: 20px;">mdi-dots-vertical</VIcon>
        </VBtn>
      </div>
    </div>

    <!-- Sağ taraf: Details -->
    <div class="training-library-drawer-content-summary__details-section">
      <!-- Training Name -->
      <h2 class="training-library-drawer-content-summary__title">
        {{ trainingData.trainingName || 'Training Name' }}
      </h2>

      <!-- Info Cards Grid -->
      <div class="training-library-drawer-content-summary__info-grid">
        <TrainingLibraryDrawerInfoCard
          v-for="(card, index) in getInfoCards"
          :key="index"
          :icon="card.icon"
          :text="card.text"
        />
      </div>

      <!-- Description -->
      <p class="training-library-drawer-content-summary__description">
        {{
          trainingData.description ||
          'This comprehensive training provides employees with the knowledge and skills needed to protect against phishing attacks. Supported by real-world examples and interactive simulations, the training content enhances security awareness.'
        }}
      </p>
    </div>
  </div>
</template>

<script>
import TrainingLibraryDrawerInfoCard from './TrainingLibraryDrawerInfoCard.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingLibraryDrawerContentSummary',
  components: {
    TrainingLibraryDrawerInfoCard
  },
  props: {
    trainingData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'Training Library'
    }
  },
  computed: {
    getTrainingImage() {
      return this.trainingData.coverImage
    },
    getPreviewButtonText() {
      if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) return 'PREVIEW LEARNING PATH'
      if (this.type === TRAINING_LIBRARY_TYPES.POSTER) return 'PREVIEW POSTER'
      if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) return 'PREVIEW INFOGRAPHIC'
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) return 'PREVIEW SCREENSAVER'
      if (this.type === TRAINING_LIBRARY_TYPES.SURVEY) return 'PREVIEW SURVEY'
      return 'PREVIEW TRAINING'
    },
    getSendButtonText() {
      if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) return 'SEND LEARNING PATH'
      if (this.type === TRAINING_LIBRARY_TYPES.POSTER) return 'SEND POSTER'
      if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) return 'SEND INFOGRAPHIC'
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) return 'DOWNLOAD SCREENSAVER'
      if (this.type === TRAINING_LIBRARY_TYPES.SURVEY) return 'SEND SURVEY'
      return 'SEND TRAINING'
    },
    getInfoCards() {
      return [
        {
          icon: 'mdi-email-outline',
          text: this.trainingData.category || 'Email Security'
        },
        {
          icon: 'mdi-chart-bar',
          text: this.trainingData.difficulty || 'Beginner'
        },
        {
          icon: 'mdi-account-group-outline',
          text: this.trainingData.targetAudience || 'All Employees'
        },
        {
          icon: 'mdi-clock-outline',
          text: this.trainingData.duration || '5 minutes'
        },
        {
          icon: 'mdi-shield-check-outline',
          text: this.trainingData.compliance || '2 compliance'
        },
        {
          icon: 'mdi-web',
          text: this.trainingData.languages || '5 languages'
        }
      ]
    }
  }
}
</script>
