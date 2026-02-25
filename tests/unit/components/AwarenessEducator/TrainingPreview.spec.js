jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrlForPreview: jest.fn(() =>
    Promise.resolve({ data: { data: { scormPlayerUrl: 'https://player', trainingUrl: '/sco' } } })
  )
}))

import TrainingPreview from '@/components/AwarenessEducator/TrainingPreview.vue'

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
})
