import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import login from './modules/login'
import permission from './modules/permissions'
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import threadSharing from './modules/threadSharing'
import tour from './modules/tour'
import investigations from './modules/investigations'
import playbook from './modules/playbook'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    permission,
    login,
    auth,
    dashboard,
    threadSharing,
    tour,
    investigations,
    playbook
  }
})
