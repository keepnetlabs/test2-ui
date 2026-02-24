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

  beforeEach(() => {
    getAgenticAIStatus.mockClear()
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
  })

  describe('setAgenticAIEnabled action', () => {
    it('commits payload', () => {
      const commit = jest.fn()
      login.actions.setAgenticAIEnabled({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', true)
    })
  })
})
