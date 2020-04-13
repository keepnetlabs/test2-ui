import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import login from './modules/login'
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import threadSharing from './modules/threadSharing'
import investigations from './modules/investigations'
import tour from './modules/tour'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    login,
    auth,
    dashboard,
    threadSharing,
    investigations,
    tour
  }
})
