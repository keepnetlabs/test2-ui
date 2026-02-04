jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as scimSettingsApi from '@/api/scimSettings'

describe('scimSettings API', () => {
  const URL = '/scim'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('SCIM settings search and retrieval', () => {
    it('should call searchSCIMSettings', async () => {
      const payload = { page: 1 }
      await scimSettingsApi.searchSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, payload)
    })

    it('should call getSCIMSetting', async () => {
      const resourceId = 'scim-123'
      await scimSettingsApi.getSCIMSetting(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/${resourceId}`)
    })

    it('should call getSCIMSetting with empty resourceId', async () => {
      await scimSettingsApi.getSCIMSetting()
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/`)
    })

    it('should call getSCIMFields', async () => {
      await scimSettingsApi.getSCIMFields()
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/fields`)
    })
  })

  describe('SCIM settings management', () => {
    it('should call createSCIMSetting', async () => {
      const payload = { name: 'SCIM Config' }
      await scimSettingsApi.createSCIMSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}`, payload)
    })

    it('should call updateSCIMSetting', async () => {
      const payload = { name: 'Updated SCIM' }
      const resourceId = 'scim-123'
      await scimSettingsApi.updateSCIMSetting(payload, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${URL}/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSCIMSetting', async () => {
      const resourceId = 'scim-123'
      await scimSettingsApi.deleteSCIMSetting(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${URL}/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSCIMSetting with empty resourceId', async () => {
      await scimSettingsApi.deleteSCIMSetting()
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${URL}/`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SCIM operations', () => {
    it('should call revokeSCIMSetting', async () => {
      const resourceId = 'scim-123'
      await scimSettingsApi.revokeSCIMSetting(resourceId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${URL}/${resourceId}/revoke`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call revokeSCIMSetting with empty resourceId', async () => {
      await scimSettingsApi.revokeSCIMSetting()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${URL}//revoke`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SCIM export operations', () => {
    it('should call exportSCIMSettings', async () => {
      const payload = { filters: {} }
      await scimSettingsApi.exportSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${URL}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'scim-123'
      await scimSettingsApi.getSCIMSetting(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await scimSettingsApi.searchSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await scimSettingsApi.updateSCIMSetting(payload, 'scim-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await scimSettingsApi.deleteSCIMSetting('scim-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await scimSettingsApi.updateSCIMSetting(payload, 'scim-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await scimSettingsApi.deleteSCIMSetting('scim-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for revoke operations', async () => {
      await scimSettingsApi.revokeSCIMSetting('scim-123')
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        {},
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await scimSettingsApi.exportSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchSCIMSettings with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          status: ['active', 'provisioning'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await scimSettingsApi.searchSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SCIM creation with user attributes', async () => {
      const payload = {
        name: 'SCIM Integration',
        endpoint: 'https://example.com/scim',
        token: 'bearer-token-123'
      }
      await scimSettingsApi.createSCIMSetting(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SCIM update with field mappings', async () => {
      const payload = {
        name: 'Updated SCIM',
        mappings: {
          email: 'userPrincipalName',
          firstName: 'givenName',
          lastName: 'surname'
        }
      }
      await scimSettingsApi.updateSCIMSetting(payload, 'scim-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle getSCIMFields retrieval', async () => {
      await scimSettingsApi.getSCIMFields()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle exportSCIMSettings with date filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active']
        }
      }
      await scimSettingsApi.exportSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SCIM revoke operation', async () => {
      await scimSettingsApi.revokeSCIMSetting('scim-123')
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
