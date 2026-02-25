import TrainingLibraryNewScreensaverContentByLanguage from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewScreensaverModal/TrainingLibraryNewScreensaverContentByLanguage.vue'

describe('TrainingLibraryNewScreensaverContentByLanguage.vue', () => {
  it('getRemovableButtonStyle disables when uploading or not deleteable', () => {
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.getRemovableButtonStyle.call({
        isUploading: true
      })
    ).toEqual({ opacity: 0.5, pointerEvents: 'none' })
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.getRemovableButtonStyle.call({
        value: { isDeleteable: true }
      })
    ).toEqual({ opacity: 0.5, pointerEvents: 'none' })
  })

  it('isRenderTooltip returns value.isDeleteable', () => {
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.isRenderTooltip.call({
        value: { isDeleteable: true }
      })
    ).toBe(true)
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.isRenderTooltip.call({
        value: {}
      })
    ).toBeFalsy()
  })

  it('isCheckDisableVendor returns true when canSaveVendor and no vendorId', () => {
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.isCheckDisableVendor.call({
        canSaveVendor: true,
        vendorId: ''
      })
    ).toBe(true)
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.isCheckDisableVendor.call({
        canSaveVendor: false
      })
    ).toBe(false)
  })

  it('getHint returns file hint', () => {
    expect(
      TrainingLibraryNewScreensaverContentByLanguage.computed.getHint.call({})
    ).toContain('100MB')
  })

  it('handleRemove emits on-remove', () => {
    const emit = jest.fn()
    TrainingLibraryNewScreensaverContentByLanguage.methods.handleRemove.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-remove')
  })
})
