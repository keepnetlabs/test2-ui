const common = {
  namespaced: true,
  state: {
    menuStatus: true,
    isLoading: false,
    snackStatus: false,
    snackbarColor: 'red',
    errors: '',
    errorState: false
  },
  getters: {
    getMenuStatus: state => state.menuStatus,
    getIsLoading: state => state.isLoading,
    getSnackStatus: state => state.snackStatus,
    getColor: state => state.snackbarColor,
    getErrors: state => state.errors,
    getErrorStatus: state => state.errorState
  },
  mutations: {
    CHANGE_MENU_STATUS(state, payload) {
      state.menuStatus = payload
    },
    SET_IS_LOADING(state, payload) {
      state.isLoading = payload
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
    SET_ERROR_STATE(state, payload) {
      state.errorState = payload
    }
  },
  actions: {
    changeMenuStatus({ commit }, payload) {
      commit('CHANGE_MENU_STATUS', payload)
    },
    setSnackStatus({ commit }, payload) {
      commit('SET_SNACK_STATUS', payload)
    },
    setErrorMessage({ commit }, payload) {
      commit('SET_ERROR_MESSAGE', payload)
    },
    activateLoader({ commit }, payload) {
      commit('SET_IS_LOADING', payload)
    }
  }
}

export default common
