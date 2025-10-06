<template>
  <div>
    <TrainingLibraryDeleteDialog v-bind="getDeleteDialog" />

    <!-- Unified Drawer for Training, Poster, Infographic, Screensaver -->
    <TrainingLibraryDrawer
      v-if="currentDrawer.status"
      :value="currentDrawer.status"
      :type="currentDrawer.type"
      :training-data="currentDrawer.selectedRow"
      @input="handleDrawerClose"
      @delete-success="handleDeleteSuccess"
      @duplicate-success="handleDuplicateSuccess"
    />

    <!-- Lightbox for Preview -->
    <TrainingLibraryLightbox :value="getLightbox.status" @input="handleLightboxClose">
      <TrainingLibraryLightboxContent
        :preview-data="getLightbox.previewData"
        :is-loading="getLightbox.isLoading"
        :type="getLightbox.type"
      />
    </TrainingLibraryLightbox>

    <TrainingLibraryLearningPathPreviewDialog
      v-if="getLearningPathPreviewDialog.status"
      v-bind="getLearningPathPreviewDialog"
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
  </div>
</template>

<script>
import TrainingLibraryDeleteDialog from '@/components/TrainingLibrary/TrainingLibraryDeleteDialog/TrainingLibraryDeleteDialog.vue'
import { mapGetters } from 'vuex'
import TrainingLibraryDrawer from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
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
import TrainingLibraryLightbox from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightbox.vue'
import TrainingLibraryLightboxContent from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightboxContent.vue'

export default {
  name: 'TrainingLibraryCommonComponents',
  data() {
    return {
      TRAINING_LIBRARY_TYPES
    }
  },
  components: {
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
    TrainingLibraryDeleteDialog,
    TrainingLibraryDrawer,
    TrainingLibraryLightbox,
    TrainingLibraryLightboxContent
  },
  methods: {
    handleDrawerClose(value) {
      console.log(
        '📦 handleDrawerClose called with value:',
        value,
        'dialogType:',
        this.currentDrawer.dialogType
      )
      if (!value) {
        console.log('🔄 Resetting store for:', this.currentDrawer.dialogType)

        // Hangi dialog açıksa onu kapat
        if (this.currentDrawer.dialogType === 'training') {
          this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null,
            showSendButton: true,
            type: TRAINING_LIBRARY_TYPES.TRAINING
          })
        } else if (this.currentDrawer.dialogType === 'poster') {
          this.$store.commit('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'infographic') {
          this.$store.commit('trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'screensaver') {
          this.$store.commit('trainingLibrary/SET_SCREENSAVER_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'survey') {
          this.$store.commit('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        }
      }
    },
    handleDeleteSuccess() {
      console.log('✅ Delete success - refreshing list')
      this.$store.dispatch('trainingLibrary/callForTrainingLibrary')
    },
    handleDuplicateSuccess() {
      console.log('✅ Duplicate success - refreshing list')
      this.$store.dispatch('trainingLibrary/callForTrainingLibrary')
    },
    handleLightboxClose(value) {
      console.log('📦 handleLightboxClose called with value:', value)
      if (!value) {
        this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
          status: false,
          previewData: null,
          isLoading: false,
          type: null
        })
      }
    }
  },
  computed: {
    currentDrawer() {
      // Priority: Training > Poster > Infographic > Screensaver > Survey
      if (this.getTrainingPreviewDialog.status) {
        return {
          status: this.getTrainingPreviewDialog.status,
          type: this.getTrainingPreviewDialog.type,
          selectedRow: this.getTrainingPreviewDialog.selectedRow,
          dialogType: 'training'
        }
      }
      if (this.getPosterPreviewDialog.status) {
        return {
          status: this.getPosterPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.POSTER,
          selectedRow: this.getPosterPreviewDialog.selectedRow,
          dialogType: 'poster'
        }
      }
      if (this.getInfographicPreviewDialog.status) {
        return {
          status: this.getInfographicPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC,
          selectedRow: this.getInfographicPreviewDialog.selectedRow,
          dialogType: 'infographic'
        }
      }
      if (this.getScreensaverPreviewDialog.status) {
        return {
          status: this.getScreensaverPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.SCREENSAVER,
          selectedRow: this.getScreensaverPreviewDialog.selectedRow,
          dialogType: 'screensaver'
        }
      }
      if (this.getSurveyPreviewDialog.status) {
        return {
          status: this.getSurveyPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.SURVEY,
          selectedRow: this.getSurveyPreviewDialog.selectedRow,
          dialogType: 'survey'
        }
      }
      return {
        status: false,
        type: null,
        selectedRow: null,
        dialogType: null
      }
    },
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
      getSurveyPreviewDialog: 'trainingLibrary/getSurveyPreviewDialog',
      getLightbox: 'trainingLibrary/getLightbox'
    })
  }
}
</script>
