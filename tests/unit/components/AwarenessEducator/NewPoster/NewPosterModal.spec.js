jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTraining: jest.fn(),
    createDraftTraining: jest.fn(),
    updateTraining: jest.fn()
  }
}))

import NewPosterModal from '@/components/AwarenessEducator/NewPoster/NewPosterModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'

describe('NewPosterModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title returns create/edit titles', () => {
    expect(NewPosterModal.computed.getTitle.call({ isEdit: false })).toBe(labels.CreateNewPosterContent)
    expect(NewPosterModal.computed.getTitle.call({ isEdit: true })).toBe(labels.EditPosterContent)
  })

  it('changeStep creates draft when first step is valid', async () => {
    AwarenessEducatorService.createDraftTraining.mockResolvedValueOnce({
      data: { data: { resourceId: 'draft-1' } }
    })
    const ctx = {
      step: 1,
      isEdit: false,
      trainingId: '',
      isActionButtonDisabled: false,
      $refs: {
        refTrainingCourseInformation: {
          $refs: {},
          validateForm: jest.fn(() => true),
          formData: {
            name: 'Poster',
            description: 'Desc',
            category: 'General',
            targetAudience: 'All',
            tagNames: ['tag-1'],
            availableForRequests: [{ type: 'MyCompanyOnly', resourceId: null }],
            compliances: [],
            behaviours: []
          }
        },
        refTrainingContent: {
          formData: { contentByLanguage: [{ languageId: 'en', file: 'x.zip' }] }
        }
      }
    }

    NewPosterModal.methods.changeStep.call(ctx, 1)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.createDraftTraining).toHaveBeenCalled()
    expect(ctx.trainingId).toBe('draft-1')
    expect(ctx.step).toBe(2)
  })

  it('handleSubmit emits close after update', async () => {
    AwarenessEducatorService.updateTraining.mockResolvedValueOnce({})
    const emit = jest.fn()
    const ctx = {
      trainingId: 'training-1',
      isActionButtonDisabled: false,
      $emit: emit,
      $refs: {
        refTrainingCourseInformation: {
          formData: {
            coverImage: null,
            coverImageUrl: '',
            name: 'Poster',
            description: 'Desc',
            category: 'General',
            targetAudience: 'All',
            tags: ['tag-1'],
            availableForRequests: [{ type: 'MyCompanyOnly', resourceId: null }],
            compliances: [],
            behaviours: []
          }
        },
        refTrainingContent: {
          formData: { hasQuiz: false }
        }
      }
    }

    NewPosterModal.methods.handleSubmit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.updateTraining).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-close', true)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
