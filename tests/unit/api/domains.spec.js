jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as domainsApi from '@/api/domains'

describe('domains API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('domain operations', () => {
    it('should call getDomainsList', async () => {
      const payload = { page: 1 }
      await domainsApi.getDomainsList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/domain-records/search', payload)
    })

    it('should call createDomain', async () => {
      const payload = { name: 'example.com' }
      await domainsApi.createDomain(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateDomain', async () => {
      const id = 'domain-123'
      const payload = { name: 'example.com', ttl: 3600 }
      await domainsApi.updateDomain(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/domain-records/${id}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const id = 'domain-123'
      await domainsApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/domain-records/${id}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('domain configuration operations', () => {
    it('should call getDomainData', async () => {
      await domainsApi.getDomainData()
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/domain-records/form-details')
    })

    it('should call getDomainEditData', async () => {
      const resId = 'domain-123'
      await domainsApi.getDomainEditData(resId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/domain-records/${resId}`,
        { loading: true }
      )
    })

    it('should call testDomainConnection', async () => {
      const payload = { domain: 'example.com' }
      await domainsApi.testDomainConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/test',
        payload
      )
    })
  })

  describe('export operations', () => {
    it('should call exportDnsService', async () => {
      const payload = { filters: {} }
      await domainsApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await domainsApi.getDomainData()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await domainsApi.getDomainsList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'updated.com' }
      await domainsApi.updateDomain(payload, 'domain-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await domainsApi.deleteEmailTemplate('domain-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar and loading consistency', () => {
    it('should include loading for domain retrieval', async () => {
      const resId = 'domain-123'
      await domainsApi.getDomainEditData(resId)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ loading: true })
      )
    })

    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'example.com' }
      await domainsApi.createDomain(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should include loading and snackbar for updates', async () => {
      const payload = { name: 'updated.com' }
      await domainsApi.updateDomain(payload, 'domain-123')
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
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await domainsApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle domain creation with DNS records', async () => {
      const payload = {
        name: 'example.com',
        dnsRecords: [
          { type: 'A', value: '192.168.1.1' },
          { type: 'MX', value: 'mail.example.com' }
        ]
      }
      await domainsApi.createDomain(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle domain update with SSL configuration', async () => {
      const payload = {
        name: 'example.com',
        sslEnabled: true,
        sslCertificate: 'cert-123'
      }
      await domainsApi.updateDomain(payload, 'domain-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle domain connection test', async () => {
      const payload = {
        domain: 'subdomain.example.com',
        recordType: 'CNAME',
        expectedValue: 'target.example.com'
      }
      await domainsApi.testDomainConnection(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle domain export with date filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active', 'pending']
        }
      }
      await domainsApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
