import Vue from 'vue'
const sentryDSN = APP_CONFIG.VUE_APP_SENTRY_DSN
const sentryStatus = APP_CONFIG.VUE_APP_SENTRY_STATUS
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
const CONSTANTS = {
  ERROR: 'error',
  GRAPESJS_INTERNAL: [
    "Cannot read properties of null (reading 'querySelector')",
    "Cannot read properties of null (reading 'hasFocus')",
    "Cannot read properties of undefined (reading 'width')",
    "Cannot read properties of null (reading 'CodeMirror')",
    "Cannot read properties of undefined (reading 'get')",
    "Cannot read properties of undefined (reading '__trgEv')",
    "Cannot read properties of undefined (reading 'allComponents')",
    'this.em.trigger is not a function',
    "Cannot read properties of undefined (reading 'lastComponent')",
    'this.model.get is not a function',
    'this.get(...) is undefined',
    'o is null',
    "Cannot read properties of undefined (reading 'getZoomDecimal')",
    "Cannot read properties of undefined (reading 'parseHtml')",
    "Cannot read properties of null (reading 'ownerDocument')",
    'this.getDoc() is null',
    'this.em.getSelected is not a function',
    'this.em.getSelectedAll is not a function',
    "undefined is not an object (evaluating 'u.width')",
    "null is not an object (evaluating 'this.getDoc().querySelector')",
    'v.get is not a function',
    "undefined is not an object (evaluating '__gCrWeb.instantSearch.clearHighlight')"
  ],
  VUETIFY_INTERNAL: [
    "Cannot read properties of undefined (reading 'getTiles')",
    't.hasAttribute is not a function'
  ],
  VUE_ROUTER: 'Navigation aborted from',
  SMARTLOOK: 'smartlook',
  RECORDER_ERROR: 'Could not start new session on document.visible event',
  RESIZE_OBSERVER: 'ResizeObserver',
  AXIOS_ERROR: [
    'Request failed with status code 401',
    'Request failed with status code 403',
    'timeout of 100000ms exceeded',
    'Request aborted',
    'Request failed with status code 524',
    'Non-Error promise rejection captured with value: Timeout'
  ],
  NETWORK_ERROR: 'Network Error',
  USER_FLOW: [
    'Userflow.js error reply (generic)',
    'Unexpected token',
    'Failed to fetch dynamically imported module: https://js.userflow.com',
    'Non-Error exception captured with keys: currentTarget, detail, isTrusted, target',
    'Non-Error exception captured with keys: message',
    'This Userflow.js client has reached a maximum of 100 operations in the last 1 minute',
    'Rendering cancelled, page 1',
    'Cannot redefine property: googletag',
    'Non-Error promise rejection captured with value: something went wrong',
    'Invalid embed URL detected. Either URL hostname or protocol are invalid. Please use Power BI REST APIs to get the valid URL'
  ],
  LOGIN_NAVIGATION_DUPLICATED: [
    'Avoided redundant navigation to current location: "/login"',
    'Redirected when going from "/login" to "/" via a navigation guard.',
    'Navigation aborted from "/login?',
    'Avoided redundant navigation to current location: /threat-sharing'
  ],
  ANIMATION_FRAME: [
    'window.requestAnimationFrame is not a function',
    'requestAnimationFrame is not defined'
  ],
  GTAG: ['a.indexOf is not a function', 'Illegal invocation'],
  CHART_JS: ['No error message', "Cannot read properties of undefined (reading '_meta')"],
  ANALYTICS: [
    "null is not an object (evaluating 'g.readyState')",
    'Error response received for message <get-frame-manager-configuration>'
  ],
  POWER_BI: [`Cannot read properties of undefined (reading 'indexOf')`],
  VUE_PDF: [`Cannot read properties of undefined (reading 'catch')`]
}
export default (router) => {
  if (!sentryStatus) return
  Sentry.init({
    Vue,
    dsn: sentryDSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
      })
    ],
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      'Request failed with status code 403',
      'Userflow.js error reply (undefined): undefined'
    ],
    trackComponents: true,
    tracesSampleRate: 1.0
  })
  Sentry.addGlobalEventProcessor(function (event) {
    if (event?.level === CONSTANTS.ERROR && event?.exception?.values?.[0]) {
      const message = event.exception.values[0].value
      if (CONSTANTS.GRAPESJS_INTERNAL.some((m) => message.includes(m))) return null
      if (CONSTANTS.VUETIFY_INTERNAL.some((m) => message.includes(m))) return null
      if (CONSTANTS.AXIOS_ERROR.some((m) => message.includes(m))) return null
      if (CONSTANTS.LOGIN_NAVIGATION_DUPLICATED.some((m) => message.includes(m))) return null
      if (CONSTANTS.ANIMATION_FRAME.some((m) => message.includes(m))) return null
      if (CONSTANTS.GTAG.some((m) => message.includes(m))) return null
      if (CONSTANTS.CHART_JS.some((m) => message.includes(m))) return null
      if (CONSTANTS.USER_FLOW.some((m) => message.includes(m))) return null
      if (CONSTANTS.ANALYTICS.some((m) => message.includes(m))) return null
      if (CONSTANTS.POWER_BI.some((m) => message.includes(m))) return null
      if (CONSTANTS.VUE_PDF.some((m) => message.includes(m))) return null
      if (message.includes(CONSTANTS.SMARTLOOK)) return null
      if (message.includes(CONSTANTS.RECORDER_ERROR)) return null
      if (message.includes(CONSTANTS.VUE_ROUTER)) return null
      if (message.includes(CONSTANTS.RESIZE_OBSERVER)) return null
      if (message.includes(CONSTANTS.NETWORK_ERROR)) return null
    }
    return event
  })
}
