import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import login from './modules/login'
import permission from './modules/permissions'
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import investigations from './modules/investigations'
import playbook from './modules/playbook'
import rightColumn from './modules/rightColumn'

Vue.use(Vuex)
let store = new Vuex.Store({
  modules: {
    common,
    permission,
    login,
    auth,
    dashboard,
    investigations,
    playbook,
    rightColumn
  }
})

export default store
