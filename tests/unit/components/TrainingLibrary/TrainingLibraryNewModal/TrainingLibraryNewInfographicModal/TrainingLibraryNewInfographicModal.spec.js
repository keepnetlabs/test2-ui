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

  it('handleClose resets modal via setNewInfographicModal action', () => {
    const setNewInfographicModal = jest.fn()
    TrainingLibraryNewInfographicModal.methods.handleClose.call({ setNewInfographicModal })
    expect(setNewInfographicModal).toHaveBeenCalled()
  })

  it('changeStep decrements step and clears disabled state when going back from step 2', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: true,
      $refs: {}
    }

    await TrainingLibraryNewInfographicModal.methods.changeStep.call(ctx, -1)

    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.step).toBe(1)
  })

  it('changeStep increments step in non-initial flow', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: false,
      $refs: {}
    }

    await TrainingLibraryNewInfographicModal.methods.changeStep.call(ctx, 1)

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

    await TrainingLibraryNewInfographicModal.methods.changeStep.call(ctx, 1)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(ctx.step).toBe(1)
  })
})
