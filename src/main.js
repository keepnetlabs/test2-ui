import 'babel-polyfill'
import Vue from 'vue'
import VueTour from 'vue-tour'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import vuetify from './plugins/vuetify'
import '@mdi/font/scss/materialdesignicons.scss'
import './assets/scss/main.scss'
import { SmartWidget, SmartWidgetGrid } from 'vue-smart-widget'
import VueMask, { VueMaskDirective } from 'v-mask'
import * as Sentry from '@sentry/browser'
import VueMixpanel from 'vue-mixpanel'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'
import { VAutocomplete, VCombobox, VSelect } from 'vuetify/lib'
import VueTagManager from 'vue-tag-manager'
import Vlf from 'vlf'
import localforage from 'localforage'
localforage.config({
  name: 'keepnet'
})
Vue.use(Vlf, localforage)

require('vue-tour/dist/vue-tour.css')

Vue.component('SmartWidget', SmartWidget)
Vue.component('SmartWidgetGrid', SmartWidgetGrid)
//dynamic kullanımda bindingi gelmiyodu
Vue.component('VSelect', VSelect)
Vue.component('VAutocomplete', VAutocomplete)
Vue.component('VCombobox', VCombobox)

Vue.component(
  'phishing-settings',
  require('./components/PhishingReporter/Settings/Settings').default
)

const hotjarID = APP_CONFIG.VUE_APP_HOTJAR_ID
const gtmID = APP_CONFIG.VUE_APP_GTM_ID
const gtmPreviewEnv = APP_CONFIG.VUE_APP_GTM_ENV
const gtmAuth = APP_CONFIG.VUE_APP_GTM_AUTH
const fullstoryID = APP_CONFIG.VUE_APP_FULLSTORY_ID
const isCloud = APP_CONFIG.VUE_APP_IS_CLOUD
const sentryDSN = APP_CONFIG.VUE_APP_SENTRY_DSN
const gtmStatus = APP_CONFIG.VUE_APP_GTM_STATUS
const sentryStatus = APP_CONFIG.VUE_APP_SENTRY_STATUS
const fullstoryStatus = APP_CONFIG.VUE_APP_FULLSTORY_STATUS
const hotjarStatus = APP_CONFIG.VUE_APP_HOTJAR_STATUS
const mixPanelStatus = APP_CONFIG.VUE_APP_MIX_PANEL_STATUS
const mixPanelToken = APP_CONFIG.VUE_APP_MIX_PANEL_TOKEN

if (isCloud) {
  //Sentry
  sentryStatus &&
    Sentry.init({
      dsn: sentryDSN,
      integrations: [
        new VueIntegration({
          Vue,
          tracing: true
        }),
        new Integrations.BrowserTracing()
      ],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0
    })

  //Analytics
  /* const VueAnalytics = require('vue-analytics').default
   Vue.use(VueAnalytics, {
     id: APP_CONFIG.VUE_APP_ANALYTICS_ID
   })*/

  //Hotjar
  const Hotjar = require('vue-hotjar').default

  hotjarStatus &&
    Vue.use(Hotjar, {
      id: hotjarID // Hotjar Site ID
    })

  //Google Tag Manager
  !!gtmStatus &&
    Vue.use(VueTagManager, {
      gtmId: gtmID, // GTM ID
      queryParams: {
        gtm_preview: gtmPreviewEnv,
        gtm_auth: gtmAuth
      }
    })

  //FullSTORY
  const FullStory = require('@fullstory/browser')
  if (!!fullstoryStatus) {
    FullStory.init({ orgId: fullstoryID })
    Vue.prototype.$FullStory = FullStory
  }
  //MixinPanel
  mixPanelStatus &&
    Vue.use(VueMixpanel, {
      token: mixPanelToken,
      config: {
        api_host: 'https://api-eu.mixpanel.com'
      }
    })
}

Vue.use(VueTour)
Vue.use(require('vue-moment'))
Vue.use(VueMask)
Vue.directive('mask', VueMaskDirective)
Vue.config.productionTip = false
Vue.filter('formatSize', function (size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
})
const vm = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
global.vm = vm
