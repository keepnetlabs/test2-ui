import { getTimezones } from '../../api/common'

const common = {
  namespaced: true,
  state: {
    menuStatus: true,
    isLoading: 0,
    snackStatus: false,
    snackbars: [],
    snackbarColor: 'red',
    errors: '',
    errorState: false,
    downloadModalStatus: false,
    timezones: [],
    sessionCheck: false,
    isReCaptcha: false,
    activePageRouterName: ''
  },
  getters: {
    getMenuStatus: (state) => state.menuStatus,
    getIsLoading: (state) => state.isLoading,
    getSnackStatus: (state) => state.snackStatus,
    getSnackBars: (state) => state.snackbars,
    getColor: (state) => state.snackbarColor,
    getErrors: (state) => state.errors,
    getErrorStatus: (state) => state.errorState,
    getReCaptcha: (state) => state.isReCaptcha,
    getDownloadModalStatus: (state) => state.downloadModalStatus,
    getTimezones: (state) => state.timezones,
    getSessionCheck: (state) => state.sessionCheck
  },
  mutations: {
    CHANGE_SESSION_CHECK(state, payload) {
      state.sessionCheck = payload
    },
    CHANGE_MENU_STATUS(state, payload) {
      state.menuStatus = payload
    },
    SET_IS_LOADING(state, payload) {
      state.isLoading += payload
    },
    SET_SNACK_STATUS(state, payload) {
      state.snackStatus = payload
    },
    SET_SNACKBAR_COLOR(state, payload) {
      state.snackbarColor = payload
    },
    SET_ERROR_MESSAGE(state, payload) {
      state.errors = payload
    },
    SET_RE_CAPTCHA(state, payload) {
      state.isReCaptcha = payload
    },
    SET_ERROR_STATE(state, payload) {
      state.errorState = payload
    },
    SET_DOWNLOAD_MODAL_STATUS(state, payload) {
      state.downloadModalStatus = payload
    },
    SET_TIMEZONE(state, payload) {
      state.timezones = payload
    },
    SET_CREATE_SNACKBAR(state, payload) {
      state.snackbars = [...state.snackbars, payload]
    },
    SET_CLOSE_SNACKBAR(state, payload) {
      state.snackbars = state.snackbars.filter((item) => {
        return JSON.stringify(item) !== JSON.stringify(payload)
      })
    },
    SET_ACTIVE_PAGE_ROUTE_NAME(state, payload) {
      state.activePageRouterName = payload
    }
  },
  actions: {
    changeSessionExpiredStatus({ commit }, payload) {
      commit('CHANGE_SESSION_CHECK', payload)
    },
    changeMenuStatus({ commit }, payload) {
      commit('CHANGE_MENU_STATUS', payload)
    },
    setSnackStatus({ commit }, payload) {
      commit('SET_SNACK_STATUS', payload)
    },
    setErrorMessage({ commit }, payload) {
      commit('SET_ERROR_MESSAGE', payload)
    },
    setReCaptcha({ commit }, payload) {
      commit('SET_RE_CAPTCHA', payload)
    },
    activateLoader({ commit }, payload) {
      commit('SET_IS_LOADING', payload)
    },
    createSnackBar({ commit }, payload) {
      /* params
      message --> string,
      icon --> string,
      color --> string,
      action --> object { link, label }
       */
      commit('SET_CREATE_SNACKBAR', { ...payload, status: true, id: Math.random() })
    },
    closeSnackBar({ commit }, payload) {
      commit('SET_CLOSE_SNACKBAR', payload)
    },
    changeDownloadModalStatus({ commit }, payload) {
      commit('SET_DOWNLOAD_MODAL_STATUS', payload)
    },
    getTimezone({ commit }) {
      getTimezones().then((response) => {
        commit('SET_TIMEZONE', response.data.data)
      })
    },
    setActivePageRouterName({ commit }, payload) {
      commit('SET_ACTIVE_PAGE_ROUTE_NAME', payload)
    }
  }
}

export default common
