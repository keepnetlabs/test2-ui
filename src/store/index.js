import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import login from './modules/login'
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import investigations from './modules/investigations'
import playbook from './modules/playbook'
import rightColumn from './modules/rightColumn'
import datatable from '@/store/modules/datatable'
import incidents from '@/store/modules/incidents'
import communities from '@/store/modules/communities'
import tableReload from '@/store/modules/tableReload'
import whitelabel from '@/store/modules/whitelabel'
import widgets from '@/store/modules/widgets'
import permissions from '@/store/modules/permissions'
import trainingLibrary from '@/store/modules/trainingLibrary'
import trainingLibraryHelpers from '@/store/modules/trainingLibraryHelpers'
Vue.use(Vuex)
let store = new Vuex.Store({
  modules: {
    common,
    login,
    auth,
    dashboard,
    investigations,
    playbook,
    rightColumn,
    datatable,
    incidents,
    communities,
    tableReload,
    whitelabel,
    widgets,
    permissions,
    trainingLibrary,
    trainingLibraryHelpers
  }
})

export default store
