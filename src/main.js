import 'babel-polyfill'
//import './plugins/classlist'
//import './plugins/classlist'
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
Vue.component(
  'phishing-settings',
  require('./components/PhishingReporter/Settings/Settings').default
)
if (process.env.VUE_APP_SAAS_STATUS !== 'ONPREMISE') {
  const VueAnalytics = require('vue-analytics').default
  Vue.use(VueAnalytics, {
    id: 'UA-131042304-2'
  })

  const Hotjar = require('vue-hotjar').default
  Vue.use(Hotjar, {
    id: '1724870' // Hotjar Site ID
  })

  const FullStory = require('@fullstory/browser')

  FullStory.init({ orgId: 'TRDZX' })
  Vue.prototype.$FullStory = FullStory
}
Vue.use(VueTour)
Vue.component('v-chart', ECharts)
Vue.use(require('vue-moment'))

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
