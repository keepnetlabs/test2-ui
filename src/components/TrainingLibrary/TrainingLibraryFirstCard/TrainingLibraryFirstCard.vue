<template>
  <div class="training-library-list-view-first-card">
    <TrainingLibraryListViewFirstCardHeader />
    <hr class="mt-6 mb-4" />
    <TrainingLibraryFirstCardTabs />
    <TrainingLibraryFilters />
  </div>
</template>

<script>
import TrainingLibraryListViewFirstCardHeader from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardHeader.vue'
import TrainingLibraryFirstCardTabs from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardTabs.vue'
import TrainingLibraryFilters from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilters.vue'

export default {
  name: 'TrainingLibraryFirstCard',
  components: {
    TrainingLibraryFilters,
    TrainingLibraryFirstCardTabs,
    TrainingLibraryListViewFirstCardHeader
  }
}
</script>
