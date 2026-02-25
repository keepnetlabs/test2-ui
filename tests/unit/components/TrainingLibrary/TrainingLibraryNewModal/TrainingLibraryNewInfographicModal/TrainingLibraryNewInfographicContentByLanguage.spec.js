jest.mock('@/api/awarenessEducator', () => ({
  uploadPosterContent: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryNewInfographicContentByLanguage from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewInfographicModal/TrainingLibraryNewInfographicContentByLanguage.vue'

describe('TrainingLibraryNewInfographicContentByLanguage.vue', () => {
  it('getRemovableButtonStyle disables remove while uploading', () => {
    expect(
      TrainingLibraryNewInfographicContentByLanguage.computed.getRemovableButtonStyle.call({
        isUploading: true
      })
    ).toEqual({ opacity: 0.5, pointerEvents: 'none' })
  })

  it('isCheckDisableVendor follows vendor requirement', () => {
    expect(
      TrainingLibraryNewInfographicContentByLanguage.computed.isCheckDisableVendor.call({
        canSaveVendor: true,
        vendorId: ''
      })
    ).toBe(true)
    expect(
      TrainingLibraryNewInfographicContentByLanguage.computed.isCheckDisableVendor.call({
        canSaveVendor: false,
        vendorId: ''
      })
    ).toBe(false)
  })

  it('handleFileChange clears file when given empty array', () => {
    const ctx = { value: { file: 'x' }, $emit: jest.fn() }
    TrainingLibraryNewInfographicContentByLanguage.methods.handleFileChange.call(ctx, [])
    expect(ctx.value.file).toBeNull()
    expect(ctx.$emit).not.toHaveBeenCalled()
  })

  it('handleRemove aborts upload and emits on-remove', () => {
    const abort = jest.fn()
    const emit = jest.fn()
    const ctx = { abortController: { abort }, $emit: emit }
    TrainingLibraryNewInfographicContentByLanguage.methods.handleRemove.call(ctx)
    expect(abort).toHaveBeenCalled()
    expect(ctx.abortController).toBeNull()
    expect(emit).toHaveBeenCalledWith('on-remove')
  })
})
