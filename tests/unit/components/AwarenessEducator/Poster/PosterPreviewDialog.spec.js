jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrlForPreview: jest.fn(() =>
    Promise.resolve({ data: { data: { trainingUrl: 'https://cdn/file.pdf' } } })
  ),
  getTraining: jest.fn(() => Promise.resolve({ data: { data: { name: 'Poster Name' } } })),
  downloadPoster: jest.fn(() => Promise.resolve({ data: new Blob(['pdf']) }))
}))

import PosterPreviewDialog from '@/components/AwarenessEducator/Poster/PosterPreviewDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('PosterPreviewDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDownloadPosterStyle disables clicks when downloading', () => {
    const style = PosterPreviewDialog.computed.getDownloadPosterStyle.call({
      isDownloadButtonDisabled: true
    })
    expect(style.pointerEvents).toBe('none')
  })

  it('getDownloadPosterStyle returns default style when button is enabled', () => {
    const style = PosterPreviewDialog.computed.getDownloadPosterStyle.call({
      isDownloadButtonDisabled: false
    })
    expect(style).toEqual({ textTransform: 'none' })
  })

  it('getLanguages joins selected language names', () => {
    const text = PosterPreviewDialog.computed.getLanguages.call({
      selectedLanguages: [{ name: 'English' }, { name: 'Turkish' }]
    })
    expect(text).toBe('English, Turkish')
  })

  it('getTitle/getSubtitle computed branches', () => {
    expect(PosterPreviewDialog.computed.getTitle.call({})).toBeDefined()
    expect(PosterPreviewDialog.computed.getSubtitle.call({ selectedRow: { name: 'My Poster' } })).toBe(
      'My Poster'
    )
    expect(PosterPreviewDialog.computed.getSubtitle.call({ selectedRow: null })).toBe('')
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    PosterPreviewDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('created maps selected languages, sets specification and calls loaders', () => {
    const callForData = jest.fn()
    const callForPoster = jest.fn()
    const ctx = {
      selectedRow: { languages: ['en'], trainingId: 't1' },
      languages: [{ code: 'en', id: 'lang-1', name: 'English' }],
      selectedLanguages: [],
      specification: '',
      callForData,
      callForPoster
    }

    PosterPreviewDialog.created.call(ctx)
    expect(ctx.selectedLanguages).toEqual([{ code: 'en', id: 'lang-1', name: 'English' }])
    expect(ctx.specification).toBe('lang-1')
    expect(callForData).toHaveBeenCalled()
    expect(callForPoster).toHaveBeenCalled()
  })

  it('callForPoster sets posterParams from API response', async () => {
    const ctx = {
      selectedRow: { trainingId: 't1' },
      posterParams: {}
    }
    PosterPreviewDialog.methods.callForPoster.call(ctx)
    await Promise.resolve()
    expect(ctx.posterParams).toEqual({ name: 'Poster Name' })
  })

  it('callForData handles non-pdf flow and stops loading in finally', async () => {
    AwarenessEducatorService.getTrainingUrlForPreview.mockResolvedValueOnce({
      data: { data: { trainingUrl: 'https://cdn/file.png' } }
    })
    const ctx = {
      isLoading: false,
      pdfSrc: 'old',
      selectedRow: { trainingId: 't1' },
      specification: 'lang-1',
      fileName: '',
      isPdf: true,
      posterPreviewSrc: '',
      handleDownloadPoster: jest.fn()
    }

    PosterPreviewDialog.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.fileName).toBe('file.png')
    expect(ctx.isPdf).toBe(false)
    expect(ctx.posterPreviewSrc).toBe('https://cdn/file.png')
    expect(ctx.isLoading).toBe(false)
    expect(ctx.handleDownloadPoster).not.toHaveBeenCalled()
  })

  it('callForData handles pdf flow and triggers download handler', async () => {
    const ctx = {
      isLoading: false,
      pdfSrc: '',
      selectedRow: { trainingId: 't1' },
      specification: 'lang-1',
      fileName: '',
      isPdf: false,
      posterPreviewSrc: '',
      handleDownloadPoster: jest.fn()
    }

    PosterPreviewDialog.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.fileName).toBe('file.pdf')
    expect(ctx.isPdf).toBe(true)
    expect(ctx.handleDownloadPoster).toHaveBeenCalled()
  })

  it('handleDownloadPoster returns early when pdfSrc exists', () => {
    const downloadPDFObject = jest.fn()
    const ctx = {
      isPdf: true,
      pdfSrc: 'blob:abc',
      downloadPDFObject,
      isDownloadButtonDisabled: false
    }
    PosterPreviewDialog.methods.handleDownloadPoster.call(ctx)
    expect(downloadPDFObject).toHaveBeenCalledWith('blob:abc')
    expect(ctx.isDownloadButtonDisabled).toBe(false)
    expect(AwarenessEducatorService.downloadPoster).not.toHaveBeenCalled()
  })

  it('handleDownloadPoster for pdf sets pdfSrc and resets states', async () => {
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:pdf-url')
    const ctx = {
      isPdf: true,
      pdfSrc: '',
      isLoading: true,
      isDownloadButtonDisabled: false,
      selectedRow: { trainingId: 't2' },
      specification: 'lang-2',
      downloadPDFObject: jest.fn()
    }

    PosterPreviewDialog.methods.handleDownloadPoster.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.downloadPoster).toHaveBeenCalledWith({
      trainingId: 't2',
      languageId: 'lang-2'
    })
    expect(ctx.pdfSrc).toBe('blob:pdf-url')
    expect(ctx.isLoading).toBe(false)
    expect(ctx.isDownloadButtonDisabled).toBe(false)
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('handleDownloadPoster for non-pdf downloads object URL directly', async () => {
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:image-url')
    const downloadPDFObject = jest.fn()
    const ctx = {
      isPdf: false,
      pdfSrc: '',
      isLoading: true,
      isDownloadButtonDisabled: false,
      selectedRow: { trainingId: 't3' },
      specification: 'lang-3',
      downloadPDFObject
    }

    PosterPreviewDialog.methods.handleDownloadPoster.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(downloadPDFObject).toHaveBeenCalledWith('blob:image-url')
    expect(ctx.isLoading).toBe(true)
    expect(ctx.isDownloadButtonDisabled).toBe(false)
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('downloadPDFObject creates anchor and clicks it', () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement
    document.createElement = jest.fn(() => ({ click }))

    PosterPreviewDialog.methods.downloadPDFObject.call(
      { fileName: 'poster.pdf' },
      'blob:download-url'
    )

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(click).toHaveBeenCalled()
    document.createElement = originalCreateElement
  })
})
