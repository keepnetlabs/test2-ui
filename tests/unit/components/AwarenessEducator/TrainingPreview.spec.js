jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrlForPreview: jest.fn(() =>
    Promise.resolve({ data: { data: { scormPlayerUrl: 'https://player', trainingUrl: '/sco' } } })
  )
}))

import TrainingPreview from '@/components/AwarenessEducator/TrainingPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingPreview.vue', () => {
  it('hasPrevious/hasNext computed values follow activePage', () => {
    expect(TrainingPreview.computed.hasPrevious.call({ activePage: 0 })).toBe(false)
    expect(TrainingPreview.computed.hasNext.call({ activePage: 0, languages: [{}, {}] })).toBe(true)
  })

  it('getLanguageName returns current language name', () => {
    const value = TrainingPreview.computed.getLanguageName.call({
      activePage: 0,
      languages: [{ name: 'English' }]
    })
    expect(value).toBe('English')
  })

  it('handlePreviousTemplate decrements activePage and calls data loader', () => {
    const callForData = jest.fn()
    const ctx = { activePage: 1, callForData }
    TrainingPreview.methods.handlePreviousTemplate.call(ctx)
    expect(ctx.activePage).toBe(0)
    expect(callForData).toHaveBeenCalled()
  })

  it('hasNext is false on last page and getLanguageName falls back to empty string', () => {
    expect(TrainingPreview.computed.hasNext.call({ activePage: 1, languages: [{}, {}] })).toBe(
      false
    )
    expect(TrainingPreview.computed.getLanguageName.call({ activePage: 0, languages: [] })).toBe('')
  })

  it('handleNextTemplate increments activePage and calls data loader', () => {
    const callForData = jest.fn()
    const ctx = { activePage: 0, callForData }
    TrainingPreview.methods.handleNextTemplate.call(ctx)
    expect(ctx.activePage).toBe(1)
    expect(callForData).toHaveBeenCalled()
  })

  it('callForData uses cached src and skips API/loading emit', () => {
    const $emit = jest.fn()
    const ctx = {
      activePage: 0,
      srcs: ['cached-url'],
      activeTemplate: null,
      $emit
    }
    TrainingPreview.methods.callForData.call(ctx)
    expect(ctx.activeTemplate).toBe('cached-url')
    expect($emit).not.toHaveBeenCalled()
  })

  it('callForData loads template from API and updates srcs and emits loading', async () => {
    AwarenessEducatorService.getTrainingUrlForPreview.mockResolvedValueOnce({
      data: { data: { scormPlayerUrl: 'https://player', trainingUrl: '/dynamic' } }
    })
    const $emit = jest.fn()
    const ctx = {
      trainingId: 'training-9',
      languages: [{ id: 'en' }],
      activePage: 0,
      srcs: [],
      iframeKey: 'initial',
      activeTemplate: null,
      $emit
    }

    TrainingPreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.getTrainingUrlForPreview).toHaveBeenCalledWith(
      'training-9',
      'en'
    )
    expect(ctx.srcs[0]).toContain('isPreview=true')
    expect(ctx.activeTemplate).toBe(ctx.srcs[0])
    expect($emit).toHaveBeenCalledWith('update:isLoading', true)
    expect($emit).toHaveBeenCalledWith('update:isLoading', false)
  })

  it('created calls callForData', () => {
    const callForData = jest.fn()
    TrainingPreview.created.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })
})
