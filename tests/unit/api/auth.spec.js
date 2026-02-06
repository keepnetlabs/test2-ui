// Mock localStorage before importing modules
const mockStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  },
  clear() {
    this.data = {}
  }
}

Object.defineProperty(global, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
})

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/authTestRequest', () => ({
  post: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/request', () => ({
  post: jest.fn().mockResolvedValue({})
}))

jest.mock('@/services/authentication', () => ({
  getToken: jest.fn().mockReturnValue('test-token')
}))

import testRequest from '@/utils/testRequest'
import authTestRequest from '@/utils/authTestRequest'
import request from '@/utils/request'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as authApi from '@/api/auth'

describe('auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
  })

  describe('login operations', () => {
    it('should call loginAction with email and password', async () => {
      const payload = { email: 'user@example.com', password: 'password123' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalledWith(
        'connect/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          loading: true,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      )
    })

    it('should call loginAction with MFA code', async () => {
      const payload = { email: 'user@example.com', password: 'password123', code: '123456' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should call loginAction with remember device option', async () => {
      const payload = { email: 'user@example.com', password: 'password123', rememberMeOnThisDevice: true }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should call loginAction with inactive MFA', async () => {
      const payload = {
        email: 'user@example.com',
        password: 'password123',
        mfa: { StatusName: 'Inactive', IsExpired: false }
      }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should call loginAction with recovery code', async () => {
      const payload = { email: 'user@example.com', password: 'password123', recovery_code: 'recovery123' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should call loginAction with CAPTCHA response', async () => {
      const payload = { email: 'user@example.com', password: 'password123', captchaResponse: 'captcha-token' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should call loginAction with stored UUID', async () => {
      const uuid = { email: 'user@example.com', uuid: 'uuid-123' }
      mockStorage.setItem('uuid', JSON.stringify(uuid))
      const payload = { email: 'user@example.com', password: 'password123' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should call loginWithSaml', async () => {
      const payload = { username: 'user@example.com', authcode: 'saml-code' }
      await authApi.loginWithSaml(payload)
      expect(authTestRequest.post).toHaveBeenCalledWith(
        'connect/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          loading: true,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      )
    })

    it('should call loginWithUsername', async () => {
      const payload = { username: 'testuser', password: 'password' }
      await authApi.loginWithUsername(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/account/login', payload, { loading: true })
    })

    it('should call loginWithUsername with empty payload', async () => {
      await authApi.loginWithUsername()
      expect(testRequest.post).toHaveBeenCalledWith('/account/login', {}, { loading: true })
    })

    it('should call twoStepLogin', async () => {
      const payload = { code: '123456' }
      await authApi.twoStepLogin(payload)
      expect(request.post).toHaveBeenCalledWith('account/twostep/verify', expect.any(Object))
    })
  })

  describe('password operations', () => {
    it('should call resetPassword', async () => {
      const email = 'user@example.com'
      await authApi.resetPassword(email)
      expect(testRequest.post).toHaveBeenCalledWith(
        'system-users/send-reset-password-link',
        expect.objectContaining({
          loading: true,
          Email: email
        })
      )
    })

    it('should call createPasswordByToken', async () => {
      const payload = { token: 'token123', password: 'newpassword' }
      await authApi.createPasswordByToken(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/create-password',
        payload,
        { loading: true }
      )
    })

    it('should call resetPasswordByToken', async () => {
      const payload = { token: 'token123', password: 'newpassword' }
      await authApi.resetPasswordByToken(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/reset-password',
        payload,
        { loading: true }
      )
    })

    it('should call updatePassword', async () => {
      const payload = { currentPassword: 'old', newPassword: 'new' }
      await authApi.updatePassword(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/change-password',
        payload,
        expect.objectContaining({
          loading: true,
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('MFA operations', () => {
    it('should call getMfaQRCode', async () => {
      const payload = { userId: 'user-123' }
      await authApi.getMfaQRCode(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/mfa',
        payload,
        { loading: true }
      )
    })

    it('should call setMFA', async () => {
      const payload = { code: '123456' }
      await authApi.setMFA(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/mfa',
        payload,
        { loading: true }
      )
    })

    it('should call setMfaResync', async () => {
      const payload = { code: '123456' }
      await authApi.setMfaResync(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/mfa/resync',
        payload,
        { loading: true }
      )
    })

    it('should call cantLogin', async () => {
      const payload = { phoneNumber: '+1234567890' }
      await authApi.cantLogin(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/mfa/send-recovery-sms',
        payload,
        { loading: true }
      )
    })

    it('should call getMfaStatus', async () => {
      const payload = {}
      await authApi.getMfaStatus(payload)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/system-users/mfa/status',
        payload,
        { loading: true }
      )
    })

    it('should call getMfaSetup', async () => {
      const payload = {}
      await authApi.getMfaSetup(payload)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/system-users/mfa/setup',
        payload,
        { loading: true }
      )
    })

    it('should call disableMfaStatus', async () => {
      const payload = { userId: 'user-123' }
      await authApi.disableMfaStatus(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/mfa/disable',
        payload,
        expect.objectContaining({
          loading: true,
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('agent operations', () => {
    it('should call getAgentLoginUrl', async () => {
      const payload = { agentId: 'agent-123' }
      await authApi.getAgentLoginUrl(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/agent-auth/login-url', payload)
    })
  })

  describe('HTTP method consistency', () => {
    it('should use POST for login operations', async () => {
      const payload = { email: 'user@example.com', password: 'password123' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      const payload = { currentPassword: 'old', newPassword: 'new' }
      await authApi.updatePassword(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use GET for status operations', async () => {
      await authApi.getMfaStatus({})
      expect(testRequest.get).toHaveBeenCalled()
    })
  })

  describe('loading indicator consistency', () => {
    it('should set loading true for login operations', async () => {
      const payload = { email: 'user@example.com', password: 'password123' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(URLSearchParams),
        expect.objectContaining({ loading: true })
      )
    })

    it('should set loading true for MFA operations', async () => {
      const payload = { code: '123456' }
      await authApi.getMfaQRCode(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: true })
      )
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for password update', async () => {
      const payload = { currentPassword: 'old', newPassword: 'new' }
      await authApi.updatePassword(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for MFA disable', async () => {
      const payload = { userId: 'user-123' }
      await authApi.disableMfaStatus(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle login with all optional parameters', async () => {
      const payload = {
        email: 'user@example.com',
        password: 'password123',
        code: '123456',
        rememberMeOnThisDevice: true,
        recovery_code: 'recovery123',
        captchaResponse: 'captcha-token',
        skipMfa: 'forced',
        mfa: { StatusName: 'Inactive', IsExpired: true }
      }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should handle SAML login with minimal parameters', async () => {
      const payload = { username: 'user@example.com', authcode: 'saml-code' }
      await authApi.loginWithSaml(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should handle two-step login verification', async () => {
      const payload = { code: '123456' }
      await authApi.twoStepLogin(payload)
      expect(request.post).toHaveBeenCalled()
    })

    it('should handle MFA operations with empty payload', async () => {
      await authApi.getMfaStatus({})
      expect(testRequest.get).toHaveBeenCalled()
    })
  })
})
