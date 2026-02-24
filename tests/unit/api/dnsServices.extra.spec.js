import * as dnsServicesApi from '@/api/dnsServices'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('dnsServices API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDnsServiceList', () => {
    it('calls POST with payload', async () => {
      await dnsServicesApi.getDnsServiceList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services/search',
        { page: 1 }
      )
    })
  })

  describe('createDnsServiceList', () => {
    it('calls POST with snackbar config', async () => {
      await dnsServicesApi.createDnsServiceList({ name: 'Test' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services',
        { name: 'Test' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('testConnection', () => {
    it('calls POST with id in path', async () => {
      await dnsServicesApi.testConnection({}, 'service-123')
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services/service-123/test',
        {}
      )
    })
  })

  describe('getDnsService', () => {
    it('calls GET with loading', async () => {
      await dnsServicesApi.getDnsService('id-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/dns-services/id-1',
        { loading: true }
      )
    })
  })

  describe('exportDnsService', () => {
    it('calls POST with blob responseType', async () => {
      await dnsServicesApi.exportDnsService({})
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })
})
