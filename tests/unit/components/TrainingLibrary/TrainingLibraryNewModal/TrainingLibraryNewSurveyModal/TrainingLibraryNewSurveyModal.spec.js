jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  createDraftSurvey: jest.fn(),
  updateSurvey: jest.fn()
}))

import TrainingLibraryNewSurveyModal from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewSurveyModal/TrainingLibraryNewSurveyModal.vue'
import labels from '@/model/constants/labels'

describe('TrainingLibraryNewSurveyModal.vue', () => {
  it('getTitle returns create/edit labels', () => {
    expect(TrainingLibraryNewSurveyModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewSurvey
    )
    expect(TrainingLibraryNewSurveyModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditSurvey
    )
  })

  it('handleGeneratingChanged updates isGenerating', () => {
    const ctx = { isGenerating: false }
    TrainingLibraryNewSurveyModal.methods.handleGeneratingChanged.call(ctx, true)
    expect(ctx.isGenerating).toBe(true)
  })
})

