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
import { updateFavicon } from '@/utils/favicon'

const createState = () => JSON.parse(JSON.stringify(whitelabel.state))

describe('whitelabel store (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    Object.defineProperty(document, 'title', { value: '', writable: true })
  })

  describe('mutations', () => {
    it('SET_DATA calls updateFavicon when payload has faviconUrl', () => {
      const state = createState()
      const payload = { faviconUrl: 'https://example.com/favicon.ico' }
      whitelabel.mutations.SET_DATA(state, payload)
      expect(updateFavicon).toHaveBeenCalledWith('https://example.com/favicon.ico')
    })

    it('SET_DATA sets document.title when payload has brandName', () => {
      const state = createState()
      const payload = { brandName: 'My Brand' }
      whitelabel.mutations.SET_DATA(state, payload)
      expect(document.title).toBe('My Brand')
    })

    it('SET_DATA does not call updateFavicon when faviconUrl is falsy', () => {
      const state = createState()
      whitelabel.mutations.SET_DATA(state, { faviconUrl: null })
      expect(updateFavicon).not.toHaveBeenCalled()
    })

    it('SET_SHOW_EXCEED_DIALOG toggles when payload is not boolean', () => {
      const state = createState()
      state.showLicenseExceededDialog = true
      whitelabel.mutations.SET_SHOW_EXCEED_DIALOG(state, undefined)
      expect(state.showLicenseExceededDialog).toBe(false)
    })

    it('RESET_STATE resets all state keys from payload', () => {
      const state = createState()
      state.brandName = 'Modified'
      state.loading = false
      const payload = createState()
      whitelabel.mutations.RESET_STATE(state, payload)
      expect(state.brandName).toBe('')
      expect(state.loading).toBe(true)
    })
  })

  describe('actions', () => {
    it('updateData builds FormData and dispatches callForData and callForSystemVersion', async () => {
      const dispatch = jest.fn()
      const payload = {
        resourceId: 'res-123',
        id: 'old-id',
        brandName: 'Test',
        mainLogoUrl: 'https://x.com/logo.png'
      }
      await whitelabel.actions.updateData({ dispatch }, payload)
      expect(whitelabelApi.updateWhiteLabel).toHaveBeenCalled()
      const [formData, id] = whitelabelApi.updateWhiteLabel.mock.calls[0]
      expect(id).toBe('res-123')
      expect(formData).toBeInstanceOf(FormData)
      expect(dispatch).toHaveBeenCalledWith('callForData')
      expect(dispatch).toHaveBeenCalledWith('callForSystemVersion')
    })

    it('callForData commits SET_DATA and TOGGLE_LOADING', async () => {
      whitelabelApi.resolveWhiteLabel.mockResolvedValue({
        data: { data: { brandName: 'Fetched' } }
      })
      const commit = jest.fn()
      whitelabel.actions.callForData({ commit })
      await new Promise((r) => setImmediate(r))
      expect(commit).toHaveBeenCalledWith('TOGGLE_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_DATA', { brandName: 'Fetched' })
      expect(commit).toHaveBeenCalledWith('TOGGLE_LOADING', false)
    })

    it('callForSystemInfoSummary dispatches toggleShowExceedDialog when isLimited and isLicenseExceeded', async () => {
      whitelabelApi.callForSystemInfoSummary.mockResolvedValue({
        data: {
          versionInfo: { data: { version: '2.0' } },
          companyLicense: { data: { isLicenseExceeded: true, isLimited: true } },
          company: { data: { countryName: 'UK' } },
          summary: { data: { countryCode: 'GB' } }
        }
      })
      const commit = jest.fn()
      const dispatch = jest.fn()
      await whitelabel.actions.callForSystemInfoSummary(
        { commit, dispatch },
        { checkExceedDialog: true }
      )
      expect(dispatch).toHaveBeenCalledWith('toggleShowExceedDialog')
    })

    it('callForSystemInfoSummary does not check license when companyLicense.data is not object', async () => {
      whitelabelApi.callForSystemInfoSummary.mockResolvedValue({
        data: {
          versionInfo: { data: { version: '1.0' } },
          companyLicense: { data: 'string-not-object' },
          company: {},
          summary: {}
        }
      })
      const commit = jest.fn()
      const dispatch = jest.fn()
      await whitelabel.actions.callForSystemInfoSummary(
        { commit, dispatch },
        { checkExceedDialog: true }
      )
      expect(dispatch).not.toHaveBeenCalledWith('toggleShowExceedDialog')
    })

    it('callForSystemInfoSummary handles empty response', async () => {
      whitelabelApi.callForSystemInfoSummary.mockResolvedValue({})
      const commit = jest.fn()
      await whitelabel.actions.callForSystemInfoSummary({ commit })
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', '')
    })

    it('callForSystemInfoSummary catch runs without throwing', async () => {
      whitelabelApi.callForSystemInfoSummary.mockRejectedValue(new Error('fail'))
      const commit = jest.fn()
      whitelabel.actions.callForSystemInfoSummary({ commit })
      await new Promise((r) => setImmediate(r))
      expect(commit).not.toHaveBeenCalled()
    })

    it('callForSystemVersion commits version from response', async () => {
      whitelabelApi.getSystemVersion.mockResolvedValue({
        data: { data: { version: '3.0.0' } }
      })
      const commit = jest.fn()
      whitelabel.actions.callForSystemVersion({ commit })
      await new Promise((r) => setImmediate(r))
      expect(commit).toHaveBeenCalledWith('SET_SYSTEM_VERSION', '3.0.0')
    })
  })

  describe('getters', () => {
    it('getEmailTemplateLogoUrl returns state', () => {
      const state = createState()
      state.emailTemplateLogoUrl = 'https://logo.com/email.png'
      expect(whitelabel.getters.getEmailTemplateLogoUrl(state)).toBe(
        'https://logo.com/email.png'
      )
    })

    it('getBrandName returns state', () => {
      const state = createState()
      state.brandName = 'Acme'
      expect(whitelabel.getters.getBrandName(state)).toBe('Acme')
    })

    it('getCountryCode and getCountryName return state', () => {
      const state = createState()
      state.countryCode = 'DE'
      state.countryName = 'Germany'
      expect(whitelabel.getters.getCountryCode(state)).toBe('DE')
      expect(whitelabel.getters.getCountryName(state)).toBe('Germany')
    })
  })
})
