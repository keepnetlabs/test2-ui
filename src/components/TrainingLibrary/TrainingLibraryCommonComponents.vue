<template>
  <div>
    <TrainingLibraryDeleteDialog v-bind="getDeleteDialog" />
    <TrainingLibraryTrainingPreviewDialog
      v-if="getTrainingPreviewDialog.status"
      v-bind="getTrainingPreviewDialog"
    />
    <TrainingLibraryLearningPathPreviewDialog
      v-if="getLearningPathPreviewDialog.status"
      v-bind="getLearningPathPreviewDialog"
    />
    <TrainingLibraryPosterPreviewDialog
      v-if="getPosterPreviewDialog.status"
      v-bind="getPosterPreviewDialog"
    />
    <TrainingLibraryInfographicPreviewDialog
      v-if="getInfographicPreviewDialog.status"
      v-bind="getInfographicPreviewDialog"
    />
    <TrainingLibraryScreensaverPreviewDialog
      v-if="getScreensaverPreviewDialog.status"
      v-bind="getScreensaverPreviewDialog"
    />
    <TrainingLibraryNewTrainingModal
      v-if="getNewTrainingModal.status"
      v-bind="getNewTrainingModal"
    />
  </div>
</template>

<script>
import TrainingLibraryDeleteDialog from '@/components/TrainingLibrary/TrainingLibraryDeleteDialog/TrainingLibraryDeleteDialog.vue'
import { mapGetters } from 'vuex'
import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'
import TrainingLibraryPosterPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryPosterPreviewDialog.vue'
import TrainingLibraryInfographicPreviewDialog from './TrainingLibraryPreviewDialog/TrainingLibraryInfographicPreviewDialog.vue'
import TrainingLibraryScreensaverPreviewDialog from './TrainingLibraryPreviewDialog/TrainingLibraryScreensaverPreviewDialog.vue'
import TrainingLibraryLearningPathPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreviewDialog.vue'
import TrainingLibraryNewTrainingModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewTrainingModal/TrainingLibraryNewTrainingModal.vue'

export default {
  name: 'TrainingLibraryCommonComponents',
  components: {
    TrainingLibraryNewTrainingModal,
    TrainingLibraryLearningPathPreviewDialog,
    TrainingLibraryScreensaverPreviewDialog,
    TrainingLibraryInfographicPreviewDialog,
    TrainingLibraryPosterPreviewDialog,
    TrainingLibraryTrainingPreviewDialog,
    TrainingLibraryDeleteDialog
  },
  computed: {
    ...mapGetters({
      getDeleteDialog: 'trainingLibrary/getDeleteDialog',
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog',
      getPosterPreviewDialog: 'trainingLibrary/getPosterPreviewDialog',
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog',
      getScreensaverPreviewDialog: 'trainingLibrary/getScreensaverPreviewDialog',
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog',
      getNewTrainingModal: 'trainingLibrary/getNewTrainingModal'
    })
  }
}
</script>
