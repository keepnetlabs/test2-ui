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
import { VAutocomplete, VCombobox, VSelect } from 'vuetify/lib'
import VueTagManager from 'vue-tag-manager'
import useSentry from './plugins/sentry'
//widget componentleri
Vue.component('SmartWidget', SmartWidget)
Vue.component('SmartWidgetGrid', SmartWidgetGrid)
//dynamic kullanımda bindingi gelmiyodu
Vue.component('VSelect', VSelect)
Vue.component('VAutocomplete', VAutocomplete)
Vue.component('VCombobox', VCombobox)
//kendisi içerisinde kendisini çağırınca hata veriyordu ondan böyle bind edildi.
Vue.component(
  'phishing-settings',
  require('./components/PhishingReporter/Settings/Settings').default
)
const gtmID = APP_CONFIG.VUE_APP_GTM_ID
const gtmPreviewEnv = APP_CONFIG.VUE_APP_GTM_ENV
const gtmAuth = APP_CONFIG.VUE_APP_GTM_AUTH
const isCloud = APP_CONFIG.VUE_APP_IS_CLOUD
const gtmStatus = APP_CONFIG.VUE_APP_GTM_STATUS
if (isCloud) {
  if (!window.location.origin.includes('test-ui.devkeepnet.com')) useSentry(router)
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
const vm = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
global.vm = vm
