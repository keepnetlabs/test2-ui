import Vue from 'vue'
const sentryDSN = APP_CONFIG.VUE_APP_SENTRY_DSN
const sentryStatus = APP_CONFIG.VUE_APP_SENTRY_STATUS
import * as Sentry from '@sentry/vue'
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
    `Cannot read properties of undefined (reading 'ownerDocument')`,
    'this.getDoc() is null',
    'this.em.getSelected is not a function',
    'this.em.getSelectedAll is not a function',
    "undefined is not an object (evaluating 'u.width')",
    "null is not an object (evaluating 'this.getDoc().querySelector')",
    'v.get is not a function',
    "undefined is not an object (evaluating '__gCrWeb.instantSearch.clearHighlight')",
    `Cannot read properties of null (reading 'offsetWidth')`,
    `Failed to execute 'querySelectorAll' on 'Document': The provided selector is empty.`,
    `Cannot read properties of undefined (reading 'getCosmeticsFilters')`,
    `Cannot read properties of undefined (reading 'getBoundingClientRect')`,
    'a.getEl is not a function',
    "Cannot read properties of undefined (reading '__ob__')",
    `undefined is not an object (evaluating 'this.get("selected").lastComponent')`,
    `undefined is not an object (evaluating 'this.get("selected").allComponents')`
  ],
  VUETIFY_INTERNAL: [
    "Cannot read properties of undefined (reading 'getTiles')",
    't.hasAttribute is not a function',
    '[Vuetify] Rules should return a string or boolean'
  ],
  VUE_ROUTER: [
    'Navigation aborted from',
    `Redirected when going from "/reports/executive-reports" to "/reports/executive-reports/new" via a navigation guard.`,
    'Redirected when going from "/awareness-educator/enrollments" to "/awareness-educator/enrollments/training-report',
    'Avoided redundant navigation to current location: /threat-sharing',
    `Avoided redundant navigation to current location: "/reports/executive-reports".`,
    'Avoided redundant navigation to current location: "/company/job-log".',
    'Redirected when going from "/login" to "/email-threat-simulator"'
  ],
  SMARTLOOK: 'smartlook',
  RECORDER_ERROR: 'Could not start new session on document.visible event',
  RESIZE_OBSERVER: 'ResizeObserver',
  AXIOS_ERROR: [
    'timeout of 100000ms exceeded',
    'Request aborted',
    'Non-Error promise rejection captured with value: Timeout',
    'Failed to fetch',
    'Request failed with status code 524',
    'Request failed with status code 403',
    'Request failed with status code 400',
    'Request failed with status code 401',
    'Request failed with status code 409',
    'Request failed with status code 404',
    `https://phishing-embed.livingsecurity.com`,
    'HTTP/1.1 Overhead'
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
    'Navigation aborted from "/login?'
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
  POWER_BI: [
    `Cannot read properties of undefined (reading 'indexOf')`,
    `Cannot read properties of undefined (reading 'powerBiEmbed')`
  ],
  VUE_PDF: [`Cannot read properties of undefined (reading 'catch')`, 'l.cancel() is undefined'],
  SAFARI: [`undefined is not an object (evaluating 'n.features')`],
  VUE_MULTIPANE: ['t.className.match is not a function'],
  SENTRY: [`Cannot read properties of null (reading 'role')`],
  IOS: [
    `TypeError: undefined is not an object (evaluating '__gCrWeb.instantSearch.setIOSParameters')`,
    `TypeError: undefined is not an object (evaluating 'a.K')`,
    `undefined is not an object (evaluating '__gCrWeb.edgeTranslate.detectPageState')`
  ],
  HTML2CANVAS: ["Cannot use 'in' operator to search for 'length' in null"],
  SCORM: [
    'https://dash.keepnetlabs.com/training/scorm/watch',
    `Can't find variable: gmo`,
    'Non-Error promise rejection captured with value:',
    `Cannot read properties of undefined (reading 'key')`,
    `Object captured as exception with keys: message`
  ],
  SESSION_STACK: [`Cannot use 'in' operator to search for 'activeTime' in undefined`],
  ELEMENT_UI: [
    'e.getFullYear is not a function',
    't.getFullYear is not a function',
    'e.getHours is not a function'
  ],
  ZARAZ: ['https://acmeproducts.keepnetlabs.com/login']
}
export default (router) => {
  if (!sentryStatus) return
  const userData = JSON.parse(localStorage.getItem('userData')) || {
    fullName: 'Guest',
    email: 'Guest Email',
    name: 'Company'
  }
  Sentry.setUser({
    username: userData.name || 'Company',
    email: userData.email || 'Guest Email'
  })
  Sentry.init({
    Vue,
    dsn: sentryDSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.captureConsoleIntegration({
        levels: ['error']
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false
      })
    ],
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Maximum call stack size exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      'Userflow.js error reply (undefined): undefined',
      'NetworkError when attempting to fetch resource.',
      'NotSupportedError: Failed to load because no supported source was found.',
      `Cannot read properties of undefined (reading 'status')`,
      `Cannot read properties of undefined (reading 'message')`,
      'Event `CustomEvent` (type=error) captured as exception',
      'Load failed',
      'Request failed with status code 524',
      'Request failed with status code 403',
      'Request failed with status code 400',
      'Request failed with status code 401',
      'Request failed with status code 409',
      'Request failed with status code 404',
      'timed out while waiting for outgoing message to echo back'
    ],
    trackComponents: true,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0
  })
  Sentry.addEventProcessor(function (event) {
    if (event.type === 'replay_event') {
      if (window.location.pathname.includes('/training/scorm')) {
        return null
      }
    }
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
      if (CONSTANTS.SAFARI.some((m) => message.includes(m))) return null
      if (CONSTANTS.VUE_MULTIPANE.some((m) => message.includes(m))) return null
      if (CONSTANTS.SENTRY.some((m) => message.includes(m))) return null
      if (CONSTANTS.IOS.some((m) => message.includes(m))) return null
      if (CONSTANTS.VUE_ROUTER.some((m) => message.includes(m))) return null
      if (CONSTANTS.HTML2CANVAS.some((m) => message.includes(m))) return null
      if (CONSTANTS.SCORM.some((m) => message.includes(m))) return null
      if (CONSTANTS.SESSION_STACK.some((m) => message.includes(m))) return null
      if (CONSTANTS.ELEMENT_UI.some((m) => message.includes(m))) return null
      if (CONSTANTS.ZARAZ.some((m) => message.includes(m))) return null
      if (message.includes(CONSTANTS.SMARTLOOK)) return null
      if (message.includes(CONSTANTS.RECORDER_ERROR)) return null
      if (message.includes(CONSTANTS.RESIZE_OBSERVER)) return null
      if (message.includes(CONSTANTS.NETWORK_ERROR)) return null
    } else if (
      event?.level === CONSTANTS.ERROR &&
      (event?.message?.includes('Vuetify') ||
        event?.message?.includes('HTTP/1.1 Overhead') ||
        event?.message?.includes('[object Event]') ||
        event?.message?.includes('[object ProgressEvent]') ||
        event?.message?.includes('Large Render Blocking Asset') ||
        event?.message?.includes('<unknown>'))
    ) {
      return null
    }
    return event
  })
}
