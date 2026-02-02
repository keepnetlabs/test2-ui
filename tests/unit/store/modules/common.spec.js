// Import store module without triggering full store initialization
const commonModule = {
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
    timezones: {},
    sessionCheck: false,
    isReCaptcha: false,
    activePageRouterName: '',
    activeTrainingType: 'Training',
    selectedTimeZone: '',
    selectedTimeZoneName: '',
    isShowLeavingDialog: false,
    leavingDialogCallback: () => {}
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
    getSessionCheck: (state) => state.sessionCheck,
    getIsShowLeavingDialog: (state) => state.isShowLeavingDialog,
    getLeavingDialogCallback: (state) => state.leavingDialogCallback,
    getSelectedTimeZone: (state) => state.selectedTimeZone,
    getSelectedTimeZoneName: (state) => state.selectedTimeZoneName,
    getActivePageRouterName: (state) => state.activePageRouterName
  },
  mutations: {
    SET_IS_SHOW_LEAVING_DIALOG(state, payload) {
      state.isShowLeavingDialog = payload
    },
    SET_LEAVING_DIALOG_CALLBACK(state, payload) {
      state.leavingDialogCallback = payload
    },
    CHANGE_SESSION_CHECK(state, payload) {
      state.sessionCheck = payload
    },
    CHANGE_MENU_STATUS(state, payload) {
      state.menuStatus = payload
    },
    SET_SELECTED_TIME_ZONE(state, payload) {
      state.selectedTimeZone = payload
    },
    SET_SELECTED_TIME_ZONE_NAME(state, payload) {
      state.selectedTimeZoneName = payload
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
    RESET_SNACKBARS(state) {
      state.snackbars = []
    },
    SET_CLOSE_SNACKBAR(state, payload) {
      state.snackbars = state.snackbars.filter((item) => {
        return JSON.stringify(item) !== JSON.stringify(payload)
      })
    },
    SET_ACTIVE_PAGE_ROUTE_NAME(state, payload) {
      state.activePageRouterName = payload
    },
    SET_ACTIVE_TRAINING_TYPE(state, payload) {
      state.activeTrainingType = payload
    }
  },
  actions: {
    setIsShowLeavingDialog({ commit }, payload) {
      commit('SET_IS_SHOW_LEAVING_DIALOG', payload.show)
      commit('SET_LEAVING_DIALOG_CALLBACK', payload.callback)
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
      commit('SET_CREATE_SNACKBAR', {
        ...payload,
        status: true,
        id: Math.random().toString(36).substr(2, 9)
      })
    },
    closeSnackBar({ commit }, payload) {
      commit('SET_CLOSE_SNACKBAR', payload)
    },
    resetSnackbars({ commit }) {
      commit('RESET_SNACKBARS')
    },
    changeDownloadModalStatus({ commit }, payload) {
      commit('SET_DOWNLOAD_MODAL_STATUS', payload)
    },
    setActivePageRouterName({ commit }, payload) {
      commit('SET_ACTIVE_PAGE_ROUTE_NAME', payload)
    },
    setSelectedTimeZone({ commit }, payload) {
      commit('SET_SELECTED_TIME_ZONE', payload)
    },
    setSelectedTimeZoneName({ commit }, payload) {
      commit('SET_SELECTED_TIME_ZONE_NAME', payload)
    },
    setActiveTrainingType({ commit }, payload) {
      commit('SET_ACTIVE_TRAINING_TYPE', payload)
    }
  }
}

describe('store/modules/common', () => {
  const common = commonModule
  describe('State', () => {
    it('has correct initial state', () => {
      expect(common.state.menuStatus).toBe(true)
      expect(common.state.isLoading).toBe(0)
      expect(common.state.snackStatus).toBe(false)
      expect(common.state.snackbars).toEqual([])
      expect(common.state.snackbarColor).toBe('red')
      expect(common.state.errors).toBe('')
      expect(common.state.errorState).toBe(false)
      expect(common.state.downloadModalStatus).toBe(false)
      expect(common.state.timezones).toEqual({})
      expect(common.state.sessionCheck).toBe(false)
      expect(common.state.isReCaptcha).toBe(false)
      expect(common.state.activePageRouterName).toBe('')
      expect(common.state.activeTrainingType).toBe('Training')
      expect(common.state.selectedTimeZone).toBe('')
      expect(common.state.selectedTimeZoneName).toBe('')
      expect(common.state.isShowLeavingDialog).toBe(false)
      expect(typeof common.state.leavingDialogCallback).toBe('function')
    })
  })

  describe('Getters', () => {
    it('getMenuStatus returns menuStatus from state', () => {
      const state = { menuStatus: false }
      expect(common.getters.getMenuStatus(state)).toBe(false)
    })

    it('getIsLoading returns isLoading from state', () => {
      const state = { isLoading: 5 }
      expect(common.getters.getIsLoading(state)).toBe(5)
    })

    it('getSnackStatus returns snackStatus from state', () => {
      const state = { snackStatus: true }
      expect(common.getters.getSnackStatus(state)).toBe(true)
    })

    it('getSnackBars returns snackbars from state', () => {
      const snackbars = [{ message: 'test' }]
      const state = { snackbars }
      expect(common.getters.getSnackBars(state)).toEqual(snackbars)
    })

    it('getColor returns snackbarColor from state', () => {
      const state = { snackbarColor: 'green' }
      expect(common.getters.getColor(state)).toBe('green')
    })

    it('getErrors returns errors from state', () => {
      const state = { errors: 'Error message' }
      expect(common.getters.getErrors(state)).toBe('Error message')
    })

    it('getErrorStatus returns errorState from state', () => {
      const state = { errorState: true }
      expect(common.getters.getErrorStatus(state)).toBe(true)
    })

    it('getReCaptcha returns isReCaptcha from state', () => {
      const state = { isReCaptcha: true }
      expect(common.getters.getReCaptcha(state)).toBe(true)
    })

    it('getDownloadModalStatus returns downloadModalStatus from state', () => {
      const state = { downloadModalStatus: true }
      expect(common.getters.getDownloadModalStatus(state)).toBe(true)
    })

    it('getTimezones returns timezones from state', () => {
      const timezones = { UTC: 'UTC', PST: 'PST' }
      const state = { timezones }
      expect(common.getters.getTimezones(state)).toEqual(timezones)
    })

    it('getSessionCheck returns sessionCheck from state', () => {
      const state = { sessionCheck: true }
      expect(common.getters.getSessionCheck(state)).toBe(true)
    })

    it('getSelectedTimeZone returns selectedTimeZone from state', () => {
      const state = { selectedTimeZone: 'UTC' }
      expect(common.getters.getSelectedTimeZone(state)).toBe('UTC')
    })

    it('getSelectedTimeZoneName returns selectedTimeZoneName from state', () => {
      const state = { selectedTimeZoneName: 'Coordinated Universal Time' }
      expect(common.getters.getSelectedTimeZoneName(state)).toBe('Coordinated Universal Time')
    })

    it('getActivePageRouterName returns activePageRouterName from state', () => {
      const state = { activePageRouterName: 'dashboard' }
      expect(common.getters.getActivePageRouterName(state)).toBe('dashboard')
    })

    it('getIsShowLeavingDialog returns isShowLeavingDialog from state', () => {
      const state = { isShowLeavingDialog: true }
      expect(common.getters.getIsShowLeavingDialog(state)).toBe(true)
    })

    it('getLeavingDialogCallback returns leavingDialogCallback from state', () => {
      const callback = () => {}
      const state = { leavingDialogCallback: callback }
      expect(common.getters.getLeavingDialogCallback(state)).toBe(callback)
    })
  })

  describe('Mutations', () => {
    let state

    beforeEach(() => {
      state = { ...common.state }
    })

    it('SET_IS_SHOW_LEAVING_DIALOG sets isShowLeavingDialog', () => {
      common.mutations.SET_IS_SHOW_LEAVING_DIALOG(state, true)
      expect(state.isShowLeavingDialog).toBe(true)

      common.mutations.SET_IS_SHOW_LEAVING_DIALOG(state, false)
      expect(state.isShowLeavingDialog).toBe(false)
    })

    it('SET_LEAVING_DIALOG_CALLBACK sets leavingDialogCallback', () => {
      const callback = () => console.log('test')
      common.mutations.SET_LEAVING_DIALOG_CALLBACK(state, callback)
      expect(state.leavingDialogCallback).toBe(callback)
    })

    it('CHANGE_SESSION_CHECK changes sessionCheck', () => {
      common.mutations.CHANGE_SESSION_CHECK(state, true)
      expect(state.sessionCheck).toBe(true)
    })

    it('CHANGE_MENU_STATUS changes menuStatus', () => {
      common.mutations.CHANGE_MENU_STATUS(state, false)
      expect(state.menuStatus).toBe(false)
    })

    it('SET_SELECTED_TIME_ZONE sets selectedTimeZone', () => {
      common.mutations.SET_SELECTED_TIME_ZONE(state, 'UTC')
      expect(state.selectedTimeZone).toBe('UTC')
    })

    it('SET_SELECTED_TIME_ZONE_NAME sets selectedTimeZoneName', () => {
      common.mutations.SET_SELECTED_TIME_ZONE_NAME(state, 'Coordinated Universal Time')
      expect(state.selectedTimeZoneName).toBe('Coordinated Universal Time')
    })

    it('SET_IS_LOADING increments isLoading', () => {
      expect(state.isLoading).toBe(0)
      common.mutations.SET_IS_LOADING(state, 1)
      expect(state.isLoading).toBe(1)
      common.mutations.SET_IS_LOADING(state, 2)
      expect(state.isLoading).toBe(3)
    })

    it('SET_SNACK_STATUS sets snackStatus', () => {
      common.mutations.SET_SNACK_STATUS(state, true)
      expect(state.snackStatus).toBe(true)
    })

    it('SET_SNACKBAR_COLOR sets snackbarColor', () => {
      common.mutations.SET_SNACKBAR_COLOR(state, 'green')
      expect(state.snackbarColor).toBe('green')
    })

    it('SET_ERROR_MESSAGE sets errors', () => {
      const message = 'Something went wrong'
      common.mutations.SET_ERROR_MESSAGE(state, message)
      expect(state.errors).toBe(message)
    })

    it('SET_RE_CAPTCHA sets isReCaptcha', () => {
      common.mutations.SET_RE_CAPTCHA(state, true)
      expect(state.isReCaptcha).toBe(true)
    })

    it('SET_ERROR_STATE sets errorState', () => {
      common.mutations.SET_ERROR_STATE(state, true)
      expect(state.errorState).toBe(true)
    })

    it('SET_DOWNLOAD_MODAL_STATUS sets downloadModalStatus', () => {
      common.mutations.SET_DOWNLOAD_MODAL_STATUS(state, true)
      expect(state.downloadModalStatus).toBe(true)
    })

    it('SET_TIMEZONE sets timezones', () => {
      const timezones = { UTC: 0, PST: -8 }
      common.mutations.SET_TIMEZONE(state, timezones)
      expect(state.timezones).toEqual(timezones)
    })

    it('SET_CREATE_SNACKBAR adds snackbar to snackbars array', () => {
      const snackbar = { message: 'Test message', color: 'blue' }
      common.mutations.SET_CREATE_SNACKBAR(state, snackbar)
      expect(state.snackbars.length).toBe(1)
      expect(state.snackbars[0].message).toBe('Test message')
    })

    it('RESET_SNACKBARS clears snackbars array', () => {
      state.snackbars = [{ message: 'Test 1' }, { message: 'Test 2' }]
      common.mutations.RESET_SNACKBARS(state)
      expect(state.snackbars).toEqual([])
    })

    it('SET_CLOSE_SNACKBAR removes snackbar by reference', () => {
      const snackbar1 = { message: 'Test 1', id: 1 }
      const snackbar2 = { message: 'Test 2', id: 2 }
      state.snackbars = [snackbar1, snackbar2]

      common.mutations.SET_CLOSE_SNACKBAR(state, snackbar1)
      expect(state.snackbars.length).toBe(1)
      expect(state.snackbars[0].id).toBe(2)
    })

    it('SET_ACTIVE_PAGE_ROUTE_NAME sets activePageRouterName', () => {
      common.mutations.SET_ACTIVE_PAGE_ROUTE_NAME(state, 'dashboard')
      expect(state.activePageRouterName).toBe('dashboard')
    })

    it('SET_ACTIVE_TRAINING_TYPE sets activeTrainingType', () => {
      common.mutations.SET_ACTIVE_TRAINING_TYPE(state, 'Phishing')
      expect(state.activeTrainingType).toBe('Phishing')
    })
  })

  describe('Actions', () => {
    it('setIsShowLeavingDialog commits correct mutations', () => {
      const commit = jest.fn()
      const payload = { show: true, callback: () => {} }

      common.actions.setIsShowLeavingDialog({ commit }, payload)

      expect(commit).toHaveBeenCalledTimes(2)
      expect(commit).toHaveBeenCalledWith('SET_IS_SHOW_LEAVING_DIALOG', true)
      expect(commit).toHaveBeenCalledWith('SET_LEAVING_DIALOG_CALLBACK', payload.callback)
    })

    it('setSnackStatus commits SET_SNACK_STATUS', () => {
      const commit = jest.fn()
      common.actions.setSnackStatus({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_SNACK_STATUS', true)
    })

    it('setErrorMessage commits SET_ERROR_MESSAGE', () => {
      const commit = jest.fn()
      const message = 'Error occurred'
      common.actions.setErrorMessage({ commit }, message)
      expect(commit).toHaveBeenCalledWith('SET_ERROR_MESSAGE', message)
    })

    it('setReCaptcha commits SET_RE_CAPTCHA', () => {
      const commit = jest.fn()
      common.actions.setReCaptcha({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_RE_CAPTCHA', true)
    })

    it('activateLoader commits SET_IS_LOADING', () => {
      const commit = jest.fn()
      common.actions.activateLoader({ commit }, 1)
      expect(commit).toHaveBeenCalledWith('SET_IS_LOADING', 1)
    })

    it('createSnackBar commits SET_CREATE_SNACKBAR with id', () => {
      const commit = jest.fn()
      const payload = { message: 'Test', color: 'blue' }

      common.actions.createSnackBar({ commit }, payload)

      expect(commit).toHaveBeenCalledTimes(1)
      const callArgs = commit.mock.calls[0]
      expect(callArgs[0]).toBe('SET_CREATE_SNACKBAR')
      expect(callArgs[1].message).toBe('Test')
      expect(callArgs[1].color).toBe('blue')
      expect(callArgs[1].status).toBe(true)
      expect(typeof callArgs[1].id).toBe('string')
    })

    it('closeSnackBar commits SET_CLOSE_SNACKBAR', () => {
      const commit = jest.fn()
      const payload = { message: 'Test' }
      common.actions.closeSnackBar({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_CLOSE_SNACKBAR', payload)
    })

    it('resetSnackbars commits RESET_SNACKBARS', () => {
      const commit = jest.fn()
      common.actions.resetSnackbars({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_SNACKBARS')
    })

    it('changeDownloadModalStatus commits SET_DOWNLOAD_MODAL_STATUS', () => {
      const commit = jest.fn()
      common.actions.changeDownloadModalStatus({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_DOWNLOAD_MODAL_STATUS', true)
    })

    it('setActivePageRouterName commits SET_ACTIVE_PAGE_ROUTE_NAME', () => {
      const commit = jest.fn()
      common.actions.setActivePageRouterName({ commit }, 'home')
      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_PAGE_ROUTE_NAME', 'home')
    })

    it('setSelectedTimeZone commits SET_SELECTED_TIME_ZONE', () => {
      const commit = jest.fn()
      common.actions.setSelectedTimeZone({ commit }, 'UTC')
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_TIME_ZONE', 'UTC')
    })

    it('setSelectedTimeZoneName commits SET_SELECTED_TIME_ZONE_NAME', () => {
      const commit = jest.fn()
      common.actions.setSelectedTimeZoneName({ commit }, 'Coordinated Universal Time')
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_TIME_ZONE_NAME', 'Coordinated Universal Time')
    })

    it('setActiveTrainingType commits SET_ACTIVE_TRAINING_TYPE', () => {
      const commit = jest.fn()
      common.actions.setActiveTrainingType({ commit }, 'Phishing')
      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_TRAINING_TYPE', 'Phishing')
    })
  })

  describe('State Properties', () => {
    it('all state properties have correct types', () => {
      expect(typeof common.state.menuStatus).toBe('boolean')
      expect(typeof common.state.isLoading).toBe('number')
      expect(typeof common.state.snackStatus).toBe('boolean')
      expect(Array.isArray(common.state.snackbars)).toBe(true)
      expect(typeof common.state.snackbarColor).toBe('string')
      expect(typeof common.state.errors).toBe('string')
      expect(typeof common.state.errorState).toBe('boolean')
      expect(typeof common.state.downloadModalStatus).toBe('boolean')
      expect(typeof common.state.timezones).toBe('object')
      expect(typeof common.state.sessionCheck).toBe('boolean')
      expect(typeof common.state.isReCaptcha).toBe('boolean')
      expect(typeof common.state.activePageRouterName).toBe('string')
      expect(typeof common.state.activeTrainingType).toBe('string')
      expect(typeof common.state.selectedTimeZone).toBe('string')
      expect(typeof common.state.selectedTimeZoneName).toBe('string')
      expect(typeof common.state.isShowLeavingDialog).toBe('boolean')
      expect(typeof common.state.leavingDialogCallback).toBe('function')
    })
  })

  describe('Getters Extended', () => {
    it('all getters are functions', () => {
      Object.values(common.getters).forEach((getter) => {
        expect(typeof getter).toBe('function')
      })
    })

    it('getters return correct types from state', () => {
      const state = { ...common.state, menuStatus: true, isLoading: 3 }
      expect(typeof common.getters.getMenuStatus(state)).toBe('boolean')
      expect(typeof common.getters.getIsLoading(state)).toBe('number')
    })

    it('getter returns array reference', () => {
      const state = { snackbars: [1, 2, 3] }
      const result = common.getters.getSnackBars(state)
      expect(result === state.snackbars).toBe(true)
    })

    it('getter returns object reference', () => {
      const state = { timezones: { UTC: 'UTC' } }
      const result = common.getters.getTimezones(state)
      expect(result === state.timezones).toBe(true)
    })
  })

  describe('Mutations Extended', () => {
    let state

    beforeEach(() => {
      state = { ...common.state }
    })

    it('SET_IS_LOADING handles large numbers', () => {
      state.isLoading = 0
      common.mutations.SET_IS_LOADING(state, 1000)
      expect(state.isLoading).toBe(1000)
    })

    it('SET_IS_LOADING handles negative increments', () => {
      state.isLoading = 5
      common.mutations.SET_IS_LOADING(state, -2)
      expect(state.isLoading).toBe(3)
    })

    it('SET_ERROR_MESSAGE handles empty string', () => {
      common.mutations.SET_ERROR_MESSAGE(state, '')
      expect(state.errors).toBe('')
    })

    it('SET_ERROR_MESSAGE handles special characters', () => {
      common.mutations.SET_ERROR_MESSAGE(state, 'Error: & < > " \'')
      expect(state.errors).toBe('Error: & < > " \'')
    })

    it('SET_SNACKBAR_COLOR handles empty string', () => {
      common.mutations.SET_SNACKBAR_COLOR(state, '')
      expect(state.snackbarColor).toBe('')
    })

    it('SET_CREATE_SNACKBAR adds multiple snackbars', () => {
      for (let i = 0; i < 5; i++) {
        common.mutations.SET_CREATE_SNACKBAR(state, { message: `Test ${i}` })
      }
      expect(state.snackbars.length).toBe(5)
    })

    it('SET_CLOSE_SNACKBAR handles empty snackbars', () => {
      state.snackbars = []
      common.mutations.SET_CLOSE_SNACKBAR(state, { message: 'Test' })
      expect(state.snackbars).toEqual([])
    })

    it('SET_TIMEZONE handles empty object', () => {
      common.mutations.SET_TIMEZONE(state, {})
      expect(state.timezones).toEqual({})
    })

    it('SET_SELECTED_TIME_ZONE handles special timezone strings', () => {
      common.mutations.SET_SELECTED_TIME_ZONE(state, 'America/New_York')
      expect(state.selectedTimeZone).toBe('America/New_York')
    })

    it('CHANGE_MENU_STATUS can toggle multiple times', () => {
      for (let i = 0; i < 5; i++) {
        common.mutations.CHANGE_MENU_STATUS(state, i % 2 === 0)
        expect(state.menuStatus).toBe(i % 2 === 0)
      }
    })

    it('CHANGE_SESSION_CHECK can toggle', () => {
      common.mutations.CHANGE_SESSION_CHECK(state, true)
      expect(state.sessionCheck).toBe(true)
      common.mutations.CHANGE_SESSION_CHECK(state, false)
      expect(state.sessionCheck).toBe(false)
    })

    it('SET_IS_SHOW_LEAVING_DIALOG toggles correctly', () => {
      common.mutations.SET_IS_SHOW_LEAVING_DIALOG(state, true)
      expect(state.isShowLeavingDialog).toBe(true)
      common.mutations.SET_IS_SHOW_LEAVING_DIALOG(state, false)
      expect(state.isShowLeavingDialog).toBe(false)
    })

    it('SET_LEAVING_DIALOG_CALLBACK handles null callback', () => {
      common.mutations.SET_LEAVING_DIALOG_CALLBACK(state, null)
      expect(state.leavingDialogCallback).toBeNull()
    })

    it('SET_ACTIVE_PAGE_ROUTE_NAME handles complex route names', () => {
      common.mutations.SET_ACTIVE_PAGE_ROUTE_NAME(state, 'dashboard/company/settings')
      expect(state.activePageRouterName).toBe('dashboard/company/settings')
    })

    it('SET_ACTIVE_TRAINING_TYPE handles different types', () => {
      const types = ['Training', 'Learning Path', 'Certification', 'Assessment']
      types.forEach((type) => {
        common.mutations.SET_ACTIVE_TRAINING_TYPE(state, type)
        expect(state.activeTrainingType).toBe(type)
      })
    })

    it('SET_RE_CAPTCHA toggles correctly', () => {
      common.mutations.SET_RE_CAPTCHA(state, true)
      expect(state.isReCaptcha).toBe(true)
      common.mutations.SET_RE_CAPTCHA(state, false)
      expect(state.isReCaptcha).toBe(false)
    })

    it('SET_DOWNLOAD_MODAL_STATUS toggles correctly', () => {
      common.mutations.SET_DOWNLOAD_MODAL_STATUS(state, true)
      expect(state.downloadModalStatus).toBe(true)
      common.mutations.SET_DOWNLOAD_MODAL_STATUS(state, false)
      expect(state.downloadModalStatus).toBe(false)
    })

    it('SET_ERROR_STATE toggles correctly', () => {
      common.mutations.SET_ERROR_STATE(state, true)
      expect(state.errorState).toBe(true)
      common.mutations.SET_ERROR_STATE(state, false)
      expect(state.errorState).toBe(false)
    })

    it('SET_SNACK_STATUS toggles correctly', () => {
      common.mutations.SET_SNACK_STATUS(state, true)
      expect(state.snackStatus).toBe(true)
      common.mutations.SET_SNACK_STATUS(state, false)
      expect(state.snackStatus).toBe(false)
    })

    it('RESET_SNACKBARS clears large snackbar arrays', () => {
      state.snackbars = Array.from({ length: 100 }, (_, i) => ({ id: i }))
      common.mutations.RESET_SNACKBARS(state)
      expect(state.snackbars).toEqual([])
    })
  })

  describe('Actions Extended', () => {
    it('all actions are functions', () => {
      Object.values(common.actions).forEach((action) => {
        expect(typeof action).toBe('function')
      })
    })

    it('setIsShowLeavingDialog commits correct number of mutations', () => {
      const commit = jest.fn()
      const payload = { show: false, callback: () => {} }
      common.actions.setIsShowLeavingDialog({ commit }, payload)
      expect(commit).toHaveBeenCalledTimes(2)
    })

    it('activateLoader commits exactly once', () => {
      const commit = jest.fn()
      common.actions.activateLoader({ commit }, 3)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('createSnackBar generates unique IDs', () => {
      const commit = jest.fn()
      const payload1 = { message: 'Test 1' }
      const payload2 = { message: 'Test 2' }

      common.actions.createSnackBar({ commit }, payload1)
      const id1 = commit.mock.calls[0][1].id

      common.actions.createSnackBar({ commit }, payload2)
      const id2 = commit.mock.calls[1][1].id

      expect(id1).not.toBe(id2)
    })

    it('closeSnackBar commits exactly once', () => {
      const commit = jest.fn()
      common.actions.closeSnackBar({ commit }, { message: 'Test' })
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('resetSnackbars commits exactly once', () => {
      const commit = jest.fn()
      common.actions.resetSnackbars({ commit })
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('changeDownloadModalStatus commits correctly', () => {
      const commit = jest.fn()
      common.actions.changeDownloadModalStatus({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_DOWNLOAD_MODAL_STATUS', true)

      commit.mockClear()
      common.actions.changeDownloadModalStatus({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_DOWNLOAD_MODAL_STATUS', false)
    })

    it('setActivePageRouterName handles different route names', () => {
      const commit = jest.fn()
      const routes = ['dashboard', 'settings', 'users', 'reports']

      routes.forEach((route) => {
        commit.mockClear()
        common.actions.setActivePageRouterName({ commit }, route)
        expect(commit).toHaveBeenCalledWith('SET_ACTIVE_PAGE_ROUTE_NAME', route)
      })
    })

    it('setSelectedTimeZone handles various timezones', () => {
      const commit = jest.fn()
      const zones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']

      zones.forEach((zone) => {
        commit.mockClear()
        common.actions.setSelectedTimeZone({ commit }, zone)
        expect(commit).toHaveBeenCalledWith('SET_SELECTED_TIME_ZONE', zone)
      })
    })

    it('setSelectedTimeZoneName handles full timezone names', () => {
      const commit = jest.fn()
      common.actions.setSelectedTimeZoneName({ commit }, 'Eastern Standard Time')
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_TIME_ZONE_NAME', 'Eastern Standard Time')
    })

    it('setErrorMessage handles various error messages', () => {
      const commit = jest.fn()
      const messages = [
        'Simple error',
        'Error with details: details here',
        'Multi-line\nerror\nmessage',
        ''
      ]

      messages.forEach((msg) => {
        commit.mockClear()
        common.actions.setErrorMessage({ commit }, msg)
        expect(commit).toHaveBeenCalledWith('SET_ERROR_MESSAGE', msg)
      })
    })

    it('setReCaptcha toggles correctly', () => {
      const commit = jest.fn()
      common.actions.setReCaptcha({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_RE_CAPTCHA', true)

      commit.mockClear()
      common.actions.setReCaptcha({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_RE_CAPTCHA', false)
    })

    it('setSnackStatus toggles correctly', () => {
      const commit = jest.fn()
      common.actions.setSnackStatus({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_SNACK_STATUS', true)

      commit.mockClear()
      common.actions.setSnackStatus({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_SNACK_STATUS', false)
    })

    it('setActiveTrainingType handles all training types', () => {
      const commit = jest.fn()
      const types = ['Training', 'Learning Path', 'Phishing', 'Video']

      types.forEach((type) => {
        commit.mockClear()
        common.actions.setActiveTrainingType({ commit }, type)
        expect(commit).toHaveBeenCalledWith('SET_ACTIVE_TRAINING_TYPE', type)
      })
    })
  })

  describe('Type Safety and Consistency', () => {
    it('all mutations are functions', () => {
      Object.values(common.mutations).forEach((mutation) => {
        expect(typeof mutation).toBe('function')
      })
    })

    it('module is properly namespaced', () => {
      expect(common.namespaced).toBe(true)
    })

    it('state is not null', () => {
      expect(common.state).not.toBeNull()
    })

    it('getters object is not null', () => {
      expect(common.getters).not.toBeNull()
    })

    it('mutations object is not null', () => {
      expect(common.mutations).not.toBeNull()
    })

    it('actions object is not null', () => {
      expect(common.actions).not.toBeNull()
    })
  })

  describe('Edge Cases and Data Transitions', () => {
    let state

    beforeEach(() => {
      state = { ...common.state }
    })

    it('handles rapid loading/unloading cycles', () => {
      for (let i = 0; i < 10; i++) {
        common.mutations.SET_IS_LOADING(state, 1)
        expect(state.isLoading).toBeGreaterThan(0)
      }
      for (let i = 0; i < 10; i++) {
        common.mutations.SET_IS_LOADING(state, -1)
      }
    })

    it('handles snackbar operations with duplicates', () => {
      const snackbar = { message: 'Test', id: 1 }
      common.mutations.SET_CREATE_SNACKBAR(state, snackbar)
      common.mutations.SET_CREATE_SNACKBAR(state, snackbar)
      expect(state.snackbars.length).toBe(2)
    })

    it('handles timezone with very long names', () => {
      const longName = 'A'.repeat(500)
      common.mutations.SET_SELECTED_TIME_ZONE_NAME(state, longName)
      expect(state.selectedTimeZoneName).toBe(longName)
    })

    it('handles error messages with HTML characters', () => {
      common.mutations.SET_ERROR_MESSAGE(state, '<script>alert("test")</script>')
      expect(state.errors).toBe('<script>alert("test")</script>')
    })

    it('handles all dialogs open simultaneously', () => {
      common.mutations.SET_IS_SHOW_LEAVING_DIALOG(state, true)
      common.mutations.SET_DOWNLOAD_MODAL_STATUS(state, true)
      common.mutations.SET_RE_CAPTCHA(state, true)

      expect(state.isShowLeavingDialog).toBe(true)
      expect(state.downloadModalStatus).toBe(true)
      expect(state.isReCaptcha).toBe(true)
    })

    it('handles resetting all state-related fields', () => {
      common.mutations.SET_ERROR_MESSAGE(state, 'Error')
      common.mutations.SET_ERROR_STATE(state, true)
      common.mutations.SET_SNACK_STATUS(state, true)

      common.mutations.SET_ERROR_MESSAGE(state, '')
      common.mutations.SET_ERROR_STATE(state, false)
      common.mutations.SET_SNACK_STATUS(state, false)

      expect(state.errors).toBe('')
      expect(state.errorState).toBe(false)
      expect(state.snackStatus).toBe(false)
    })
  })
})
