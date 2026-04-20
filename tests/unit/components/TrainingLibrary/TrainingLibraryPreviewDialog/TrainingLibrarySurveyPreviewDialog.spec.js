jest.mock('@/api/awarenessEducator', () => ({
  getTraining: jest.fn(() =>
    Promise.resolve({
      data: { data: { name: 'Survey', isFavourite: false } }
    })
  )
}))

import TrainingLibrarySurveyPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibrarySurveyPreviewDialog.vue'

describe('TrainingLibrarySurveyPreviewDialog.vue', () => {
  it('callForLanguages maps languages by code and calls detail fetch', () => {
    const ctx = {
      isPreviewLoading: false,
      selectedLanguages: [],
      selectedRow: { languages: ['en'] },
      languages: [{ code: 'en', id: '1', name: 'English' }],
      callForTrainingDetail: jest.fn()
    }
    TrainingLibrarySurveyPreviewDialog.methods.callForLanguages.call(ctx)
    expect(ctx.selectedLanguages[0]).toEqual({ text: 'English', value: '1', code: 'en' })
    expect(ctx.callForTrainingDetail).toHaveBeenCalled()
  })

  it('handleSend closes and opens survey send modal', () => {
    const handleClose = jest.fn()
    const setSurveySendModal = jest.fn()
    TrainingLibrarySurveyPreviewDialog.methods.handleSend.call(
      { handleClose, setSurveySendModal, selectedRow: { trainingId: 's1' } }
    )
    expect(handleClose).toHaveBeenCalled()
    expect(setSurveySendModal).toHaveBeenCalledWith({
      selectedRow: { trainingId: 's1' },
      status: true
    })
  })

  it('callForTrainingDetail normalizes multi category display', async () => {
    const AwarenessEducatorService = require('@/api/awarenessEducator')
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Survey',
          trainingCategories: [
            { code: 'RemoteWorkingSecurity', categoryName: 'Remote Working Security' },
            { code: 'TravelSecurity', categoryName: 'Travel Security' }
          ]
        }
      }
    })
    const ctx = {
      selectedRow: { trainingId: 's2' },
      selectedLanguages: [{ text: 'English' }],
      trainingDetails: null
    }

    TrainingLibrarySurveyPreviewDialog.methods.callForTrainingDetail.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.trainingDetails).toEqual(
      expect.objectContaining({
        categoryName: 'Remote Working Security, Travel Security',
        languages: 'English'
      })
    )
  })
})

