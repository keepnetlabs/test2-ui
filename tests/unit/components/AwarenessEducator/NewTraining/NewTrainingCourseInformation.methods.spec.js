jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn()
  }
})

import NewTrainingCourseInformation from '@/components/AwarenessEducator/NewTraining/NewTrainingCourseInformation.vue'
import { scrollToComponent } from '@/utils/functions'

describe('NewTrainingCourseInformation.vue methods/computed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data initializes form defaults', () => {
    const data = NewTrainingCourseInformation.data.call({})
    expect(data.formData.name).toBe('')
    expect(data.formData.tags).toEqual([])
    expect(data.formData.coverImage).toBe(null)
  })

  it('computed categories and targetAudiences proxy injected providers', () => {
    const categories = [{ text: 'Cat', value: 'cat' }]
    const audiences = [{ text: 'Role', value: 'role' }]
    const ctx = {
      getCategories: jest.fn(() => categories),
      getTargetAudiences: jest.fn(() => audiences)
    }

    expect(NewTrainingCourseInformation.computed.categories.call(ctx)).toEqual(categories)
    expect(NewTrainingCourseInformation.computed.targetAudiences.call(ctx)).toEqual(audiences)
  })

  it('getCoverImagePreview handles array, empty array, string and file object', () => {
    const originalCreateObjectURL = URL.createObjectURL
    URL.createObjectURL = jest.fn(() => 'blob:mock')

    expect(
      NewTrainingCourseInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: ['https://img.example.com/cover.png']
      })
    ).toBe('https://img.example.com/cover.png')

    expect(
      NewTrainingCourseInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: []
      })
    ).toBe(null)

    expect(
      NewTrainingCourseInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: 'https://img.example.com/from-backend.png'
      })
    ).toBe('https://img.example.com/from-backend.png')

    const file = new Blob(['x'], { type: 'image/png' })
    expect(
      NewTrainingCourseInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: file
      })
    ).toBe('blob:mock')
    expect(URL.createObjectURL).toHaveBeenCalledWith(file)

    URL.createObjectURL = originalCreateObjectURL
  })

  it('handleCoverImageChange clears image for empty array and sets image otherwise', () => {
    const ctx = { formData: { coverImage: 'old' } }
    NewTrainingCourseInformation.methods.handleCoverImageChange.call(ctx, [])
    expect(ctx.formData.coverImage).toBe(null)

    const file = new Blob(['x'], { type: 'image/png' })
    NewTrainingCourseInformation.methods.handleCoverImageChange.call(ctx, file)
    expect(ctx.formData.coverImage).toBe(file)
  })

  it('validateForm returns true for valid form', () => {
    const ctx = {
      $refs: {
        refForm: {
          validate: jest.fn(() => true)
        }
      }
    }

    expect(NewTrainingCourseInformation.methods.validateForm.call(ctx)).toBe(true)
    expect(scrollToComponent).not.toHaveBeenCalled()
  })

  it('validateForm returns false and scrolls to first error when invalid', () => {
    const errorEl = {}
    const ctx = {
      $refs: {
        refForm: {
          validate: jest.fn(() => false),
          $el: {
            querySelector: jest.fn(() => errorEl)
          }
        }
      },
      $nextTick: (cb) => cb()
    }

    expect(NewTrainingCourseInformation.methods.validateForm.call(ctx)).toBe(false)
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('setFormData merges fields into existing formData', () => {
    const ctx = {
      formData: {
        name: 'Old',
        description: 'Old desc',
        tags: []
      }
    }

    NewTrainingCourseInformation.methods.setFormData.call(ctx, {
      name: 'New',
      tags: ['tag-1']
    })

    expect(ctx.formData).toEqual({
      name: 'New',
      description: 'Old desc',
      tags: ['tag-1']
    })
  })

  it('setMakeAvailableForData sets mapped data, fallback default, and no-ref default', () => {
    const mappedCtx = {
      formData: { availableForRequests: [] },
      $refs: {
        refMakeAvailableFor: {
          getAvailableForListFromBackend: jest.fn(() => [{ type: 'UserGroup', resourceId: 'g1' }])
        }
      }
    }
    NewTrainingCourseInformation.methods.setMakeAvailableForData.call(mappedCtx, [
      { type: 'UserGroup', resourceId: 'g1' }
    ])
    expect(mappedCtx.formData.availableForRequests).toEqual([{ type: 'UserGroup', resourceId: 'g1' }])

    const emptyMappedCtx = {
      formData: { availableForRequests: [] },
      $refs: {
        refMakeAvailableFor: {
          getAvailableForListFromBackend: jest.fn(() => [])
        }
      }
    }
    NewTrainingCourseInformation.methods.setMakeAvailableForData.call(emptyMappedCtx, [{ id: 1 }])
    expect(emptyMappedCtx.formData.availableForRequests[0].type).toBe('MyCompanyOnly')

    const noRefCtx = { formData: { availableForRequests: [] }, $refs: {} }
    NewTrainingCourseInformation.methods.setMakeAvailableForData.call(noRefCtx, [])
    expect(noRefCtx.formData.availableForRequests[0].type).toBe('MyCompanyOnly')
  })
})
