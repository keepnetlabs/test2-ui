require('regenerator-runtime')
require('jest-canvas-mock')
import Vue from 'vue'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
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
}

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
