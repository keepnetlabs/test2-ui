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
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
  })
})
