<template>
  <div v-if="isRenderFilters" class="training-library-filters-badges">
    <div class="training-library-filters-badges__left-side">
      <div style="flex-shrink: 0;">Filter Type: {{ filterType }}</div>
      <div class="training-library-filters-badges__container">
        <TrainingLibraryFilterBadge
          v-for="(filter, filterIndex) in filters"
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
        @click="clearAllFilters"
      >
        Clear All
      </VBtn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryFilterBadge from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilterBadge.vue'

export default {
  name: 'TrainingLibraryFiltersBadges',
  components: { TrainingLibraryFilterBadge },
  computed: {
    ...mapGetters({
      filters: 'trainingLibrary/getFilters',
      filterType: 'trainingLibrary/getFilterType',
      getFilters: 'trainingLibrary/getFilters'
    }),
    isRenderFilters() {
      return this.getFilters.some((filter) => filter.isFilterActive)
    }
  },
  methods: {
    ...mapActions({
      clearAllFilters: 'trainingLibrary/clearAllFilters'
    })
  }
}
</script>
