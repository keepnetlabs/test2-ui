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
          v-if="!isLearningPath"
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
        <VBtn
          v-else-if="!onlyPreview"
          block
          color="#2196F3"
          class="training-library-drawer-content-summary__preview-btn"
          dark
          rounded
          depressed
          :ripple="false"
          @click="handleSend"
        >
          <VIcon left>mdi-send</VIcon>
          {{ getPreviewButtonText }}
        </VBtn>
        <div
          v-if="!onlyPreview && !isLearningPath"
          class="training-library-drawer-content-summary__send-wrapper"
        >
          <!-- Screensaver: open language select like preview, then download -->
          <template v-if="isScreensaver">
            <TrainingLibraryDrawerLanguageMenu
              :languages="availableLanguages"
              :is-loading="isLoadingLanguages"
              @language-selected="handleDownloadByLanguage"
            >
              <template #activator>
                <VBtn
                  outlined
                  color="#fff"
                  class="training-library-drawer-content-summary__send-btn"
                  rounded
                  :ripple="false"
                >
                  <VIcon left color="#757575">mdi-download</VIcon>
                  {{ getSendButtonText }}
                </VBtn>
              </template>
            </TrainingLibraryDrawerLanguageMenu>
          </template>
          <template v-else>
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
          </template>
          <VBtn
            icon
            color="#fff"
            :ripple="false"
            class="training-library-drawer-content-summary__action-icon"
            @click="handleFavoriteToggle"
          >
            <VIcon :color="isFavorite ? '#757575' : '#757575'" style="font-size: 20px;">
              {{ isFavorite ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
            </VIcon>
          </VBtn>
          <TrainingLibraryDrawerActionsMenu
            v-if="!onlyPreview"
            :type="type"
            :is-deletable="isDeletable"
            :is-nested="isNested"
            :is-deep-nested="isDeepNested"
            :languages="availableLanguages"
            @edit="handleEdit"
            @duplicate="handleDuplicate"
            @delete="handleDelete"
            @download="handleDownloadByLanguage"
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
            :tooltip="card.tooltip"
          />
        </div>

        <!-- Description -->
        <p class="training-library-drawer-content-summary__description">
          {{ getCurrentTrainingData.description }}
        </p>

        <!-- Learning Path Steps -->
        <TrainingLibraryDrawerContentSteps
          v-if="isLearningPath && learningPathSteps.length > 0"
          :steps="learningPathSteps"
          @preview-step="handlePreviewStep"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TrainingLibraryDrawerInfoCard from './TrainingLibraryDrawerInfoCard.vue'
import TrainingLibraryDrawerLanguageMenu from './TrainingLibraryDrawerLanguageMenu.vue'
import TrainingLibraryDrawerActionsMenu from './TrainingLibraryDrawerActionsMenu.vue'
import TrainingLibraryDrawerContentSteps from './TrainingLibraryDrawerContentSteps.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingLibraryDrawerContentSummary',
  components: {
    TrainingLibraryDrawerInfoCard,
    TrainingLibraryDrawerLanguageMenu,
    TrainingLibraryDrawerActionsMenu,
    TrainingLibraryDrawerContentSteps
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
    },
    isNested: {
      type: Boolean,
      default: false
    },
    isDeepNested: {
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
      availableLanguages: [],
      isLoadingLanguages: true,
      trainingDetails: null,
      isFavorite: false,
      learningPathSteps: []
    }
  },
  mounted() {
    this.isFavorite = this.trainingData.isFavourite || false

    if (this.trainingData.trainingId || this.trainingData.resourceId) {
      this.callForLanguages()
    }
    if (this.isLearningPath && this.trainingData.trainingGroups) {
      this.processLearningPathSteps()
    }
  },
  watch: {
    trainingData: {
      deep: true,
      handler(newVal) {
        this.isFavorite = newVal.isFavourite || false
        if (newVal && (newVal.trainingId || newVal.resourceId)) {
          this.callForLanguages()
        }
        // Learning Path ise steps'i güncelle
        if (this.isLearningPath && newVal.trainingGroups) {
          this.processLearningPathSteps()
        }
      }
    }
  },
  computed: {
    isScreensaver() {
      return this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER
    },
    isLearningPath() {
      return this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
    },
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
      if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) return 'SEND LEARNING PATH'
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
          icon: 'mdi-shape-outline',
          text: data.categoryName || data.category || 'No category'
        },
        /*
        {
          icon: 'mdi-chart-bar',
          text: data.difficulty || 'No difficulty'
        },
        */
        {
          icon: 'mdi-account-outline',
          text: data.targetAudienceName || data.targetAudience || 'No target audience'
        },
        /*
        {
          icon: 'mdi-clock-outline',
          text: data.duration || 'No duration'
        },
        */
        {
          icon: 'mdi-shield-check-outline',
          text: this.getComplianceText(data),
          tooltip: this.getComplianceTooltip(data)
        },
        {
          icon: 'mdi-web',
          text: this.getLanguagesText,
          tooltip: this.getLanguagesTooltip()
        }
      ]
    }
  },
  methods: {
    processLearningPathSteps() {
      // trainingDetails'den veya trainingData'dan al
      const trainingGroups =
        this.trainingDetails?.trainingGroups || this.trainingData.trainingGroups

      if (!trainingGroups || !Array.isArray(trainingGroups)) {
        this.learningPathSteps = []
        return
      }

      // trainingOrder'a göre sırala ve map et
      this.learningPathSteps = [...trainingGroups]
        .sort((a, b) => (a.trainingOrder || 0) - (b.trainingOrder || 0))
        .map((step) => ({
          title: step.name,
          type: step.type === 'SCORM' ? 'Training' : step.type,
          detailTrainingId: step.detailTrainingId,
          languages: step.languages,
          coverImage: step.coverImage
        }))
    },
    handlePreviewStep(step) {
      // Eğer zaten nested içindeysek, deep nested drawer açmalıyız
      if (this.isNested) {
        this.$store.commit('trainingLibrary/SET_DEEP_NESTED_DRAWER', {
          status: true,
          selectedRow: {
            trainingId: step.detailTrainingId,
            resourceId: step.detailTrainingId,
            name: step.title,
            trainingName: step.title,
            languages: step.languages,
            coverImage: step.coverImage
          },
          type: step.type === 'Training' ? 'Training' : step.type,
          onlyPreview: this.onlyPreview
        })
      } else {
        // Normal nested drawer açılacak
        this.$store.commit('trainingLibrary/SET_NESTED_DRAWER', {
          status: true,
          selectedRow: {
            trainingId: step.detailTrainingId,
            resourceId: step.detailTrainingId,
            name: step.title,
            trainingName: step.title,
            languages: step.languages,
            coverImage: step.coverImage
          },
          type: step.type === 'Training' ? 'Training' : step.type,
          onlyPreview: this.onlyPreview
        })
      }
    },
    handleDownloadByLanguage(language) {
      // Map to ID if structure is { text, value }
      const languageId = language?.value || language?.id || language
      const trainingId = this.trainingData.trainingId || this.trainingData.resourceId
      if (!trainingId || !languageId) return
      // Use blob download endpoint (same used by legacy screensaver preview dialog)
      AwarenessEducatorService.downloadPoster({ trainingId, languageId })
        .then((response) => {
          const blob = response?.data
          // Try to resolve filename from headers; fallback to training name
          const disposition =
            response?.headers &&
            (response.headers['content-disposition'] || response.headers['Content-Disposition'])

          let filename = this.trainingData.name || this.trainingData.trainingName || 'screensaver'

          if (disposition) {
            const match = /filename\*=UTF-8''([^;]+)|filename=\"?([^;\"]+)/i.exec(disposition)
            if (match) {
              filename = decodeURIComponent(match[1] || match[2])
            }
          }

          // Eğer filename'de uzantı yoksa veya .jfif gibi istenmeyen uzantı varsa, content-type'dan al
          if (!filename.match(/\.(jpg|jpeg|png|gif|pdf)$/i) || filename.includes('.jfif')) {
            const contentType =
              response?.headers &&
              (response.headers['content-type'] || response.headers['Content-Type'])

            const extensionMap = {
              'image/jpeg': '.jpg',
              'image/jpg': '.jpg',
              'image/png': '.png',
              'image/gif': '.gif',
              'application/pdf': '.pdf'
            }

            const extension = extensionMap[contentType] || '.jpg'
            // .jfif varsa değiştir, yoksa ekle
            if (filename.includes('.jfif')) {
              filename = filename.replace(/\.jfif$/i, extension)
            } else if (!filename.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
              filename = filename + extension
            }
          }

          this.downloadBlob(blob, filename)
        })
        .catch(() => {})
    },
    downloadBlob(blob, filename) {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    },
    getLanguagesTooltip() {
      if (this.availableLanguages && this.availableLanguages.length > 1) {
        return this.availableLanguages.map((l) => l.text).join(', ')
      }
      const languageCodes = this.trainingData.languages
      if (Array.isArray(languageCodes) && languageCodes.length > 1) {
        return languageCodes.join(', ')
      }
      return ''
    },
    getComplianceTooltip(data) {
      if (data && Array.isArray(data.complianceNames)) {
        const filtered = data.complianceNames.filter(
          (c) => c && typeof c === 'string' && c.trim() !== ''
        )
        if (filtered.length > 1) return filtered.join(', ')
      }
      return ''
    },
    getComplianceText(data) {
      if (data.complianceNames && Array.isArray(data.complianceNames)) {
        const filtered = data.complianceNames.filter(
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
      this.isLoadingLanguages = true
      AwarenessEducatorService.getLanguages()
        .then((res) => {
          // languageCodes varsa onu kullan (orijinal kodlar), yoksa languages'i dene
          const languageCodes = this.trainingData.languageCodes || this.trainingData.languages || []
          this.availableLanguages = []
          // Array kontrolü
          if (!Array.isArray(languageCodes)) {
            this.isLoadingLanguages = false
            return
          }
          languageCodes.forEach((langCode) => {
            // API'den gelen dillerde shortCode veya code field'ı ile eşleştir
            const language = res?.data?.data?.find(
              (item) =>
                item.shortCode === langCode || item.code === langCode || item.id === langCode
            )
            if (language) {
              this.availableLanguages.push({
                text: language.isoFriendlyName || language.name,
                value: language.id
              })
            }
          })
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
        this.isLoadingLanguages = false
        return
      }
      AwarenessEducatorService.getTraining(trainingId)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.trainingDetails = {
            ...data,
            category: data.category || this.trainingData.category,
            categoryName: data.categoryName || this.trainingData.categoryName,
            languages: this.availableLanguages.map((lang) => lang.text).join(', '),
            // Prefer API compliances; fallback to selectedRow.compliances
            compliances: Array.isArray(data.complianceNames)
              ? data.complianceNames
              : this.trainingData.complianceNames || []
          }
          // isFavorite'i training details'den güncelle
          this.isFavorite = data.isFavourite || false
          // Category'yi parent'a emit et (boşluksuz versiyonu)
          this.$emit('category-ready', this.trainingDetails.category)

          // Learning Path ise ve trainingGroups API'den geldiyse steps'i işle
          if (this.isLearningPath && data.trainingGroups) {
            this.trainingDetails.trainingGroups = data.trainingGroups
            this.processLearningPathSteps()
          }
        })
        .catch((error) => {
          console.error('❌ Error fetching training details:', error)
        })
        .finally(() => {
          this.isLoadingLanguages = false
        })
    },
    handlePreviewClick(language) {
      // Learning Path ise send modal aç
      if (this.isLearningPath) {
        this.handleSend()
        return
      }

      const trainingId = this.trainingData.trainingId || this.trainingData.resourceId
      const languageId = language.value

      AwarenessEducatorService.getTrainingUrlForPreview(trainingId, languageId)
        .then((response) => {
          const previewData = response?.data?.data || response?.data
          const previewUrl = previewData?.trainingUrl || previewData

          // Filename'i al
          const splittedUrl = previewUrl.split('/')
          const fileName = splittedUrl[splittedUrl.length - 1]
          const isPdf = fileName.includes('.pdf')
          if (isPdf) {
            // Store'da lightbox'ı aç ve loading göster
            this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
              status: true,
              previewData: null,
              isLoading: true,
              type: this.type
            })

            // PDF ise blob olarak indir
            AwarenessEducatorService.downloadPoster({ trainingId, languageId })
              .then((blobResponse) => {
                const blobUrl = window.URL.createObjectURL(blobResponse.data)
                // Download tamamlandı, şimdi lightbox'ı aç
                this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
                  status: true,
                  previewData: blobUrl,
                  isLoading: false,
                  type: this.type
                })
              })
              .catch((error) => {
                console.error('❌ Error downloading PDF:', error)
                this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
                  status: false,
                  previewData: null,
                  isLoading: false,
                  type: null
                })
              })
          } else {
            // Image ise direkt URL'i göster
            this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
              status: true,
              previewData: previewUrl,
              isLoading: false,
              type: this.type
            })
          }
        })
        .catch((error) => {
          console.error('❌ Error fetching preview URL:', error)
          this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
            status: false,
            previewData: null,
            isLoading: false,
            type: null
          })
        })
    },
    handleEdit() {
      // Open corresponding edit modal based on type
      const selectedRow = this.trainingData
      if (this.type === TRAINING_LIBRARY_TYPES.TRAINING) {
        this.$store.dispatch('trainingLibrary/setNewTrainingModal', {
          status: true,
          selectedRow,
          isEdit: true,
          isDuplicate: false
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH) {
        this.$store.dispatch('trainingLibrary/setNewLearningPathModal', {
          status: true,
          selectedRow,
          isEdit: true,
          isDuplicate: false
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.POSTER) {
        this.$store.dispatch('trainingLibrary/setNewPosterModal', {
          status: true,
          selectedRow,
          isEdit: true,
          isDuplicate: false
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) {
        this.$store.dispatch('trainingLibrary/setNewInfographicModal', {
          status: true,
          selectedRow,
          isEdit: true,
          isDuplicate: false
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) {
        this.$store.dispatch('trainingLibrary/setNewScreensaverModal', {
          status: true,
          selectedRow,
          isEdit: true,
          isDuplicate: false
        })
      } else if (this.type === TRAINING_LIBRARY_TYPES.SURVEY) {
        this.$store.dispatch('trainingLibrary/setNewSurveyModal', {
          status: true,
          selectedRow,
          isEdit: true,
          isDuplicate: false
        })
      }
      // Edit modal açıldı, drawer kapanmalı
      this.$emit('edit-clicked')
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
      })
    },
    handleSend() {
      // Screensaver: open download flow instead of send
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) {
        const firstLang = this.availableLanguages[0]
        if (!firstLang) return
        this.handleDownloadByLanguage(firstLang)
        // Drawer should remain open for Screensaver downloads
        return
      }
      // Other types: open related send modal
      if (this.type === TRAINING_LIBRARY_TYPES.TRAINING) {
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
