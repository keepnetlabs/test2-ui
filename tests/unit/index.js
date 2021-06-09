require('regenerator-runtime')
import Vue from 'vue'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
global.Vue = Vue
Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(Vuetify)
