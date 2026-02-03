jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as siemIntegrationsApi from '@/api/siemIntegrations'

describe('siemIntegrations API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('SIEM integration search and retrieval', () => {
    it('should call searchSIEMIntegrations', async () => {
      const payload = { page: 1 }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search',
        payload
      )
    })

    it('should call searchSIEMIntegrations with empty payload', async () => {
      await siemIntegrationsApi.searchSIEMIntegrations()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search',
        {}
      )
    })

    it('should call getSIEMIntegration', async () => {
      const resourceId = 'siem-123'
      await siemIntegrationsApi.getSIEMIntegration(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/siem-settings/${resourceId}`
      )
    })

    it('should call getSIEMIntegration with empty resourceId', async () => {
      await siemIntegrationsApi.getSIEMIntegration()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/siem-settings/')
    })
  })

  describe('SIEM integration management', () => {
    it('should call createSIEMIntegration', async () => {
      const payload = { name: 'SIEM Config' }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createSIEMIntegration with empty payload', async () => {
      await siemIntegrationsApi.createSIEMIntegration()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSIEMIntegration', async () => {
      const payload = { name: 'Updated SIEM' }
      const resourceId = 'siem-123'
      await siemIntegrationsApi.updateSIEMIntegration(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/companies/siem-settings/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSIEMIntegration with empty resourceId', async () => {
      const payload = { name: 'Updated SIEM' }
      await siemIntegrationsApi.updateSIEMIntegration('', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/siem-settings/',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSIEMIntegration', async () => {
      const resourceId = 'siem-123'
      await siemIntegrationsApi.deleteSIEMIntegration(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/companies/siem-settings/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSIEMIntegration with empty resourceId', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/companies/siem-settings/',
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SIEM connection testing', () => {
    it('should call testSIEMIntegration', async () => {
      const payload = { endpoint: 'https://siem.example.com' }
      await siemIntegrationsApi.testSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/test',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testSIEMIntegration with empty payload', async () => {
      await siemIntegrationsApi.testSIEMIntegration()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/test',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SIEM export operations', () => {
    it('should call exportSIEMIntegrations', async () => {
      const payload = { filters: {} }
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportSIEMIntegrations with empty payload', async () => {
      await siemIntegrationsApi.exportSIEMIntegrations()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'siem-123'
      await siemIntegrationsApi.getSIEMIntegration(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await siemIntegrationsApi.updateSIEMIntegration('siem-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration('siem-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'SIEM Config' }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await siemIntegrationsApi.updateSIEMIntegration('siem-123', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration('siem-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for test operations', async () => {
      const payload = { endpoint: 'https://siem.example.com' }
      await siemIntegrationsApi.testSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchSIEMIntegrations with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          status: ['active', 'inactive'],
          type: ['splunk', 'elastic', 'qradar'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM creation with Splunk configuration', async () => {
      const payload = {
        name: 'Splunk Integration',
        type: 'splunk',
        endpoint: 'https://splunk.example.com:8089',
        username: 'admin',
        password: 'splunk-password'
      }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM creation with Elastic configuration', async () => {
      const payload = {
        name: 'Elastic Integration',
        type: 'elastic',
        endpoint: 'https://elastic.example.com:9200',
        username: 'elastic',
        password: 'elastic-password'
      }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM update with partial fields', async () => {
      const payload = {
        name: 'Updated SIEM Name'
      }
      await siemIntegrationsApi.updateSIEMIntegration('siem-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle SIEM connection test with credentials', async () => {
      const payload = {
        endpoint: 'https://qradar.example.com',
        apiKey: 'qradar-api-key-123',
        verifySSL: false
      }
      await siemIntegrationsApi.testSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportSIEMIntegrations with date range filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active'],
          type: ['splunk']
        }
      }
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM deletion with confirmation', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration('siem-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle pagination in SIEM search', async () => {
      const payload = {
        page: 2,
        pageSize: 50,
        sort: { field: 'name', direction: 'asc' }
      }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
