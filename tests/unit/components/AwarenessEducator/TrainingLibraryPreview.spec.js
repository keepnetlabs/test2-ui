jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrlForPreview: jest.fn(() =>
    Promise.resolve({ data: { data: { scormPlayerUrl: 'https://player', trainingUrl: '/t' } } })
  )
}))

import TrainingLibraryPreview from '@/components/AwarenessEducator/TrainingLibraryPreview.vue'

describe('TrainingLibraryPreview.vue', () => {
  it('created sets activeLanguage from first language and calls loader', () => {
    const callForData = jest.fn()
    const ctx = { languages: [{ value: 'en' }], activeLanguage: '', callForData }
    TrainingLibraryPreview.created.call(ctx)
    expect(ctx.activeLanguage).toBe('en')
    expect(callForData).toHaveBeenCalled()
  })

  it('callForData emits loading updates for main loading flow', async () => {
    const $emit = jest.fn()
    const ctx = {
      trainingId: 't1',
      activeLanguage: 'en',
      iframeKey: 'k1',
      $emit
    }
    TrainingLibraryPreview.methods.callForData.call(ctx, false)
    await Promise.resolve()
    await Promise.resolve()
    expect($emit).toHaveBeenCalledWith('update:isLoading', true)
    expect($emit).toHaveBeenCalledWith('update:isLoading', false)
    expect(ctx.activeTemplate).toContain('isPreview=true')
  })

  it('callForData(true) toggles template loading flag', async () => {
    const ctx = {
      trainingId: 't1',
      activeLanguage: 'en',
      iframeKey: 'k1',
      isTemplateLoading: false,
      $emit: jest.fn()
    }
    TrainingLibraryPreview.methods.callForData.call(ctx, true)
    expect(ctx.isTemplateLoading).toBe(true)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.isTemplateLoading).toBe(false)
  })
})
