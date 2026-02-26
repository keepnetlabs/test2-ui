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

  it('handleClose resets modal via setNewLearningPathModal action', () => {
    const setNewLearningPathModal = jest.fn()
    TrainingLibraryNewLearningPathModal.methods.handleClose.call({ setNewLearningPathModal })
    expect(setNewLearningPathModal).toHaveBeenCalled()
  })

  it('changeStep decrements step and clears disabled state when going back from step 2', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: true,
      $refs: {}
    }

    await TrainingLibraryNewLearningPathModal.methods.changeStep.call(ctx, -1)

    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.step).toBe(1)
  })

  it('changeStep does not advance when validation fails on step 1', async () => {
    const ctx = {
      step: 1,
      availableForRequestIds: [],
      $refs: {
        refTrainingCourseInformation: {
          formData: { availableForRequests: [] },
          validateForm: jest.fn(() => false)
        }
      }
    }

    await TrainingLibraryNewLearningPathModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(1)
  })

  it('handleSubmit dispatches snackbar and returns when selected trainings are less than 2', () => {
    const dispatch = jest.fn()
    const ctx = {
      $refs: {
        refLearningPathContent: { getSelectedTrainings: [{ trainingId: '1' }] }
      },
      $store: { dispatch }
    }

    TrainingLibraryNewLearningPathModal.methods.handleSubmit.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        icon: 'mdi-alert'
      })
    )
  })

  it('handleSubmit opens cannot-save modal when disabled trainings exist', () => {
    const toggleCannotSaveModal = jest.fn()
    const originalGetElementsByClassName = document.getElementsByClassName
    document.getElementsByClassName = jest.fn(() => [{ id: 'disabled-item' }])

    const ctx = {
      $refs: {
        refLearningPathContent: { getSelectedTrainings: [{}, {}] }
      },
      toggleCannotSaveModal
    }

    TrainingLibraryNewLearningPathModal.methods.handleSubmit.call(ctx)

    expect(toggleCannotSaveModal).toHaveBeenCalled()
    document.getElementsByClassName = originalGetElementsByClassName
  })
})
