jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrlForPreview: jest.fn(() =>
    Promise.resolve({
      data: { data: { scormPlayerUrl: 'https://s', trainingUrl: 'https://t' } }
    })
  )
}))

import TrainingLibrarySurveyPreview from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibrarySurveyPreview.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibrarySurveyPreview.vue', () => {
  it('callForData sets activeTemplate', async () => {
    const ctx = {
      trainingId: 'tr2',
      activeLanguage: 'en',
      activeTemplate: '',
      iframeKey: '',
      $emit: jest.fn()
    }
    TrainingLibrarySurveyPreview.methods.callForData.call(ctx, true)
    await Promise.resolve()
    await Promise.resolve()
    expect(AwarenessEducatorService.getTrainingUrlForPreview).toHaveBeenCalledWith('tr2', 'en')
    expect(ctx.activeTemplate).toContain('scoAddress=')
  })
})

