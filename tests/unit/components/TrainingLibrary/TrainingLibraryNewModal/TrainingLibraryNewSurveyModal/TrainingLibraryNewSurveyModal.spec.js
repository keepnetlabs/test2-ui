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

  it('handleClose resets modal via setNewSurveyModal action', () => {
    const setNewSurveyModal = jest.fn()
    TrainingLibraryNewSurveyModal.methods.handleClose.call({ setNewSurveyModal })
    expect(setNewSurveyModal).toHaveBeenCalled()
  })

  it('changeStep decrements step and clears disabled state when going back from step 2', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: true,
      $refs: {}
    }

    await TrainingLibraryNewSurveyModal.methods.changeStep.call(ctx, -1)

    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.step).toBe(1)
  })

  it('changeStep increments step in non-initial flow', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: false,
      $refs: {}
    }

    await TrainingLibraryNewSurveyModal.methods.changeStep.call(ctx, 1)

    expect(ctx.step).toBe(3)
  })

  it('changeStep does not advance when make-available validation fails on step 1', async () => {
    const validateAvailableFor = jest.fn()
    const ctx = {
      step: 1,
      $refs: {
        refTrainingCourseInformation: {
          formData: { availableForRequests: [] },
          $refs: {
            refMakeAvailableFor: {
              validateAvailableFor,
              isAvailableForValid: false
            }
          }
        }
      }
    }

    await TrainingLibraryNewSurveyModal.methods.changeStep.call(ctx, 1)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(ctx.step).toBe(1)
  })
})

