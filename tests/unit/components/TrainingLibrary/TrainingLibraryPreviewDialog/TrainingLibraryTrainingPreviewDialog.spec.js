jest.mock('@/api/awarenessEducator', () => ({
  getTraining: jest.fn(() =>
    Promise.resolve({
      data: { data: { name: 'Training', isFavourite: false } }
    })
  )
}))

import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'

describe('TrainingLibraryTrainingPreviewDialog.vue', () => {
  it('getTrainingId falls back to detailTrainingId', () => {
    const id = TrainingLibraryTrainingPreviewDialog.computed.getTrainingId.call({
      selectedRow: { detailTrainingId: 'd1' }
    })
    expect(id).toBe('d1')
  })

  it('handleSend closes and opens send modal', () => {
    const handleClose = jest.fn()
    const setTrainingSendModal = jest.fn()
    TrainingLibraryTrainingPreviewDialog.methods.handleSend.call(
      { handleClose, setTrainingSendModal, selectedRow: { trainingId: 't1' } }
    )
    expect(handleClose).toHaveBeenCalled()
    expect(setTrainingSendModal).toHaveBeenCalledWith({
      selectedRow: { trainingId: 't1' },
      status: true
    })
  })

  it('callForTrainingDetail normalizes multi category display', async () => {
    const AwarenessEducatorService = require('@/api/awarenessEducator')
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Training',
          trainingCategories: [
            { code: 'RemoteWorkingSecurity', categoryName: 'Remote Working Security' },
            { code: 'TravelSecurity', categoryName: 'Travel Security' }
          ]
        }
      }
    })
    const ctx = {
      selectedRow: { trainingId: 't2' },
      selectedLanguages: [{ text: 'English' }],
      trainingDetails: null
    }

    TrainingLibraryTrainingPreviewDialog.methods.callForTrainingDetail.call(ctx)
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

