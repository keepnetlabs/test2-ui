require('regenerator-runtime')
require('jest-canvas-mock')

// Global browser environment mock for Node.js (CI/CD builds)
if (typeof window === 'undefined') {
  global.window = {
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    },
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
  global.localStorage = global.window.localStorage
}

// Mock localStorage for JSDOM environment
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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock window.location for test environment
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

jest.mock('powerbi-client', () => ({
  get: Promise.resolve({})
}))
import Vue from 'vue'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
global.Vue = Vue
Vue.config.productionTip = false
Vue.config.silent = true
Vue.use(ElementUI, { locale })
Vue.use(VueMoment)
Vue.use(Vuetify)
Vue.use(Vuex)
