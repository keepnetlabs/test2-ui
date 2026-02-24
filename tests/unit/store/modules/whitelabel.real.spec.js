jest.mock('@/api/whitelabel', () => ({
  resolveWhiteLabel: jest.fn().mockResolvedValue({ data: { data: {} } }),
  updateWhiteLabel: jest.fn().mockResolvedValue({}),
  deleteWhiteLabel: jest.fn().mockResolvedValue({}),
  getSystemVersion: jest.fn().mockResolvedValue({ data: { data: { version: '1.0.0' } } }),
  callForSystemInfoSummary: jest.fn().mockResolvedValue({
    data: {
      versionInfo: { data: { version: '1.0.0' } },
      companyLicense: { data: { isLicenseExceeded: false, isLimited: false } },
      company: { data: { countryName: 'USA' } },
      summary: { data: { countryCode: 'US' } }
    }
  })
}))
jest.mock('@/utils/favicon', () => ({ updateFavicon: jest.fn() }))

import whitelabel from '@/store/modules/whitelabel'
import * as whitelabelApi from '@/api/whitelabel'

const createState = () => JSON.parse(JSON.stringify(whitelabel.state))

describe('whitelabel store module (real)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    Object.defineProperty(document, 'title', { value: '', writable: true })
  })

  describe('module structure', () => {
    it('should have state, getters, mutations, actions', () => {
      expect(whitelabel.state).toBeDefined()
      expect(whitelabel.getters).toBeDefined()
      expect(whitelabel.mutations).toBeDefined()
      expect(whitelabel.actions).toBeDefined()
    })
    it('should be namespaced', () => {
      expect(whitelabel.namespaced).toBe(true)
    })
  })

  describe('getters', () => {
    it('getShowLicenseDialog returns state', () => {
      const state = createState()
      state.showLicenseExceededDialog = true
      expect(whitelabel.getters.getShowLicenseDialog(state)).toBe(true)
    })
    it('getFooterLinks returns footer links object', () => {
      const state = createState()
      state.footerPrivacyPolicyUrl = 'https://privacy.com'
      const result = whitelabel.getters.getFooterLinks(state)
      expect(result).toHaveProperty('footerPrivacyPolicyUrl')
      expect(result).toHaveProperty('footerTermsAndConditionsUrl')
    })
    it('getNavigatorMenuProps returns menu props', () => {
      const state = createState()
      state.mainLogoUrl = 'https://logo.com'
      const result = whitelabel.getters.getNavigatorMenuProps(state)
      expect(result.mainLogoUrl).toBe('https://logo.com')
    })
  })

  describe('mutations', () => {
    it('SET_DATA updates state and localStorage', () => {
      const state = createState()
      const payload = { brandName: 'Test', mainLogoUrl: 'https://x.com' }
      whitelabel.mutations.SET_DATA(state, payload)
      expect(state.brandName).toBe('Test')
      expect(localStorage.getItem('whitelabelData')).toBeTruthy()
    })
    it('SET_SYSTEM_VERSION updates systemVersion', () => {
      const state = createState()
      whitelabel.mutations.SET_SYSTEM_VERSION(state, '2.0.0')
      expect(state.systemVersion).toBe('2.0.0')
    })
    it('TOGGLE_LOADING updates loading', () => {
      const state = createState()
      whitelabel.mutations.TOGGLE_LOADING(state, false)
      expect(state.loading).toBe(false)
    })
    it('SET_COMPANY_LICENSE updates companyLicense', () => {
      const state = createState()
      whitelabel.mutations.SET_COMPANY_LICENSE(state, { isLimited: true })
      expect(state.companyLicense).toEqual({ isLimited: true })
    })
    it('SET_SHOW_EXCEED_DIALOG sets boolean', () => {
      const state = createState()
      whitelabel.mutations.SET_SHOW_EXCEED_DIALOG(state, true)
      expect(state.showLicenseExceededDialog).toBe(true)
    })
    it('SET_COUNTRY_NAME updates countryName', () => {
      const state = createState()
      whitelabel.mutations.SET_COUNTRY_NAME(state, 'Germany')
      expect(state.countryName).toBe('Germany')
    })
  })

  describe('actions', () => {
    it('callForData fetches and commits', async () => {
      const commit = jest.fn()
      await whitelabel.actions.callForData({ commit })
      expect(commit).toHaveBeenCalledWith('TOGGLE_LOADING', true)
      expect(whitelabelApi.resolveWhiteLabel).toHaveBeenCalled()
    })
    it('callForSystemVersion commits version', async () => {
      const commit = jest.fn()
      await whitelabel.actions.callForSystemVersion({ commit })
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', '1.0.0')
    })
    it('callForSystemInfoSummary with checkExceedDialog', async () => {
      const commit = jest.fn()
      whitelabelApi.callForSystemInfoSummary.mockResolvedValue({
        data: {
          versionInfo: { data: { version: '2.0' } },
          companyLicense: { data: { isLicenseExceeded: true, isLimited: true } },
          company: { data: { countryName: 'UK' } },
          summary: { data: { countryCode: 'GB' } }
        }
      })
      await whitelabel.actions.callForSystemInfoSummary({ commit }, { checkExceedDialog: true })
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', '2.0')
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_LICENSE', expect.any(Object))
    })
    it('callForSystemInfoSummary handles catch', async () => {
      const commit = jest.fn()
      whitelabelApi.callForSystemInfoSummary.mockRejectedValue(new Error('fail'))
      await whitelabel.actions.callForSystemInfoSummary({ commit })
      expect(commit).not.toHaveBeenCalled()
    })
    it('resetState commits RESET_STATE', () => {
      const commit = jest.fn()
      whitelabel.actions.resetState({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_STATE', expect.any(Object))
    })
    it('setState commits SET_DATA', () => {
      const commit = jest.fn()
      whitelabel.actions.setState({ commit }, { brandName: 'X' })
      expect(commit).toHaveBeenCalledWith('SET_DATA', { brandName: 'X' })
    })
    it('toggleShowExceedDialog closes when open', () => {
      const state = createState()
      state.showLicenseExceededDialog = true
      const commit = jest.fn()
      whitelabel.actions.toggleShowExceedDialog({ state, commit })
      expect(commit).toHaveBeenCalledWith('SET_SHOW_EXCEED_DIALOG', false)
    })
    it('toggleShowExceedDialog opens when closed and no storage', () => {
      const state = createState()
      state.showLicenseExceededDialog = false
      const commit = jest.fn()
      const rootGetters = { 'login/getCurrentCompany': { resourceId: 'company-1' } }
      whitelabel.actions.toggleShowExceedDialog({ state, commit, rootGetters })
      expect(commit).toHaveBeenCalledWith('SET_SHOW_EXCEED_DIALOG', true)
    })
    it('toggleShowExceedDialog returns early when no companyId', () => {
      const state = createState()
      state.showLicenseExceededDialog = false
      const commit = jest.fn()
      whitelabel.actions.toggleShowExceedDialog({ state, commit, rootGetters: {} })
      expect(commit).not.toHaveBeenCalled()
    })
    it('toggleShowExceedDialog shows dialog when 24h passed since last shown', () => {
      const state = createState()
      state.showLicenseExceededDialog = false
      const commit = jest.fn()
      const rootGetters = { 'login/getCurrentCompany': { resourceId: 'company-1' } }
      const twentyFiveHoursAgo = Date.now() - 25 * 60 * 60 * 1000
      localStorage.setItem('lastLicenseExceededDialogShown_company-1', twentyFiveHoursAgo.toString())
      whitelabel.actions.toggleShowExceedDialog({ state, commit, rootGetters })
      expect(commit).toHaveBeenCalledWith('SET_SHOW_EXCEED_DIALOG', true)
    })
    it('toggleShowExceedDialog does not show when less than 24h since last shown', () => {
      const state = createState()
      state.showLicenseExceededDialog = false
      const commit = jest.fn()
      const rootGetters = { 'login/getCurrentCompany': { resourceId: 'company-1' } }
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      localStorage.setItem('lastLicenseExceededDialogShown_company-1', oneHourAgo.toString())
      whitelabel.actions.toggleShowExceedDialog({ state, commit, rootGetters })
      expect(commit).not.toHaveBeenCalled()
    })
    it('resetToDefault calls deleteWhiteLabel', async () => {
      const state = createState()
      state.resourceId = 'res-123'
      await whitelabel.actions.resetToDefault({ state })
      expect(whitelabelApi.deleteWhiteLabel).toHaveBeenCalledWith('res-123')
    })
  })
})
