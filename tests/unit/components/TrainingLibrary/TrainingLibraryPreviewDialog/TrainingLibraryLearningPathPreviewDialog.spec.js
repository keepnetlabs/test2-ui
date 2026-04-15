jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibraryLearningPathPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreviewDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryLearningPathPreviewDialog.vue', () => {
  it('handleSend opens send modal and closes', () => {
    const setLearningPathSendModal = jest.fn()
    const handleClose = jest.fn()
    TrainingLibraryLearningPathPreviewDialog.methods.handleSend.call(
      {
        setLearningPathSendModal,
        handleClose,
        selectedRow: { trainingId: 'lp1' }
      }
    )
    expect(setLearningPathSendModal).toHaveBeenCalledWith({
      selectedRow: { trainingId: 'lp1' },
      status: true
    })
    expect(handleClose).toHaveBeenCalled()
  })

  it('getTrainingParams returns given trainingParams when callApi is false', () => {
    const params = { name: 'LP' }
    const result = TrainingLibraryLearningPathPreviewDialog.computed.getTrainingParams.call({
      trainingParams: params,
      callApi: false,
      trainingDetails: null
    })
    expect(result).toEqual(params)
  })

  it('callForTrainingDetail normalizes multi category display', async () => {
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: {
        data: {
          name: 'LP',
          trainingGroups: [],
          trainingCategories: [
            { code: 'RemoteWorkingSecurity', categoryName: 'Remote Working Security' },
            { code: 'TravelSecurity', categoryName: 'Travel Security' }
          ]
        }
      }
    })
    const ctx = {
      isPreviewLoading: true,
      selectedRow: { trainingId: 'lp2' },
      trainingDetails: null
    }

    TrainingLibraryLearningPathPreviewDialog.methods.callForTrainingDetail.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.trainingDetails).toEqual(
      expect.objectContaining({
        categoryName: 'Remote Working Security, Travel Security'
      })
    )
  })
})

