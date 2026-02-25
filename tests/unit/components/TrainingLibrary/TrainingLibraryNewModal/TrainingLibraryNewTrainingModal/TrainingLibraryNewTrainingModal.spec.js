jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  createDraftTraining: jest.fn(),
  updateTraining: jest.fn()
}))

import TrainingLibraryNewTrainingModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewTrainingModal/TrainingLibraryNewTrainingModal.vue'
import labels from '@/model/constants/labels'

describe('TrainingLibraryNewTrainingModal.vue', () => {
  it('getTitle returns create/edit labels', () => {
    expect(TrainingLibraryNewTrainingModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewTrainingContent
    )
    expect(TrainingLibraryNewTrainingModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditTrainingContent
    )
  })

  it('handleGeneratingChanged updates isGenerating', () => {
    const ctx = { isGenerating: false }
    TrainingLibraryNewTrainingModal.methods.handleGeneratingChanged.call(ctx, true)
    expect(ctx.isGenerating).toBe(true)
  })
})

