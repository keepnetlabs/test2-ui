jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingTypeCount: jest.fn(),
    getTraining: jest.fn(),
    createDraftTraining: jest.fn(),
    updateTraining: jest.fn()
  }
}))

import TrainingLibraryNewInfographicModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewInfographicModal/TrainingLibraryNewInfographicModal.vue'
import labels from '@/model/constants/labels'

describe('TrainingLibraryNewInfographicModal.vue', () => {
  it('getTitle returns create/edit label', () => {
    expect(TrainingLibraryNewInfographicModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewInfographic
    )
    expect(TrainingLibraryNewInfographicModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditInfographic
    )
  })

  it('handleGeneratingChanged sets flag', () => {
    const ctx = { isGenerating: false }
    TrainingLibraryNewInfographicModal.methods.handleGeneratingChanged.call(ctx, true)
    expect(ctx.isGenerating).toBe(true)
  })
})
