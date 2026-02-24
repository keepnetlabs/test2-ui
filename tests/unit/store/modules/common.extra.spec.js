import common from '@/store/modules/common'
import { getTimezones } from '@/api/common'
import { getSystemUserSettings } from '@/api/settings'

jest.mock('@/api/common', () => ({
  getTimezones: jest.fn()
}))
jest.mock('@/api/settings', () => ({
  getSystemUserSettings: jest.fn()
}))
jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'rnd-123')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('common store (extra - real module)', () => {
  let state

  beforeEach(() => {
    jest.clearAllMocks()
    state = JSON.parse(JSON.stringify(common.state))
  })

  describe('getters', () => {
    it('getActivePageRouterName returns activePageRouterName', () => {
      state.activePageRouterName = 'Dashboard'
      expect(common.getters.getActivePageRouterName(state)).toBe('Dashboard')
    })

    it('getSelectedTimeZone returns selectedTimeZone', () => {
      state.selectedTimeZone = 'UTC'
      expect(common.getters.getSelectedTimeZone(state)).toBe('UTC')
    })

    it('getSelectedTimeZoneName returns selectedTimeZoneName', () => {
      state.selectedTimeZoneName = 'Coordinated Universal Time'
      expect(common.getters.getSelectedTimeZoneName(state)).toBe('Coordinated Universal Time')
    })

    it('getTimezones returns timezones object', () => {
      state.timezones = { UTC: 'UTC', EST: 'EST' }
      expect(common.getters.getTimezones(state)).toEqual({ UTC: 'UTC', EST: 'EST' })
    })

    it('getDownloadModalStatus returns downloadModalStatus', () => {
      state.downloadModalStatus = true
      expect(common.getters.getDownloadModalStatus(state)).toBe(true)
    })

    it('getReCaptcha returns isReCaptcha', () => {
      state.isReCaptcha = true
      expect(common.getters.getReCaptcha(state)).toBe(true)
    })

    it('getLeavingDialogCallback returns leavingDialogCallback', () => {
      const cb = jest.fn()
      state.leavingDialogCallback = cb
      expect(common.getters.getLeavingDialogCallback(state)).toBe(cb)
    })
  })

  describe('mutations', () => {
    it('SET_ACTIVE_TRAINING_TYPE sets activeTrainingType', () => {
      common.mutations.SET_ACTIVE_TRAINING_TYPE(state, 'Survey')
      expect(state.activeTrainingType).toBe('Survey')
    })

    it('SET_IS_LOADING supports increment and decrement branches', () => {
      state.isLoading = 0
      common.mutations.SET_IS_LOADING(state, 2)
      expect(state.isLoading).toBe(2)
      common.mutations.SET_IS_LOADING(state, -1)
      expect(state.isLoading).toBe(1)
    })

    it('SET_CLOSE_SNACKBAR removes exact match and keeps non-matching items', () => {
      const snack1 = { id: 1, message: 'A' }
      const snack2 = { id: 2, message: 'B' }
      state.snackbars = [snack1, snack2]

      common.mutations.SET_CLOSE_SNACKBAR(state, { id: 1, message: 'A' })
      expect(state.snackbars).toEqual([snack2])

      common.mutations.SET_CLOSE_SNACKBAR(state, { id: 999, message: 'X' })
      expect(state.snackbars).toEqual([snack2])
    })
  })

  describe('actions', () => {
    it('setIsShowLeavingDialog commits both show and callback', () => {
      const commit = jest.fn()
      const payload = { show: true, callback: jest.fn() }
      common.actions.setIsShowLeavingDialog({ commit }, payload)
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
      common.actions.setErrorMessage({ commit }, 'Error message')
      expect(commit).toHaveBeenCalledWith('SET_ERROR_MESSAGE', 'Error message')
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

    it('createSnackBar adds id and status to payload', () => {
      const commit = jest.fn()
      common.actions.createSnackBar({ commit }, { message: 'Test', color: 'green' })
      expect(commit).toHaveBeenCalledWith('SET_CREATE_SNACKBAR', {
        message: 'Test',
        color: 'green',
        status: true,
        id: 'rnd-123'
      })
    })

    it('closeSnackBar commits SET_CLOSE_SNACKBAR', () => {
      const commit = jest.fn()
      const payload = { id: 1, message: 'x' }
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

    it('getTimezone fetches and commits timezones', async () => {
      getTimezones.mockResolvedValue({ data: { data: { UTC: 'UTC', EST: 'EST' } } })
      const commit = jest.fn()

      common.actions.getTimezone({ commit })
      await flushPromises()

      expect(getTimezones).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_TIMEZONE', { UTC: 'UTC', EST: 'EST' })
    })

    it('getTimezone commits undefined when response path is missing', async () => {
      getTimezones.mockResolvedValue({ data: {} })
      const commit = jest.fn()

      common.actions.getTimezone({ commit })
      await flushPromises()

      expect(commit).toHaveBeenCalledWith('SET_TIMEZONE', undefined)
    })

    it('setActivePageRouterName commits SET_ACTIVE_PAGE_ROUTE_NAME', () => {
      const commit = jest.fn()
      common.actions.setActivePageRouterName({ commit }, 'Report')
      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_PAGE_ROUTE_NAME', 'Report')
    })

    it('setSelectedTimeZone commits SET_SELECTED_TIME_ZONE', () => {
      const commit = jest.fn()
      common.actions.setSelectedTimeZone({ commit }, 'PST')
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_TIME_ZONE', 'PST')
    })

    it('setSelectedTimeZoneName commits SET_SELECTED_TIME_ZONE_NAME', () => {
      const commit = jest.fn()
      common.actions.setSelectedTimeZoneName({ commit }, 'Pacific')
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_TIME_ZONE_NAME', 'Pacific')
    })

    it('callForSettings fetches and dispatches timezone', async () => {
      getSystemUserSettings.mockResolvedValue({
        data: {
          data: { timeZoneId: 'tz-1', timeZoneName: 'UTC' }
        }
      })
      const dispatch = jest.fn()

      common.actions.callForSettings({ dispatch })
      await flushPromises()

      expect(getSystemUserSettings).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith('setSelectedTimeZone', 'tz-1')
      expect(dispatch).toHaveBeenCalledWith('setSelectedTimeZoneName', 'UTC')
    })

    it('callForSettings dispatches undefined values when response data is missing', async () => {
      getSystemUserSettings.mockResolvedValue({ data: { data: {} } })
      const dispatch = jest.fn()

      common.actions.callForSettings({ dispatch })
      await flushPromises()

      expect(dispatch).toHaveBeenCalledWith('setSelectedTimeZone', undefined)
      expect(dispatch).toHaveBeenCalledWith('setSelectedTimeZoneName', undefined)
    })

    it('setActiveTrainingType commits SET_ACTIVE_TRAINING_TYPE', () => {
      const commit = jest.fn()
      common.actions.setActiveTrainingType({ commit }, 'Infographic')
      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_TRAINING_TYPE', 'Infographic')
    })
  })
})
