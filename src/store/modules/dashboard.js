import {
  selectCompany,
  getMenus,
  logoutUser,
  getNotifications,
  notificationSeen
} from '@/api/dashboard'
import AuthenticationService from '../../services/authentication'
import router from '../../router'
import { getCompanyList } from '@/api/company'

const dashboard = {
  namespaced: true,
  state: {
    popupFeedback: false,
    overallMonths: [],
    notificationList: [],
    dropdownCompanies: [],
    selectedCompany: 'Loading...',
    selectedCompanyObject: {
      logoUrl: null,
      name: null
    },
    isSwitchDialogOpen: false
  },
  getters: {
    isPopupOpened: (state) => state.popupFeedback,
    getNotificationList: (state) => state.notificationList,
    getIsSwitchDialogOpen: (state) => state.isSwitchDialogOpen,
    getSelectedCompany: (state) => state.selectedCompany,
    getCompanyDropdowns: (state) => state.dropdownCompanies
  },
  mutations: {
    SET_DROPDOWN_COMPANIES(state, payload) {
      state.dropdownCompanies = payload
    },
    SET_SELECTED_COMPANY(state, payload) {
      const defaultAccountDropdown = []
      localStorage.setItem('isSelectCompany', 'true')
      payload.name = localStorage.getItem('selectedCompanyName')
      payload.id = localStorage.getItem('selectedCompanyRequestId')
      state.selectedCompany = payload
      state.selectedCompanyName = payload
      defaultAccountDropdown.push(payload)
      defaultAccountDropdown.push({
        companyId: 'default',
        name: 'Switch Company',
        index: 5 // this.state.auth.user.role.id
      })
      state.switchAccountDropdown = defaultAccountDropdown
    },
    SET_SWITCH_DIALOG(state, payload) {
      state.isSwitchDialogOpen = payload
    },
    SET_NOTIFICATIONS(state, payload) {
      state.notificationList = payload
    },
    CHANGE_FEEDBACK_POPUP(state, payload) {
      state.popupFeedback = payload
    }
  },
  actions: {
    notificationSeen({ commit }, payload) { // eslint-disable-line
      notificationSeen(payload.id).then(() => {})
    },
    getNotifications({ commit }) {
      getNotifications().then((response) => {
        const result = response.data
        commit('SET_NOTIFICATIONS', result)
      })
    },
    logoutUser({ commit }) {
      commit('common/SET_SNACK_STATUS', false, { root: true })
      commit('common/SET_SNACKBAR_COLOR', '', { root: true })
      commit('common/SET_ERROR_MESSAGE', '', {
        root: true
      })
      commit('common/SET_ERROR_STATE', false, { root: true })

      logoutUser()
        .then(() => {
          AuthenticationService.removeToken()
          router.push('/login')
        })
        .catch(() => {
          AuthenticationService.removeToken()
          router.push('/login')
        })
    },
    getMenus({ commit }) {
      getMenus().then((response) => {
        const result = response.data
        commit('SET_MENUS', result)
      })
    },
    setSwitchDialog({ commit }, payload) {
      commit('SET_SWITCH_DIALOG', payload)
    },
    selectCompany({ commit, dispatch, state }, payload) {
      payload.companyResourceId && localStorage.setItem('companyId', payload.companyResourceId)
      payload.companyResourceId &&
        localStorage.setItem('companyRequestId', payload.companyResourceId)
      return selectCompany(payload).then((response) => {
        state.selectedCompanyObject = response.data.data
        commit('SET_SELECTED_COMPANY', payload)
        if (window.location.pathname !== '/') {
          dispatch('getDropdownCompanies', payload)
        }
      })
    },
    getDropdownCompanies({ commit }, payload) {
      if (payload !== 'CompanyAdmin') {
        getCompanyList().then((response) => {
          const result = response.data.data && response.data.data
          commit('SET_DROPDOWN_COMPANIES', result)
        })
      }
    },
    changeFeedbackPopup({ commit }, payload) {
      commit('CHANGE_FEEDBACK_POPUP', payload)
    }
  }
}

export default dashboard
