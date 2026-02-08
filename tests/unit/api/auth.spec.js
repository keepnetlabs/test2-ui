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

    it('should handle special characters in email', async () => {
      const payload = { email: 'user+test@example.com', password: 'pass' }
      await authApi.loginAction(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should handle various MFA code formats', async () => {
      const codes = ['123456', '000000', '999999']
      for (const code of codes) {
        authTestRequest.post.mockClear()
        const payload = { code }
        await authApi.setMFA(payload)
        expect(testRequest.put).toHaveBeenCalled()
      }
    })

    it('should handle different phone number formats', async () => {
      const phones = ['+1234567890', '1234567890', '+44-20-1234-5678']
      for (const phone of phones) {
        testRequest.post.mockClear()
        await authApi.cantLogin({ phoneNumber: phone })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle UUID storage and retrieval', async () => {
      const uuid = { email: 'user@example.com', uuid: 'stored-uuid-123' }
      mockStorage.setItem('uuid', JSON.stringify(uuid))
      const stored = mockStorage.getItem('uuid')
      expect(stored).toBe(JSON.stringify(uuid))
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        authApi.loginAction({ email: 'test@test.com', password: 'pass' }),
        authApi.loginWithSaml({ username: 'user', authcode: 'code' }),
        authApi.loginWithUsername({ username: 'user', password: 'pass' }),
        authApi.twoStepLogin({ code: '123456' }),
        authApi.resetPassword('email@test.com'),
        authApi.createPasswordByToken({ token: 'token', password: 'pass' }),
        authApi.resetPasswordByToken({ token: 'token', password: 'pass' }),
        authApi.updatePassword({ currentPassword: 'old', newPassword: 'new' }),
        authApi.getMfaQRCode({ userId: 'user-1' }),
        authApi.setMFA({ code: '123456' }),
        authApi.setMfaResync({ code: '123456' }),
        authApi.cantLogin({ phoneNumber: '+1234567890' }),
        authApi.getMfaStatus({}),
        authApi.getMfaSetup({}),
        authApi.disableMfaStatus({ userId: 'user-1' }),
        authApi.getAgentLoginUrl({ agentId: 'agent-1' })
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof authApi.loginAction).toBe('function')
      expect(typeof authApi.loginWithSaml).toBe('function')
      expect(typeof authApi.loginWithUsername).toBe('function')
      expect(typeof authApi.twoStepLogin).toBe('function')
      expect(typeof authApi.resetPassword).toBe('function')
      expect(typeof authApi.createPasswordByToken).toBe('function')
      expect(typeof authApi.resetPasswordByToken).toBe('function')
      expect(typeof authApi.updatePassword).toBe('function')
      expect(typeof authApi.getMfaQRCode).toBe('function')
      expect(typeof authApi.setMFA).toBe('function')
      expect(typeof authApi.setMfaResync).toBe('function')
      expect(typeof authApi.cantLogin).toBe('function')
      expect(typeof authApi.getMfaStatus).toBe('function')
      expect(typeof authApi.getMfaSetup).toBe('function')
      expect(typeof authApi.disableMfaStatus).toBe('function')
      expect(typeof authApi.getAgentLoginUrl).toBe('function')
    })

    it('should export at least 16 functions', () => {
      const functions = Object.values(authApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(16)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle complete login workflow', async () => {
      const loginPayload = { email: 'user@example.com', password: 'password123' }
      await authApi.loginAction(loginPayload)
      expect(authTestRequest.post).toHaveBeenCalledTimes(1)

      authTestRequest.post.mockClear()
      const mfaPayload = { code: '123456' }
      await authApi.setMFA(mfaPayload)
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle MFA setup and verification workflow', async () => {
      await authApi.getMfaSetup({})
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await authApi.getMfaQRCode({ userId: 'user-1' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await authApi.setMFA({ code: '123456' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle password reset workflow', async () => {
      await authApi.resetPassword('user@example.com')
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      const payload = { token: 'reset-token', password: 'newpassword' }
      await authApi.resetPasswordByToken(payload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel authentication operations', async () => {
      const results = await Promise.all([
        authApi.getMfaStatus({}),
        authApi.getMfaSetup({}),
        authApi.getAgentLoginUrl({ agentId: 'agent-1' })
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle login with various email formats', async () => {
      const emails = [
        'user@example.com',
        'user+tag@example.co.uk',
        'first.last@subdomain.example.com',
        'user123@example-domain.com'
      ]

      for (const email of emails) {
        authTestRequest.post.mockClear()
        const payload = { email, password: 'password' }
        await authApi.loginAction(payload)
        expect(authTestRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle password reset with email parameter', async () => {
      const emails = ['user@example.com', 'test@test.com', 'admin@company.org']

      for (const email of emails) {
        testRequest.post.mockClear()
        await authApi.resetPassword(email)
        expect(testRequest.post).toHaveBeenCalledWith(
          'system-users/send-reset-password-link',
          expect.objectContaining({ Email: email })
        )
      }
    })

    it('should handle MFA operations with user IDs', async () => {
      const userIds = ['user-123', 'user-456', 'admin-789']

      for (const userId of userIds) {
        testRequest.post.mockClear()
        await authApi.getMfaQRCode({ userId })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle password change with complex payloads', async () => {
      const payload = {
        currentPassword: 'ComplexPassword123!@#',
        newPassword: 'NewComplexPassword456!@#'
      }
      await authApi.updatePassword(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/change-password',
        payload,
        expect.any(Object)
      )
    })

    it('should handle agent login with various agent IDs', async () => {
      const agentIds = ['agent-123', 'agent-abc-def', 'service-agent-1']

      for (const agentId of agentIds) {
        testRequest.post.mockClear()
        await authApi.getAgentLoginUrl({ agentId })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle two-step login with numeric codes', async () => {
      const codes = ['000000', '123456', '999999']

      for (const code of codes) {
        request.post.mockClear()
        await authApi.twoStepLogin({ code })
        expect(request.post).toHaveBeenCalled()
      }
    })
  })

  describe('Error Handling', () => {
    it('should propagate loginAction errors', async () => {
      const error = new Error('Login failed')
      authTestRequest.post.mockRejectedValueOnce(error)
      await expect(authApi.loginAction({ email: 'test@test.com', password: 'pass' })).rejects.toThrow('Login failed')
    })

    it('should propagate loginWithSaml errors', async () => {
      const error = new Error('SAML authentication failed')
      authTestRequest.post.mockRejectedValueOnce(error)
      await expect(authApi.loginWithSaml({ username: 'user', authcode: 'code' })).rejects.toThrow('SAML authentication failed')
    })

    it('should propagate loginWithUsername errors', async () => {
      const error = new Error('Username login failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(authApi.loginWithUsername({ username: 'user', password: 'pass' })).rejects.toThrow('Username login failed')
    })

    it('should propagate resetPassword errors', async () => {
      const error = new Error('Reset password request failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(authApi.resetPassword('test@test.com')).rejects.toThrow('Reset password request failed')
    })

    it('should propagate updatePassword errors', async () => {
      const error = new Error('Password update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(authApi.updatePassword({ currentPassword: 'old', newPassword: 'new' })).rejects.toThrow('Password update failed')
    })

    it('should propagate getMfaQRCode errors', async () => {
      const error = new Error('MFA QR code generation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(authApi.getMfaQRCode({ userId: 'user-1' })).rejects.toThrow('MFA QR code generation failed')
    })

    it('should propagate setMFA errors', async () => {
      const error = new Error('MFA setup failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(authApi.setMFA({ code: '123456' })).rejects.toThrow('MFA setup failed')
    })

    it('should propagate getMfaStatus errors', async () => {
      const error = new Error('MFA status retrieval failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(authApi.getMfaStatus({})).rejects.toThrow('MFA status retrieval failed')
    })

    it('should propagate twoStepLogin errors', async () => {
      const error = new Error('Two-step verification failed')
      request.post.mockRejectedValueOnce(error)
      await expect(authApi.twoStepLogin({ code: '123456' })).rejects.toThrow('Two-step verification failed')
    })

    it('should propagate disableMfaStatus errors', async () => {
      const error = new Error('MFA disable failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(authApi.disableMfaStatus({ userId: 'user-1' })).rejects.toThrow('MFA disable failed')
    })

    it('should propagate getAgentLoginUrl errors', async () => {
      const error = new Error('Agent login URL generation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(authApi.getAgentLoginUrl({ agentId: 'agent-1' })).rejects.toThrow('Agent login URL generation failed')
    })
  })
})
