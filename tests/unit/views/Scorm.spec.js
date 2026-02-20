jest.mock('@/api/awarenessEducator', () => ({
  getTrainingUrl: jest.fn()
}))

import Scorm from '@/views/Scorm.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Scorm.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.APP_CONFIG = {
      ...global.APP_CONFIG,
      VUE_APP_AWARENESS_URL: 'https://awareness.keepnetlabs.com'
    }
  })

  it('callForData sets preview src when isPreview query exists', () => {
    const ctx = {
      src: '',
      $route: {
        query: {
          isPreview: true,
          template: 'https://template.example',
          scoAddress: 'sco-1'
        }
      }
    }

    Scorm.methods.callForData.call(ctx)

    expect(ctx.src).toBe('https://template.example?isPreview=true&scoAddress=sco-1')
    expect(AwarenessEducatorService.getTrainingUrl).not.toHaveBeenCalled()
  })

  it('created hook triggers callForData', () => {
    const callForData = jest.fn()
    const ctx = { callForData }

    Scorm.created.call(ctx)

    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData fetches training url and builds iframe src', async () => {
    AwarenessEducatorService.getTrainingUrl.mockResolvedValueOnce({
      data: { data: { scormPlayerUrl: 'https://player.example', trainingUrl: '/course/a' } }
    })

    const registerFrameChannelForQuestionExtractorProxy = jest.fn()
    const ctx = {
      src: '',
      registerFrameChannelForQuestionExtractorProxy,
      $route: {
        query: {
          EnrollmentContentId: 'enroll-1',
          TargetUserResourceId: 'user-1'
        }
      }
    }

    Scorm.methods.callForData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingUrl).toHaveBeenCalledWith('user-1', 'enroll-1')
    expect(ctx.src).toContain('https://player.example?TargetUserResourceId=user-1')
    expect(ctx.src).toContain('EnrollmentContentId=enroll-1')
    expect(ctx.src).toContain('DomainUrl=https://awareness.keepnetlabs.com')
    expect(ctx.src).toContain('scoAddress=/course/a')
    expect(registerFrameChannelForQuestionExtractorProxy).toHaveBeenCalledTimes(1)
  })

  it('callForData does nothing when required query ids are missing', () => {
    const ctx = {
      src: '',
      registerFrameChannelForQuestionExtractorProxy: jest.fn(),
      $route: { query: {} }
    }

    Scorm.methods.callForData.call(ctx)

    expect(AwarenessEducatorService.getTrainingUrl).not.toHaveBeenCalled()
    expect(ctx.registerFrameChannelForQuestionExtractorProxy).not.toHaveBeenCalled()
    expect(ctx.src).toBe('')
  })

  it('callForData alerts when training url request fails', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    AwarenessEducatorService.getTrainingUrl.mockRejectedValueOnce({
      response: { data: { message: 'Training URL error' } }
    })

    const ctx = {
      registerFrameChannelForQuestionExtractorProxy: jest.fn(),
      $route: {
        query: {
          EnrollmentContentId: 'enroll-1',
          TargetUserResourceId: 'user-1'
        }
      }
    }

    Scorm.methods.callForData.call(ctx)
    await flushPromises()

    expect(alertSpy).toHaveBeenCalledWith('Training URL error')
    alertSpy.mockRestore()
  })

  it('callForData removes beforeunload handler after timeout in finally block', async () => {
    jest.useFakeTimers()
    const removeEventListener = jest.fn()
    const originalWindow = global.window
    Object.defineProperty(global, 'window', {
      value: {
        ...originalWindow,
        __beforeUnloadHandler: jest.fn(),
        removeEventListener
      },
      configurable: true
    })

    AwarenessEducatorService.getTrainingUrl.mockResolvedValueOnce({
      data: { data: { scormPlayerUrl: 'https://player.example', trainingUrl: '/course/a' } }
    })

    const ctx = {
      registerFrameChannelForQuestionExtractorProxy: jest.fn(),
      $route: {
        query: {
          EnrollmentContentId: 'enroll-1',
          TargetUserResourceId: 'user-1'
        }
      }
    }

    Scorm.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    jest.advanceTimersByTime(12000)

    expect(removeEventListener).toHaveBeenCalledWith('beforeunload', window.__beforeUnloadHandler)

    Object.defineProperty(global, 'window', { value: originalWindow, configurable: true })
    jest.useRealTimers()
  })

  it('callForData does not try to remove listener when beforeunload handler is absent', async () => {
    jest.useFakeTimers()
    const removeEventListener = jest.fn()
    const originalWindow = global.window
    Object.defineProperty(global, 'window', {
      value: {
        ...originalWindow,
        __beforeUnloadHandler: null,
        removeEventListener
      },
      configurable: true
    })
    AwarenessEducatorService.getTrainingUrl.mockResolvedValueOnce({
      data: { data: { scormPlayerUrl: 'https://player.example', trainingUrl: '/course/a' } }
    })

    const ctx = {
      registerFrameChannelForQuestionExtractorProxy: jest.fn(),
      $route: {
        query: {
          EnrollmentContentId: 'enroll-1',
          TargetUserResourceId: 'user-1'
        }
      }
    }

    Scorm.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    jest.advanceTimersByTime(12000)

    expect(removeEventListener).not.toHaveBeenCalled()
    Object.defineProperty(global, 'window', { value: originalWindow, configurable: true })
    jest.useRealTimers()
  })

  it('registerFrameChannelForQuestionExtractorProxy warns when iframe is missing', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(null)

    Scorm.methods.registerFrameChannelForQuestionExtractorProxy.call({})

    expect(warnSpy).toHaveBeenCalled()
    querySpy.mockRestore()
    warnSpy.mockRestore()
  })

  it('registerFrameChannelForQuestionExtractorProxy posts params to iframe channel on load', () => {
    const postMessage = jest.fn()
    let onLoad
    const iframe = {
      addEventListener: jest.fn((event, cb) => {
        if (event === 'load') onLoad = cb
      }),
      contentWindow: { postMessage }
    }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(iframe)
    const originalMessageChannel = global.MessageChannel
    const port1Post = jest.fn()
    global.MessageChannel = function MessageChannelMock() {
      return {
        port1: { postMessage: port1Post },
        port2: {}
      }
    }

    Scorm.methods.registerFrameChannelForQuestionExtractorProxy.call({})
    onLoad()

    expect(postMessage).toHaveBeenCalledWith({ type: 'QEX_PARAMS_CHANNEL' }, '*', [expect.any(Object)])
    expect(port1Post).toHaveBeenCalledWith(
      expect.objectContaining({
        EnrollmentContentId: expect.any(String),
        TargetUserResourceId: expect.any(String)
      })
    )

    global.MessageChannel = originalMessageChannel
    querySpy.mockRestore()
  })

  it('registerFrameChannelForQuestionExtractorProxy catches postMessage errors', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    let onLoad
    const iframe = {
      addEventListener: jest.fn((event, cb) => {
        if (event === 'load') onLoad = cb
      }),
      contentWindow: {
        postMessage: jest.fn(() => {
          throw new Error('postMessage blocked')
        })
      }
    }
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(iframe)
    const originalMessageChannel = global.MessageChannel
    global.MessageChannel = function MessageChannelMock() {
      return {
        port1: { postMessage: jest.fn() },
        port2: {}
      }
    }

    Scorm.methods.registerFrameChannelForQuestionExtractorProxy.call({})
    onLoad()

    expect(errorSpy).toHaveBeenCalled()

    global.MessageChannel = originalMessageChannel
    querySpy.mockRestore()
    errorSpy.mockRestore()
  })
})
