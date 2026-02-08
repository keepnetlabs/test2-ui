jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

    it('should handle numeric and string IDs', async () => {
      await scimSettingsApi.getSCIMSetting(123)
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/123`)

      testRequest.get.mockClear()
      await scimSettingsApi.getSCIMSetting('scim-xyz')
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/scim-xyz`)
    })

    it('should handle SCIM endpoint URLs with special characters', async () => {
      const payload = {
        name: 'SCIM',
        endpoint: 'https://example.com/scim/v2?auth=token'
      }
      await scimSettingsApi.createSCIMSetting(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('searchSCIMSettings should return thenable', () => {
      const result = scimSettingsApi.searchSCIMSettings({})
      expect(typeof result.then).toBe('function')
    })

    it('getSCIMSetting should return thenable', () => {
      const result = scimSettingsApi.getSCIMSetting('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getSCIMFields should return thenable', () => {
      const result = scimSettingsApi.getSCIMFields()
      expect(typeof result.then).toBe('function')
    })

    it('createSCIMSetting should return thenable', () => {
      const result = scimSettingsApi.createSCIMSetting({})
      expect(typeof result.then).toBe('function')
    })

    it('updateSCIMSetting should return thenable', () => {
      const result = scimSettingsApi.updateSCIMSetting({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('deleteSCIMSetting should return thenable', () => {
      const result = scimSettingsApi.deleteSCIMSetting('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('revokeSCIMSetting should return thenable', () => {
      const result = scimSettingsApi.revokeSCIMSetting('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('exportSCIMSettings should return thenable', () => {
      const result = scimSettingsApi.exportSCIMSettings({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof scimSettingsApi.searchSCIMSettings).toBe('function')
      expect(typeof scimSettingsApi.getSCIMSetting).toBe('function')
      expect(typeof scimSettingsApi.getSCIMFields).toBe('function')
      expect(typeof scimSettingsApi.createSCIMSetting).toBe('function')
      expect(typeof scimSettingsApi.updateSCIMSetting).toBe('function')
      expect(typeof scimSettingsApi.deleteSCIMSetting).toBe('function')
      expect(typeof scimSettingsApi.revokeSCIMSetting).toBe('function')
      expect(typeof scimSettingsApi.exportSCIMSettings).toBe('function')
    })

    it('should export at least 8 functions', () => {
      const functions = Object.values(scimSettingsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(8)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle SCIM settings CRUD workflow', async () => {
      await scimSettingsApi.searchSCIMSettings({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await scimSettingsApi.createSCIMSetting({ name: 'SCIM Config' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await scimSettingsApi.getSCIMSetting('scim-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await scimSettingsApi.updateSCIMSetting({ name: 'Updated' }, 'scim-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await scimSettingsApi.deleteSCIMSetting('scim-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle SCIM revoke workflow', async () => {
      await scimSettingsApi.revokeSCIMSetting('scim-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel SCIM operations', async () => {
      const results = await Promise.all([
        scimSettingsApi.searchSCIMSettings({}),
        scimSettingsApi.getSCIMFields(),
        scimSettingsApi.getSCIMSetting('scim-1')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle SCIM creation with full configuration', async () => {
      const payload = {
        name: 'SCIM Integration',
        endpoint: 'https://example.com/scim/v2',
        token: 'bearer-abc123',
        mappings: { email: 'mail' }
      }
      await scimSettingsApi.createSCIMSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}`, payload)
    })

    it('should handle SCIM update with resourceId', async () => {
      const payload = {
        name: 'Updated SCIM',
        endpoint: 'https://example.com/scim/v2'
      }
      await scimSettingsApi.updateSCIMSetting(payload, 'scim-123')
      expect(testRequest.put).toHaveBeenCalledWith(`${URL}/scim-123`, payload, expect.any(Object))
    })

    it('should handle search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await scimSettingsApi.searchSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, payload)
    })

    it('should handle export with filters', async () => {
      const payload = {
        filters: {
          status: ['active'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await scimSettingsApi.exportSCIMSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search/export`, payload, expect.any(Object))
    })

    it('should handle get with different ID formats', async () => {
      const numericId = 123
      await scimSettingsApi.getSCIMSetting(numericId)
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/${numericId}`)
    })

    it('should handle revoke operation with ID', async () => {
      const id = 'scim-456'
      await scimSettingsApi.revokeSCIMSetting(id)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/${id}/revoke`, {}, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchSCIMSettings errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.searchSCIMSettings({})).rejects.toThrow('Search failed')
    })

    it('should propagate getSCIMSetting errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.getSCIMSetting('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate getSCIMFields errors', async () => {
      const error = new Error('Fields fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.getSCIMFields()).rejects.toThrow('Fields fetch failed')
    })

    it('should propagate createSCIMSetting errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.createSCIMSetting({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateSCIMSetting errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.updateSCIMSetting({}, 'id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate deleteSCIMSetting errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.deleteSCIMSetting('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate revokeSCIMSetting errors', async () => {
      const error = new Error('Revoke failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.revokeSCIMSetting('id-1')).rejects.toThrow('Revoke failed')
    })

    it('should propagate exportSCIMSettings errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scimSettingsApi.exportSCIMSettings({})).rejects.toThrow('Export failed')
    })
  })
})
