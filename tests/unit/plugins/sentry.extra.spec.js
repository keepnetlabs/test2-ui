describe('plugins/sentry (extra coverage)', () => {
  const createSentryMock = () => ({
    setUser: jest.fn(),
    init: jest.fn(),
    addEventProcessor: jest.fn(),
    browserTracingIntegration: jest.fn().mockReturnValue('browserTracing'),
    captureConsoleIntegration: jest.fn().mockReturnValue('captureConsole'),
    replayIntegration: jest.fn().mockReturnValue('replay')
  })

  const loadPlugin = ({ sentryStatus = true, userData = null } = {}) => {
    jest.resetModules()
    const sentryMock = createSentryMock()
    global.APP_CONFIG = {
      ...global.APP_CONFIG,
      VUE_APP_SENTRY_DSN: 'dsn-test',
      VUE_APP_SENTRY_STATUS: sentryStatus
    }
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(() => userData),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true,
      configurable: true
    })
    let plugin
    jest.isolateModules(() => {
      jest.doMock('@sentry/vue', () => sentryMock)
      plugin = require('@/plugins/sentry').default
    })
    return { plugin, sentryMock }
  }

  const getProcessor = (userData = null) => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: userData ? JSON.stringify(userData) : null
    })
    plugin({})
    return sentryMock.addEventProcessor.mock.calls[0][0]
  }

  it('filters GRAPESJS_INTERNAL errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: "Cannot read properties of null (reading 'querySelector')" }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters AXIOS_ERROR timeout', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'timeout of 100000ms exceeded' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters LOGIN_NAVIGATION_DUPLICATED', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'Avoided redundant navigation to current location: "/login"' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters SMARTLOOK message', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'smartlook error occurred' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters RESIZE_OBSERVER message', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'ResizeObserver loop limit exceeded' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters Network Error message', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'Network Error' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters HTTP/1.1 Overhead in message-level event', () => {
    const processor = getProcessor()
    const event = { level: 'error', message: 'HTTP/1.1 Overhead' }
    expect(processor(event)).toBeNull()
  })

  it('filters [object Event] in message', () => {
    const processor = getProcessor()
    const event = { level: 'error', message: '[object Event]' }
    expect(processor(event)).toBeNull()
  })

  it('filters [object ProgressEvent] in message', () => {
    const processor = getProcessor()
    const event = { level: 'error', message: '[object ProgressEvent]' }
    expect(processor(event)).toBeNull()
  })

  it('filters Large Render Blocking Asset in message', () => {
    const processor = getProcessor()
    const event = { level: 'error', message: 'Large Render Blocking Asset' }
    expect(processor(event)).toBeNull()
  })

  it('filters <unknown> in message', () => {
    const processor = getProcessor()
    const event = { level: 'error', message: '<unknown>' }
    expect(processor(event)).toBeNull()
  })

  it('returns event when exception values is empty', () => {
    const processor = getProcessor()
    const event = { level: 'error', exception: { values: [] } }
    expect(processor(event)).toBe(event)
  })

  it('returns event when level is not error', () => {
    const processor = getProcessor()
    const event = { level: 'warning', exception: { values: [{ value: 'some warning' }] } }
    expect(processor(event)).toBe(event)
  })
})
