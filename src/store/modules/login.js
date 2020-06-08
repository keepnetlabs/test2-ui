import { loginAction, resetPassword, twoStepLogin } from '../../api/auth'
import AuthenticationService from '../../services/authentication'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

const login = {
  namespaced: true,
  state: {
    pageNumber: 1,
    wrongLoginAttempt: 0
  },
  getters: {
    getPageNumber: (state) => state.pageNumber
  },
  mutations: {
    SET_PAGE_NUMBER(state, payload) {
      state.pageNumber = payload
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
    loginAction({ commit, dispatch }, payload) {
      dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
      loginAction(payload)
        .then((response) => {
          commit('common/SET_ERROR_STATE', false, { root: true })
          AuthenticationService.setToken(
            response.data.token,
            response.data.expiredIn,
            response.data.status
          )
          if (response.data.status === 3) {
            commit('SET_PAGE_NUMBER', 4)
            dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })
          } else {
            dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })
            commit('EMPTY_LOGIN_ATTEMPT', 0)
            payload.router.push('/')
          }
        })
        .catch((error) => {
          dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })
          commit('WRONG_LOGIN_ATTEMPT', 1)
          if (error.response && error.response.status === 401) {
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit('common/SET_ERROR_MESSAGE', error.response.data.errors[0].message, {
              root: true
            })
          } else {
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit('common/SET_ERROR_MESSAGE', 'Unknown Error Occured !!!', { root: true })
          }
        })
    }
  }
}

export default login
