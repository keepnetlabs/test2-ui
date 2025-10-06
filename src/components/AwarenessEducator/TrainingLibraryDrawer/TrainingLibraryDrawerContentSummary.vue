<template>
  <div class="training-library-drawer-content-summary">
    <!-- Skeleton Loader -->
    <div v-if="isLoadingLanguages" class="training-library-drawer-content-summary__skeleton">
      <div class="training-library-drawer-content-summary__image-section">
        <div class="skeleton skeleton--image"></div>
        <div class="skeleton skeleton--button"></div>
        <div class="skeleton skeleton--button"></div>
      </div>
      <div class="training-library-drawer-content-summary__details-section">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="skeleton skeleton--heading" style="width: 60%;"></div>
          <div class="d-flex gap-2">
            <div class="skeleton skeleton--avatar"></div>
            <div class="skeleton skeleton--avatar"></div>
            <div class="skeleton skeleton--avatar"></div>
          </div>
        </div>
        <div class="training-library-drawer-content-summary__info-grid">
          <div class="skeleton skeleton--info-card">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--text" style="width: 75%;"></div>
          </div>
          <div class="skeleton skeleton--info-card">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--text" style="width: 65%;"></div>
          </div>
          <div class="skeleton skeleton--info-card">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--text" style="width: 80%;"></div>
          </div>
          <div class="skeleton skeleton--info-card">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--text" style="width: 70%;"></div>
          </div>
          <div class="skeleton skeleton--info-card">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--text" style="width: 60%;"></div>
          </div>
          <div class="skeleton skeleton--info-card">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--text" style="width: 55%;"></div>
          </div>
        </div>
        <div class="skeleton skeleton--paragraph mb-2"></div>
        <div class="skeleton skeleton--paragraph" style="width: 80%;"></div>
      </div>
    </div>

    <!-- Actual Content -->
    <div v-else class="training-library-drawer-content-summary__content">
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
            <VIcon size="36" color="#fff">mdi-image</VIcon>
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
            @click="handleSend"
          >
            <VIcon left color="#757575">mdi-send</VIcon>
            {{ getSendButtonText }}
          </VBtn>
          <VBtn
            icon
            color="#fff"
            :ripple="false"
            class="training-library-drawer-content-summary__action-icon"
            @click="handleFavoriteToggle"
          >
            <VIcon :color="isFavorite ? '#FFC107' : '#757575'" style="font-size: 20px;">
              {{ isFavorite ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
            </VIcon>
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
          {{ getCurrentTrainingData.name }}
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
          {{ getCurrentTrainingData.description }}
        </p>
      </div>
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
      default: TRAINING_LIBRARY_TYPES.TRAINING
    },
    isDeletable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      availableLanguages: [],
      isLoadingLanguages: true,
      trainingDetails: null,
      isFavorite: false
    }
  },
  mounted() {
    console.log('📦 TrainingData received:', this.trainingData)
    console.log('🌍 trainingData.languages:', this.trainingData.languages)
    console.log('🔢 trainingData.trainingLanguageIds:', this.trainingData.trainingLanguageIds)

    this.isFavorite = this.trainingData.isFavourite || false

    if (this.trainingData.trainingId || this.trainingData.resourceId) {
      this.callForLanguages()
    }
  },
  watch: {
    trainingData: {
      deep: true,
      handler(newVal) {
        console.log('🔄 TrainingData changed:', newVal)
        this.isFavorite = newVal.isFavourite || false
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
      const coverImage = this.getCurrentTrainingData.coverImage
      // coverImage object ise imageUrl'i döndür, string ise direkt döndür
      if (!coverImage) return null
      return typeof coverImage === 'string' ? coverImage : coverImage.imageUrl
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
        const filtered = data.compliances.filter(
          (c) => c && typeof c === 'string' && c.trim() !== ''
        )
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
              (item) =>
                item.shortCode === langCode || item.code === langCode || item.id === langCode
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
          console.log('🔍 Original trainingData.category:', this.trainingData.category)
          console.log('🔍 Original trainingData.categoryName:', this.trainingData.categoryName)
          console.log('🔍 API data.category:', data.category)
          console.log('🔍 API data.categoryName:', data.categoryName)

          this.trainingDetails = {
            ...data,
            category: data.category || this.trainingData.category,
            categoryName: data.categoryName || this.trainingData.categoryName,
            languages: this.availableLanguages.map((lang) => lang.text).join(', ')
          }

          console.log('✅ Merged trainingDetails.category:', this.trainingDetails.category)
          console.log('✅ Merged trainingDetails.categoryName:', this.trainingDetails.categoryName)

          // isFavorite'i training details'den güncelle
          this.isFavorite = data.isFavourite || false

          // Category'yi parent'a emit et (boşluksuz versiyonu)
          this.$emit('category-ready', this.trainingDetails.category)

          console.log('📦 Training details with languages:', this.trainingDetails)
          console.log('⭐ isFavorite:', this.isFavorite)
        })
        .catch((error) => {
          console.error('❌ Error fetching training details:', error)
        })
        .finally(() => {
          this.isLoadingLanguages = false
        })
    },
    handlePreviewClick(language) {
      console.log('👁️ Preview clicked with language:', language)

      const trainingId = this.trainingData.trainingId || this.trainingData.resourceId
      const languageId = language.value

      // Store'da lightbox'ı aç ve loading göster
      this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
        status: true,
        previewData: null,
        isLoading: true,
        type: this.type
      })

      console.log('📥 Fetching preview URL for:', {
        trainingId,
        languageId,
        type: this.type
      })

      AwarenessEducatorService.getTrainingUrlForPreview(trainingId, languageId)
        .then((response) => {
          console.log('✅ Full response:', response)
          const previewData = response?.data?.data || response?.data

          console.log('✅ Preview data:', previewData)

          // Preview data'yı store'a set et
          this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
            status: true,
            previewData: previewData,
            isLoading: false,
            type: this.type
          })
        })
        .catch((error) => {
          console.error('❌ Error fetching preview URL:', error)

          // Hata durumunda lightbox'ı kapat
          this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
            status: false,
            previewData: null,
            isLoading: false,
            type: null
          })
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
    },
    handleFavoriteToggle() {
      const resourceId = this.trainingData.trainingId || this.trainingData.resourceId
      if (!resourceId) {
        console.error('❌ No resourceId found for favorite toggle')
        return
      }

      const apiCall = this.isFavorite
        ? AwarenessEducatorService.removeFromFavorite(resourceId)
        : AwarenessEducatorService.addToFavorite(resourceId)

      apiCall.then(() => {
        this.isFavorite = !this.isFavorite
        console.log(`✅ ${this.isFavorite ? 'Added to' : 'Removed from'} favorites`)
      })
    },
    handleSend() {
      console.log('📤 Send button clicked')
      console.log('📦 Current type:', this.type)
      console.log('📦 TRAINING_LIBRARY_TYPES:', TRAINING_LIBRARY_TYPES)
      console.log('📦 Training data:', this.trainingData)

      // Type'a göre ilgili send modal'ını aç
      if (this.type === TRAINING_LIBRARY_TYPES.TRAINING) {
        console.log('✅ Opening Training Send Modal')
        this.$store.commit('trainingLibrary/SET_TRAINING_SEND_MODAL', {
          status: true,
          selectedRow: this.trainingData
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) {
        this.$store.commit('trainingLibrary/SET_LEARNING_PATH_SEND_MODAL', {
          status: true,
          selectedRow: this.trainingData
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.POSTER) {
        this.$store.commit('trainingLibrary/SET_POSTER_SEND_MODAL', {
          status: true,
          selectedRow: this.trainingData
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) {
        this.$store.commit('trainingLibrary/SET_INFOGRAPHIC_SEND_MODAL', {
          status: true,
          selectedRow: this.trainingData
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) {
        this.$store.commit('trainingLibrary/SET_SCREENSAVER_SEND_MODAL', {
          status: true,
          selectedRow: this.trainingData
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.SURVEY) {
        this.$store.commit('trainingLibrary/SET_SURVEY_SEND_MODAL', {
          status: true,
          selectedRow: this.trainingData
        })
      }

      // Drawer store'unu temizle
      this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
        status: false,
        selectedRow: null,
        showSendButton: true,
        type: TRAINING_LIBRARY_TYPES.TRAINING
      })

      // Modal açıldıktan sonra drawer'ı kapat
      this.$emit('send-clicked')
    }
  }
}
</script>
