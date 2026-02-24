import dashboard from '@/store/modules/dashboard'

jest.mock('@/api/dashboard', () => ({
  selectCompany: jest.fn().mockResolvedValue({ data: { data: {} } }),
  logoutUser: jest.fn().mockResolvedValue()
}))
jest.mock('@/api/company', () => ({
  getCompanyList: jest.fn().mockResolvedValue({ data: { data: [] } })
}))
jest.mock('@/services/authentication', () => {
  const removeToken = jest.fn()
  return {
    __esModule: true,
    default: { removeToken }
  }
})
jest.mock('@/router', () => ({ push: jest.fn() }))

describe('dashboard store (extra coverage)', () => {
  const { selectCompany, logoutUser } = require('@/api/dashboard')
  const { getCompanyList } = require('@/api/company')
  const router = require('@/router')
  const AuthenticationService = require('@/services/authentication').default

  let state
  let originalLocation

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(dashboard.state))
    localStorage.clear()
    jest.clearAllMocks()
    originalLocation = globalThis.location
    globalThis.location = { pathname: '/dashboard' }
  })

  afterEach(() => {
    globalThis.location = originalLocation
  })

  describe('getters', () => {
    it('isPopupOpened returns popupFeedback', () => {
      state.popupFeedback = true
      expect(dashboard.getters.isPopupOpened(state)).toBe(true)
    })

    it('getIsSwitchDialogOpen returns state', () => {
      state.isSwitchDialogOpen = true
      expect(dashboard.getters.getIsSwitchDialogOpen(state)).toBe(true)
    })

    it('getCompanyDropdowns returns dropdownCompanies', () => {
      state.dropdownCompanies = [{ id: 1 }]
      expect(dashboard.getters.getCompanyDropdowns(state)).toEqual([{ id: 1 }])
    })

    it('getCurrentCompanyObject returns selectedCompanyObject', () => {
      state.selectedCompanyObject = { name: 'Acme' }
      expect(dashboard.getters.getCurrentCompanyObject(state)).toEqual({ name: 'Acme' })
    })
  })

  describe('mutations', () => {
    it('SET_DROPDOWN_COMPANIES updates state', () => {
      dashboard.mutations.SET_DROPDOWN_COMPANIES(state, [{ id: 1 }])
      expect(state.dropdownCompanies).toEqual([{ id: 1 }])
    })

    it('SET_SELECTED_COMPANY sets state and reads from localStorage', () => {
      localStorage.setItem('selectedCompanyName', 'Acme Corp')
      localStorage.setItem('selectedCompanyRequestId', 'req-99')
      const payload = { id: 1 }
      dashboard.mutations.SET_SELECTED_COMPANY(state, payload)
      expect(state.selectedCompany).toBe(payload)
      expect(payload.name).toBe('Acme Corp')
      expect(payload.id).toBe('req-99')
      expect(localStorage.getItem('isSelectCompany')).toBe('true')
    })

    it('SET_SELECTED_COMPANY falls back to null values when localStorage keys are absent', () => {
      const payload = { id: 7, name: 'Original' }
      dashboard.mutations.SET_SELECTED_COMPANY(state, payload)

      expect(payload.name).toBeNull()
      expect(payload.id).toBeNull()
      expect(state.selectedCompany).toBe(payload)
      expect(localStorage.getItem('isSelectCompany')).toBe('true')
    })

    it('SET_SWITCH_DIALOG updates state', () => {
      dashboard.mutations.SET_SWITCH_DIALOG(state, true)
      expect(state.isSwitchDialogOpen).toBe(true)
    })

    it('CHANGE_FEEDBACK_POPUP updates state', () => {
      dashboard.mutations.CHANGE_FEEDBACK_POPUP(state, true)
      expect(state.popupFeedback).toBe(true)
    })
  })

  describe('actions', () => {
    it('logoutUser calls API, removeToken, router.push and commits on success', async () => {
      logoutUser.mockResolvedValue()
      const commit = jest.fn()
      dashboard.actions.logoutUser({ commit })
      await new Promise((r) => setImmediate(r))
      expect(logoutUser).toHaveBeenCalled()
      expect(AuthenticationService.removeToken).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/login')
      expect(commit).toHaveBeenCalledWith('common/RESET_SNACKBARS', undefined, { root: true })
    })

    it('logoutUser calls removeToken and router.push on API rejection', async () => {
      logoutUser.mockRejectedValue(new Error('Network error'))
      const commit = jest.fn()
      dashboard.actions.logoutUser({ commit })
      await new Promise((r) => setImmediate(r))
      expect(AuthenticationService.removeToken).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/login')
      expect(commit).toHaveBeenCalledWith('common/RESET_SNACKBARS', undefined, { root: true })
    })

    it('logoutUser commits snackbar reset mutations before API call', async () => {
      logoutUser.mockResolvedValue()
      const commit = jest.fn()
      await dashboard.actions.logoutUser({ commit })
      expect(commit).toHaveBeenCalledWith('common/SET_SNACK_STATUS', false, { root: true })
      expect(commit).toHaveBeenCalledWith('common/SET_SNACKBAR_COLOR', '', { root: true })
      expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', '', { root: true })
      expect(commit).toHaveBeenCalledWith('common/SET_ERROR_STATE', false, { root: true })
    })

    it('selectCompany stores companyResourceId in localStorage when present', async () => {
      selectCompany.mockResolvedValue({ data: { data: { name: 'Test' } } })
      const commit = jest.fn()
      const dispatch = jest.fn()
      const stateObj = { ...dashboard.state }
      await dashboard.actions.selectCompany(
        { commit, dispatch, state: stateObj },
        { companyResourceId: 'res-123' }
      )
      expect(localStorage.getItem('companyId')).toBe('res-123')
      expect(localStorage.getItem('companyRequestId')).toBe('res-123')
    })

    it('selectCompany does not set companyId when companyResourceId absent', async () => {
      selectCompany.mockResolvedValue({ data: { data: {} } })
      const commit = jest.fn()
      const dispatch = jest.fn()
      const stateObj = { ...dashboard.state }
      await dashboard.actions.selectCompany(
        { commit, dispatch, state: stateObj },
        {}
      )
      expect(localStorage.getItem('companyId')).toBeNull()
    })

    it('selectCompany uses empty object when response.data.data is absent', async () => {
      selectCompany.mockResolvedValue({ data: {} })
      const commit = jest.fn()
      const dispatch = jest.fn()
      const stateObj = { ...dashboard.state }
      await dashboard.actions.selectCompany(
        { commit, dispatch, state: stateObj },
        { companyResourceId: 'res-1' }
      )
      expect(stateObj.selectedCompanyObject).toEqual({})
    })

    it('selectCompany dispatches getDropdownCompanies when pathname is not root', async () => {
      selectCompany.mockResolvedValue({ data: { data: {} } })
      const commit = jest.fn()
      const dispatch = jest.fn()
      globalThis.location = { pathname: '/dashboard' }
      await dashboard.actions.selectCompany(
        { commit, dispatch, state: { ...dashboard.state } },
        { companyResourceId: 'res-1' }
      )
      expect(dispatch).toHaveBeenCalledWith('getDropdownCompanies', { companyResourceId: 'res-1' })
    })

    it('selectCompany does not dispatch getDropdownCompanies when pathname is root', async () => {
      selectCompany.mockResolvedValue({ data: { data: {} } })
      const commit = jest.fn()
      const dispatch = jest.fn()
      globalThis.location = { pathname: '/' }
      await dashboard.actions.selectCompany(
        { commit, dispatch, state: { ...dashboard.state } },
        { companyResourceId: 'res-1' }
      )
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('setSwitchDialog commits SET_SWITCH_DIALOG', () => {
      const commit = jest.fn()
      dashboard.actions.setSwitchDialog({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_SWITCH_DIALOG', true)
    })

    it('changeFeedbackPopup commits CHANGE_FEEDBACK_POPUP', () => {
      const commit = jest.fn()
      dashboard.actions.changeFeedbackPopup({ commit }, false)
      expect(commit).toHaveBeenCalledWith('CHANGE_FEEDBACK_POPUP', false)
    })

    it('getDropdownCompanies skips when payload is CompanyAdmin', async () => {
      const commit = jest.fn()
      await dashboard.actions.getDropdownCompanies({ commit }, 'CompanyAdmin')
      expect(getCompanyList).not.toHaveBeenCalled()
    })

    it('getDropdownCompanies fetches when payload is not CompanyAdmin', async () => {
      const commit = jest.fn()
      getCompanyList.mockResolvedValue({ data: { data: [{ id: 1 }] } })
      await dashboard.actions.getDropdownCompanies({ commit }, 'User')
      expect(getCompanyList).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_DROPDOWN_COMPANIES', [{ id: 1 }])
    })

    it('getDropdownCompanies handles empty response', async () => {
      const commit = jest.fn()
      getCompanyList.mockResolvedValue({ data: {} })
      await dashboard.actions.getDropdownCompanies({ commit }, 'User')
      expect(commit).toHaveBeenCalledWith('SET_DROPDOWN_COMPANIES', [])
    })

    it('getDropdownCompanies handles response with data.data', async () => {
      const commit = jest.fn()
      getCompanyList.mockResolvedValue({ data: { data: [{ id: 1 }, { id: 2 }] } })
      await dashboard.actions.getDropdownCompanies({ commit }, 'User')
      expect(commit).toHaveBeenCalledWith('SET_DROPDOWN_COMPANIES', [{ id: 1 }, { id: 2 }])
    })

    it('getDropdownCompanies treats undefined payload as non-admin and fetches list', async () => {
      const commit = jest.fn()
      getCompanyList.mockResolvedValue({ data: { data: [{ id: 5 }] } })
      await dashboard.actions.getDropdownCompanies({ commit }, undefined)

      expect(getCompanyList).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_DROPDOWN_COMPANIES', [{ id: 5 }])
    })
  })
})
