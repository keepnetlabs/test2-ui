jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn()
  }
})

import NewPosterInformation from '@/components/AwarenessEducator/NewPoster/NewPosterInformation.vue'
import { scrollToComponent } from '@/utils/functions'

describe('NewPosterInformation.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data initializes defaults', () => {
    const data = NewPosterInformation.data.call({})
    expect(data.formData.name).toBe('')
    expect(data.formData.tags).toEqual([])
    expect(data.formData.coverImage).toBe(null)
  })

  it('computed categories and targetAudiences return injected values', () => {
    const categories = [{ text: 'General', value: 'general' }]
    const targetAudiences = [{ text: 'All', value: 'all' }]
    const ctx = {
      getCategories: jest.fn(() => categories),
      getTargetAudiences: jest.fn(() => targetAudiences)
    }

    expect(NewPosterInformation.computed.categories.call(ctx)).toEqual(categories)
    expect(NewPosterInformation.computed.targetAudiences.call(ctx)).toEqual(targetAudiences)
  })

  it('getCoverImagePreview handles array/string/blob cases', () => {
    const original = URL.createObjectURL
    URL.createObjectURL = jest.fn(() => 'blob:preview')

    expect(
      NewPosterInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: ['https://x.test/cover.png']
      })
    ).toBe('https://x.test/cover.png')

    expect(
      NewPosterInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: []
      })
    ).toBe(null)

    expect(
      NewPosterInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: 'https://x.test/from-backend.png'
      })
    ).toBe('https://x.test/from-backend.png')

    const file = new Blob(['x'], { type: 'image/png' })
    expect(
      NewPosterInformation.computed.getCoverImagePreview.call({
        getPreviewOfCoverImage: file
      })
    ).toBe('blob:preview')

    URL.createObjectURL = original
  })

  it('validateForm returns false and scrolls when invalid', () => {
    const errorEl = {}
    const ctx = {
      $refs: {
        refForm: {
          validate: jest.fn(() => false),
          $el: { querySelector: jest.fn(() => errorEl) }
        }
      },
      $nextTick: (cb) => cb()
    }

    expect(NewPosterInformation.methods.validateForm.call(ctx)).toBe(false)
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('setMakeAvailableForData falls back to MyCompanyOnly', () => {
    const ctx = {
      formData: { availableForRequests: [] },
      $refs: {
        refMakeAvailableFor: {
          getAvailableForListFromBackend: jest.fn(() => [])
        }
      }
    }

    NewPosterInformation.methods.setMakeAvailableForData.call(ctx, [{ id: 1 }])
    expect(ctx.formData.availableForRequests[0].type).toBe('MyCompanyOnly')
  })
})
