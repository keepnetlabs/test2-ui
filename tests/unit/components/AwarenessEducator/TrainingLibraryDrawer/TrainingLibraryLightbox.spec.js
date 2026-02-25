import TrainingLibraryLightbox from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightbox.vue'

describe('TrainingLibraryLightbox.vue', () => {
  it('value watcher toggles isVisible', () => {
    const ctx = { isVisible: false }
    TrainingLibraryLightbox.watch.value.handler.call(ctx, true)
    expect(ctx.isVisible).toBe(true)
    TrainingLibraryLightbox.watch.value.handler.call(ctx, false)
    expect(ctx.isVisible).toBe(false)
  })

  it('handleClose emits input false and close', () => {
    const $emit = jest.fn()
    TrainingLibraryLightbox.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalledWith('input', false)
    expect($emit).toHaveBeenCalledWith('close')
  })
})
