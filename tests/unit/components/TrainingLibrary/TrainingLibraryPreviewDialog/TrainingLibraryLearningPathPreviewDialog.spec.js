jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibraryLearningPathPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreviewDialog.vue'

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
})

