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
      <TrainingLibraryDrawerLanguageMenu
        :languages="availableLanguages"
        :is-loading="isLoadingLanguages"
        @language-selected="handlePreviewClick"
      >
        <template #activator>
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
        </template>
      </TrainingLibraryDrawerLanguageMenu>
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
        <TrainingLibraryDrawerActionsMenu
          :type="type"
          :is-deletable="isDeletable"
          @edit="handleEdit"
          @duplicate="handleDuplicate"
          @delete="handleDelete"
          @download="handleDownload"
        >
          <template #activator>
            <VBtn
              icon
              color="#fff"
              :ripple="false"
              class="training-library-drawer-content-summary__action-icon"
            >
              <VIcon color="#757575" style="font-size: 20px;">mdi-dots-vertical</VIcon>
            </VBtn>
          </template>
        </TrainingLibraryDrawerActionsMenu>
      </div>
    </div>

    <!-- Sağ taraf: Details -->
    <div class="training-library-drawer-content-summary__details-section">
      <!-- Training Name -->
      <h2 class="training-library-drawer-content-summary__title">
        {{ getCurrentTrainingData.trainingName || 'Training Name' }}
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
          getCurrentTrainingData.description ||
          'This comprehensive training provides employees with the knowledge and skills needed to protect against phishing attacks. Supported by real-world examples and interactive simulations, the training content enhances security awareness.'
        }}
      </p>
    </div>
  </div>
</template>

<script>
import TrainingLibraryDrawerInfoCard from './TrainingLibraryDrawerInfoCard.vue'
import TrainingLibraryDrawerLanguageMenu from './TrainingLibraryDrawerLanguageMenu.vue'
import TrainingLibraryDrawerActionsMenu from './TrainingLibraryDrawerActionsMenu.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingLibraryDrawerContentSummary',
  components: {
    TrainingLibraryDrawerInfoCard,
    TrainingLibraryDrawerLanguageMenu,
    TrainingLibraryDrawerActionsMenu
  },
  props: {
    trainingData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'Training Library'
    },
    isDeletable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      availableLanguages: [],
      isLoadingLanguages: false,
      trainingDetails: null
    }
  },
  mounted() {
    console.log('📦 TrainingData received:', this.trainingData)
    console.log('🌍 trainingData.languages:', this.trainingData.languages)
    console.log('🔢 trainingData.trainingLanguageIds:', this.trainingData.trainingLanguageIds)

    if (this.trainingData.trainingId || this.trainingData.resourceId) {
      this.callForLanguages()
    }
  },
  watch: {
    trainingData: {
      deep: true,
      handler(newVal) {
        console.log('🔄 TrainingData changed:', newVal)
        if (newVal && (newVal.trainingId || newVal.resourceId)) {
          this.callForLanguages()
        }
      }
    }
  },
  computed: {
    getCurrentTrainingData() {
      return this.trainingDetails || this.trainingData
    },
    getTrainingImage() {
      return this.getCurrentTrainingData.coverImage
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
    getLanguagesText() {
      // API'den dil isimleri geldiyse onları kullan
      if (this.availableLanguages && this.availableLanguages.length > 0) {
        if (this.availableLanguages.length === 1) {
          return this.availableLanguages[0].text
        }
        return `${this.availableLanguages.length} languages`
      }

      // Yoksa trainingData'dan gelen kodları kullan
      const languageCodes = this.trainingData.languages
      if (languageCodes && Array.isArray(languageCodes)) {
        if (languageCodes.length === 1) {
          return languageCodes[0] // Kod göster (örn: "AR")
        }
        return `${languageCodes.length} languages`
      }

      return 'No languages'
    },
    getInfoCards() {
      const data = this.getCurrentTrainingData
      return [
        {
          icon: 'mdi-email-outline',
          text: data.categoryName || data.category || 'No category'
        },
        {
          icon: 'mdi-chart-bar',
          text: data.difficulty || 'No difficulty'
        },
        {
          icon: 'mdi-account-group-outline',
          text: data.targetAudienceName || data.targetAudience || 'No target audience'
        },
        {
          icon: 'mdi-clock-outline',
          text: data.duration || 'No duration'
        },
        {
          icon: 'mdi-shield-check-outline',
          text: this.getComplianceText(data)
        },
        {
          icon: 'mdi-web',
          text: this.getLanguagesText
        }
      ]
    }
  },
  methods: {
    getComplianceText(data) {
      // compliances array ise
      if (data.compliances && Array.isArray(data.compliances)) {
        const filtered = data.compliances.filter((c) => c && typeof c === 'string' && c.trim() !== '')
        if (filtered.length === 0) return 'No compliance'
        if (filtered.length === 1) return filtered[0]
        return `${filtered.length} compliances`
      }
      // compliance string ise
      if (data.compliance) {
        return data.compliance
      }
      return 'No compliance'
    },
    callForLanguages() {
      console.log('🔍 Fetching languages for training:', this.trainingData)
      console.log('🌍 Language codes from training:', this.trainingData.languages)

      this.isLoadingLanguages = true
      AwarenessEducatorService.getLanguages()
        .then((res) => {
          console.log('✅ Languages API response:', res?.data?.data)

          const languageCodes = this.trainingData.languages || []
          this.availableLanguages = []

          languageCodes.forEach((langCode) => {
            // API'den gelen dillerde shortCode veya code field'ı ile eşleştir
            const language = res?.data?.data?.find(
              (item) => item.shortCode === langCode || item.code === langCode || item.id === langCode
            )
            if (language) {
              this.availableLanguages.push({
                text: language.name,
                value: language.id
              })
              console.log(`✅ Matched ${langCode} → ${language.name}`)
            } else {
              console.warn(`⚠️ Language code not found in API: ${langCode}`)
            }
          })

          console.log('🌐 Available languages:', this.availableLanguages)
        })
        .catch((error) => {
          console.error('❌ Error fetching languages:', error)
        })
        .finally(() => {
          this.callForTrainingDetail()
        })
    },
    callForTrainingDetail() {
      const trainingId = this.trainingData.trainingId
      if (!trainingId) {
        console.warn('⚠️ No trainingId found')
        this.isLoadingLanguages = false
        return
      }

      console.log('📥 Fetching training details for ID:', trainingId)

      AwarenessEducatorService.getTraining(trainingId)
        .then((response) => {
          const {
            data: { data }
          } = response

          console.log('✅ Training details:', data)

          this.trainingDetails = {
            ...data,
            languages: this.availableLanguages.map((lang) => lang.text).join(', ')
          }

          console.log('📦 Training details with languages:', this.trainingDetails)
        })
        .catch((error) => {
          console.error('❌ Error fetching training details:', error)
        })
        .finally(() => {
          this.isLoadingLanguages = false
        })
    },
    handlePreviewClick(language) {
      this.$emit('preview-clicked', {
        language,
        trainingData: this.trainingData
      })
    },
    handleEdit() {
      this.$emit('edit', this.trainingData)
    },
    handleDuplicate() {
      const trainingId = this.trainingData.trainingId || this.trainingData.resourceId
      if (!trainingId) {
        console.error('❌ No trainingId found for duplicate')
        return
      }

      AwarenessEducatorService.duplicateTraining(trainingId).then(() => {
        // Drawer'ı kapat ve listeyi yenile
        this.$emit('duplicate-success')
      })
    },
    handleDelete() {
      this.$store.commit('trainingLibrary/SET_DELETE_DIALOG', {
        status: true,
        title: 'Delete Training',
        body: 'Are you sure you want to delete this training material?',
        selectedRow: this.trainingData,
        type: this.type,
        apiFunc: (trainingId) => {
          return AwarenessEducatorService.deleteTraining(trainingId)
        },
        onClose: (forceUpdate) => {
          this.$store.commit('trainingLibrary/SET_DELETE_DIALOG', {
            status: false,
            title: '',
            body: '',
            selectedRow: null,
            type: '',
            onClose: () => {}
          })

          // Silme başarılı olduysa drawer'ı kapat
          if (forceUpdate) {
            this.$emit('delete-success')
          }
        }
      })
    },
    handleDownload() {
      this.$emit('download', this.trainingData)
    }
  }
}
</script>
