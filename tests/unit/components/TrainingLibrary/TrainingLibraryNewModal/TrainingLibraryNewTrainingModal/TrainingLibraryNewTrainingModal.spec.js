jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  createDraftTraining: jest.fn(),
  updateTraining: jest.fn()
}))

import AwarenessEducatorService from '@/api/awarenessEducator'
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

  it('handleClose resets modal via setNewTrainingModal action', () => {
    const setNewTrainingModal = jest.fn()
    TrainingLibraryNewTrainingModal.methods.handleClose.call({ setNewTrainingModal })
    expect(setNewTrainingModal).toHaveBeenCalled()
  })

  it('changeStep decrements step and clears disabled state when going back from step 2', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: true,
      $refs: {}
    }

    await TrainingLibraryNewTrainingModal.methods.changeStep.call(ctx, -1)

    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.step).toBe(1)
  })

  it('changeStep increments step in non-initial flow', async () => {
    const ctx = {
      step: 2,
      isActionButtonDisabled: false,
      $refs: {}
    }

    await TrainingLibraryNewTrainingModal.methods.changeStep.call(ctx, 1)

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

    await TrainingLibraryNewTrainingModal.methods.changeStep.call(ctx, 1)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(ctx.step).toBe(1)
  })

  it('changeStep sends multi categories in backward compatible draft payload', async () => {
    AwarenessEducatorService.createDraftTraining.mockResolvedValue({
      data: { data: { resourceId: 'draft-1' } }
    })

    const validateAvailableFor = jest.fn()
    const ctx = {
      step: 1,
      trainingId: '',
      isEdit: false,
      isActionButtonDisabled: false,
      $refs: {
        refTrainingCourseInformation: {
          formData: {
            name: 'Security 101',
            description: 'Description',
            category: [1, 2],
            level: '1',
            duration: '2',
            roleIds: ['7'],
            tagNames: [],
            availableForRequests: [],
            compliances: [],
            behaviours: []
          },
          getCategories: [
            { id: 1, text: 'Remote Working Security', value: 'RemoteWorkingSecurity' },
            { id: 2, text: 'Travel Security', value: 'TravelSecurity' }
          ],
          validateForm: jest.fn(() => true),
          $refs: {
            refMakeAvailableFor: {
              validateAvailableFor,
              isAvailableForValid: true
            }
          }
        },
        refTrainingContent: {
          formData: {
            contentByLanguage: []
          }
        }
      }
    }

    await TrainingLibraryNewTrainingModal.methods.changeStep.call(ctx, 1)

    expect(AwarenessEducatorService.createDraftTraining).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryIds: [1, 2]
      })
    )
    expect(ctx.trainingId).toBe('draft-1')
    expect(ctx.step).toBe(2)
  })
})

