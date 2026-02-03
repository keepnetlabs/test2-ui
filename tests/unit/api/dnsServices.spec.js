jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as dnsServicesApi from '@/api/dnsServices'

describe('dnsServices API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DNS service operations', () => {
    it('should call getDnsServiceList', async () => {
      const payload = { page: 1 }
      await dnsServicesApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/search', payload)
    })

    it('should call createDnsServiceList', async () => {
      const payload = { name: 'DNS Service', provider: 'Route53' }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDnsService', async () => {
      const id = 'dns-123'
      await dnsServicesApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}`,
        { loading: true }
      )
    })

    it('should call updateDnsServiceList', async () => {
      const id = 'dns-123'
      const payload = { name: 'Updated Service' }
      await dnsServicesApi.updateDnsServiceList(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const id = 'dns-123'
      await dnsServicesApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('DNS connection testing', () => {
    it('should call testConnection', async () => {
      const id = 'dns-123'
      const payload = { testData: 'test' }
      await dnsServicesApi.testConnection(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}/test`,
        payload
      )
    })
  })

  describe('export operations', () => {
    it('should call exportDnsService', async () => {
      const payload = { filters: {} }
      await dnsServicesApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'dns-123'
      await dnsServicesApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await dnsServicesApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await dnsServicesApi.deleteEmailTemplate('dns-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar and loading consistency', () => {
    it('should include loading flag for read operations', async () => {
      const id = 'dns-123'
      await dnsServicesApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ loading: true })
      )
    })

    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { name: 'New Service' }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should include loading and snackbar for updates', async () => {
      const payload = { name: 'Updated' }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          loading: true,
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for DNS service export', async () => {
      const payload = { filters: {} }
      await dnsServicesApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle DNS service creation with API credentials', async () => {
      const payload = {
        name: 'AWS Route53',
        provider: 'Route53',
        apiKey: 'key-123',
        apiSecret: 'secret-456'
      }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle DNS service update with new configuration', async () => {
      const payload = {
        name: 'Updated Service',
        configuration: { timeout: 30, retries: 3 }
      }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle connection test with DNS parameters', async () => {
      const payload = {
        hostname: 'example.com',
        recordType: 'A',
        expectedValue: '192.168.1.1'
      }
      await dnsServicesApi.testConnection(payload, 'dns-123')
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle DNS service deletion with confirmation', async () => {
      const id = 'dns-123'
      await dnsServicesApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          loading: true,
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })
})
