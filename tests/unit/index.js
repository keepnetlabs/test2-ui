require('regenerator-runtime')
require('jest-canvas-mock')
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
