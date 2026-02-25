jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingTypeCount: jest.fn(),
    getTraining: jest.fn(),
    createTraining: jest.fn(),
    updateTraining: jest.fn()
  }
}))

import TrainingLibraryNewLearningPathModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathModal.vue'
import labels from '@/model/constants/labels'

describe('TrainingLibraryNewLearningPathModal.vue', () => {
  it('getTitle returns create/edit label', () => {
    expect(TrainingLibraryNewLearningPathModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewLearningPath
    )
    expect(TrainingLibraryNewLearningPathModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditLearningPath
    )
  })

  it('toggleCannotSaveModal toggles dialog status', () => {
    const ctx = { isCannotSaveModalActive: false }
    TrainingLibraryNewLearningPathModal.methods.toggleCannotSaveModal.call(ctx)
    expect(ctx.isCannotSaveModalActive).toBe(true)
  })

  it('handleGeneratingChanged sets flag', () => {
    const ctx = { isGenerating: false }
    TrainingLibraryNewLearningPathModal.methods.handleGeneratingChanged.call(ctx, true)
    expect(ctx.isGenerating).toBe(true)
  })
})
