import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({ setNewTrainingModal: 'trainingLibrary/setNewTrainingModal' }),
    handleAddTrainingLibraryContent(text) {
      switch (text) {
        case TRAINING_LIBRARY_TYPES.LEARNING_PATH:
          this.$emit('addLearningPath')
          break
        case TRAINING_LIBRARY_TYPES.INFOGRAPHIC:
          this.$emit('addCourse')
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
          this.$emit('addCourse')
          break
        case TRAINING_LIBRARY_TYPES.SCREENSAVER:
          this.$emit('addCourse')
          break
        default:
          break
      }
    }
  }
}
