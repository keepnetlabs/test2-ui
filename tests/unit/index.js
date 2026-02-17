require('regenerator-runtime')
require('jest-canvas-mock')
import Vue from 'vue'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
import { config as testUtilsConfig } from '@vue/test-utils'
import promisePool from './promise-pool'

// Start Promise Pool tracking globally
promisePool.startInterception()

// Make promise pool available globally for individual tests
global.promisePool = promisePool

// Mock vue-router before any imports that use it
jest.mock('@/router', () => ({
  push: jest.fn(() => Promise.resolve()),
  replace: jest.fn(() => Promise.resolve()),
  go: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  currentRoute: {
    path: '/',
    name: 'home',
    params: {},
    query: {},
    meta: {}
  }
}))

// Mock localStorage for both Node.js and JSDOM environments
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value.toString()
    },
    removeItem: function (key) {
      delete store[key]
    },
    clear: function () {
      store = {}
    }
  }
})()

// Mock window.history for vue-router
const historyMock = {
  length: 1,
  action: 'POP',
  location: {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
  },
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  block: jest.fn(() => () => {}),
  listen: jest.fn(() => () => {}),
  createHref: jest.fn((location) => location.pathname + location.search + location.hash)
}

// Global browser environment setup
if (typeof window === 'undefined') {
  // Node.js environment (CI/CD builds)
  global.window = {
    localStorage: localStorageMock,
    history: historyMock,
    location: {
      origin: 'http://localhost',
      href: 'http://localhost',
      hostname: 'localhost',
      pathname: '/',
      search: '',
      hash: ''
    },
    document: {
      origin: 'http://localhost'
    }
  }
  global.localStorage = localStorageMock
  global.history = historyMock
} else {
  // Browser/JSDOM environment (tests)
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  })

  Object.defineProperty(window, 'history', {
    value: historyMock,
    writable: true
  })

  Object.defineProperty(window, 'location', {
    value: {
      origin: 'http://localhost',
      href: 'http://localhost',
      hostname: 'localhost',
      pathname: '/',
      search: '',
      hash: ''
    },
    writable: true
  })

  // Fix JSDOM document.origin issue
  if (window.document && !window.document.origin) {
    window.document.origin = 'http://localhost'
  }

  // Add data-app for Vuetify
  if (window.document && window.document.body) {
    const app = window.document.createElement('div')
    app.setAttribute('data-app', 'true')
    window.document.body.appendChild(app)
  }
}

// Mock XMLHttpRequest to prevent ECONNREFUSED errors in JSDOM
const mockXMLHttpRequest = function () {
  return {
    open: jest.fn(),
    send: jest.fn(function () {
      // Simulate immediate successful response
      setTimeout(() => {
        this.readyState = 4
        this.status = 200
        this.responseText = '{}'
        this.response = '{}'

        // Trigger success callbacks
        if (this.onreadystatechange) {
          this.onreadystatechange()
        }
        if (this.onload) {
          this.onload()
        }
      }, 0)
    }),
    setRequestHeader: jest.fn(),
    abort: jest.fn(),
    getAllResponseHeaders: jest.fn(() => ''),
    getResponseHeader: jest.fn(() => null),
    readyState: 0,
    status: 0,
    statusText: '',
    responseText: '',
    response: '',
    responseXML: null,
    upload: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onreadystatechange: null,
    onload: null,
    onerror: null,
    ontimeout: null,
    onabort: null
  }
}

// Override JSDOM's XMLHttpRequest
global.XMLHttpRequest = mockXMLHttpRequest

// Also mock fetch API if used
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('{}')
  })
)

jest.mock('powerbi-client', () => ({
  get: Promise.resolve({})
}))

global.Vue = Vue
Vue.config.productionTip = false
Vue.config.silent = true
Vue.use(ElementUI, { locale })
Vue.use(VueMoment)
Vue.use(Vuetify)
Vue.use(Vuex)

// Suppress VTU deprecation warnings from legacy tests (string stubs, isVueInstance, find/findComponent migration).
testUtilsConfig.showDeprecationWarnings = false

// VTU still logs some deprecations via console.error in this version. Filter only those known messages.
const originalConsoleError = console.error
console.error = (...args) => {
  const firstArg = typeof args[0] === 'string' ? args[0] : ''
  const isVtuDeprecation =
    firstArg.includes('[vue-test-utils]: Using a string for stubs is deprecated') ||
    firstArg.includes('[vue-test-utils]: isVueInstance is deprecated') ||
    firstArg.includes('[vue-test-utils]: finding components with `find` or `get` is deprecated') ||
    firstArg.includes('[vue-test-utils]: overwriting methods via the `methods` property is deprecated')
  const isKnownVuexNoise =
    firstArg.includes('[vuex] unknown getter: permissions/getDomainSearchPermissions') ||
    firstArg.includes('[vuex] unknown getter: permissions/getDnsSearchPermissions') ||
    firstArg.includes('[vuex] unknown getter: permissions/getExcludedIpAddressGetPermissions')

  if (isVtuDeprecation || isKnownVuexNoise) {
    return
  }

  originalConsoleError(...args)
}
