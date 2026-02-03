jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as googleUserProvisioningApi from '@/api/googleUserProvisioning'

describe('googleUserProvisioning API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Google authorization operations', () => {
    it('should call getGoogleAuthorizeLink', async () => {
      await googleUserProvisioningApi.getGoogleAuthorizeLink()
      expect(testRequest.get).toHaveBeenCalledWith('/googleoauth/authorize')
    })

    it('should call submitGoogleUserProvisioningInformation', async () => {
      const code = 'auth-code-123'
      const state = 'state-456'
      await googleUserProvisioningApi.submitGoogleUserProvisioningInformation({
        code,
        state
      })
      expect(testRequest.get).toHaveBeenCalledWith(
        `/googleoauth/callback?Code=${code}&State=${state}`
      )
    })
  })

  describe('Google user provisioning data retrieval', () => {
    it('should call getGoogleUserProvisioning', async () => {
      await googleUserProvisioningApi.getGoogleUserProvisioning()
      expect(testRequest.get).toHaveBeenCalledWith('/google-user-provisioning')
    })

    it('should call getGoogleUserProvisioningGroups', async () => {
      await googleUserProvisioningApi.getGoogleUserProvisioningGroups()
      expect(testRequest.get).toHaveBeenCalledWith('/google-user-provisioning/group')
    })

    it('should call getGoogleUserProvisioningOrganizationUnits', async () => {
      await googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits()
      expect(testRequest.get).toHaveBeenCalledWith('/google-user-provisioning/orgunit')
    })
  })

  describe('Google user provisioning sync operations', () => {
    it('should call syncGoogleUserProvisioning', async () => {
      const payload = { schedule: 'daily' }
      await googleUserProvisioningApi.syncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/google-user-provisioning/sync',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call manuallySyncGoogleUserProvisioning', async () => {
      const payload = { force: true }
      await googleUserProvisioningApi.manuallySyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/google-user-provisioning/sync-now',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopSyncGoogleUserProvisioning', async () => {
      const payload = { reason: 'Testing' }
      await googleUserProvisioningApi.stopSyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/google-user-provisioning/sync-stop',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('Google user provisioning unlink operations', () => {
    it('should call unlinkGoogleUserProvisioning', async () => {
      await googleUserProvisioningApi.unlinkGoogleUserProvisioning()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/googleoauth/revoke',
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await googleUserProvisioningApi.getGoogleAuthorizeLink()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for sync operations', async () => {
      const payload = { schedule: 'daily' }
      await googleUserProvisioningApi.syncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use DELETE for unlink operations', async () => {
      await googleUserProvisioningApi.unlinkGoogleUserProvisioning()
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for sync operations', async () => {
      const payload = { schedule: 'daily' }
      await googleUserProvisioningApi.syncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for manual sync', async () => {
      const payload = { force: true }
      await googleUserProvisioningApi.manuallySyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for stop sync', async () => {
      const payload = { reason: 'Testing' }
      await googleUserProvisioningApi.stopSyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for unlink', async () => {
      await googleUserProvisioningApi.unlinkGoogleUserProvisioning()
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle authorization callback with special characters', async () => {
      const code = 'auth-code-with-special-chars!@#'
      const state = 'state-with-special-chars!@#'
      await googleUserProvisioningApi.submitGoogleUserProvisioningInformation({
        code,
        state
      })
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle sync with complex payload', async () => {
      const payload = {
        schedule: 'custom',
        frequency: 'every 2 hours',
        includeGroups: true,
        includeOrganizationUnits: true
      }
      await googleUserProvisioningApi.syncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle manual sync with force flag', async () => {
      const payload = { force: true }
      await googleUserProvisioningApi.manuallySyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle stop sync with reason', async () => {
      const payload = { reason: 'Maintenance mode' }
      await googleUserProvisioningApi.stopSyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle retrieval of organization units', async () => {
      await googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits()
      expect(testRequest.get).toHaveBeenCalled()
    })
  })
})
