<template>
  <div class="training-library-drawer-content-related">
    <h3 class="training-library-drawer-content-related__title">
      {{ getRelatedTitle }}
    </h3>

    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="training-library-drawer-content-related__grid">
      <div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton skeleton--related-card">
        <div class="skeleton skeleton--related-image"></div>
        <div class="skeleton skeleton--related-content">
          <div class="skeleton skeleton--related-title"></div>
          <div class="skeleton skeleton--related-subtitle" style="width: 60%;"></div>
          <div class="skeleton skeleton--related-subtitle" style="width: 80%;"></div>
          <div class="skeleton skeleton--related-button"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading && relatedItems.length === 0"
      class="training-library-drawer-content-related__empty"
    >
      There are currently no additional {{ type.toLowerCase() }}s under this category
    </div>

    <!-- Actual Content -->
    <div v-else class="training-library-drawer-content-related__grid">
      <VCard
        v-for="(card, index) in relatedItems"
        :key="index"
        class="training-library-drawer-content-related__card"
        outlined
      >
        <div class="training-library-drawer-content-related__card-image">
          <TrainingLibraryNewBadge
            v-if="card.isNew"
            class="training-library-drawer-content-related__card-new-badge"
          />
          <TrainingLibraryFavoriteButton
            class="training-library-drawer-content-related__card-favorite-btn"
            :is-default-favourite="card.isFavourite"
            :training-id="card.trainingId || card.resourceId"
          />
          <template v-if="card.coverImage">
            <img :src="card.coverImage" :alt="card.title" />
          </template>
          <template v-else>
            <div class="training-library-drawer-content-related__card-no-image">
              <VIcon size="36" color="#fff">mdi-image</VIcon>
              <div class="training-library-drawer-content-related__card-no-image-text">
                No Cover Image
              </div>
            </div>
          </template>
        </div>
        <div class="training-library-drawer-content-related__card-body">
          <VTooltip bottom :disabled="!isTitleOverflowing(card.title)">
            <template #activator="{ on }">
              <div
                class="training-library-drawer-content-related__card-title"
                v-on="on"
                :ref="`title-${index}`"
              >
                {{ card.title }}
              </div>
            </template>
            <span>{{ card.title }}</span>
          </VTooltip>
          <div class="training-library-drawer-content-related__card-meta">
            <VTooltip bottom max-width="300" :disabled="!isTrainingRolesTooltipEnabled(card)">
              <template #activator="{ on }">
                <span v-on="on">{{ getTrainingRolesText(card) }}</span>
              </template>
              <span>{{ getTrainingRolesTooltip(card) }}</span>
            </VTooltip>
            <span class="dot">•</span>
            <span>{{ card.category }}</span>
          </div>
          <div class="training-library-drawer-content-related__card-langs">
            <VIcon small class="mr-1">mdi-web</VIcon>
            <span v-if="card.languages.length <= 2">{{ card.languagesFormatted }}</span>
            <span v-else>
              {{ getFirstTwoLanguages(card.languages) }}
              <VTooltip bottom>
                <template #activator="{ on }">
                  <span v-on="on" style="cursor: pointer;">, +{{ card.languages.length - 2 }}</span>
                </template>
                <span>{{ getRemainingLanguages(card.languages) }}</span>
              </VTooltip>
            </span>
          </div>
          <div class="training-library-drawer-content-related__card-actions">
            <VBtn
              class="w-100 fw-600"
              rounded
              outlined
              color="#2196F3"
              :ripple="false"
              @click="handlePreviewClick(card)"
            >
              <VIcon left small class="mr-1">mdi-eye</VIcon>
              Preview
            </VBtn>
          </div>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import TrainingLibraryNewBadge from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryNewBadge.vue'
import TrainingLibraryFavoriteButton from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'

export default {
  name: 'TrainingLibraryDrawerContentRelated',
  components: {
    TrainingLibraryNewBadge,
    TrainingLibraryFavoriteButton
  },
  props: {
    trainingData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'Training'
    },
    category: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: true,
      relatedItems: [],
      allLanguages: []
    }
  },
  mounted() {
    this.fetchLanguages()
  },
  computed: {
    getRelatedTitle() {
      const base = this.type ? this.type : 'Training'
      return `Related ${base}`
    }
  },
  watch: {
    category: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchRelatedTrainings()
        }
      }
    }
  },
  methods: {
    fetchLanguages() {
      AwarenessEducatorService.getLanguages()
        .then((res) => {
          this.allLanguages = res?.data?.data || []
        })
        .catch((error) => {
          console.error('❌ Error fetching languages:', error)
        })
    },
    fetchRelatedTrainings() {
      // Prop'tan gelen category'yi kullan
      const category = this.category

      if (!category) {
        this.isLoading = false
        return
      }

      this.isLoading = true

      const payload = {
        pageNumber: 1,
        pageSize: 4, // 4 çek, birini filtrele, 3 kalsın
        orderBy: 'createTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'Or',
              FilterItems: [
                {
                  FieldName: 'category',
                  Value: category,
                  Operator: 'Include'
                }
              ],
              FilterGroups: []
            }
          ]
        },
        trainingSearchType: 1,
        trainingType:
          this.type === TRAINING_LIBRARY_TYPES.TRAINING
            ? 'SCORM'
            : this.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
            ? 'LearningPath'
            : this.type
      }

      AwarenessEducatorService.searchTraining(payload)
        .then((response) => {
          const data = response?.data?.data?.results || response?.data?.data || []

          // Array kontrolü
          if (!Array.isArray(data)) {
            this.relatedItems = []
            return
          }

          // Mevcut training'i filtrele
          const currentTrainingId = this.trainingData.trainingId || this.trainingData.resourceId
          this.relatedItems = data
            .filter((item) => {
              const itemId = item.trainingId || item.resourceId
              return itemId !== currentTrainingId
            })
            .slice(0, 3)
            .map((item) => ({
              ...item,
              title: item.name || item.trainingName,
              targetAudienceDisplay: item.targetAudience || 'All Users',
              category: item.categoryName || item.category,
              languagesFormatted: this.formatLanguages(item.languageCodes || item.languages),
              languages: item.languageCodes || item.languages, // Keep original codes for nested drawer
              languageCodes: item.languageCodes || item.languages, // Ensure languageCodes is available
              coverImage: this.getCoverImage(item.coverImage),
              trainingRoles: item.trainingRoles || []
            }))
        })
        .catch((error) => {
          console.error('❌ Error fetching related trainings:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getLanguageNames(languageCodes) {
      if (!languageCodes || languageCodes.length === 0) return []

      return languageCodes.map((code) => {
        const lang = this.allLanguages.find(
          (item) => item.shortCode === code || item.code === code || item.id === code
        )
        return lang ? lang.isoFriendlyName || lang.name : code
      })
    },
    formatLanguages(languageCodes) {
      if (!languageCodes || languageCodes.length === 0) return 'No languages'

      const languageNames = this.getLanguageNames(languageCodes)

      if (languageNames.length === 1) return languageNames[0]
      if (languageNames.length === 2) return languageNames.join(', ')
      return `${languageNames.slice(0, 2).join(', ')}, +${languageNames.length - 2}`
    },
    getFirstTwoLanguages(languageCodes) {
      const languageNames = this.getLanguageNames(languageCodes)
      return languageNames.slice(0, 2).join(', ')
    },
    getRemainingLanguages(languageCodes) {
      const languageNames = this.getLanguageNames(languageCodes)
      return languageNames.slice(2).join(', ')
    },
    isTitleOverflowing(title) {
      // Title'ın belirli bir karakter sayısını aşıp aşmadığını kontrol et
      // Daha hassas bir kontrol için DOM'u kullanabilirsin ama performans için basit karakter kontrolü yeterli
      return title && title.length > 40
    },
    getCoverImage(coverImage) {
      if (!coverImage) return null
      return typeof coverImage === 'string' ? coverImage : coverImage.imageUrl
    },
    getTrainingRolesText(card) {
      const roles = card.trainingRoles || []
      // Eğer hiç role yoksa veya trainingRoles gelmediyse targetAudience fallback
      if (!roles || roles.length === 0) {
        return card.targetAudienceDisplay || card.targetAudience || 'No target audience'
      }

      // Tek role varsa direkt ismini döndür
      if (roles.length === 1) {
        return roles[0].roleName
      }

      // Birden fazla role varsa: İlk Role + (N-1)
      const firstRole = roles[0].roleName
      const remainingCount = roles.length - 1
      return `${firstRole} +${remainingCount}`
    },
    getTrainingRolesTooltip(card) {
      const roles = card.trainingRoles || []
      if (!roles || roles.length <= 1) return ''
      return roles.map((r) => r.roleName).join(', ')
    },
    isTrainingRolesTooltipEnabled(card) {
      const roles = card.trainingRoles || []
      return roles.length > 1
    },
    handlePreviewClick(card) {
      // Nested drawer'ı aç
      this.$store.commit('trainingLibrary/SET_NESTED_DRAWER', {
        status: true,
        selectedRow: card,
        type: this.type
      })
    }
  }
}
</script>
