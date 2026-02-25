jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  createDraftTraining: jest.fn(),
  updateTraining: jest.fn()
}))

import TrainingLibraryNewScreensaverModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewScreensaverModal/TrainingLibraryNewScreensaverModal.vue'
import labels from '@/model/constants/labels'

describe('TrainingLibraryNewScreensaverModal.vue', () => {
  it('getTitle returns create/edit label', () => {
    expect(TrainingLibraryNewScreensaverModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewScreensaver
    )
    expect(TrainingLibraryNewScreensaverModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditScreensaver
    )
  })

  it('handleGeneratingChanged updates isGenerating', () => {
    const ctx = { isGenerating: false }
    TrainingLibraryNewScreensaverModal.methods.handleGeneratingChanged.call(ctx, true)
    expect(ctx.isGenerating).toBe(true)
  })
})

