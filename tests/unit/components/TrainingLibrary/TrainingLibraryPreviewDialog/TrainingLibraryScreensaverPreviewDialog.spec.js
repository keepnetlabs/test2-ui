import TrainingLibraryScreensaverPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryScreensaverPreviewDialog.vue'

describe('TrainingLibraryScreensaverPreviewDialog.vue', () => {
  it('getLanguages returns selected language codes', () => {
    const codes = TrainingLibraryScreensaverPreviewDialog.computed.getLanguages.call({
      selectedLanguages: [{ code: 'en' }, { code: 'tr' }]
    })
    expect(codes).toEqual(['en', 'tr'])
  })

  it('handleSend opens send modal and closes dialog', () => {
    const setScreensaverSendModal = jest.fn()
    const handleClose = jest.fn()
    TrainingLibraryScreensaverPreviewDialog.methods.handleSend.call(
      { setScreensaverSendModal, handleClose, selectedRow: { trainingId: 's1' } }
    )
    expect(setScreensaverSendModal).toHaveBeenCalledWith({
      selectedRow: { trainingId: 's1' },
      status: true
    })
    expect(handleClose).toHaveBeenCalled()
  })
})

