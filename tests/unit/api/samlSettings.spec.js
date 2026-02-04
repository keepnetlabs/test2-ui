jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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

    it('should call deleteSamlSettings', async () => {
      const resourceId = 'saml-123'
      await samlSettingsApi.deleteSamlSettings(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${BASE_URL}/${resourceId}`,
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
  })
})
