<template>
  <div v-if="isRenderFilters">
    <!-- <div style="flex-shrink: 0;">Filter Type: {{ filterType }}</div> -->
    <div class="training-library-filters-badges mt-0">
      <div class="training-library-filters-badges__left-side">
        <div class="training-library-filters-badges__container">
          <TrainingLibraryLearningPathFilterBadge
            v-for="(filter, filterIndex) in getFilters"
            isLearningPathModal
            :key="filterIndex"
            :filter="filter"
          />
        </div>
      </div>
      <div>
        <VBtn
          class="training-library-filters-badges__clear"
          color="#2196F3"
          text
          :ripple="false"
          @click="clearAllFilters({ isFetch: true })"
        >
          Clear All
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryLearningPathFilterBadge from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryLearningPathFilterBadge'

export default {
  name: 'TrainingLibraryNewLearningPathFilterBadges',
  components: { TrainingLibraryLearningPathFilterBadge },
  computed: {
    ...mapGetters({
      // filterType: 'learningPath/getLearningPathFilterType',
      getFilters: 'learningPath/getLearningPathFilters'
    }),
    isRenderFilters() {
      return this.getFilters.some((filter) => filter.isFilterActive)
    }
  },
  methods: {
    ...mapActions({
      clearAllFilters: 'learningPath/learningPathClearAllFilters'
    })
  }
}
</script>
