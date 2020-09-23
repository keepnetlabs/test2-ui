import 'babel-polyfill'
import Vue from 'vue'
import VueTour from 'vue-tour'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import vuetify from './plugins/vuetify'
import 'vue-tour/dist/vue-tour.css'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts-gl'
import '@mdi/font/scss/materialdesignicons.scss'
import './assets/scss/main.scss'
import { SmartWidget } from 'vue-smart-widget'
import { SmartWidgetGrid } from 'vue-smart-widget'
import VueMask, { VueMaskDirective } from 'v-mask'

Vue.component('SmartWidget', SmartWidget)
Vue.component('SmartWidgetGrid', SmartWidgetGrid)

Vue.component(
  'phishing-settings',
  require('./components/PhishingReporter/Settings/Settings').default
)
console.log('APP_CONFIG', APP_CONFIG)
if (APP_CONFIG.VUE_APP_IS_CLOUD) {
  console.log('buralar hep cloud')
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
}
Vue.use(VueTour)
Vue.component('v-chart', ECharts)
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
