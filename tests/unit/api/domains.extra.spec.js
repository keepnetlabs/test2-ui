import * as domainsApi from '@/api/domains'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('domains API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDomainsList', () => {
    it('calls POST with payload', async () => {
      await domainsApi.getDomainsList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/search',
        { page: 1 }
      )
    })
  })

  describe('createDomain', () => {
    it('calls POST with snackbar config', async () => {
      await domainsApi.createDomain({ name: 'example.com' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records',
        { name: 'example.com' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getDomainData', () => {
    it('calls GET form-details', async () => {
      await domainsApi.getDomainData()
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/domain-records/form-details')
    })
  })

  describe('testDomainConnection', () => {
    it('calls POST test endpoint', async () => {
      await domainsApi.testDomainConnection({ domain: 'test.com' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/test',
        { domain: 'test.com' }
      )
    })
  })

  describe('updateDomain', () => {
    it('calls PUT with id and loading config', async () => {
      await domainsApi.updateDomain({ name: 'updated.com' }, 'res-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/res-123',
        { name: 'updated.com' },
        expect.objectContaining({ loading: true, snackbar: expect.anything() })
      )
    })
  })

  describe('deleteEmailTemplate', () => {
    it('calls DELETE with id', async () => {
      await domainsApi.deleteEmailTemplate('id-456')
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/id-456',
        expect.objectContaining({ loading: true, snackbar: expect.anything() })
      )
    })
  })

  describe('exportDnsService', () => {
    it('calls POST export with responseType blob', async () => {
      await domainsApi.exportDnsService({ filter: {} })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/search/export',
        { filter: {} },
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('getDomainEditData', () => {
    it('calls GET with resource id', async () => {
      await domainsApi.getDomainEditData('edit-res-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/domain-records/edit-res-1',
        expect.objectContaining({ loading: true })
      )
    })
  })
})
