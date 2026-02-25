jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrlForPreview: jest.fn(() =>
    Promise.resolve({
      data: { data: { scormPlayerUrl: 'https://s', trainingUrl: 'https://t' } }
    })
  )
}))

import TrainingLibraryTrainingPreview from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryTrainingPreview.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData sets activeTemplate and emits loading state', async () => {
    const emit = jest.fn()
    const ctx = {
      trainingId: 'tr1',
      activeLanguage: 'en',
      activeTemplate: '',
      iframeKey: '',
      $emit: emit
    }
    TrainingLibraryTrainingPreview.methods.callForData.call(ctx, false)
    await Promise.resolve()
    await Promise.resolve()
    expect(AwarenessEducatorService.getTrainingUrlForPreview).toHaveBeenCalledWith('tr1', 'en')
    expect(ctx.activeTemplate).toContain('isPreview=true')
    expect(emit).toHaveBeenCalledWith('update:isLoading', true)
  })
})

