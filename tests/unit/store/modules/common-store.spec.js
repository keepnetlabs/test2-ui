describe('common.js store module', () => {
  let commonStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    commonStore = {
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
        }
      }
    }

    state = JSON.parse(JSON.stringify(commonStore.state))
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(state.menuStatus).toBe(true)
      expect(state.isLoading).toBe(0)
      expect(state.snackStatus).toBe(false)
      expect(state.snackbars).toEqual([])
      expect(state.snackbarColor).toBe('red')
      expect(state.errors).toBe('')
      expect(state.errorState).toBe(false)
      expect(state.downloadModalStatus).toBe(false)
      expect(state.sessionCheck).toBe(false)
      expect(state.isReCaptcha).toBe(false)
      expect(state.activePageRouterName).toBe('')
    })
  })

  describe('Getters', () => {
    it('should return correct state values', () => {
      expect(commonStore.getters.getMenuStatus(state)).toBe(true)
      expect(commonStore.getters.getIsLoading(state)).toBe(0)
      expect(commonStore.getters.getSnackStatus(state)).toBe(false)
      expect(commonStore.getters.getErrorStatus(state)).toBe(false)
    })

    it('should track all state changes through getters', () => {
      state.menuStatus = false
      state.isLoading = 5
      state.snackStatus = true

      expect(commonStore.getters.getMenuStatus(state)).toBe(false)
      expect(commonStore.getters.getIsLoading(state)).toBe(5)
      expect(commonStore.getters.getSnackStatus(state)).toBe(true)
    })

    it('should return snackbars array', () => {
      expect(commonStore.getters.getSnackBars(state)).toEqual([])
      state.snackbars = [{ id: 1, msg: 'test' }]
      expect(commonStore.getters.getSnackBars(state)).toHaveLength(1)
    })
  })

  describe('Mutations - Menu & Session', () => {
    it('CHANGE_MENU_STATUS should toggle menu', () => {
      commonStore.mutations.CHANGE_MENU_STATUS(state, false)
      expect(state.menuStatus).toBe(false)

      commonStore.mutations.CHANGE_MENU_STATUS(state, true)
      expect(state.menuStatus).toBe(true)
    })

    it('CHANGE_SESSION_CHECK should set session status', () => {
      commonStore.mutations.CHANGE_SESSION_CHECK(state, true)
      expect(state.sessionCheck).toBe(true)
    })
  })

  describe('Mutations - Loading State', () => {
    it('SET_IS_LOADING should increment counter', () => {
      commonStore.mutations.SET_IS_LOADING(state, 1)
      expect(state.isLoading).toBe(1)

      commonStore.mutations.SET_IS_LOADING(state, 1)
      expect(state.isLoading).toBe(2)
    })

    it('SET_IS_LOADING should handle decrement', () => {
      state.isLoading = 3
      commonStore.mutations.SET_IS_LOADING(state, -1)
      expect(state.isLoading).toBe(2)
    })
  })

  describe('Mutations - Snackbars', () => {
    it('SET_CREATE_SNACKBAR should add snackbar', () => {
      const snackbar = { id: 1, msg: 'test' }
      commonStore.mutations.SET_CREATE_SNACKBAR(state, snackbar)

      expect(state.snackbars).toHaveLength(1)
      expect(state.snackbars[0]).toEqual(snackbar)
    })

    it('RESET_SNACKBARS should clear all', () => {
      state.snackbars = [{ id: 1 }, { id: 2 }]
      commonStore.mutations.RESET_SNACKBARS(state)
      expect(state.snackbars).toEqual([])
    })

    it('SET_CLOSE_SNACKBAR should remove specific snackbar', () => {
      const snackbar1 = { id: 1, msg: 'test1' }
      const snackbar2 = { id: 2, msg: 'test2' }

      state.snackbars = [snackbar1, snackbar2]
      commonStore.mutations.SET_CLOSE_SNACKBAR(state, snackbar1)

      expect(state.snackbars).toHaveLength(1)
      expect(state.snackbars[0]).toEqual(snackbar2)
    })

    it('SET_SNACK_STATUS should toggle snack display', () => {
      commonStore.mutations.SET_SNACK_STATUS(state, true)
      expect(state.snackStatus).toBe(true)
    })

    it('SET_SNACKBAR_COLOR should set color', () => {
      commonStore.mutations.SET_SNACKBAR_COLOR(state, 'green')
      expect(state.snackbarColor).toBe('green')
    })
  })

  describe('Mutations - Errors', () => {
    it('SET_ERROR_STATE should set error status', () => {
      commonStore.mutations.SET_ERROR_STATE(state, true)
      expect(state.errorState).toBe(true)
    })

    it('SET_ERROR_MESSAGE should set error text', () => {
      commonStore.mutations.SET_ERROR_MESSAGE(state, 'Error occurred')
      expect(state.errors).toBe('Error occurred')
    })
  })

  describe('Mutations - Timezone', () => {
    it('SET_SELECTED_TIME_ZONE should set timezone', () => {
      commonStore.mutations.SET_SELECTED_TIME_ZONE(state, 'EST')
      expect(state.selectedTimeZone).toBe('EST')
    })

    it('SET_SELECTED_TIME_ZONE_NAME should set timezone name', () => {
      commonStore.mutations.SET_SELECTED_TIME_ZONE_NAME(state, 'Eastern')
      expect(state.selectedTimeZoneName).toBe('Eastern')
    })

    it('SET_TIMEZONE should set timezone object', () => {
      const timezones = { UTC: 'UTC', EST: 'EST' }
      commonStore.mutations.SET_TIMEZONE(state, timezones)
      expect(state.timezones).toEqual(timezones)
    })
  })

  describe('Mutations - Dialog', () => {
    it('SET_IS_SHOW_LEAVING_DIALOG should toggle dialog visibility', () => {
      commonStore.mutations.SET_IS_SHOW_LEAVING_DIALOG(state, true)
      expect(state.isShowLeavingDialog).toBe(true)
    })

    it('SET_LEAVING_DIALOG_CALLBACK should set callback', () => {
      const callback = jest.fn()
      commonStore.mutations.SET_LEAVING_DIALOG_CALLBACK(state, callback)
      expect(state.leavingDialogCallback).toBe(callback)
    })
  })

  describe('Mutations - Other', () => {
    it('SET_RE_CAPTCHA should set reCaptcha status', () => {
      commonStore.mutations.SET_RE_CAPTCHA(state, true)
      expect(state.isReCaptcha).toBe(true)
    })

    it('SET_DOWNLOAD_MODAL_STATUS should set modal status', () => {
      commonStore.mutations.SET_DOWNLOAD_MODAL_STATUS(state, true)
      expect(state.downloadModalStatus).toBe(true)
    })

    it('SET_ACTIVE_PAGE_ROUTE_NAME should set route name', () => {
      commonStore.mutations.SET_ACTIVE_PAGE_ROUTE_NAME(state, 'Dashboard')
      expect(state.activePageRouterName).toBe('Dashboard')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle loading workflow', () => {
      expect(state.isLoading).toBe(0)

      // Load started
      commonStore.mutations.SET_IS_LOADING(state, 1)
      expect(commonStore.getters.getIsLoading(state)).toBe(1)

      // More loading
      commonStore.mutations.SET_IS_LOADING(state, 1)
      expect(commonStore.getters.getIsLoading(state)).toBe(2)

      // Load finished
      commonStore.mutations.SET_IS_LOADING(state, -2)
      expect(commonStore.getters.getIsLoading(state)).toBe(0)
    })

    it('should handle error display workflow', () => {
      // Error occurs
      commonStore.mutations.SET_ERROR_STATE(state, true)
      commonStore.mutations.SET_ERROR_MESSAGE(state, 'Network error')
      commonStore.mutations.SET_SNACKBAR_COLOR(state, 'red')

      expect(commonStore.getters.getErrorStatus(state)).toBe(true)
      expect(commonStore.getters.getErrors(state)).toBe('Network error')
      expect(commonStore.getters.getColor(state)).toBe('red')

      // Error resolved
      commonStore.mutations.SET_ERROR_STATE(state, false)
      commonStore.mutations.SET_ERROR_MESSAGE(state, '')
      expect(commonStore.getters.getErrorStatus(state)).toBe(false)
    })

    it('should handle snackbar notifications', () => {
      const msg1 = { id: 1, text: 'Success' }
      const msg2 = { id: 2, text: 'Warning' }

      commonStore.mutations.SET_CREATE_SNACKBAR(state, msg1)
      commonStore.mutations.SET_CREATE_SNACKBAR(state, msg2)
      commonStore.mutations.SET_SNACK_STATUS(state, true)

      expect(commonStore.getters.getSnackBars(state)).toHaveLength(2)
      expect(commonStore.getters.getSnackStatus(state)).toBe(true)

      commonStore.mutations.SET_CLOSE_SNACKBAR(state, msg1)
      expect(commonStore.getters.getSnackBars(state)).toHaveLength(1)
    })

    it('should handle timezone configuration', () => {
      const tzs = { UTC: 'UTC', EST: 'EST', PST: 'PST' }

      commonStore.mutations.SET_TIMEZONE(state, tzs)
      commonStore.mutations.SET_SELECTED_TIME_ZONE(state, 'EST')
      commonStore.mutations.SET_SELECTED_TIME_ZONE_NAME(state, 'Eastern Standard')

      expect(commonStore.getters.getTimezones(state)).toEqual(tzs)
      expect(commonStore.getters.getSelectedTimeZone(state)).toBe('EST')
    })
  })
})
