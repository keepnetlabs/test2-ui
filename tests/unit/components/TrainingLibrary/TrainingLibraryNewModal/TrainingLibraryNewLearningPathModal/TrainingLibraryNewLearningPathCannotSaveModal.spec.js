import TrainingLibraryNewLearningPathCannotSaveModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathCannotSaveModal.vue'

describe('TrainingLibraryNewLearningPathCannotSaveModal.vue', () => {
  it('closeOverlay emits closeOverlay event', () => {
    const $emit = jest.fn()
    TrainingLibraryNewLearningPathCannotSaveModal.methods.closeOverlay.call({ $emit })
    expect($emit).toHaveBeenCalledWith('closeOverlay')
  })
})
