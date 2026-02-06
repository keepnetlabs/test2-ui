jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

  describe('return values', () => {
    it('getGoogleAuthorizeLink should return thenable', () => {
      const result = googleUserProvisioningApi.getGoogleAuthorizeLink()
      expect(typeof result.then).toBe('function')
    })

    it('submitGoogleUserProvisioningInformation should return thenable', () => {
      const result = googleUserProvisioningApi.submitGoogleUserProvisioningInformation({ code: 'c', state: 's' })
      expect(typeof result.then).toBe('function')
    })

    it('getGoogleUserProvisioning should return thenable', () => {
      const result = googleUserProvisioningApi.getGoogleUserProvisioning()
      expect(typeof result.then).toBe('function')
    })

    it('getGoogleUserProvisioningGroups should return thenable', () => {
      const result = googleUserProvisioningApi.getGoogleUserProvisioningGroups()
      expect(typeof result.then).toBe('function')
    })

    it('getGoogleUserProvisioningOrganizationUnits should return thenable', () => {
      const result = googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits()
      expect(typeof result.then).toBe('function')
    })

    it('syncGoogleUserProvisioning should return thenable', () => {
      const result = googleUserProvisioningApi.syncGoogleUserProvisioning({})
      expect(typeof result.then).toBe('function')
    })

    it('manuallySyncGoogleUserProvisioning should return thenable', () => {
      const result = googleUserProvisioningApi.manuallySyncGoogleUserProvisioning({})
      expect(typeof result.then).toBe('function')
    })

    it('stopSyncGoogleUserProvisioning should return thenable', () => {
      const result = googleUserProvisioningApi.stopSyncGoogleUserProvisioning({})
      expect(typeof result.then).toBe('function')
    })

    it('unlinkGoogleUserProvisioning should return thenable', () => {
      const result = googleUserProvisioningApi.unlinkGoogleUserProvisioning()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 9 functions', () => {
      const functions = Object.values(googleUserProvisioningApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(9)
    })

    it('should have all Google provisioning functions', () => {
      expect(typeof googleUserProvisioningApi.getGoogleAuthorizeLink).toBe('function')
      expect(typeof googleUserProvisioningApi.submitGoogleUserProvisioningInformation).toBe('function')
      expect(typeof googleUserProvisioningApi.getGoogleUserProvisioning).toBe('function')
      expect(typeof googleUserProvisioningApi.getGoogleUserProvisioningGroups).toBe('function')
      expect(typeof googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits).toBe('function')
      expect(typeof googleUserProvisioningApi.syncGoogleUserProvisioning).toBe('function')
      expect(typeof googleUserProvisioningApi.manuallySyncGoogleUserProvisioning).toBe('function')
      expect(typeof googleUserProvisioningApi.stopSyncGoogleUserProvisioning).toBe('function')
      expect(typeof googleUserProvisioningApi.unlinkGoogleUserProvisioning).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle Google authorization workflow', async () => {
      // Get authorization link
      await googleUserProvisioningApi.getGoogleAuthorizeLink()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Submit authorization information
      testRequest.get.mockClear()
      await googleUserProvisioningApi.submitGoogleUserProvisioningInformation({ code: 'code-123', state: 'state-456' })
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle Google provisioning data retrieval workflow', async () => {
      // Get main provisioning data
      await googleUserProvisioningApi.getGoogleUserProvisioning()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Get groups
      testRequest.get.mockClear()
      await googleUserProvisioningApi.getGoogleUserProvisioningGroups()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Get organization units
      testRequest.get.mockClear()
      await googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle sync workflow', async () => {
      // Schedule sync
      await googleUserProvisioningApi.syncGoogleUserProvisioning({ schedule: 'daily' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Manually trigger sync
      testRequest.post.mockClear()
      await googleUserProvisioningApi.manuallySyncGoogleUserProvisioning({ force: true })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Stop sync
      testRequest.post.mockClear()
      await googleUserProvisioningApi.stopSyncGoogleUserProvisioning({ reason: 'Testing' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle unlink workflow', async () => {
      // Unlink Google provisioning
      await googleUserProvisioningApi.unlinkGoogleUserProvisioning()
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel data retrieval requests', async () => {
      const results = await Promise.all([
        googleUserProvisioningApi.getGoogleUserProvisioning(),
        googleUserProvisioningApi.getGoogleUserProvisioningGroups(),
        googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle authorization submission with code and state', async () => {
      const code = 'auth-code-123'
      const state = 'state-456'
      await googleUserProvisioningApi.submitGoogleUserProvisioningInformation({ code, state })
      expect(testRequest.get).toHaveBeenCalledWith(`/googleoauth/callback?Code=${code}&State=${state}`)
    })

    it('should handle sync with minimal payload', async () => {
      await googleUserProvisioningApi.syncGoogleUserProvisioning({})
      expect(testRequest.post).toHaveBeenCalledWith('/google-user-provisioning/sync', {}, expect.any(Object))
    })

    it('should handle sync with complex schedule payload', async () => {
      const payload = {
        schedule: 'weekly',
        dayOfWeek: 'Monday',
        time: '02:00',
        includeGroups: true,
        includeOrganizationUnits: true,
        includeUsers: true
      }
      await googleUserProvisioningApi.syncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/google-user-provisioning/sync', payload, expect.any(Object))
    })

    it('should handle manual sync with empty payload', async () => {
      await googleUserProvisioningApi.manuallySyncGoogleUserProvisioning({})
      expect(testRequest.post).toHaveBeenCalledWith('/google-user-provisioning/sync-now', {}, expect.any(Object))
    })

    it('should handle manual sync with force flag', async () => {
      const payload = { force: true, skipValidation: false }
      await googleUserProvisioningApi.manuallySyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/google-user-provisioning/sync-now', payload, expect.any(Object))
    })

    it('should handle stop sync with reason', async () => {
      const payload = { reason: 'Configuration change' }
      await googleUserProvisioningApi.stopSyncGoogleUserProvisioning(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/google-user-provisioning/sync-stop', payload, expect.any(Object))
    })

    it('should handle stop sync with empty payload', async () => {
      await googleUserProvisioningApi.stopSyncGoogleUserProvisioning({})
      expect(testRequest.post).toHaveBeenCalledWith('/google-user-provisioning/sync-stop', {}, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate getGoogleAuthorizeLink errors', async () => {
      const error = new Error('Authorization link fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.getGoogleAuthorizeLink()).rejects.toThrow('Authorization link fetch failed')
    })

    it('should propagate submitGoogleUserProvisioningInformation errors', async () => {
      const error = new Error('Callback submission failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.submitGoogleUserProvisioningInformation({ code: 'c', state: 's' })).rejects.toThrow('Callback submission failed')
    })

    it('should propagate getGoogleUserProvisioning errors', async () => {
      const error = new Error('Provisioning data fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.getGoogleUserProvisioning()).rejects.toThrow('Provisioning data fetch failed')
    })

    it('should propagate getGoogleUserProvisioningGroups errors', async () => {
      const error = new Error('Groups fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.getGoogleUserProvisioningGroups()).rejects.toThrow('Groups fetch failed')
    })

    it('should propagate getGoogleUserProvisioningOrganizationUnits errors', async () => {
      const error = new Error('Organization units fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.getGoogleUserProvisioningOrganizationUnits()).rejects.toThrow('Organization units fetch failed')
    })

    it('should propagate syncGoogleUserProvisioning errors', async () => {
      const error = new Error('Sync scheduling failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.syncGoogleUserProvisioning({})).rejects.toThrow('Sync scheduling failed')
    })

    it('should propagate manuallySyncGoogleUserProvisioning errors', async () => {
      const error = new Error('Manual sync failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.manuallySyncGoogleUserProvisioning({})).rejects.toThrow('Manual sync failed')
    })

    it('should propagate stopSyncGoogleUserProvisioning errors', async () => {
      const error = new Error('Stop sync failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.stopSyncGoogleUserProvisioning({})).rejects.toThrow('Stop sync failed')
    })

    it('should propagate unlinkGoogleUserProvisioning errors', async () => {
      const error = new Error('Unlink failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(googleUserProvisioningApi.unlinkGoogleUserProvisioning()).rejects.toThrow('Unlink failed')
    })
  })
})
