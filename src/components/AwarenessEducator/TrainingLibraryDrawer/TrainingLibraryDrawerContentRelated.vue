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
          <VChip v-if="card.isNew" small color="#00BCD4" text-color="#fff">New</VChip>
          <template v-if="card.coverImage">
            <img :src="card.coverImage" :alt="card.title" />
          </template>
          <template v-else>
            <div class="training-library-drawer-content-related__card-no-image">
              <VIcon size="48" color="#fff">mdi-image</VIcon>
              <div class="training-library-drawer-content-related__card-no-image-text">
                No Cover Image
              </div>
            </div>
          </template>
        </div>
        <div class="training-library-drawer-content-related__card-body">
          <div class="training-library-drawer-content-related__card-title">
            {{ card.title }}
          </div>
          <div class="training-library-drawer-content-related__card-meta">
            <span>Role</span>
            <span class="dot">•</span>
            <span>{{ card.category }}</span>
          </div>
          <div class="training-library-drawer-content-related__card-langs">
            <VIcon small class="mr-1">mdi-web</VIcon>
            <span>{{ card.languages }}</span>
          </div>
          <div class="training-library-drawer-content-related__card-actions">
            <VBtn class="w-100" rounded outlined color="#2196F3" :ripple="false">
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

export default {
  name: 'TrainingLibraryDrawerContentRelated',
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
      relatedItems: []
    }
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
    fetchRelatedTrainings() {
      console.log('🔍 Fetching related trainings')
      console.log('🔍 category prop:', this.category)
      // Prop'tan gelen category'yi kullan
      const category = this.category
      console.log('🔍 Selected Category:', category)
      if (!category) {
        console.warn('⚠️ No category found for related trainings')
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
        trainingType: this.type === TRAINING_LIBRARY_TYPES.TRAINING ? 'SCORM' : this.type
      }

      console.log('📥 Fetching related trainings with payload:', payload)

      AwarenessEducatorService.searchTraining(payload)
        .then((response) => {
          console.log('✅ Full response:', response)
          const data = response?.data?.data?.results || response?.data?.data || []
          console.log('✅ Related trainings data:', data)

          // Array kontrolü
          if (!Array.isArray(data)) {
            console.warn('⚠️ Data is not an array:', data)
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
              category: item.categoryName || item.category,
              languages: this.formatLanguages(item.languages),
              coverImage: this.getCoverImage(item.coverImage)
            }))

          console.log('🔗 Related items:', this.relatedItems)
        })
        .catch((error) => {
          console.error('❌ Error fetching related trainings:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    formatLanguages(languages) {
      if (!languages || languages.length === 0) return 'No languages'
      if (languages.length === 1) return languages[0]
      if (languages.length <= 3) return languages.join(', ')
      return `${languages.slice(0, 3).join(', ')}, +${languages.length - 3}`
    },
    getCoverImage(coverImage) {
      if (!coverImage) return null
      return typeof coverImage === 'string' ? coverImage : coverImage.imageUrl
    }
  }
}
</script>
