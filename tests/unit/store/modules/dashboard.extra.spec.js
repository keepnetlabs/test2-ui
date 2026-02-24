import dashboard from '@/store/modules/dashboard'

jest.mock('@/api/dashboard', () => ({
  selectCompany: jest.fn().mockResolvedValue({ data: { data: {} } }),
  logoutUser: jest.fn().mockResolvedValue()
}))
jest.mock('@/api/company', () => ({
  getCompanyList: jest.fn().mockResolvedValue({ data: { data: [] } })
}))
jest.mock('@/services/authentication', () => ({
  default: { removeToken: jest.fn() }
}))
jest.mock('@/router', () => ({ push: jest.fn() }))

describe('dashboard store (extra coverage)', () => {
  const { selectCompany, logoutUser } = require('@/api/dashboard')
  const { getCompanyList } = require('@/api/company')
  const router = require('@/router')

  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(dashboard.state))
    localStorage.clear()
    jest.clearAllMocks()
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
  })
})
