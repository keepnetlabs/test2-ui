<template>
  <div class="training-library-list-view-card mt-6">
    <TrainingLibraryAllTypesTable v-if="selectedTab === TRAINING_LIBRARY_TYPES.ALL_TYPES" />
    <TrainingLibraryLearningPathTable
      v-else-if="selectedTab === TRAINING_LIBRARY_TYPES.LEARNING_PATH"
    />
    <TrainingLibraryTrainingTable v-else-if="selectedTab === TRAINING_LIBRARY_TYPES.TRAINING" />
    <TrainingLibraryPosterTable v-else-if="selectedTab === TRAINING_LIBRARY_TYPES.POSTER" />
    <TrainingLibraryInfographicTable
      v-else-if="selectedTab === TRAINING_LIBRARY_TYPES.INFOGRAPHIC"
    />
    <TrainingLibraryScreensaverTable
      v-else-if="selectedTab === TRAINING_LIBRARY_TYPES.SCREENSAVER"
    />
  </div>
</template>

<script>
import TrainingLibraryAllTypesTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryAllTypesTable.vue'
import { mapGetters } from 'vuex'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import TrainingLibraryLearningPathTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryLearningPathTable.vue'
import TrainingLibraryTrainingTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryTrainingTable.vue'
import TrainingLibraryPosterTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryPosterTable.vue'
import TrainingLibraryInfographicTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryInfographicTable.vue'
import TrainingLibraryScreensaverTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryScreensaverTable.vue'

export default {
  name: 'TrainingLibraryListViewCard',
  components: {
    TrainingLibraryScreensaverTable,
    TrainingLibraryInfographicTable,
    TrainingLibraryPosterTable,
    TrainingLibraryTrainingTable,
    TrainingLibraryLearningPathTable,
    TrainingLibraryAllTypesTable
  },
  computed: {
    TRAINING_LIBRARY_TYPES() {
      return TRAINING_LIBRARY_TYPES
    },
    ...mapGetters({
      selectedTab: 'trainingLibrary/getSelectedSubTrainingContent'
    })
  }
}
</script>
