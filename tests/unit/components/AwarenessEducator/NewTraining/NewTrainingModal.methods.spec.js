jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTraining: jest.fn(),
    createDraftTraining: jest.fn(),
    updateTraining: jest.fn()
  }
}))

import NewTrainingModal from '@/components/AwarenessEducator/NewTraining/NewTrainingModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'
import { EMITS } from '@/components/AwarenessEducator/utils'

describe('NewTrainingModal.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes data and computed title correctly', () => {
    const data = NewTrainingModal.data.call({
      selectedRow: { resourceId: 'resource-1' }
    })
    expect(data.trainingId).toBe('resource-1')
    expect(data.step).toBe(1)

    expect(NewTrainingModal.computed.getTitle.call({ isEdit: true })).toBe(
      labels.EditTrainingContent
    )
    expect(NewTrainingModal.computed.getTitle.call({ isEdit: false })).toBe(
      labels.CreateNewTrainingContent
    )
  })

  it('created fetches training details in edit mode and pushes data to child refs', async () => {
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: {
        data: {
          coverImageUrl: 'https://img',
          name: 'T1',
          hasQuiz: true,
          description: 'desc',
          tagNames: ['tag1'],
          targetAudience: 'all',
          trainingContents: [{ languageId: 1 }],
          availableForList: [{ type: 'UserGroup', resourceId: 'ug-1' }],
          category: 'General',
          type: 1
        }
      }
    })
    const setCourseFormData = jest.fn()
    const setAvailable = jest.fn()
    const setContentFormData = jest.fn()
    const setContents = jest.fn()
    const ctx = {
      isEdit: true,
      selectedRow: { trainingId: 'training-1' },
      trainingId: '',
      $refs: {
        refTrainingCourseInformation: {
          setFormData: setCourseFormData,
          setMakeAvailableForData: setAvailable
        },
        refTrainingContent: {
          setFormData: setContentFormData,
          setTrainingContents: setContents
        }
      }
    }

    NewTrainingModal.created.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.trainingId).toBe('training-1')
    expect(AwarenessEducatorService.getTraining).toHaveBeenCalledWith('training-1')
    expect(setCourseFormData).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'T1', hasQuiz: true, category: 'General' })
    )
    expect(setAvailable).toHaveBeenCalledWith([{ type: 'UserGroup', resourceId: 'ug-1' }])
    expect(setContentFormData).toHaveBeenCalledWith({ hasQuiz: true, type: 1 })
    expect(setContents).toHaveBeenCalledWith([{ languageId: 1 }])
  })

  it('handleClose emits close event', () => {
    const emit = jest.fn()
    NewTrainingModal.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith(EMITS.ON_CLOSE)
  })

  it('changeStep stops when make-available validation fails', () => {
    const validateAvailableFor = jest.fn()
    const validateForm = jest.fn()
    const ctx = {
      step: 1,
      isEdit: false,
      trainingId: '',
      $refs: {
        refTrainingCourseInformation: {
          $refs: {
            refMakeAvailableFor: {
              validateAvailableFor,
              isAvailableForValid: false
            }
          },
          formData: { availableForRequests: [] },
          validateForm
        }
      }
    }

    NewTrainingModal.methods.changeStep.call(ctx, 1)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(validateForm).not.toHaveBeenCalled()
    expect(ctx.step).toBe(1)
  })

  it('changeStep creates draft and moves to second step', async () => {
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
            name: 'Training',
            description: 'Desc',
            category: 'General',
            targetAudience: 'All',
            tagNames: ['tag1'],
            availableForRequests: [{ type: 'UserGroup', resourceId: 'ug-1' }]
          }
        },
        refTrainingContent: {
          formData: {
            contentByLanguage: [{ file: 'content.zip', languageId: 1 }]
          }
        }
      }
    }

    NewTrainingModal.methods.changeStep.call(ctx, 1)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.createDraftTraining).toHaveBeenCalledWith({
      name: 'Training',
      description: 'Desc',
      category: 'General',
      targetAudience: 'All',
      tagNames: ['tag1'],
      availableForRequests: [{ type: 'UserGroup', resourceId: 'ug-1' }]
    })
    expect(ctx.trainingId).toBe('draft-1')
    expect(ctx.step).toBe(2)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('changeStep handles existing trainingId and back navigation', () => {
    const ctx = {
      step: 1,
      isEdit: false,
      trainingId: 'training-9',
      isActionButtonDisabled: false,
      $refs: {
        refTrainingCourseInformation: {
          $refs: {},
          validateForm: jest.fn(() => true),
          formData: {}
        },
        refTrainingContent: {
          formData: {
            contentByLanguage: [{ file: '', languageId: null }]
          }
        }
      }
    }

    NewTrainingModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(2)
    expect(ctx.isActionButtonDisabled).toBe(true)

    NewTrainingModal.methods.changeStep.call(ctx, -1)
    expect(ctx.step).toBe(1)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('changeStep moves to next step directly in edit mode and stops on invalid form', () => {
    const invalidCtx = {
      step: 1,
      isEdit: false,
      trainingId: '',
      $refs: {
        refTrainingCourseInformation: {
          $refs: {},
          validateForm: jest.fn(() => false),
          formData: {}
        },
        refTrainingContent: { formData: { contentByLanguage: [] } }
      }
    }
    NewTrainingModal.methods.changeStep.call(invalidCtx, 1)
    expect(invalidCtx.step).toBe(1)

    const editCtx = {
      step: 1,
      isEdit: true,
      trainingId: 'edit-1',
      $refs: {
        refTrainingCourseInformation: {
          $refs: {},
          validateForm: jest.fn(() => true),
          formData: {}
        },
        refTrainingContent: { formData: { contentByLanguage: [] } }
      }
    }
    NewTrainingModal.methods.changeStep.call(editCtx, 1)
    expect(editCtx.step).toBe(2)
  })

  it('created in edit mode skips child updates when refs are missing', async () => {
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: { data: { name: 'No Ref Training' } }
    })
    const ctx = {
      isEdit: true,
      selectedRow: { trainingId: 'training-missing-refs' },
      trainingId: '',
      $refs: {}
    }

    NewTrainingModal.created.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.getTraining).toHaveBeenCalledWith('training-missing-refs')
    expect(ctx.trainingId).toBe('training-missing-refs')
  })

  it('created does not call getTraining when not in edit mode', () => {
    const ctx = {
      isEdit: false,
      selectedRow: { trainingId: 'training-no-edit' },
      trainingId: '',
      $refs: {}
    }

    NewTrainingModal.created.call(ctx)
    expect(AwarenessEducatorService.getTraining).not.toHaveBeenCalled()
  })

  it('handleSubmit builds payload, calls update and emits close on success', async () => {
    AwarenessEducatorService.updateTraining.mockResolvedValueOnce({})
    const appendSpy = jest.spyOn(FormData.prototype, 'append')
    const emit = jest.fn()
    const ctx = {
      trainingId: 'training-2',
      isActionButtonDisabled: false,
      $emit: emit,
      $refs: {
        refTrainingCourseInformation: {
          formData: {
            coverImage: 'file-binary',
            name: 'My Training',
            description: 'My Description',
            category: 'General',
            targetAudience: 'All',
            tags: ['tag-1', 'tag-2'],
            availableForRequests: [{ type: 'UserGroup', resourceId: 'ug-1' }],
            coverImageUrl: 'https://cover'
          }
        },
        refTrainingContent: {
          formData: { hasQuiz: true, type: 2 }
        }
      }
    }

    NewTrainingModal.methods.handleSubmit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.updateTraining).toHaveBeenCalledWith(
      expect.any(FormData),
      'training-2'
    )
    expect(appendSpy).toHaveBeenCalledWith('trainingDetail.name', 'My Training')
    expect(appendSpy).toHaveBeenCalledWith('trainingDetail.tagNames[0]', 'tag-1')
    expect(appendSpy).toHaveBeenCalledWith(
      'trainingDetail.availableForRequests[0].resourceId',
      'ug-1'
    )
    expect(emit).toHaveBeenCalledWith('on-close', true)
    expect(ctx.isActionButtonDisabled).toBe(false)
    appendSpy.mockRestore()
  })

  it('handleSubmit works without coverImageUrl and keeps close emit off on unresolved success path checks', async () => {
    AwarenessEducatorService.updateTraining.mockResolvedValueOnce({})
    const appendSpy = jest.spyOn(FormData.prototype, 'append')
    const emit = jest.fn()
    const ctx = {
      trainingId: 'training-3',
      isActionButtonDisabled: false,
      $emit: emit,
      $refs: {
        refTrainingCourseInformation: {
          formData: {
            coverImage: 'file-binary',
            name: 'My Training',
            description: 'My Description',
            category: 'General',
            targetAudience: 'All',
            tags: [],
            availableForRequests: [],
            coverImageUrl: ''
          }
        },
        refTrainingContent: {
          formData: { hasQuiz: false, type: 1 }
        }
      }
    }

    NewTrainingModal.methods.handleSubmit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.updateTraining).toHaveBeenCalledWith(
      expect.any(FormData),
      'training-3'
    )
    expect(appendSpy).not.toHaveBeenCalledWith('trainingDetail.coverImageUrl', expect.anything())
    expect(emit).toHaveBeenCalledWith('on-close', true)
    expect(ctx.isActionButtonDisabled).toBe(false)
    appendSpy.mockRestore()
  })

  it('changeStep keeps action button enabled logic safe when content ref is missing', async () => {
    AwarenessEducatorService.createDraftTraining.mockResolvedValueOnce({
      data: { data: { resourceId: 'draft-no-content-ref' } }
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
            name: 'Training',
            description: 'Desc',
            category: 'General',
            targetAudience: 'All',
            tagNames: [],
            availableForRequests: []
          }
        },
        refTrainingContent: null
      }
    }

    NewTrainingModal.methods.changeStep.call(ctx, 1)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.createDraftTraining).toHaveBeenCalled()
    expect(ctx.step).toBe(2)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
