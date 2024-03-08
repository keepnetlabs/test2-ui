import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      setNewTrainingModal: 'trainingLibrary/setNewTrainingModal',
      setNewLearningPathModal: 'trainingLibrary/setNewLearningPathModal',
      setNewPosterModal: 'trainingLibrary/setNewPosterModal',
      setNewInfographicModal: 'trainingLibrary/setNewInfographicModal',
      setNewScreensaverModal: 'trainingLibrary/setNewScreensaverModal'
    }),
    handleAddTrainingLibraryContent(text) {
      switch (text) {
        case TRAINING_LIBRARY_TYPES.LEARNING_PATH:
          this.setNewLearningPathModal({
            status: true,
            isEdit: false,
            isDuplicate: false,
            selectedRow: null
          })
          break
        case TRAINING_LIBRARY_TYPES.INFOGRAPHIC:
          this.setNewInfographicModal({
            status: true,
            selectedRow: null,
            isEdit: false,
            isDuplicate: false
          })
          break
        case TRAINING_LIBRARY_TYPES.TRAINING:
          this.setNewTrainingModal({
            status: true,
            selectedRow: null,
            isEdit: false,
            isDuplicate: false
          })
          break
        case TRAINING_LIBRARY_TYPES.POSTER:
          this.setNewPosterModal({
            status: true,
            selectedRow: null,
            isEdit: false,
            isDuplicate: false
          })
          break
        case TRAINING_LIBRARY_TYPES.SCREENSAVER:
          this.setNewScreensaverModal({
            status: true,
            selectedRow: null,
            isEdit: false,
            isDuplicate: false
          })
          break
        default:
          break
      }
    }
  }
}
