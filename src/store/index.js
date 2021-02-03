import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import login from './modules/login'
import permission from './modules/permissions'
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import tour from './modules/tour'
import investigations from './modules/investigations'
import playbook from './modules/playbook'
import rightColumn from './modules/rightColumn'
import datatable from '@/store/modules/datatable'
import incidents from '@/store/modules/incidents'
import communities from '@/store/modules/communities'
import tableReload from '@/store/modules/tableReload'
Vue.use(Vuex)
let store = new Vuex.Store({
  modules: {
    common,
    permission,
    login,
    auth,
    dashboard,
    tour,
    investigations,
    playbook,
    rightColumn,
    datatable,
    incidents,
    communities,
    tableReload
  }
})

export default store
