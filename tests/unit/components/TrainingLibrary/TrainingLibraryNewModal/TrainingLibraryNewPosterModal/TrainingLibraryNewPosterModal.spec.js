jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingTypeCount: jest.fn(),
    getTraining: jest.fn(),
    createDraftTraining: jest.fn(),
    updateTraining: jest.fn()
  }
}))

import TrainingLibraryNewPosterModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewPosterModal/TrainingLibraryNewPosterModal.vue'
import labels from '@/model/constants/labels'

describe('TrainingLibraryNewPosterModal.vue', () => {
  it('getTitle returns create/edit label', () => {
    expect(TrainingLibraryNewPosterModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewPoster
    )
    expect(TrainingLibraryNewPosterModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditPoster
    )
  })

  it('handleGeneratingChanged sets flag', () => {
    const ctx = { isGenerating: false }
    TrainingLibraryNewPosterModal.methods.handleGeneratingChanged.call(ctx, true)
    expect(ctx.isGenerating).toBe(true)
  })
})
