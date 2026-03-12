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

  it('passes through event with no type and no level', () => {
    const processor = getProcessor()
    const event = { extra: { foo: 'bar' } }
    expect(processor(event)).toBe(event)
  })

  it('passes through event when exception values exist but value is null', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: null }] }
    }
    expect(processor(event)).toBe(event)
  })

  it('filters POWER_BI errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: "Cannot read properties of undefined (reading 'powerBiEmbed')" }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters SCORM errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'https://dash.keepnetlabs.com/training/scorm/watch' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUE_ROUTER errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'Navigation aborted from "/reports" to "/login"' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters RECORDER_ERROR message', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'Could not start new session on document.visible event' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUETIFY_INTERNAL t.hasAttribute', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 't.hasAttribute is not a function' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters AXIOS_ERROR Request aborted', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'Request aborted' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters USER_FLOW errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'Userflow.js error reply (generic)' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters ANIMATION_FRAME errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'requestAnimationFrame is not defined' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters GTAG errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'Illegal invocation' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters CHART_JS errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'No error message' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters ANALYTICS errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "null is not an object (evaluating 'g.readyState')" }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters POWER_BI indexOf error', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "Cannot read properties of undefined (reading 'indexOf')" }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUE_PDF errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'l.cancel() is undefined' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters SAFARI errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "undefined is not an object (evaluating 'n.features')" }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUE_MULTIPANE errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 't.className.match is not a function' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters SENTRY errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "Cannot read properties of null (reading 'role')" }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters IOS errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'window.webkit.messageHandlers' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters HTML2CANVAS errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "Cannot use 'in' operator to search for 'length' in null" }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters SESSION_STACK errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: "Cannot use 'in' operator to search for 'activeTime' in undefined" }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters ELEMENT_UI errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: 'e.getFullYear is not a function' }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters ZARAZ errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'https://acmeproducts.keepnetlabs.com/login' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters SCORM Can\'t find variable gmo', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: { values: [{ value: "Can't find variable: gmo" }] }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUE_ROUTER NavigationDuplicated errors', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'NavigationDuplicated: Navigating to current location is not allowed' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUE_ROUTER generic redundant navigation', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [{ value: 'Avoided redundant navigation to current location: "/some-page"' }]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('filters VUE_ROUTER executive-reports redirect', () => {
    const processor = getProcessor()
    const event = {
      level: 'error',
      exception: {
        values: [
          {
            value:
              'Redirected when going from "/reports/executive-reports" to "/reports/executive-reports/new" via a navigation guard.'
          }
        ]
      }
    }
    expect(processor(event)).toBeNull()
  })

  it('handles message-level filter when message is null', () => {
    const processor = getProcessor()
    const event = { level: 'error', message: null }
    expect(processor(event)).toBe(event)
  })

  it('handles globalThis.location.pathname undefined for replay_event', () => {
    const { plugin, sentryMock } = loadPlugin({
      sentryStatus: true,
      userData: JSON.stringify({ name: 'Acme', email: 'a@b.com' })
    })
    const origLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: {},
      configurable: true,
      writable: true
    })
    plugin({})
    const processor = sentryMock.addEventProcessor.mock.calls[0][0]
    expect(processor({ type: 'replay_event' })).toEqual({ type: 'replay_event' })
    Object.defineProperty(globalThis, 'location', {
      value: origLocation,
      configurable: true,
      writable: true
    })
  })
})
