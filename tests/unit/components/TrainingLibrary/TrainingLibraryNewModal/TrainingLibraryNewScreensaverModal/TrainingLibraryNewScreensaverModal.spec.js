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

  it('handleClose resets modal via setNewScreensaverModal action', () => {
    const setNewScreensaverModal = jest.fn()
    TrainingLibraryNewScreensaverModal.methods.handleClose.call({ setNewScreensaverModal })
    expect(setNewScreensaverModal).toHaveBeenCalled()
  })

  it('changeStep decrements step and clears disabled state when going back from step 2', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: true,
      $refs: {}
    }

    await TrainingLibraryNewScreensaverModal.methods.changeStep.call(ctx, -1)

    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.step).toBe(1)
  })

  it('changeStep increments step in non-initial flow', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: false,
      $refs: {}
    }

    await TrainingLibraryNewScreensaverModal.methods.changeStep.call(ctx, 1)

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

    await TrainingLibraryNewScreensaverModal.methods.changeStep.call(ctx, 1)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(ctx.step).toBe(1)
  })
})

