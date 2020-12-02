import 'babel-polyfill'
import Vue from 'vue'
import VueTour from 'vue-tour'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/plugin.js'
import vuetify from './plugins/vuetify'
import '@mdi/font/scss/materialdesignicons.scss'
import './assets/scss/main.scss'
import { SmartWidget, SmartWidgetGrid } from 'vue-smart-widget'
import VueMask, { VueMaskDirective } from 'v-mask'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'
import { VAutocomplete, VCombobox, VSelect } from 'vuetify/lib'

require('vue-tour/dist/vue-tour.css')

Vue.use(VueTelInputVuetify, {
  vuetify
})
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
console.log('APP_CONFIG', APP_CONFIG)
if (APP_CONFIG.VUE_APP_IS_CLOUD) {
  console.log(APP_CONFIG.VUE_APP_IS_CLOUD)

  Sentry.init({
    dsn: 'https://d33f2fcc4295420588d442dfde43d2c5@o466336.ingest.sentry.io/5480520',
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

  const VueAnalytics = require('vue-analytics').default
  Vue.use(VueAnalytics, {
    id: APP_CONFIG.VUE_APP_ANALYTICS_ID
  })

  const Hotjar = require('vue-hotjar').default
  Vue.use(Hotjar, {
    id: APP_CONFIG.VUE_APP_HOTJAR_ID // Hotjar Site ID
  })

  const FullStory = require('@fullstory/browser')

  FullStory.init({ orgId: APP_CONFIG.VUE_APP_FULLSTORY_ID })
  Vue.prototype.$FullStory = FullStory

  APP_CONFIG.VUE_APP_NEW_RELIC()
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
