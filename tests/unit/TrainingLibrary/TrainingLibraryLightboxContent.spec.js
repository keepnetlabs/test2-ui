import TrainingLibraryLightboxContent from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightboxContent.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingLibraryLightboxContent.vue', () => {
  it('errorCaptured suppresses known vue-pdf resize error', () => {
    const result = TrainingLibraryLightboxContent.errorCaptured({
      message: "Cannot read properties of undefined (reading 'catch')"
    })
    expect(result).toBe(false)
  })

  it('errorCaptured allows unrelated errors', () => {
    const result = TrainingLibraryLightboxContent.errorCaptured({
      message: 'Some other error'
    })
    expect(result).toBe(true)
  })

  it('isImageType returns true for image-like training types', () => {
    expect(
      TrainingLibraryLightboxContent.computed.isImageType.call({
        type: TRAINING_LIBRARY_TYPES.POSTER
      })
    ).toBe(true)
    expect(
      TrainingLibraryLightboxContent.computed.isImageType.call({
        type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC
      })
    ).toBe(true)
    expect(
      TrainingLibraryLightboxContent.computed.isImageType.call({
        type: TRAINING_LIBRARY_TYPES.SCREENSAVER
      })
    ).toBe(true)
    expect(
      TrainingLibraryLightboxContent.computed.isImageType.call({
        type: TRAINING_LIBRARY_TYPES.TRAINING
      })
    ).toBe(false)
  })

  it('previewUrl resolves from string, scorm data, and training url', () => {
    expect(TrainingLibraryLightboxContent.computed.previewUrl.call({ previewData: null })).toBeNull()
    expect(
      TrainingLibraryLightboxContent.computed.previewUrl.call({
        previewData: 'https://cdn.example.com/preview.pdf'
      })
    ).toBe('https://cdn.example.com/preview.pdf')

    expect(
      TrainingLibraryLightboxContent.computed.previewUrl.call({
        previewData: {
          scormPlayerUrl: 'https://player.example.com',
          trainingUrl: 'https://content.example.com/index.html'
        }
      })
    ).toBe(
      'https://player.example.com?isPreview=true&scoAddress=https://content.example.com/index.html'
    )

    expect(
      TrainingLibraryLightboxContent.computed.previewUrl.call({
        previewData: { trainingUrl: 'https://content.example.com/file' }
      })
    ).toBe('https://content.example.com/file')
  })

  it('isPdf and pdfSrc computed values behave as expected', () => {
    expect(
      TrainingLibraryLightboxContent.computed.isPdf.call({ previewUrl: null })
    ).toBe(false)
    expect(
      TrainingLibraryLightboxContent.computed.isPdf.call({
        previewUrl: 'https://cdn.example.com/file.PDF'
      })
    ).toBe(true)
    expect(
      TrainingLibraryLightboxContent.computed.isPdf.call({
        previewUrl: 'blob:http://localhost/abc'
      })
    ).toBe(true)
    expect(
      TrainingLibraryLightboxContent.computed.isPdf.call({
        previewUrl: 'https://cdn.example.com/file.png'
      })
    ).toBe(false)

    expect(TrainingLibraryLightboxContent.computed.pdfSrc.call({ previewUrl: null })).toBeNull()
    expect(
      TrainingLibraryLightboxContent.computed.pdfSrc.call({
        previewUrl: 'https://cdn.example.com/file.pdf'
      })
    ).toBe('https://cdn.example.com/file.pdf')
  })

  it('pdfSrc watcher resets state and marks ready on nextTick for pdf', () => {
    const ctx = {
      isPdf: true,
      pdfReady: true,
      currentPage: 5,
      numPages: 8,
      $nextTick: (fn) => fn()
    }

    TrainingLibraryLightboxContent.watch.pdfSrc.handler.call(ctx, 'https://cdn.example.com/file.pdf')

    expect(ctx.currentPage).toBe(1)
    expect(ctx.numPages).toBe(0)
    expect(ctx.pdfReady).toBe(true)
  })

  it('pdfSrc watcher disables readiness when source is missing or non-pdf', () => {
    const ctx = {
      isPdf: false,
      pdfReady: true,
      currentPage: 2,
      numPages: 3,
      $nextTick: (fn) => fn()
    }

    TrainingLibraryLightboxContent.watch.pdfSrc.handler.call(ctx, null)
    expect(ctx.pdfReady).toBe(false)
  })

  it('handlePdfError emits event and disables pdfReady', () => {
    const emit = jest.fn()
    const ctx = { pdfReady: true, $emit: emit }
    const error = new Error('pdf failed')

    TrainingLibraryLightboxContent.methods.handlePdfError.call(ctx, error)

    expect(ctx.pdfReady).toBe(false)
    expect(emit).toHaveBeenCalledWith('pdf-error', error)
  })

  it('handlePdfLoaded updates page count', () => {
    const ctx = { numPages: 0 }
    TrainingLibraryLightboxContent.methods.handlePdfLoaded.call(ctx, 12)
    expect(ctx.numPages).toBe(12)
  })

  it('mounted sets pdfWidth based on viewport width', () => {
    const originalWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000
    })
    const ctx = { pdfWidth: 0 }

    TrainingLibraryLightboxContent.mounted.call(ctx)
    expect(ctx.pdfWidth).toBe(300)

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth
    })
  })
})
