// Mock localStorage BEFORE importing modules that use it
const mockLocalStorage = {
  getItem: jest.fn((key) => {
    if (key === 'companyRequestId' || key === 'companyId') {
      return 'test-company-id'
    }
    return null
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true
})

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import microsoftTeamsSettingsApi from '@/api/microsoftTeamsSettings'

describe('microsoftTeamsSettings API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('test-company-id')
  })

  describe('Microsoft Teams check operations', () => {
    it('should call getMicrosoftTeamsSettings', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/teams-app/check',
        expect.any(Object)
      )
    })
  })

  describe('Microsoft Teams OBO integration operations', () => {
    it('should call getMicrosoftTeamsOboIntegrationLink', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsOboIntegrationLink()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/teams-obo/authorize-link',
        expect.any(Object)
      )
    })

    it('should call callMicrosoftTeamsOboCallback', async () => {
      const code = 'code-123'
      const state = 'state-456'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback(code, state)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/teams-obo/callback?code=${code}&state=${state}`
      )
    })
  })

  describe('Microsoft Teams app integration operations', () => {
    it('should call getMicrosoftTeamsAppAuthorizeLink', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsAppAuthorizeLink()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/teams-app/authorize-link',
        expect.any(Object)
      )
    })

    it('should call callMicrosoftTeamsAppCallback', async () => {
      const admin_consent = 'true'
      const tenant = 'tenant-123'
      const scope = 'user.read'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback(
        admin_consent,
        tenant,
        scope
      )
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/teams-app/callback?admin_consent=${admin_consent}&tenant=${tenant}&scope=${scope}`
      )
    })

    it('should call uploadMicrosoftTeamsSettings', async () => {
      await microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/teams-app/upload',
        expect.any(Object),
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call disableMicrosoftTeamsIntegration', async () => {
      await microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/companies/teams-app/remove',
        expect.objectContaining({
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('Microsoft Teams user operations', () => {
    it('should call installMicrosoftTeamsAppToUsers', async () => {
      await microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/teams-app/install-to-users',
        expect.any(Object),
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call sendTestMessage', async () => {
      const userEmail = 'user@example.com'
      await microsoftTeamsSettingsApi.sendTestMessage(userEmail)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/teams-app/send-test-activity',
        expect.any(Object),
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for callback operations', async () => {
      await microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback('code', 'state')
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for configuration and user operations', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use DELETE for disable operations', async () => {
      await microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for upload operations', async () => {
      await microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for install operations', async () => {
      await microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for test message operations', async () => {
      const userEmail = 'user@example.com'
      await microsoftTeamsSettingsApi.sendTestMessage(userEmail)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for disable operations', async () => {
      await microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('localStorage integration', () => {
    it('should call API methods', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle OBO callback with special characters in code and state', async () => {
      const code = 'code-with-special!@#'
      const state = 'state-with-special!@#'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback(code, state)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle app callback with multiple query parameters', async () => {
      const admin_consent = 'true'
      const tenant = 'tenant-123'
      const scope = 'user.read Team.Create'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback(
        admin_consent,
        tenant,
        scope
      )
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle test message to specific user', async () => {
      const userEmail = 'john.doe@company.com'
      await microsoftTeamsSettingsApi.sendTestMessage(userEmail)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ userEmail }),
        expect.any(Object)
      )
    })

    it('should handle installation to multiple users', async () => {
      await microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers()
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle integration enable/disable flow', async () => {
      // Enable
      await microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalled()

      // Disable
      jest.clearAllMocks()
      await microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle localStorage availability', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-company-id')
      await microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle empty localStorage values', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      await microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('getMicrosoftTeamsSettings should return thenable', () => {
      const result = microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(typeof result.then).toBe('function')
    })

    it('getMicrosoftTeamsOboIntegrationLink should return thenable', () => {
      const result = microsoftTeamsSettingsApi.getMicrosoftTeamsOboIntegrationLink()
      expect(typeof result.then).toBe('function')
    })

    it('callMicrosoftTeamsOboCallback should return thenable', () => {
      const result = microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback('code', 'state')
      expect(typeof result.then).toBe('function')
    })

    it('getMicrosoftTeamsAppAuthorizeLink should return thenable', () => {
      const result = microsoftTeamsSettingsApi.getMicrosoftTeamsAppAuthorizeLink()
      expect(typeof result.then).toBe('function')
    })

    it('callMicrosoftTeamsAppCallback should return thenable', () => {
      const result = microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback('true', 'tenant', 'scope')
      expect(typeof result.then).toBe('function')
    })

    it('uploadMicrosoftTeamsSettings should return thenable', () => {
      const result = microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings()
      expect(typeof result.then).toBe('function')
    })

    it('disableMicrosoftTeamsIntegration should return thenable', () => {
      const result = microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()
      expect(typeof result.then).toBe('function')
    })

    it('installMicrosoftTeamsAppToUsers should return thenable', () => {
      const result = microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers()
      expect(typeof result.then).toBe('function')
    })

    it('sendTestMessage should return thenable', () => {
      const result = microsoftTeamsSettingsApi.sendTestMessage('user@example.com')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof microsoftTeamsSettingsApi.getMicrosoftTeamsSettings).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.getMicrosoftTeamsOboIntegrationLink).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.getMicrosoftTeamsAppAuthorizeLink).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers).toBe('function')
      expect(typeof microsoftTeamsSettingsApi.sendTestMessage).toBe('function')
    })

    it('should export at least 9 functions', () => {
      const functions = Object.values(microsoftTeamsSettingsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(9)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle Teams OBO integration workflow', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsOboIntegrationLink()
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback('code-123', 'state-456')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle Teams app integration workflow', async () => {
      await microsoftTeamsSettingsApi.getMicrosoftTeamsAppAuthorizeLink()
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback('true', 'tenant-123', 'scope')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle Teams app installation and test workflow', async () => {
      await microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers()
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await microsoftTeamsSettingsApi.sendTestMessage('user@example.com')
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle Teams integration disable workflow', async () => {
      await microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel Teams operations', async () => {
      const results = await Promise.all([
        microsoftTeamsSettingsApi.getMicrosoftTeamsSettings(),
        microsoftTeamsSettingsApi.getMicrosoftTeamsAppAuthorizeLink()
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle callback with code and state parameters', async () => {
      const code = 'auth-code-abc123'
      const state = 'state-xyz789'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback(code, state)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/teams-obo/callback?code=${code}&state=${state}`
      )
    })

    it('should handle app callback with all parameters', async () => {
      const admin_consent = 'true'
      const tenant = 'tenant-id-123'
      const scope = 'user.read offline_access'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback(admin_consent, tenant, scope)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/teams-app/callback?admin_consent=${admin_consent}&tenant=${tenant}&scope=${scope}`
      )
    })

    it('should handle test message with user email', async () => {
      const userEmail = 'test.user@domain.com'
      await microsoftTeamsSettingsApi.sendTestMessage(userEmail)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ userEmail }),
        expect.any(Object)
      )
    })

    it('should handle localStorage company ID in API calls', async () => {
      mockLocalStorage.getItem.mockReturnValue('company-456')
      await microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle callback with special characters in parameters', async () => {
      const code = 'code-with-!@#$%'
      const state = 'state-with-!@#$%'
      await microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback(code, state)
      expect(testRequest.get).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should propagate getMicrosoftTeamsSettings errors', async () => {
      const error = new Error('Teams settings fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.getMicrosoftTeamsSettings()).rejects.toThrow('Teams settings fetch failed')
    })

    it('should propagate getMicrosoftTeamsOboIntegrationLink errors', async () => {
      const error = new Error('OBO link fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.getMicrosoftTeamsOboIntegrationLink()).rejects.toThrow('OBO link fetch failed')
    })

    it('should propagate callMicrosoftTeamsOboCallback errors', async () => {
      const error = new Error('OBO callback failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.callMicrosoftTeamsOboCallback('code', 'state')).rejects.toThrow('OBO callback failed')
    })

    it('should propagate getMicrosoftTeamsAppAuthorizeLink errors', async () => {
      const error = new Error('App link fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.getMicrosoftTeamsAppAuthorizeLink()).rejects.toThrow('App link fetch failed')
    })

    it('should propagate callMicrosoftTeamsAppCallback errors', async () => {
      const error = new Error('App callback failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.callMicrosoftTeamsAppCallback('true', 'tenant', 'scope')).rejects.toThrow('App callback failed')
    })

    it('should propagate uploadMicrosoftTeamsSettings errors', async () => {
      const error = new Error('Upload failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.uploadMicrosoftTeamsSettings()).rejects.toThrow('Upload failed')
    })

    it('should propagate disableMicrosoftTeamsIntegration errors', async () => {
      const error = new Error('Disable failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.disableMicrosoftTeamsIntegration()).rejects.toThrow('Disable failed')
    })

    it('should propagate installMicrosoftTeamsAppToUsers errors', async () => {
      const error = new Error('Installation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.installMicrosoftTeamsAppToUsers()).rejects.toThrow('Installation failed')
    })

    it('should propagate sendTestMessage errors', async () => {
      const error = new Error('Test message send failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(microsoftTeamsSettingsApi.sendTestMessage('user@example.com')).rejects.toThrow('Test message send failed')
    })
  })
})
