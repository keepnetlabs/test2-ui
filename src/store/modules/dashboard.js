import { selectCompany, logoutUser } from '@/api/dashboard'
import AuthenticationService from '../../services/authentication'
import router from '../../router'
import { getCompanyList } from '@/api/company'

const dashboard = {
  namespaced: true,
  state: {
    popupFeedback: false,
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
    getIsSwitchDialogOpen: (state) => state.isSwitchDialogOpen,
    getCompanyDropdowns: (state) => state.dropdownCompanies,
    getCurrentCompanyObject: (state) => state.selectedCompanyObject
  },
  mutations: {
    SET_DROPDOWN_COMPANIES(state, payload) {
      state.dropdownCompanies = payload
    },
    SET_SELECTED_COMPANY(state, payload) {
      localStorage.setItem('isSelectCompany', 'true')
      payload.name = localStorage.getItem('selectedCompanyName')
      payload.id = localStorage.getItem('selectedCompanyRequestId')
      state.selectedCompany = payload
      state.selectedCompanyName = payload
    },
    SET_SWITCH_DIALOG(state, payload) {
      state.isSwitchDialogOpen = payload
    },
    CHANGE_FEEDBACK_POPUP(state, payload) {
      state.popupFeedback = payload
    }
  },
  actions: {
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
        .finally(() => {
          commit('common/RESET_SNACKBARS', undefined, { root: true })
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
        state.selectedCompanyObject = response?.data?.data || {}
        commit('SET_SELECTED_COMPANY', payload)
        if (globalThis.location.pathname !== '/') {
          dispatch('getDropdownCompanies', payload)
        }
      })
    },
    getDropdownCompanies({ commit }, payload) {
      if (payload !== 'CompanyAdmin') {
        getCompanyList().then((response) => {
          const result = response?.data?.data ? response.data.data : []
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
