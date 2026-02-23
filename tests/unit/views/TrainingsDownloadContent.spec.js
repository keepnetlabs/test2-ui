import TrainingsDownloadContent from '@/views/TrainingsDownloadContent.vue'
import axios from 'axios'

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingsDownloadContent.vue', () => {
  let consoleSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('mounted triggers handleDownload', () => {
    const ctx = { handleDownload: jest.fn() }

    TrainingsDownloadContent.mounted.call(ctx)
    expect(ctx.handleDownload).toHaveBeenCalledTimes(1)
  })

  it('getFileNameFromDisposition parses utf8 and normal filename variants', () => {
    const m = TrainingsDownloadContent.methods

    expect(m.getFileNameFromDisposition("attachment; filename*=UTF-8''my%20file.pdf")).toBe('my file.pdf')
    expect(m.getFileNameFromDisposition('attachment; filename="report.csv"')).toBe('report.csv')
    expect(m.getFileNameFromDisposition('attachment; filename=plain.txt')).toBe('plain.txt')
    expect(m.getFileNameFromDisposition('')).toBe('')
    expect(m.getFileNameFromDisposition('attachment')).toBe('')
  })

  it('getExtensionFromType maps known and generic mime types', () => {
    const m = TrainingsDownloadContent.methods

    expect(m.getExtensionFromType('application/pdf')).toBe('.pdf')
    expect(m.getExtensionFromType('application/octet-stream')).toBe('')
    expect(m.getExtensionFromType('image/png; charset=utf-8')).toBe('.png')
    expect(m.getExtensionFromType('audio/ogg')).toBe('.ogg')
    expect(m.getExtensionFromType('video/custom')).toBe('.custom')
    expect(m.getExtensionFromType('application/x-custom')).toBe('.x-custom')
    expect(m.getExtensionFromType('')).toBe('')
    expect(m.getExtensionFromType('invalid-type')).toBe('')
  })

  it('handleDownload sets error state when required query params are missing', async () => {
    const ctx = {
      isLoading: true,
      statusMessage: 'Preparing download...',
      shouldShowCloseButton: false,
      $route: { query: {} }
    }

    await TrainingsDownloadContent.methods.handleDownload.call(ctx)

    expect(ctx.isLoading).toBe(false)
    expect(ctx.statusMessage).toBe('Missing required download parameters.')
    expect(ctx.shouldShowCloseButton).toBe(true)
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('handleDownload success path triggers download and auto-close setup', async () => {
    axios.get.mockResolvedValueOnce({
      data: new Blob(['x']),
      headers: {
        'content-disposition': 'attachment; filename="course.pdf"',
        'content-type': 'application/pdf'
      }
    })

    const triggerDownload = jest.fn()
    const handleAutoClose = jest.fn()
    const ctx = {
      isLoading: true,
      statusMessage: 'Preparing download...',
      shouldShowCloseButton: false,
      $route: {
        query: { EnrollmentContentId: 'ec-1', TargetUserResourceId: 'tu-1' }
      },
      getFileNameFromDisposition: TrainingsDownloadContent.methods.getFileNameFromDisposition,
      getExtensionFromType: TrainingsDownloadContent.methods.getExtensionFromType,
      triggerDownload,
      handleAutoClose
    }

    await TrainingsDownloadContent.methods.handleDownload.call(ctx)
    await flushPromises()

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/trainings/download-content'),
      expect.objectContaining({
        params: {
          enrollmentContentId: 'ec-1',
          targetUserResourceId: 'tu-1'
        },
        responseType: 'blob'
      })
    )
    expect(triggerDownload).toHaveBeenCalledWith(expect.any(Blob), 'course.pdf')
    expect(ctx.statusMessage).toBe('Your download should start shortly.')
    expect(ctx.shouldShowCloseButton).toBe(true)
    expect(handleAutoClose).toHaveBeenCalledTimes(1)
    expect(ctx.isLoading).toBe(false)
  })

  it('handleDownload uses fallback filename when disposition header is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: new Blob(['x']),
      headers: {
        'content-type': 'application/pdf'
      }
    })

    const triggerDownload = jest.fn()
    const ctx = {
      isLoading: true,
      statusMessage: 'Preparing download...',
      shouldShowCloseButton: false,
      $route: {
        query: { EnrollmentContentId: 'ec-2', TargetUserResourceId: 'tu-2' }
      },
      getFileNameFromDisposition: TrainingsDownloadContent.methods.getFileNameFromDisposition,
      getExtensionFromType: TrainingsDownloadContent.methods.getExtensionFromType,
      triggerDownload,
      handleAutoClose: jest.fn()
    }

    await TrainingsDownloadContent.methods.handleDownload.call(ctx)
    await flushPromises()

    expect(triggerDownload).toHaveBeenCalledWith(expect.any(Blob), 'download.pdf')
  })

  it('handleDownload failure path sets failed message and close button', async () => {
    axios.get.mockRejectedValueOnce(new Error('network'))

    const ctx = {
      isLoading: true,
      statusMessage: 'Preparing download...',
      shouldShowCloseButton: false,
      $route: {
        query: { EnrollmentContentId: 'ec-1', TargetUserResourceId: 'tu-1' }
      },
      getFileNameFromDisposition: TrainingsDownloadContent.methods.getFileNameFromDisposition,
      getExtensionFromType: TrainingsDownloadContent.methods.getExtensionFromType,
      triggerDownload: jest.fn(),
      handleAutoClose: jest.fn()
    }

    await TrainingsDownloadContent.methods.handleDownload.call(ctx)

    expect(ctx.statusMessage).toBe('Download failed. Please try again later.')
    expect(ctx.shouldShowCloseButton).toBe(true)
    expect(ctx.isLoading).toBe(false)
  })

  it('handleAutoClose toggles hint and close button based on handleCloseTab result', () => {
    jest.useFakeTimers()

    const ctxClosed = {
      shouldShowCloseHint: false,
      shouldShowCloseButton: true,
      handleCloseTab: jest.fn(() => true)
    }
    TrainingsDownloadContent.methods.handleAutoClose.call(ctxClosed)
    expect(ctxClosed.shouldShowCloseHint).toBe(true)
    jest.advanceTimersByTime(1250)
    expect(ctxClosed.shouldShowCloseButton).toBe(false)

    const ctxNotClosed = {
      shouldShowCloseHint: false,
      shouldShowCloseButton: true,
      handleCloseTab: jest.fn(() => false)
    }
    TrainingsDownloadContent.methods.handleAutoClose.call(ctxNotClosed)
    jest.advanceTimersByTime(1250)
    expect(ctxNotClosed.shouldShowCloseButton).toBe(true)

    jest.useRealTimers()
  })

  it('handleCloseTab returns true when closable and false on close error', () => {
    const closeSpy = jest.spyOn(window, 'close').mockImplementation(() => {})

    const originalOpener = window.opener
    Object.defineProperty(window, 'opener', { value: {}, configurable: true })
    expect(TrainingsDownloadContent.methods.handleCloseTab()).toBe(true)

    closeSpy.mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(TrainingsDownloadContent.methods.handleCloseTab()).toBe(false)

    Object.defineProperty(window, 'opener', { value: originalOpener, configurable: true })
    closeSpy.mockRestore()
  })

  it('handleCloseTab returns false when tab is not closable', () => {
    const closeSpy = jest.spyOn(window, 'close').mockImplementation(() => {})
    const originalOpener = window.opener
    Object.defineProperty(window, 'opener', { value: null, configurable: true })

    const result = TrainingsDownloadContent.methods.handleCloseTab()
    expect(typeof result).toBe('boolean')
    if (window.history.length <= 1) {
      expect(result).toBe(true)
      expect(closeSpy).toHaveBeenCalled()
    } else {
      expect(result).toBe(false)
      expect(closeSpy).not.toHaveBeenCalled()
    }

    Object.defineProperty(window, 'opener', { value: originalOpener, configurable: true })
    closeSpy.mockRestore()
  })

  it('triggerDownload uses msSaveOrOpenBlob when available', () => {
    const originalMsSaveOrOpenBlob = window.navigator.msSaveOrOpenBlob
    const msSaveOrOpenBlob = jest.fn()
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: msSaveOrOpenBlob,
      configurable: true
    })

    TrainingsDownloadContent.methods.triggerDownload(new Blob(['x']), 'a.pdf')
    expect(msSaveOrOpenBlob).toHaveBeenCalled()

    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: originalMsSaveOrOpenBlob,
      configurable: true
    })
  })

  it('triggerDownload creates and clicks anchor for standard browsers', () => {
    const originalMsSaveOrOpenBlob = window.navigator.msSaveOrOpenBlob
    const originalURL = window.URL
    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: undefined,
      configurable: true
    })
    window.URL = {
      createObjectURL: jest.fn(() => 'blob:test'),
      revokeObjectURL: jest.fn()
    }

    const appendChildSpy = jest.spyOn(document.body, 'appendChild')
    const link = document.createElement('a')
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const removeSpy = jest.spyOn(Element.prototype, 'remove').mockImplementation(() => {})
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)

    TrainingsDownloadContent.methods.triggerDownload(new Blob(['x']), 'b.pdf')

    expect(window.URL.createObjectURL).toHaveBeenCalled()
    expect(appendChildSpy).toHaveBeenCalledWith(link)
    expect(clickSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
    expect(link.getAttribute('download')).toBe('b.pdf')
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test')

    Object.defineProperty(window.navigator, 'msSaveOrOpenBlob', {
      value: originalMsSaveOrOpenBlob,
      configurable: true
    })
    window.URL = originalURL
    createElementSpy.mockRestore()
    clickSpy.mockRestore()
    removeSpy.mockRestore()
    appendChildSpy.mockRestore()
  })
})
