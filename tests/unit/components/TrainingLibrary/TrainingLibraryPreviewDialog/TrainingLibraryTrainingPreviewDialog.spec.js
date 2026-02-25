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
})

