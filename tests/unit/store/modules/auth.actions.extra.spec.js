import jwt_decode from 'jwt-decode'
import auth from '@/store/modules/auth'
import CookieKeys from '@/model/constants/cookieKeys'

jest.mock('jwt-decode', () => jest.fn())
jest.mock('@/utils/functions', () => ({
  setGlobalUserData: jest.fn()
}))

const { setGlobalUserData } = require('@/utils/functions')

describe('auth store (actions/mutations extra coverage)', () => {
  const createState = () => JSON.parse(JSON.stringify(auth.state))

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('SET_CURRENTUSER returns early when isSelectCompany and currentUserData is missing', () => {
    const state = createState()
    auth.mutations.SET_CURRENTUSER(state, {
      isSelectCompany: true,
      currentUserData: null,
      permissions: ['p1']
    })
    expect(state.user).toEqual({})
    expect(state.permissions).toEqual([])
  })

  it('SET_CURRENTUSER falls back to localStorage companyName when selectedCompanyName missing', () => {
    const state = createState()
    localStorage.setItem('companyName', 'Stored Co')
    auth.mutations.SET_CURRENTUSER(state, {
      isSelectCompany: true,
      currentUserData: {
        firstName: 'A',
        role: { name: 'User' },
        userCompany: { id: 9, name: 'Backend Co', logoPath: 'logo.png' }
      },
      permissions: []
    })
    expect(state.selectedCompanyName).toBe('Stored Co')
  })

  it('getCurrentUser does not dispatch selectCompany for CompanyAdmin in non-select-company flow', async () => {
    localStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify({ token: 'jwt-token' }))
    jwt_decode.mockReturnValue({ Permission: ['x'] })
    setGlobalUserData.mockReturnValue({
      id: 10,
      name: 'Alpha',
      firstName: 'Jane',
      userCompany: { id: 10, name: 'Alpha', logoPath: '' },
      role: { name: 'CompanyAdmin' }
    })

    const commit = jest.fn()
    const dispatch = jest.fn()
    await auth.actions.getCurrentUser({ commit, dispatch })

    expect(dispatch).not.toHaveBeenCalledWith(
      'dashboard/selectCompany',
      expect.anything(),
      expect.anything()
    )
    expect(commit).toHaveBeenCalledWith('SET_CURRENTUSER', expect.objectContaining({
      isSelectCompany: false
    }))
  })

  it('SET_COMPANY_NAME and SET_COMPANY_UPDATE_REQUIRED update state and localStorage', () => {
    const state = createState()
    auth.mutations.SET_COMPANY_NAME(state, 'Gamma Inc')
    expect(state.companyName).toBe('Gamma Inc')
    expect(state.selectedCompanyName).toBe('Gamma Inc')
    expect(localStorage.getItem('companyName')).toBe('Gamma Inc')
    expect(localStorage.getItem('selectedCompanyName')).toBe('Gamma Inc')

    auth.mutations.SET_COMPANY_UPDATE_REQUIRED(state, true)
    expect(state.companyUpdateRequired).toBe(true)
  })

  it('SET_FORMATS updates only provided fields', () => {
    const state = createState()
    state.dateFormat = 'YYYY-MM-DD'
    state.timeFormat = 'HH:mm:ss'

    auth.mutations.SET_FORMATS(state, { dateFormat: 'DD/MM/YYYY' })
    expect(state.dateFormat).toBe('DD/MM/YYYY')
    expect(state.timeFormat).toBe('HH:mm:ss')

    auth.mutations.SET_FORMATS(state, { timeFormat: 'HH:mm' })
    expect(state.dateFormat).toBe('DD/MM/YYYY')
    expect(state.timeFormat).toBe('HH:mm')
  })
})
