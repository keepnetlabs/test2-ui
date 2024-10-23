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
    `Cannot read properties of null (reading 'offsetWidth')`
  ],
  VUETIFY_INTERNAL: [
    "Cannot read properties of undefined (reading 'getTiles')",
    't.hasAttribute is not a function'
  ],
  VUE_ROUTER: [
    'Navigation aborted from',
    `Redirected when going from "/reports/executive-reports" to "/reports/executive-reports/new" via a navigation guard.`
  ],
  SMARTLOOK: 'smartlook',
  RECORDER_ERROR: 'Could not start new session on document.visible event',
  RESIZE_OBSERVER: 'ResizeObserver',
  AXIOS_ERROR: [
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
  POWER_BI: [
    `Cannot read properties of undefined (reading 'indexOf')`,
    `Cannot read properties of undefined (reading 'powerBiEmbed')`
  ],
  VUE_PDF: [`Cannot read properties of undefined (reading 'catch')`],
  SAFARI: [`undefined is not an object (evaluating 'n.features')`],
  VUE_MULTIPANE: ['t.className.match is not a function'],
  SENTRY: [`Cannot read properties of null (reading 'role')`],
  IOS: [
    `TypeError: undefined is not an object (evaluating '__gCrWeb.instantSearch.setIOSParameters')`,
    `undefined is not an object (evaluating '__gCrWeb.edgeTranslate.detectPageState')`
  ]
}
export default (router) => {
  if (!sentryStatus) return
  const userData = JSON.parse(localStorage.getItem('userData')) || {
    fullName: 'Guest',
    email: 'Guest Email'
  }
  Sentry.setUser({
    username: userData.fullName || 'Guest',
    email: userData.email || 'Guest Email'
  })
  Sentry.init({
    Vue,
    dsn: sentryDSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false
      })
    ],
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      'Userflow.js error reply (undefined): undefined'
    ],
    trackComponents: true,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0
  })
  Sentry.addEventProcessor(function (event) {
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
      if (message.includes(CONSTANTS.SMARTLOOK)) return null
      if (message.includes(CONSTANTS.RECORDER_ERROR)) return null
      if (message.includes(CONSTANTS.RESIZE_OBSERVER)) return null
      if (message.includes(CONSTANTS.NETWORK_ERROR)) return null
    }
    return event
  })
}
;(function () {
  const chatScript = document.createElement('script')
  chatScript.src = 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js'
  chatScript.async = true
  document.head.appendChild(chatScript)
  chatScript.onload = async () => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      fullName: 'Guest',
      email: 'Guest Email',
      userCompany: { name: 'Guest Company' },
      role: { name: 'Guest Role' }
    }

    const chatPopup = document.createElement('div')
    chatPopup.className = 'chat-popup'
    chatPopup.style.position = 'fixed'
    chatPopup.style.bottom = '20px'
    chatPopup.style.right = '20px'
    chatPopup.style.width = '60px'
    chatPopup.style.height = '60px'
    chatPopup.style.borderRadius = '30px'
    chatPopup.style.overflow = 'hidden'
    chatPopup.style.zIndex = '9999'
    chatPopup.style.cursor = 'pointer'

    chatPopup.innerHTML = `
    <img src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/b1f13b22-812d-4463-3e79-b47d4c36c800/public" alt="Chat Icon" style="width:100%; height:100%;">
  `
    const chatContent = document.createElement('div')
    chatContent.style.display = 'none'
    chatContent.style.width = '100%'
    chatContent.style.height = '100%'
    const header = document.createElement('div')
    header.style.display = 'flex'
    header.style.justifyContent = 'flex-end'
    header.style.backgroundColor = '#f1f1f1'
    header.style.padding = '10px'
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '×'
    closeButton.style.color = 'white'
    closeButton.style.border = 'none'
    closeButton.style.fontSize = '24px'
    closeButton.style.cursor = 'pointer'
    closeButton.style.position = 'absolute'
    closeButton.style.top = '8px'
    closeButton.style.right = '16px'
    const styleOptions = {
      botAvatarBackgroundColor: '#FFFFFF',
      botAvatarImage:
        'https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/b1f13b22-812d-4463-3e79-b47d4c36c800/public',
      botAvatarInitials: 'BT',
      userAvatarInitials: userData.fullName.slice(0, 2).toUpperCase()
    }
    const tokenEndpointURL = new URL(
      'https://defaulta2b0241af5744c91af626f694403c1.64.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr744_customerService/directline/token?api-version=2022-03-01-preview'
    )
    const locale = document.documentElement.lang || 'en'
    const apiVersion = tokenEndpointURL.searchParams.get('api-version')
    const [directLineURL, token] = await Promise.all([
      fetch(
        new URL(
          `/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`,
          tokenEndpointURL
        )
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to retrieve regional channel settings.')
          }

          return response.json()
        })
        .then(({ channelUrlsById: { directline } }) => directline),
      fetch(tokenEndpointURL)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to retrieve Direct Line token.')
          }

          return response.json()
        })
        .then(({ token }) => token)
    ])

    const directLine = window.WebChat.createDirectLine({
      domain: new URL('v3/directline', directLineURL),
      token
    })

    const subscription = directLine.connectionStatus$.subscribe({
      next(value) {
        if (value === 2) {
          directLine
            .postActivity({
              localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              locale,
              name: 'startConversation',
              type: 'event'
            })
            .subscribe()
          subscription.unsubscribe()
        }
      }
    })
    const store = window.WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: 'pvaSetContext',
            value: {
              userName: userData.fullName,
              userEmail: userData.email,
              userCompany: userData.userCompany.name,
              userRole: userData.role.name
            }
          }
        })
      }
      return next(action)
    })
    window.WebChat.renderWebChat({ directLine, locale, store, styleOptions }, chatContent)
    chatContent.appendChild(closeButton)
    chatPopup.appendChild(chatContent)
    document.body.appendChild(chatPopup)
    function toggleChat() {
      if (chatPopup.style.width === '60px') {
        chatPopup.style.width = '400px'
        chatPopup.style.height = window.innerHeight > 800 ? '600px' : '400px'
        chatPopup.style.borderRadius = '10px'
        chatContent.style.display = 'block'
        chatPopup.innerHTML = ''
        chatPopup.appendChild(chatContent)
      } else {
        chatPopup.style.width = '60px'
        chatPopup.style.height = '60px'
        chatPopup.style.borderRadius = '30px'
        chatContent.style.display = 'none'
        chatPopup.innerHTML = `
        <img src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/b1f13b22-812d-4463-3e79-b47d4c36c800/public" alt="Chat Icon" style="width:100%; height:100%;">
      `
      }
    }

    chatPopup.addEventListener('click', function () {
      chatPopup.style.backgroundColor = '#fff'
      chatPopup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
      chatPopup.style.width !== '400px' && toggleChat()
    })

    closeButton.addEventListener('click', function (e) {
      chatPopup.style.backgroundColor = 'transparent'
      chatPopup.style.boxShadow = 'none'
      e.stopPropagation()
      toggleChat()
    })
  }
})()
