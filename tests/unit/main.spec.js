describe('src/main.js', () => {
  const loadMain = ({ isCloud = false, gtmStatus = false, origin = 'https://app.keepnet.com' } = {}) => {
    jest.resetModules()
    delete global._babelPolyfill

    global.APP_CONFIG = {
      VUE_APP_GTM_ID: 'GTM-TEST',
      VUE_APP_GTM_ENV: 'env-1',
      VUE_APP_GTM_AUTH: 'auth-1',
      VUE_APP_IS_CLOUD: isCloud,
      VUE_APP_GTM_STATUS: gtmStatus
    }
    global.window = Object.assign(global.window || {}, {
      location: { origin }
    })

    const vmInstance = { _id: 'vm' }
    const mountSpy = jest.fn(() => vmInstance)
    const VueMock = jest.fn(() => ({ $mount: mountSpy }))
    VueMock.component = jest.fn()
    VueMock.use = jest.fn()
    VueMock.directive = jest.fn()
    VueMock.config = {}

    const useSentry = jest.fn()
    const vueTagManagerPlugin = {}
    const browserUpdatePlugin = {}
    const vueMomentPlugin = {}
    const routerMock = { name: 'router-mock' }

    jest.doMock('vue', () => ({ __esModule: true, default: VueMock }))
    jest.doMock('@sum.cumo/vue-browserupdate', () => ({ __esModule: true, default: browserUpdatePlugin }))
    jest.doMock('vue-smart-widget', () => ({ SmartWidget: {}, SmartWidgetGrid: {} }))
    jest.doMock('v-mask', () => ({ __esModule: true, default: {}, VueMaskDirective: {} }))
    jest.doMock('vuetify/lib', () => ({ VAutocomplete: {}, VCombobox: {}, VSelect: {} }))
    jest.doMock('vue-tag-manager', () => ({ __esModule: true, default: vueTagManagerPlugin }))
    jest.doMock('@/plugins/sentry', () => ({ __esModule: true, default: useSentry }))
    const appComponent = { name: 'AppMock' }
    jest.doMock('@/App.vue', () => ({ __esModule: true, default: appComponent }))
    jest.doMock('@/router/index', () => ({ __esModule: true, default: routerMock }))
    jest.doMock('@/store/index', () => ({ __esModule: true, default: {} }))
    jest.doMock('@/plugins/vuetify', () => ({ __esModule: true, default: {} }))
    jest.doMock('@/components/PhishingReporter/Settings/Settings', () => ({ default: {} }))
    jest.doMock('vue-moment', () => ({ __esModule: true, default: vueMomentPlugin }))

    jest.isolateModules(() => {
      require('@/main.js')
    })

    return {
      VueMock,
      useSentry,
      vueTagManagerPlugin,
      mountSpy,
      browserUpdatePlugin,
      vueMomentPlugin,
      routerMock,
      appComponent
    }
  }

  it('bootstraps Vue app and assigns global vm', () => {
    const { VueMock, mountSpy } = loadMain()

    expect(VueMock).toHaveBeenCalledTimes(1)
    expect(mountSpy).toHaveBeenCalledWith('#app')
    expect(global.vm).toEqual({ _id: 'vm' })
    expect(VueMock.config.productionTip).toBe(false)
  })

  it('passes App component to render function of Vue root instance', () => {
    const { VueMock, appComponent } = loadMain()
    const vueOptions = VueMock.mock.calls[0][0]
    const h = jest.fn((component) => ({ vnodeFor: component }))

    const result = vueOptions.render(h)

    expect(h).toHaveBeenCalledWith(appComponent)
    expect(result).toEqual({ vnodeFor: appComponent })
  })

  it('registers global components/directive and installs core plugins', () => {
    const { VueMock, browserUpdatePlugin, vueMomentPlugin } = loadMain({ isCloud: false, gtmStatus: false })

    const componentNames = VueMock.component.mock.calls.map((c) => c[0])
    expect(componentNames).toEqual(
      expect.arrayContaining([
        'SmartWidget',
        'SmartWidgetGrid',
        'VSelect',
        'VAutocomplete',
        'VCombobox',
        'phishing-settings'
      ])
    )

    expect(VueMock.directive).toHaveBeenCalledWith('mask', expect.anything())
    expect(VueMock.use).toHaveBeenCalled()
    expect(VueMock.use).toHaveBeenCalledWith(
      browserUpdatePlugin,
      expect.objectContaining({
        options: expect.objectContaining({
          insecure: true,
          unsupported: true
        })
      })
    )
    expect(VueMock.use).toHaveBeenCalledWith(vueMomentPlugin)
  })

  it('does not initialize sentry/tag manager when cloud mode is off', () => {
    const { VueMock, useSentry, vueTagManagerPlugin } = loadMain({ isCloud: false, gtmStatus: true })
    const useCalls = VueMock.use.mock.calls

    expect(useSentry).not.toHaveBeenCalled()
    expect(useCalls.some((args) => args[0] === vueTagManagerPlugin)).toBe(false)
  })

  it('initializes sentry and tag manager when cloud and gtm are enabled', () => {
    const { VueMock, useSentry, vueTagManagerPlugin, routerMock } = loadMain({
      isCloud: true,
      gtmStatus: true,
      origin: 'https://prod.keepnet.com'
    })
    const useCalls = VueMock.use.mock.calls

    expect(useSentry).toHaveBeenCalledTimes(1)
    expect(useSentry).toHaveBeenCalledWith(routerMock)
    expect(useCalls.some((args) => args[0] === vueTagManagerPlugin)).toBe(true)
    expect(useCalls).toEqual(
      expect.arrayContaining([
        [
          vueTagManagerPlugin,
          expect.objectContaining({
            gtmId: 'GTM-TEST',
            queryParams: expect.objectContaining({
              gtm_preview: 'env-1',
              gtm_auth: 'auth-1'
            })
          })
        ]
      ])
    )
  })

  it('skips sentry on test-ui domain even when cloud mode is on', () => {
    const { VueMock, useSentry, vueTagManagerPlugin } = loadMain({
      isCloud: true,
      gtmStatus: true,
      origin: 'https://test-ui.devkeepnet.com'
    })
    const useCalls = VueMock.use.mock.calls

    expect(useSentry).not.toHaveBeenCalled()
    expect(useCalls.some((args) => args[0] === vueTagManagerPlugin)).toBe(true)
  })

  it('skips tag manager when gtmStatus is false in cloud mode', () => {
    const { VueMock, useSentry, vueTagManagerPlugin } = loadMain({
      isCloud: true,
      gtmStatus: false,
      origin: 'https://prod.keepnet.com'
    })
    const useCalls = VueMock.use.mock.calls

    expect(useSentry).toHaveBeenCalledTimes(1)
    expect(useCalls.some((args) => args[0] === vueTagManagerPlugin)).toBe(false)
  })
})
