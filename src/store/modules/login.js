import { loginAction, resetPassword, twoStepLogin } from '../../api/auth'
import AuthenticationService from '../../services/authentication'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import store from '../index'
import { getCompanyList } from '../../api/company'
import jwt_decode from 'jwt-decode'
import { setGlobalUserData } from '../../utils/functions'
import { getWhiteLabelByUrl } from '@/api/whitelabel'

const login = {
  namespaced: true,
  state: {
    pageNumber: 1,
    wrongLoginAttempt: 0,
    loginWhiteLabel: {
      brandName: '',
      favIconUrl: '',
      mainLogoUrl: ''
    }
  },
  getters: {
    getPageNumber: (state) => state.pageNumber,
    loginWhiteLabel: (state) => state.loginWhiteLabel
  },
  mutations: {
    SET_PAGE_NUMBER(state, payload) {
      state.pageNumber = payload
    },
    SET_LOGIN_WHITELABEL(state, payload) {
      for (const key of Object.keys(state.loginWhiteLabel)) {
        if (key === 'favIconUrl' && payload['faviconUrl']) {
          const favIcon = document.querySelector('link[rel="icon"]')
          favIcon.href = payload[key]
        }
        state.loginWhiteLabel[key] = payload[key]
      }
    },
    LOGIN_SUCCESS(state, payload) {
      AuthenticationService.setToken(payload.token, payload.expiredIn, payload.status)
      return state
    },
    WRONG_LOGIN_ATTEMPT(state, payload) {
      state.wrongLoginAttempt += payload
    },
    EMPTY_LOGIN_ATTEMPT(state, empty) {
      state.wrongLoginAttempt = empty
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
    loginAction({ commit, dispatch }, payload) {},
    getWhiteLabelByUrl({ commit }) {
      const formData = new FormData()
      formData.append('DomainUrl', window.location.origin)
      getWhiteLabelByUrl(formData).then((response) => {
        const {
          data: { data }
        } = response
        commit('SET_LOGIN_WHITELABEL', data)
      })
    }
  }
}

export default login
