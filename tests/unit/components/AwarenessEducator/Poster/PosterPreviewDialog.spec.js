import PosterPreviewDialog from '@/components/AwarenessEducator/Poster/PosterPreviewDialog.vue'

describe('PosterPreviewDialog.vue', () => {
  it('getDownloadPosterStyle disables clicks when downloading', () => {
    const style = PosterPreviewDialog.computed.getDownloadPosterStyle.call({
      isDownloadButtonDisabled: true
    })
    expect(style.pointerEvents).toBe('none')
  })

  it('getLanguages joins selected language names', () => {
    const text = PosterPreviewDialog.computed.getLanguages.call({
      selectedLanguages: [{ name: 'English' }, { name: 'Turkish' }]
    })
    expect(text).toBe('English, Turkish')
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    PosterPreviewDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})

