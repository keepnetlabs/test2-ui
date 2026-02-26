import login from '@/store/modules/login'

jest.mock('@/api/auth', () => ({ resetPassword: jest.fn(), twoStepLogin: jest.fn() }))
jest.mock('@/api/whitelabel', () => ({ getWhiteLabelByUrl: jest.fn() }))
jest.mock('@/api/company', () => ({
  getCompanyByID: jest.fn(),
  getAgenticAIStatus: jest.fn()
}))
jest.mock('@/utils/favicon', () => ({ updateFavicon: jest.fn() }))
jest.mock('@/services/authentication', () => ({
  default: {
    getToken: () => ({ token: 'mock-token' }),
    setToken: jest.fn()
  }
}))

describe('login store (extra coverage)', () => {
  const { getAgenticAIStatus } = require('@/api/company')
  const { getCompanyByID } = require('@/api/company')
  const { getWhiteLabelByUrl } = require('@/api/whitelabel')
  const { updateFavicon } = require('@/utils/favicon')

  beforeEach(() => {
    getAgenticAIStatus.mockClear()
    getCompanyByID.mockClear()
    getWhiteLabelByUrl.mockClear()
    updateFavicon.mockClear()
  })

  describe('getters', () => {
    it('getAgenticAIExecutionMode returns state value', () => {
      const state = { agenticAIExecutionMode: 'ApprovalGated' }
      expect(login.getters.getAgenticAIExecutionMode(state)).toBe('ApprovalGated')
    })
  })

  describe('mutations', () => {
    it('SET_AGENTIC_AI_EXECUTION_MODE updates state', () => {
      const state = { agenticAIExecutionMode: 'ApprovalGated' }
      login.mutations.SET_AGENTIC_AI_EXECUTION_MODE(state, 'Autonomous')
      expect(state.agenticAIExecutionMode).toBe('Autonomous')
    })

    it('SET_LOGIN_WHITELABEL updates title and favicon only when values exist', () => {
      const state = {
        loginWhiteLabel: {
          brandName: '',
          favIconUrl: '',
          mainLogoUrl: ''
        }
      }
      const originalTitle = document.title
      document.title = 'Initial'

      login.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: 'Keepnet',
        faviconUrl: 'https://cdn/logo.ico',
        mainLogoUrl: 'https://cdn/logo.png'
      })

      expect(updateFavicon).toHaveBeenCalledWith('https://cdn/logo.ico')
      expect(document.title).toBe('Keepnet')
      expect(state.loginWhiteLabel).toEqual({
        brandName: 'Keepnet',
        favIconUrl: 'https://cdn/logo.ico',
        mainLogoUrl: 'https://cdn/logo.png'
      })

      document.title = originalTitle
    })

    it('SET_LOGIN_WHITELABEL keeps old title when brandName is empty', () => {
      const state = {
        loginWhiteLabel: {
          brandName: 'Existing',
          favIconUrl: 'old.ico',
          mainLogoUrl: 'old.png'
        }
      }
      const originalTitle = document.title
      document.title = 'ExistingTitle'

      login.mutations.SET_LOGIN_WHITELABEL(state, {
        brandName: '',
        faviconUrl: '',
        mainLogoUrl: 'new.png'
      })

      expect(updateFavicon).not.toHaveBeenCalled()
      expect(document.title).toBe('ExistingTitle')
      expect(state.loginWhiteLabel.mainLogoUrl).toBe('new.png')
      expect(state.loginWhiteLabel.brandName).toBe('')
      expect(state.loginWhiteLabel.favIconUrl).toBe(undefined)

      document.title = originalTitle
    })
  })

  describe('getAgenticAIEnabled action', () => {
    it('commits executionMode when response has it', async () => {
      getAgenticAIStatus.mockResolvedValue({
        data: { data: { agenticAIEnabled: true, executionMode: 'Autonomous' } }
      })
      const commit = jest.fn()
      const state = { hasAgenticAILicense: true }
      await login.actions.getAgenticAIEnabled({ commit, state })
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_EXECUTION_MODE', 'Autonomous')
    })

    it('returns false when hasAgenticAILicense is false', async () => {
      const state = { hasAgenticAILicense: false }
      const result = await login.actions.getAgenticAIEnabled({ commit: jest.fn(), state })
      expect(result).toBe(false)
      expect(getAgenticAIStatus).not.toHaveBeenCalled()
    })

    it('commits false and returns false on API error', async () => {
      getAgenticAIStatus.mockRejectedValue(new Error('API error'))
      const commit = jest.fn()
      const state = { hasAgenticAILicense: true }
      const result = await login.actions.getAgenticAIEnabled({ commit, state })
      expect(result).toBe(false)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
    })

    it('does not commit execution mode when executionMode is missing', async () => {
      getAgenticAIStatus.mockResolvedValue({
        data: { data: { agenticAIEnabled: true } }
      })
      const commit = jest.fn()
      const state = { hasAgenticAILicense: true }

      const result = await login.actions.getAgenticAIEnabled({ commit, state })

      expect(result).toBe(true)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', true)
      expect(commit).not.toHaveBeenCalledWith('SET_AGENTIC_AI_EXECUTION_MODE', expect.anything())
    })

    it('keeps AI disabled when API payload is missing data object', async () => {
      getAgenticAIStatus.mockResolvedValueOnce({ data: {} })
      const commit = jest.fn()
      const state = { hasAgenticAILicense: true }

      const result = await login.actions.getAgenticAIEnabled({ commit, state })

      expect(result).toBe(false)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
      expect(commit).not.toHaveBeenCalledWith('SET_AGENTIC_AI_EXECUTION_MODE', expect.anything())
    })
  })

  describe('getCurrentCompany action', () => {
    it('commits company and disables AI when license is false', async () => {
      getCompanyByID.mockResolvedValue({
        data: { data: { id: 7, hasAgenticAILicense: false } }
      })
      const commit = jest.fn()

      await login.actions.getCurrentCompany({ commit })

      expect(commit).toHaveBeenCalledWith('SET_COMPANY', { id: 7, hasAgenticAILicense: false })
      expect(commit).toHaveBeenCalledWith('SET_HAS_AGENTIC_AI_LICENSE', false)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
    })

    it('commits company and keeps enabled state untouched when licensed', async () => {
      getCompanyByID.mockResolvedValue({
        data: { data: { id: 9, hasAgenticAILicense: true } }
      })
      const commit = jest.fn()

      await login.actions.getCurrentCompany({ commit })

      expect(commit).toHaveBeenCalledWith('SET_COMPANY', { id: 9, hasAgenticAILicense: true })
      expect(commit).toHaveBeenCalledWith('SET_HAS_AGENTIC_AI_LICENSE', true)
      expect(commit).not.toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
    })

    it('falls back to null company and disables AI when response data is missing', async () => {
      getCompanyByID.mockResolvedValueOnce({ data: {} })
      const commit = jest.fn()

      await login.actions.getCurrentCompany({ commit })

      expect(commit).toHaveBeenCalledWith('SET_COMPANY', null)
      expect(commit).toHaveBeenCalledWith('SET_HAS_AGENTIC_AI_LICENSE', false)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
    })
  })

  describe('setAgenticAIEnabled action', () => {
    it('commits payload', () => {
      const commit = jest.fn()
      login.actions.setAgenticAIEnabled({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', true)
    })
  })

  describe('getWhiteLabelByUrl action', () => {
    it('commits white label when API returns data payload', async () => {
      getWhiteLabelByUrl.mockResolvedValueOnce({
        data: {
          data: {
            brandName: 'Keepnet',
            faviconUrl: 'https://cdn/icon.ico',
            mainLogoUrl: 'https://cdn/logo.png'
          }
        }
      })
      const commit = jest.fn()

      await login.actions.getWhiteLabelByUrl({ commit })
      await Promise.resolve()

      expect(getWhiteLabelByUrl).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenCalledWith('SET_LOGIN_WHITELABEL', {
        brandName: 'Keepnet',
        faviconUrl: 'https://cdn/icon.ico',
        mainLogoUrl: 'https://cdn/logo.png'
      })
    })

    it('does not commit when API response has no data payload', async () => {
      getWhiteLabelByUrl.mockResolvedValueOnce({ data: {} })
      const commit = jest.fn()

      await login.actions.getWhiteLabelByUrl({ commit })
      await Promise.resolve()

      expect(getWhiteLabelByUrl).toHaveBeenCalledTimes(1)
      expect(commit).not.toHaveBeenCalled()
    })
  })
})
