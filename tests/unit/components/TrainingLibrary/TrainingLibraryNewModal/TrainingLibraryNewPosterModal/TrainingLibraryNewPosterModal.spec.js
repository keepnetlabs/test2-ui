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

  it('handleClose resets modal via setNewPosterModal action', () => {
    const setNewPosterModal = jest.fn()
    TrainingLibraryNewPosterModal.methods.handleClose.call({ setNewPosterModal })
    expect(setNewPosterModal).toHaveBeenCalled()
  })

  it('changeStep decrements step and clears disabled state when going back from step 2', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: true,
      $refs: {}
    }

    await TrainingLibraryNewPosterModal.methods.changeStep.call(ctx, -1)

    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.step).toBe(1)
  })

  it('changeStep increments step in non-initial flow', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: false,
      $refs: {}
    }

    await TrainingLibraryNewPosterModal.methods.changeStep.call(ctx, 1)

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

    await TrainingLibraryNewPosterModal.methods.changeStep.call(ctx, 1)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(ctx.step).toBe(1)
  })
})
