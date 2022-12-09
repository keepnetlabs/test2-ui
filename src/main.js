import 'babel-polyfill'
import Vue from 'vue'
import VueBrowserUpdate from '@sum.cumo/vue-browserupdate'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import vuetify from './plugins/vuetify'
import './assets/scss/@mdi/font/scss/materialdesignicons.scss'
import './assets/scss/main.scss'
import { SmartWidget, SmartWidgetGrid } from 'vue-smart-widget'
import VueMask, { VueMaskDirective } from 'v-mask'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'
import { VAutocomplete, VCombobox, VSelect } from 'vuetify/lib'
import VueTagManager from 'vue-tag-manager'
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

const gtmID = APP_CONFIG.VUE_APP_GTM_ID
const gtmPreviewEnv = APP_CONFIG.VUE_APP_GTM_ENV
const gtmAuth = APP_CONFIG.VUE_APP_GTM_AUTH
const isCloud = APP_CONFIG.VUE_APP_IS_CLOUD
const sentryDSN = APP_CONFIG.VUE_APP_SENTRY_DSN
const gtmStatus = APP_CONFIG.VUE_APP_GTM_STATUS
const sentryStatus = APP_CONFIG.VUE_APP_SENTRY_STATUS

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
      tracesSampleRate: 1.0
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
}

Vue.use(VueBrowserUpdate, {
  options: {
    insecure: true,
    unsupported: true
  }
})
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
