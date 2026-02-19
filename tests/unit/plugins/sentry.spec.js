describe('plugins/sentry', () => {
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
    Object.defineProperty(global, 'window', {
      value: global.window || { location: { pathname: '/' }, navigator: { userAgent: 'node.js' } },
      writable: true,
      configurable: true
    })
    Object.defineProperty(global, 'navigator', {
      value: global.navigator || { userAgent: 'node.js' },
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

  it('does nothing when sentry status is disabled', () => {
    const { plugin, sentryMock } = loadPlugin({ sentryStatus: false })
    plugin({})
    expect(sentryMock.init).not.toHaveBeenCalled()
    expect(sentryMock.setUser).not.toHaveBeenCalled()
  })

  it('initializes sentry and sets default user when localStorage is empty', () => {
    const { plugin, sentryMock } = loadPlugin({ sentryStatus: true, userData: null })
    plugin({})

    expect(sentryMock.setUser).toHaveBeenCalledWith({
      username: 'Company',
      email: 'Guest Email'
    })
    expect(sentryMock.init).toHaveBeenCalled()
    expect(sentryMock.addEventProcessor).toHaveBeenCalled()
  })

  it('filters known noisy errors in event processor', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "Cannot read properties of undefined (reading 'getTiles')" }]
      }
    }

    expect(processor(event)).toBeNull()
  })

  it('returns event when it is not filtered', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'Unexpected business error happened' }]
      }
    }

    expect(processor(event)).toBe(event)
  })

  it('filters replay events on scorm pages', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    const originalWindow = global.window
    Object.defineProperty(global, 'window', {
      value: { location: { pathname: '/training/scorm/watch' } },
      configurable: true
    })

    plugin({})
    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    expect(processor({ type: 'replay_event' })).toBeNull()

    Object.defineProperty(global, 'window', { value: originalWindow, configurable: true })
  })

  it('filters known Vuetify message-level errors', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      message: 'Vuetify runtime warning'
    }

    expect(processor(event)).toBeNull()
  })
})
