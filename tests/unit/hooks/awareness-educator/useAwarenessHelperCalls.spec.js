jest.mock('@/api/awarenessEducator', () => ({
  getCategories: jest.fn(),
  getScormTypes: jest.fn(),
  getLanguages: jest.fn(),
  getTargetAudiences: jest.fn()
}))

import AwarenessEducatorService from '@/api/awarenessEducator'
import useAwarenessHelperCalls from '@/hooks/awareness-educator/useAwarenessHelperCalls'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useAwarenessHelperCalls', () => {
  const { data, created, methods } = useAwarenessHelperCalls

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes helper state', () => {
    expect(data()).toEqual({
      scormTypes: [],
      categories: [],
      languages: [],
      tableLanguageFilter: [],
      targetAudiences: []
    })
  })

  it('created calls all helper loaders', () => {
    const ctx = {
      callForCategories: jest.fn(),
      callForLanguages: jest.fn(),
      callForTargetAudiences: jest.fn(),
      callForScormTypes: jest.fn()
    }

    created.call(ctx)

    expect(ctx.callForCategories).toHaveBeenCalledTimes(1)
    expect(ctx.callForLanguages).toHaveBeenCalledTimes(1)
    expect(ctx.callForTargetAudiences).toHaveBeenCalledTimes(1)
    expect(ctx.callForScormTypes).toHaveBeenCalledTimes(1)
  })

  it('maps categories, scorm types, languages and target audiences', async () => {
    AwarenessEducatorService.getCategories.mockResolvedValueOnce({
      data: { data: [{ displayName: 'Cat 1', name: 'cat-1' }] }
    })
    AwarenessEducatorService.getScormTypes.mockResolvedValueOnce({
      data: { data: [{ displayName: 'SCORM 1', name: 'scorm-1' }] }
    })
    AwarenessEducatorService.getLanguages.mockResolvedValueOnce({
      data: { data: [{ isoFriendlyName: 'English', code: 'en' }] }
    })
    AwarenessEducatorService.getTargetAudiences.mockResolvedValueOnce({
      data: { data: [{ displayName: 'Admins', name: 'admin' }] }
    })

    const ctx = {
      categories: [],
      scormTypes: [],
      languages: [],
      tableLanguageFilter: [],
      targetAudiences: []
    }

    methods.callForCategories.call(ctx)
    methods.callForScormTypes.call(ctx)
    methods.callForLanguages.call(ctx)
    methods.callForTargetAudiences.call(ctx)
    await flushPromises()

    expect(ctx.categories).toEqual([{ text: 'Cat 1', value: 'cat-1' }])
    expect(ctx.scormTypes).toEqual([{ text: 'SCORM 1', value: 'scorm-1' }])
    expect(ctx.languages).toEqual([{ isoFriendlyName: 'English', code: 'en' }])
    expect(ctx.tableLanguageFilter).toEqual([{ text: 'English', value: 'en' }])
    expect(ctx.targetAudiences).toEqual([{ text: 'Admins', value: 'admin' }])
  })
})
