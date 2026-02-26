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
    const originalLocation = global.location
    const originalWindow = global.window
    Object.defineProperty(global, 'location', {
      value: { pathname: '/training/scorm/watch' },
      configurable: true,
      writable: true
    })
    Object.defineProperty(global, 'window', {
      value: { ...global.window, location: { pathname: '/training/scorm/watch' } },
      configurable: true,
      writable: true
    })

    plugin({})
    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    expect(processor({ type: 'replay_event' })).toBeNull()

    Object.defineProperty(global, 'location', {
      value: originalLocation,
      configurable: true,
      writable: true
    })
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

  it('filters known message-level overhead errors', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      message: 'HTTP/1.1 Overhead detected during fetch'
    }

    expect(processor(event)).toBeNull()
  })

  it('keeps replay events outside scorm pages', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = { type: 'replay_event' }
    expect(processor(event)).toBe(event)
  })

  it('keeps replay events when pathname is unavailable', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    const originalLocation = global.location
    Object.defineProperty(global, 'location', {
      value: undefined,
      configurable: true,
      writable: true
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    expect(processor({ type: 'replay_event' })).toEqual({ type: 'replay_event' })

    Object.defineProperty(global, 'location', {
      value: originalLocation,
      configurable: true,
      writable: true
    })
  })

  it('sets fallback username when user has no company name', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ email: 'user@acme.com' })
    })
    plugin({})

    expect(sentryMock.setUser).toHaveBeenCalledWith({
      username: 'Company',
      email: 'user@acme.com'
    })
  })

  it('sets fallback email when email is missing', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme Corp' })
    })
    plugin({})

    expect(sentryMock.setUser).toHaveBeenCalledWith({
      username: 'Acme Corp',
      email: 'Guest Email'
    })
  })

  it('filters smartlook related exception messages', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'something smartlook happened' }]
      }
    }

    expect(processor(event)).toBeNull()
  })

  it('returns event when error level has no exception and no filtered message', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      message: 'Unhandled but meaningful error message'
    }

    expect(processor(event)).toBe(event)
  })

  it('does not filter matching message when level is not error', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'warning',
      message: 'Vuetify runtime warning'
    }

    expect(processor(event)).toBe(event)
  })

  it('filters message-level [object Event] errors', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      message: 'Event [object Event] captured as exception'
    }

    expect(processor(event)).toBeNull()
  })

  it('filters network error signature from exception message', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    plugin({})

    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'Network Error while calling API' }]
      }
    }

    expect(processor(event)).toBeNull()
  })

  it('initializes sentry integrations with router tracing config', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    const router = { currentRoute: { path: '/' } }
    plugin(router)

    expect(sentryMock.browserTracingIntegration).toHaveBeenCalledWith({ router })
    expect(sentryMock.captureConsoleIntegration).toHaveBeenCalledWith({ levels: ['error'] })
    expect(sentryMock.replayIntegration).toHaveBeenCalledWith({
      maskAllText: false,
      blockAllMedia: false
    })
    expect(sentryMock.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'dsn-test',
        trackComponents: true
      })
    )
  })
})
