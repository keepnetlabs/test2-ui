import { resetPassword, twoStepLogin } from '@/api/auth'
import AuthenticationService from '../../services/authentication'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getWhiteLabelByUrl } from '@/api/whitelabel'
import { getCompanyByID } from '@/api/company'
const login = {
  namespaced: true,
  state: {
    pageNumber: 1,
    wrongLoginAttempt: 0,
    company: null,
    loginWhiteLabel: {
      brandName: '',
      favIconUrl: '',
      mainLogoUrl: ''
    }
  },
  getters: {
    getPageNumber: (state) => state.pageNumber,
    loginWhiteLabel: (state) => state.loginWhiteLabel,
    getCurrentCompany: (state) => state.company
  },
  mutations: {
    SET_PAGE_NUMBER(state, payload) {
      state.pageNumber = payload
    },
    SET_LOGIN_WHITELABEL(state, payload) {
      for (const key of Object.keys(state.loginWhiteLabel)) {
        if (key === 'favIconUrl' && payload['faviconUrl']) {
          const favIcon = document.querySelector('link[rel="icon"]')
          if (favIcon) {
            favIcon.href = payload['faviconUrl']
          }
          state.loginWhiteLabel[key] = payload['faviconUrl']
        } else if (key === 'brandName' && payload[key]) {
          document.title = payload[key]
          state.loginWhiteLabel[key] = payload[key]
        } else {
          state.loginWhiteLabel[key] = payload[key]
        }
      }
    },
    SET_COMPANY(state, payload) {
      state.company = payload
    }
  },
  actions: {
    twoStepLogin({ commit, dispatch }, payload) {
      const jtwToken = AuthenticationService.getToken().token
      dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
      twoStepLogin({
        code: payload.code,
        token: jtwToken
      })
        .then((response) => {
          const result = response.data
          AuthenticationService.setToken(result.token, result.expiredIn, result.status)
          dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })
          commit('common/SET_ERROR_STATE', false, { root: true })
          dispatch('setPageNumber', 1)
          payload.router.push('/')
        })
        .catch((response) => {
          const result = response.response.data
          const errorMessage = result.errors[0].message
          dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', errorMessage, { root: true })
        })
    },
    resetPassword({ commit, dispatch }, payload) {
      resetPassword(payload).then((response) => {
        const result = response.data.Result
        dispatch('common/setSnackStatus', true, { root: true })
        if (result) {
          dispatch(
            'common/setErrorMessage',
            'An email to with a link to reset your password is sent if a matched user account is found',
            { root: true }
          )
        } else {
          dispatch('common/setErrorMessage', 'No user found with that email address', {
            root: true
          })
        }
        commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
      })
    },
    setPageNumber({ commit }, payload) {
      commit('SET_PAGE_NUMBER', payload)
    },
    getWhiteLabelByUrl({ commit }) {
      const formData = new FormData()
      formData.append('DomainUrl', window.location.origin)
      getWhiteLabelByUrl(formData).then((response) => {
        if (response?.data?.data) {
          const {
            data: { data }
          } = response
          commit('SET_LOGIN_WHITELABEL', data)
        }
      })
    },
    getCurrentCompany({ commit }) {
      getCompanyByID(localStorage.getItem('companyRequestId')).then((response) => {
        commit('SET_COMPANY', response.data.data)
      })
    }
  }
}

export default login
