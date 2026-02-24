jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as samlSettingsApi from '@/api/samlSettings'

describe('samlSettings API', () => {
  const BASE_URL = '/companies/saml-settings'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('SAML settings search and retrieval', () => {
    it('should call searchSamlSettings', async () => {
      const payload = { page: 1 }
      await samlSettingsApi.searchSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${BASE_URL}/search`, payload)
    })

    it('should call searchSamlSettings with empty payload', async () => {
      await samlSettingsApi.searchSamlSettings()
      expect(testRequest.post).toHaveBeenCalledWith(`${BASE_URL}/search`, {})
    })

    it('should call getDefaultSamlSettings', async () => {
      await samlSettingsApi.getDefaultSamlSettings()
      expect(testRequest.get).toHaveBeenCalledWith(`${BASE_URL}/default`)
    })

    it('should call getSamlSetting', async () => {
      const resourceId = 'saml-123'
      await samlSettingsApi.getSamlSetting(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`${BASE_URL}/${resourceId}`)
    })

    it('should call getSamlSetting with default resourceId', async () => {
      await samlSettingsApi.getSamlSetting()
      expect(testRequest.get).toHaveBeenCalledWith(`${BASE_URL}/`)
    })
  })

  describe('SAML settings management', () => {
    it('should call createSamlSetting', async () => {
      const payload = { name: 'SAML Config' }
      await samlSettingsApi.createSamlSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createSamlSetting with empty payload', async () => {
      await samlSettingsApi.createSamlSetting()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSamlSetting', async () => {
      const payload = { name: 'Updated SAML' }
      const resourceId = 'saml-123'
      await samlSettingsApi.updateSamlSetting(payload, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${BASE_URL}/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSamlSetting with empty payload', async () => {
      const resourceId = 'saml-123'
      await samlSettingsApi.updateSamlSetting({}, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${BASE_URL}/${resourceId}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSamlSetting with default resourceId', async () => {
      const payload = { name: 'Updated' }
      await samlSettingsApi.updateSamlSetting(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${BASE_URL}/`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSamlSettings', async () => {
      const resourceId = 'saml-123'
      await samlSettingsApi.deleteSamlSettings(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${BASE_URL}/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSamlSettings with default resourceId', async () => {
      await samlSettingsApi.deleteSamlSettings()
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${BASE_URL}/`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SAML metadata operations', () => {
    it('should call parseMetadata', async () => {
      const payload = new FormData()
      await samlSettingsApi.parseMetadata(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}/parse-metadata-file`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call downloadMetadata', async () => {
      const entityId = 'entity-123'
      await samlSettingsApi.downloadMetadata(entityId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `${BASE_URL}/download-metadata`,
        {
          params: { entityId },
          responseType: 'blob'
        }
      )
    })

    it('should call downloadMetadata with empty entityId', async () => {
      await samlSettingsApi.downloadMetadata()
      expect(testRequest.get).toHaveBeenCalledWith(
        `${BASE_URL}/download-metadata`,
        {
          params: { entityId: '' },
          responseType: 'blob'
        }
      )
    })
  })

  describe('SAML export operations', () => {
    it('should call exportSamlSettings', async () => {
      const payload = { filters: {} }
      await samlSettingsApi.exportSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportSamlSettings with empty payload', async () => {
      await samlSettingsApi.exportSamlSettings()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}/search/export`,
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'saml-123'
      await samlSettingsApi.getSamlSetting(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await samlSettingsApi.searchSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await samlSettingsApi.updateSamlSetting(payload, 'saml-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await samlSettingsApi.deleteSamlSettings('saml-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'SAML Config' }
      await samlSettingsApi.createSamlSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await samlSettingsApi.updateSamlSetting(payload, 'saml-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await samlSettingsApi.deleteSamlSettings('saml-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for metadata parsing', async () => {
      const payload = new FormData()
      await samlSettingsApi.parseMetadata(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for metadata download', async () => {
      const entityId = 'entity-123'
      await samlSettingsApi.downloadMetadata(entityId)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await samlSettingsApi.exportSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchSamlSettings with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          status: ['active', 'inactive'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await samlSettingsApi.searchSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SAML creation with full configuration', async () => {
      const payload = {
        name: 'Corporate SAML',
        entityId: 'https://company.okta.com',
        ssoUrl: 'https://company.okta.com/sso',
        certificate: 'cert-content'
      }
      await samlSettingsApi.createSamlSetting(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle metadata file parsing', async () => {
      const formData = new FormData()
      formData.append('file', new File(['<xml></xml>'], 'metadata.xml'))
      await samlSettingsApi.parseMetadata(formData)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle metadata download with special entity ID', async () => {
      const entityId = 'https://company.example.com/saml'
      await samlSettingsApi.downloadMetadata(entityId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle exportSamlSettings with date range', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active']
        }
      }
      await samlSettingsApi.exportSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle numeric and string IDs', async () => {
      await samlSettingsApi.getSamlSetting(123)
      expect(testRequest.get).toHaveBeenCalledWith(`${BASE_URL}/123`)

      testRequest.get.mockClear()
      await samlSettingsApi.getSamlSetting('saml-xyz')
      expect(testRequest.get).toHaveBeenCalledWith(`${BASE_URL}/saml-xyz`)
    })

    it('should handle default settings retrieval', async () => {
      await samlSettingsApi.getDefaultSamlSettings()
      expect(testRequest.get).toHaveBeenCalledWith(`${BASE_URL}/default`)
    })
  })

  describe('return values', () => {
    it('searchSamlSettings should return thenable', () => {
      const result = samlSettingsApi.searchSamlSettings({})
      expect(typeof result.then).toBe('function')
    })

    it('getDefaultSamlSettings should return thenable', () => {
      const result = samlSettingsApi.getDefaultSamlSettings()
      expect(typeof result.then).toBe('function')
    })

    it('getSamlSetting should return thenable', () => {
      const result = samlSettingsApi.getSamlSetting('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('createSamlSetting should return thenable', () => {
      const result = samlSettingsApi.createSamlSetting({})
      expect(typeof result.then).toBe('function')
    })

    it('updateSamlSetting should return thenable', () => {
      const result = samlSettingsApi.updateSamlSetting({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('deleteSamlSettings should return thenable', () => {
      const result = samlSettingsApi.deleteSamlSettings('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('parseMetadata should return thenable', () => {
      const result = samlSettingsApi.parseMetadata(new FormData())
      expect(typeof result.then).toBe('function')
    })

    it('downloadMetadata should return thenable', () => {
      const result = samlSettingsApi.downloadMetadata('entity-1')
      expect(typeof result.then).toBe('function')
    })

    it('exportSamlSettings should return thenable', () => {
      const result = samlSettingsApi.exportSamlSettings({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof samlSettingsApi.searchSamlSettings).toBe('function')
      expect(typeof samlSettingsApi.getDefaultSamlSettings).toBe('function')
      expect(typeof samlSettingsApi.getSamlSetting).toBe('function')
      expect(typeof samlSettingsApi.createSamlSetting).toBe('function')
      expect(typeof samlSettingsApi.updateSamlSetting).toBe('function')
      expect(typeof samlSettingsApi.deleteSamlSettings).toBe('function')
      expect(typeof samlSettingsApi.parseMetadata).toBe('function')
      expect(typeof samlSettingsApi.downloadMetadata).toBe('function')
      expect(typeof samlSettingsApi.exportSamlSettings).toBe('function')
    })

    it('should export at least 9 functions', () => {
      const functions = Object.values(samlSettingsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(9)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle SAML settings CRUD workflow', async () => {
      await samlSettingsApi.searchSamlSettings({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await samlSettingsApi.createSamlSetting({ name: 'SAML Config' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await samlSettingsApi.getSamlSetting('saml-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await samlSettingsApi.updateSamlSetting({ name: 'Updated' }, 'saml-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await samlSettingsApi.deleteSamlSettings('saml-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle SAML metadata workflow', async () => {
      await samlSettingsApi.getDefaultSamlSettings()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await samlSettingsApi.downloadMetadata('entity-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await samlSettingsApi.parseMetadata(new FormData())
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel SAML operations', async () => {
      const results = await Promise.all([
        samlSettingsApi.searchSamlSettings({}),
        samlSettingsApi.getDefaultSamlSettings(),
        samlSettingsApi.getSamlSetting('saml-1')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle SAML creation with full configuration', async () => {
      const payload = {
        name: 'Corporate SAML',
        entityId: 'https://company.okta.com',
        ssoUrl: 'https://company.okta.com/sso',
        certificate: 'cert-data'
      }
      await samlSettingsApi.createSamlSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle SAML update with resourceId', async () => {
      const payload = { name: 'Updated SAML' }
      const resourceId = 'saml-123'
      await samlSettingsApi.updateSamlSetting(payload, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${BASE_URL}/${resourceId}`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await samlSettingsApi.searchSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${BASE_URL}/search`, payload)
    })

    it('should handle metadata download with entity ID parameter', async () => {
      const entityId = 'https://company.example.com/saml'
      await samlSettingsApi.downloadMetadata(entityId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `${BASE_URL}/download-metadata`,
        expect.objectContaining({
          params: { entityId }
        })
      )
    })

    it('should handle parseMetadata with FormData', async () => {
      const formData = new FormData()
      formData.append('file', new File(['metadata'], 'metadata.xml'))
      await samlSettingsApi.parseMetadata(formData)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}/parse-metadata-file`,
        formData,
        expect.any(Object)
      )
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['active'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await samlSettingsApi.exportSamlSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${BASE_URL}/search/export`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle different ID formats', async () => {
      await samlSettingsApi.deleteSamlSettings(456)
      expect(testRequest.delete).toHaveBeenCalledWith(`${BASE_URL}/456`, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchSamlSettings errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.searchSamlSettings({})).rejects.toThrow('Search failed')
    })

    it('should propagate getDefaultSamlSettings errors', async () => {
      const error = new Error('Default settings fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.getDefaultSamlSettings()).rejects.toThrow('Default settings fetch failed')
    })

    it('should propagate getSamlSetting errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.getSamlSetting('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate createSamlSetting errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.createSamlSetting({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateSamlSetting errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.updateSamlSetting({}, 'id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate deleteSamlSettings errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.deleteSamlSettings('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate parseMetadata errors', async () => {
      const error = new Error('Metadata parsing failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.parseMetadata(new FormData())).rejects.toThrow('Metadata parsing failed')
    })

    it('should propagate downloadMetadata errors', async () => {
      const error = new Error('Metadata download failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.downloadMetadata('id-1')).rejects.toThrow('Metadata download failed')
    })

    it('should propagate exportSamlSettings errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(samlSettingsApi.exportSamlSettings({})).rejects.toThrow('Export failed')
    })
  })
})
