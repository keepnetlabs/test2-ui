import jwt_decode from 'jwt-decode'
import CookieKeys from '@/model/constants/cookieKeys'
import auth from '@/store/modules/auth'

jest.mock('jwt-decode', () => jest.fn())
jest.mock('@/utils/functions', () => ({
  setGlobalUserData: jest.fn((data) => ({
    id: data.user_company_resourceid || data.user_company_resource_id,
    name: data.user_company_name || 'Acme',
    firstName: data.given_name || data.first_name || 'Jane',
    userCompany: {
      id: data.user_company_resourceid || data.user_company_resource_id,
      name: data.user_company_name || 'Acme',
      logoPath: data.user_company_logopath || ''
    },
    role: { name: (data.role && data.role.name) || data.role_name || 'User' }
  }))
}))

const { setGlobalUserData } = require('@/utils/functions')

describe('auth store (extra - real module)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('getCurrentUser action', () => {
    it('commits SET_CURRENTUSER when isSelectCompany and userData from localStorage', async () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      localStorage.setItem('isSelectCompany', 'true')
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify({ token: 'jwt-token' }))

      jwt_decode.mockReturnValue({ Permission: ['read', 'write'] })

      const commit = jest.fn()
      const dispatch = jest.fn()

      await auth.actions.getCurrentUser({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: ['read', 'write']
      })
    })

    it('dispatches selectCompany when role is not CompanyAdmin (isSelectCompany true)', async () => {
      const userData = {
        firstName: 'John',
        role: { name: 'User' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      localStorage.setItem('isSelectCompany', 'true')
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify({ token: 'jwt-token' }))
      jwt_decode.mockReturnValue({ Permission: [] })

      const commit = jest.fn()
      const dispatch = jest.fn()

      await auth.actions.getCurrentUser({ commit, dispatch })

      expect(dispatch).toHaveBeenCalledWith('dashboard/selectCompany', userData, { root: true })
    })

    it('does not dispatch selectCompany when role is CompanyAdmin (isSelectCompany true)', async () => {
      const userData = {
        firstName: 'Admin',
        role: { name: 'CompanyAdmin' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      localStorage.setItem('isSelectCompany', 'true')
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify({ token: 'jwt-token' }))
      jwt_decode.mockReturnValue({ Permission: [] })

      const commit = jest.fn()
      const dispatch = jest.fn()

      await auth.actions.getCurrentUser({ commit, dispatch })

      expect(dispatch).not.toHaveBeenCalled()
    })

    it('uses setGlobalUserData and commits when isSelectCompany is false', async () => {
      const tokenData = {
        user_company_resourceid: 'comp-1',
        user_company_name: 'Acme',
        first_name: 'Jane',
        role_name: 'Editor',
        Permission: ['read']
      }
      localStorage.removeItem('isSelectCompany')
      localStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify({ token: 'jwt-token' }))
      jwt_decode.mockReturnValue(tokenData)

      const commit = jest.fn()
      const dispatch = jest.fn()

      await auth.actions.getCurrentUser({ commit, dispatch })

      expect(setGlobalUserData).toHaveBeenCalledWith(tokenData)
      expect(commit).toHaveBeenCalledWith('SET_CURRENTUSER', {
        currentUserData: expect.any(Object),
        isSelectCompany: false,
        permissions: ['read']
      })
    })

    it('dispatches selectCompany when isSelectCompany false and role not CompanyAdmin', async () => {
      const tokenData = {
        user_company_resourceid: 'comp-1',
        user_company_name: 'Acme',
        first_name: 'Jane',
        role_name: 'User',
        Permission: ['read']
      }
      localStorage.removeItem('isSelectCompany')
      localStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify({ token: 'jwt-token' }))
      jwt_decode.mockReturnValue(tokenData)

      const commit = jest.fn()
      const dispatch = jest.fn()

      await auth.actions.getCurrentUser({ commit, dispatch })

      expect(dispatch).toHaveBeenCalledWith(
        'dashboard/selectCompany',
        expect.objectContaining({ name: 'Acme' }),
        { root: true }
      )
    })
  })

  describe('setCompanyName action', () => {
    it('commits SET_COMPANY_NAME', () => {
      const commit = jest.fn()
      auth.actions.setCompanyName({ commit }, 'New Company')
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_NAME', 'New Company')
    })
  })

  describe('setCompanyUpdateRequired action', () => {
    it('commits SET_COMPANY_UPDATE_REQUIRED', () => {
      const commit = jest.fn()
      auth.actions.setCompanyUpdateRequired({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_UPDATE_REQUIRED', true)
    })
  })
})
