<template>
  <div>
    <TrainingLibraryDeleteDialog v-bind="getDeleteDialog" />
    <!-- <TrainingLibraryTrainingPreviewDialog
      v-if="getTrainingPreviewDialog.status"
      v-bind="getTrainingPreviewDialog"
    /> -->
    <TrainingLibraryDrawer
      v-if="getTrainingPreviewDialog.status"
      :value="getTrainingPreviewDialog.status"
      :type="getTrainingPreviewDialog.type"
      :training-data="getTrainingPreviewDialog.selectedRow"
      @input="handleDrawerClose"
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
    <TrainingLibraryNewLearningPathModal
      v-if="getNewLearningPathModal.status"
      v-bind="getNewLearningPathModal"
    />
    <TrainingLibraryNewPosterModal v-if="getNewPosterModal.status" v-bind="getNewPosterModal" />
    <TrainingLibraryNewInfographicModal
      v-if="getNewInfographicModal.status"
      v-bind="getNewInfographicModal"
    />
    <TrainingLibraryNewScreensaverModal
      v-if="getNewScreensaverModal.status"
      v-bind="getNewScreensaverModal"
    />
    <TrainingLibraryTrainingSendModal
      v-if="getTrainingSendModal.status"
      v-bind="getTrainingSendModal"
    />
    <TrainingLibraryPosterSendModal v-if="getPosterSendModal.status" v-bind="getPosterSendModal" />
    <TrainingLibraryInfographicSendModal
      v-if="getInfographicSendModal.status"
      v-bind="getInfographicSendModal"
    />
    <TrainingLibraryScreensaverSendModal
      v-if="getScreensaverSendModal.status"
      v-bind="getScreensaverSendModal"
    />
    <TrainingLibraryLearningPathSendModal
      v-if="getLearningPathSendModal.status"
      v-bind="getLearningPathSendModal"
    />
    <TrainingLibraryNewSurveyModal v-if="getNewSurveyModal.status" v-bind="getNewSurveyModal" />
    <TrainingLibrarySurveySendModal v-if="getSurveySendModal.status" v-bind="getSurveySendModal" />
    <TrainingLibrarySurveyPreviewDialog
      v-if="getSurveyPreviewDialog.status"
      v-bind="getSurveyPreviewDialog"
    />
  </div>
</template>

<script>
import TrainingLibraryDeleteDialog from '@/components/TrainingLibrary/TrainingLibraryDeleteDialog/TrainingLibraryDeleteDialog.vue'
import { mapGetters } from 'vuex'
import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'
import TrainingLibraryDrawer from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import TrainingLibraryPosterPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryPosterPreviewDialog.vue'
import TrainingLibraryInfographicPreviewDialog from './TrainingLibraryPreviewDialog/TrainingLibraryInfographicPreviewDialog.vue'
import TrainingLibraryScreensaverPreviewDialog from './TrainingLibraryPreviewDialog/TrainingLibraryScreensaverPreviewDialog.vue'
import TrainingLibraryLearningPathPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreviewDialog.vue'
import TrainingLibraryNewTrainingModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewTrainingModal/TrainingLibraryNewTrainingModal.vue'
import TrainingLibraryNewLearningPathModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathModal.vue'
import TrainingLibraryNewPosterModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewPosterModal/TrainingLibraryNewPosterModal.vue'
import TrainingLibraryNewInfographicModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewInfographicModal/TrainingLibraryNewInfographicModal.vue'
import TrainingLibraryNewScreensaverModal from './TrainingLibraryNewModal/TrainingLibraryNewScreensaverModal/TrainingLibraryNewScreensaverModal.vue'
import TrainingLibraryNewSurveyModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewSurveyModal/TrainingLibraryNewSurveyModal.vue'
import TrainingLibraryTrainingSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryTrainingSendModal/TrainingLibraryTrainingSendModal.vue'
import TrainingLibraryPosterSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryPosterSendModal/TrainingLibraryPosterSendModal.vue'
import TrainingLibraryInfographicSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryInfographicSendModal/TrainingLibraryInfographicSendModal.vue'
import TrainingLibraryScreensaverSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryScreensaverSendModal/TrainingLibraryScreensaverSendModal.vue'
import TrainingLibraryLearningPathSendModal from './TrainingLibrarySendModal/TrainingLibraryLearningPathSendModal/TrainingLibraryLearningPathSendModal.vue'
import TrainingLibrarySurveySendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySurveySendModal/TrainingLibrarySurveySendModal.vue'
import TrainingLibrarySurveyPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibrarySurveyPreviewDialog.vue'

export default {
  name: 'TrainingLibraryCommonComponents',
  components: {
    TrainingLibrarySurveyPreviewDialog,
    TrainingLibrarySurveySendModal,
    TrainingLibraryLearningPathSendModal,
    TrainingLibraryScreensaverSendModal,
    TrainingLibraryInfographicSendModal,
    TrainingLibraryPosterSendModal,
    TrainingLibraryTrainingSendModal,
    TrainingLibraryNewSurveyModal,
    TrainingLibraryNewScreensaverModal,
    TrainingLibraryNewInfographicModal,
    TrainingLibraryNewPosterModal,
    TrainingLibraryNewLearningPathModal,
    TrainingLibraryNewTrainingModal,
    TrainingLibraryLearningPathPreviewDialog,
    TrainingLibraryScreensaverPreviewDialog,
    TrainingLibraryInfographicPreviewDialog,
    TrainingLibraryPosterPreviewDialog,
    //TrainingLibraryTrainingPreviewDialog,
    TrainingLibraryDeleteDialog,
    TrainingLibraryDrawer
  },
  methods: {
    handleDrawerClose(value) {
      console.log('📦 handleDrawerClose called with value:', value)
      if (!value) {
        console.log('🔄 Resetting store...')
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      getDeleteDialog: 'trainingLibrary/getDeleteDialog',
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog',
      getPosterPreviewDialog: 'trainingLibrary/getPosterPreviewDialog',
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog',
      getScreensaverPreviewDialog: 'trainingLibrary/getScreensaverPreviewDialog',
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog',
      getNewTrainingModal: 'trainingLibrary/getNewTrainingModal',
      getNewLearningPathModal: 'trainingLibrary/getNewLearningPathModal',
      getNewPosterModal: 'trainingLibrary/getNewPosterModal',
      getNewInfographicModal: 'trainingLibrary/getNewInfographicModal',
      getNewScreensaverModal: 'trainingLibrary/getNewScreensaverModal',
      getTrainingSendModal: 'trainingLibrary/getTrainingSendModal',
      getPosterSendModal: 'trainingLibrary/getPosterSendModal',
      getInfographicSendModal: 'trainingLibrary/getInfographicSendModal',
      getScreensaverSendModal: 'trainingLibrary/getScreensaverSendModal',
      getLearningPathSendModal: 'trainingLibrary/getLearningPathSendModal',
      getNewSurveyModal: 'trainingLibrary/getNewSurveyModal',
      getSurveySendModal: 'trainingLibrary/getSurveySendModal',
      getSurveyPreviewDialog: 'trainingLibrary/getSurveyPreviewDialog'
    })
  }
}
</script>
