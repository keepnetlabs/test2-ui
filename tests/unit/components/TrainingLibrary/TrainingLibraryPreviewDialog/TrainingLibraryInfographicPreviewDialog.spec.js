import TrainingLibraryInfographicPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryInfographicPreviewDialog.vue'

describe('TrainingLibraryInfographicPreviewDialog.vue', () => {
  it('getDownloadInfographicStyle disables interactions while downloading', () => {
    const style = TrainingLibraryInfographicPreviewDialog.computed.getDownloadInfographicStyle.call({
      isDownloadButtonDisabled: true
    })
    expect(style.pointerEvents).toBe('none')
  })

  it('handleSend opens send modal then closes', () => {
    const setInfographicSendModal = jest.fn()
    const handleClose = jest.fn()
    TrainingLibraryInfographicPreviewDialog.methods.handleSend.call(
      { setInfographicSendModal, handleClose, selectedRow: { trainingId: 'i1' } }
    )
    expect(setInfographicSendModal).toHaveBeenCalledWith({
      selectedRow: { trainingId: 'i1' },
      status: true
    })
    expect(handleClose).toHaveBeenCalled()
  })
})

