import TrainingLibraryPosterPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryPosterPreviewDialog.vue'

describe('TrainingLibraryPosterPreviewDialog.vue', () => {
  it('getDownloadPosterStyle disables interactions while downloading', () => {
    const style = TrainingLibraryPosterPreviewDialog.computed.getDownloadPosterStyle.call({
      isDownloadButtonDisabled: true
    })
    expect(style.pointerEvents).toBe('none')
  })

  it('handleSend opens send modal and calls close', () => {
    const setPosterSendModal = jest.fn()
    const handleClose = jest.fn()
    TrainingLibraryPosterPreviewDialog.methods.handleSend.call(
      { setPosterSendModal, handleClose, selectedRow: { trainingId: 'p1' } }
    )
    expect(setPosterSendModal).toHaveBeenCalledWith({
      selectedRow: { trainingId: 'p1' },
      status: true
    })
    expect(handleClose).toHaveBeenCalled()
  })
})

