import { loginAction, resetPassword, twoStepLogin } from '../../api/auth'
import AuthenticationService from '../../services/authentication'

const login = {
  namespaced: true,
  state: {
    pageNumber: 1,
    wrongLoginAttempt: 0
  },
  getters: {
    getPageNumber: state => state.pageNumber
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
    }
  },
  actions: {
    twoStepLogin({ commit, dispatch }, payload) {
      const jtwToken = AuthenticationService.getToken().token
      commit('common/SET_IS_LOADING', 1, { root: true })
      twoStepLogin({
        code: payload.code,
        token: jtwToken
      })
        .then(response => {
          const result = response.data
          AuthenticationService.setToken(result.token, result.expiredIn, result.status)
          commit('common/SET_IS_LOADING', -1, { root: true })
          commit('common/SET_ERROR_STATE', false, { root: true })
          dispatch('setPageNumber', 1)
          payload.router.push('/')
        })
        .catch(response => {
          const result = response.response.data
          const errorMessage = result.errors[0].message
          commit('common/SET_IS_LOADING', -1, { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', errorMessage, { root: true })
        })
    },
    resetPassword({ commit, dispatch }, payload) {
      resetPassword(payload).then(response => {
        const result = response.data
        dispatch('common/setSnackStatus', true, { root: true })
        dispatch(
          'common/setErrorMessage',
          'An email to with a link to reset your password is sent if a matched user account is found',
          { root: true }
        )
        commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
      })
    },
    setPageNumber({ commit }, payload) {
      commit('SET_PAGE_NUMBER', payload)
    },
    loginAction({ commit }, payload) {
      commit('common/SET_IS_LOADING', 1, { root: true })
      loginAction(payload)
        .then(response => {
          commit('common/SET_ERROR_STATE', false, { root: true })
          AuthenticationService.setToken(
            response.data.token,
            response.data.expiredIn,
            response.data.status
          )
          if (response.data.status === 3) {
            commit('SET_PAGE_NUMBER', 4)
            commit('common/SET_IS_LOADING', -1, { root: true })
          } else {
            commit('common/SET_IS_LOADING', -1, { root: true })
            payload.router.push('/')
          }
        })
        .catch(error => {
          commit('common/SET_IS_LOADING', -1, { root: true })
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
