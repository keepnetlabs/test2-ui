import login from '@/store/modules/login'
import AuthenticationService from '@/services/authentication'
import { twoStepLogin, resetPassword } from '@/api/auth'
import { getWhiteLabelByUrl } from '@/api/whitelabel'
import { getAgenticAIStatus, getCompanyByID } from '@/api/company'
import { updateFavicon } from '@/utils/favicon'

jest.mock('@/api/auth', () => ({ resetPassword: jest.fn(), twoStepLogin: jest.fn() }))
jest.mock('@/api/whitelabel', () => ({ getWhiteLabelByUrl: jest.fn() }))
jest.mock('@/api/company', () => ({
  getCompanyByID: jest.fn(),
  getAgenticAIStatus: jest.fn()
}))
jest.mock('@/utils/favicon', () => ({ updateFavicon: jest.fn() }))
jest.mock('@/services/authentication', () => ({
  __esModule: true,
  default: {
    getToken: jest.fn(() => ({ token: 'mock-token' })),
    setToken: jest.fn()
  }
}))

describe('login store (actions extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('twoStepLogin success commits and routes to root', async () => {
    twoStepLogin.mockResolvedValue({
      data: { token: 't', expiredIn: 1, status: 'AUTHENTICATED' }
    })
    const commit = jest.fn()
    const dispatch = jest.fn()
    const push = jest.fn()

    login.actions.twoStepLogin({ commit, dispatch }, { code: '111111', router: { push } })
    await Promise.resolve()
    await Promise.resolve()

    expect(AuthenticationService.setToken).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_STATE', false, { root: true })
    expect(dispatch).toHaveBeenCalledWith('setPageNumber', 1)
    expect(push).toHaveBeenCalledWith('/')
  })

  it('twoStepLogin failure commits error state and message', async () => {
    twoStepLogin.mockRejectedValue({
      response: { data: { errors: [{ message: 'Invalid code' }] } }
    })
    const commit = jest.fn()
    const dispatch = jest.fn()

    login.actions.twoStepLogin({ commit, dispatch }, { code: '000000', router: { push: jest.fn() } })
    await Promise.resolve()
    await Promise.resolve()

    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_STATE', true, { root: true })
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', 'Invalid code', { root: true })
  })

  it('resetPassword sends success snackbar message when result is true', async () => {
    resetPassword.mockResolvedValue({ data: { Result: true } })
    const dispatch = jest.fn()
    const commit = jest.fn()

    await login.actions.resetPassword({ commit, dispatch }, { email: 'user@example.com' })

    expect(dispatch).toHaveBeenCalledWith('common/setSnackStatus', true, { root: true })
    expect(dispatch).toHaveBeenCalledWith(
      'common/setErrorMessage',
      expect.stringContaining('link to reset your password'),
      { root: true }
    )
    expect(commit).toHaveBeenCalledWith('common/SET_SNACKBAR_COLOR', 'green', { root: true })
  })

  it('resetPassword sends not-found message when result is false', async () => {
    resetPassword.mockResolvedValue({ data: { Result: false } })
    const dispatch = jest.fn()
    const commit = jest.fn()

    await login.actions.resetPassword({ commit, dispatch }, { email: 'none@example.com' })

    expect(dispatch).toHaveBeenCalledWith(
      'common/setErrorMessage',
      'No user found with that email address',
      { root: true }
    )
  })

  it('getWhiteLabelByUrl commits when response has data and skips otherwise', async () => {
    const commit = jest.fn()
    getWhiteLabelByUrl.mockResolvedValueOnce({
      data: { data: { brandName: 'BrandX', faviconUrl: 'icon.ico', mainLogoUrl: 'logo.png' } }
    })
    await login.actions.getWhiteLabelByUrl({ commit })
    expect(commit).toHaveBeenCalledWith(
      'SET_LOGIN_WHITELABEL',
      expect.objectContaining({ brandName: 'BrandX' })
    )

    commit.mockClear()
    getWhiteLabelByUrl.mockResolvedValueOnce({ data: {} })
    await login.actions.getWhiteLabelByUrl({ commit })
    expect(commit).not.toHaveBeenCalled()
  })

  it('getCurrentCompany commits license false and disables AI when no license', async () => {
    localStorage.setItem('companyRequestId', 'c-1')
    getCompanyByID.mockResolvedValue({
      data: { data: { id: 'c-1', name: 'NoLicenseCo', hasAgenticAILicense: false } }
    })
    const commit = jest.fn()

    await login.actions.getCurrentCompany({ commit })

    expect(commit).toHaveBeenCalledWith('SET_COMPANY', expect.objectContaining({ name: 'NoLicenseCo' }))
    expect(commit).toHaveBeenCalledWith('SET_HAS_AGENTIC_AI_LICENSE', false)
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
  })

  it('core mutations update primitive state fields', () => {
    const state = JSON.parse(JSON.stringify(login.state))
    login.mutations.SET_PAGE_NUMBER(state, 3)
    expect(state.pageNumber).toBe(3)

    login.mutations.SET_COMPANY(state, { id: 1, hasAgenticAILicense: true })
    expect(state.company).toEqual({ id: 1, hasAgenticAILicense: true })

    login.mutations.SET_HAS_AGENTIC_AI_LICENSE(state, 1)
    expect(state.hasAgenticAILicense).toBe(true)

    login.mutations.SET_AGENTIC_AI_ENABLED(state, 0)
    expect(state.agenticAIEnabled).toBe(false)
  })

  it('getCurrentCompany keeps AI enabled flag untouched when license exists', async () => {
    localStorage.setItem('companyRequestId', 'c-2')
    getCompanyByID.mockResolvedValue({
      data: { data: { id: 'c-2', name: 'LicensedCo', hasAgenticAILicense: true } }
    })
    const commit = jest.fn()
    await login.actions.getCurrentCompany({ commit })
    expect(commit).toHaveBeenCalledWith(
      'SET_HAS_AGENTIC_AI_LICENSE',
      true
    )
    expect(commit).not.toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
  })

  it('getAgenticAIEnabled returns false immediately when license is missing', async () => {
    const commit = jest.fn()
    const result = await login.actions.getAgenticAIEnabled({
      commit,
      state: { hasAgenticAILicense: false }
    })
    expect(result).toBe(false)
    expect(getAgenticAIStatus).not.toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
  })

  it('getAgenticAIEnabled commits enabled and execution mode on success', async () => {
    getAgenticAIStatus.mockResolvedValue({
      data: { data: { agenticAIEnabled: true, executionMode: 'FullAuto' } }
    })
    const commit = jest.fn()
    const result = await login.actions.getAgenticAIEnabled({
      commit,
      state: { hasAgenticAILicense: true }
    })
    expect(result).toBe(true)
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', true)
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_EXECUTION_MODE', 'FullAuto')
  })

  it('getAgenticAIEnabled keeps execution mode unchanged when backend does not provide it', async () => {
    getAgenticAIStatus.mockResolvedValue({
      data: { data: { agenticAIEnabled: true } }
    })
    const commit = jest.fn()
    await login.actions.getAgenticAIEnabled({
      commit,
      state: { hasAgenticAILicense: true }
    })
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', true)
    expect(commit).not.toHaveBeenCalledWith('SET_AGENTIC_AI_EXECUTION_MODE', expect.anything())
  })

  it('getAgenticAIEnabled catches api errors and resolves false', async () => {
    getAgenticAIStatus.mockRejectedValue(new Error('api error'))
    const commit = jest.fn()
    const result = await login.actions.getAgenticAIEnabled({
      commit,
      state: { hasAgenticAILicense: true }
    })
    expect(result).toBe(false)
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', false)
  })

  it('setAgenticAIEnabled and setPageNumber actions proxy to commits', () => {
    const commit = jest.fn()
    login.actions.setAgenticAIEnabled({ commit }, true)
    login.actions.setPageNumber({ commit }, 6)
    expect(commit).toHaveBeenCalledWith('SET_AGENTIC_AI_ENABLED', true)
    expect(commit).toHaveBeenCalledWith('SET_PAGE_NUMBER', 6)
  })

  it('SET_LOGIN_WHITELABEL covers favicon, brand title and fallback branches', () => {
    const state = JSON.parse(JSON.stringify(login.state))
    document.title = 'Initial'
    login.mutations.SET_LOGIN_WHITELABEL(state, {
      faviconUrl: 'fav.ico',
      brandName: 'Brand Y',
      mainLogoUrl: 'main.png'
    })
    expect(updateFavicon).toHaveBeenCalledWith('fav.ico')
    expect(document.title).toBe('Brand Y')
    expect(state.loginWhiteLabel).toEqual({
      favIconUrl: 'fav.ico',
      brandName: 'Brand Y',
      mainLogoUrl: 'main.png'
    })

    login.mutations.SET_LOGIN_WHITELABEL(state, {
      mainLogoUrl: 'main2.png'
    })
    expect(state.loginWhiteLabel.mainLogoUrl).toBe('main2.png')
  })
})
