import {
  searchCompanies,
  searchGroupCompanies,
  getMyCompanies,
  exportCompanies,
  deleteCompany,
  getCompanyByID,
  searchCompanyGroups,
  createCompanyGroups
} from '@/api/company'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('company API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchCompanies', () => {
    it('calls POST /companies/search', async () => {
      await searchCompanies({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/companies/search', { page: 1 })
    })
  })

  describe('searchGroupCompanies', () => {
    it('calls POST with group id', async () => {
      await searchGroupCompanies('grp-1', { page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/company-groups/grp-1/companies/search',
        { page: 1 }
      )
    })
  })

  describe('getMyCompanies', () => {
    it('calls GET /companies/my', async () => {
      await getMyCompanies()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/my')
    })
  })

  describe('exportCompanies', () => {
    it('calls POST with blob', async () => {
      await exportCompanies({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
  })

  describe('deleteCompany', () => {
    it('calls DELETE with snackbar', async () => {
      await deleteCompany('comp-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        'companies/comp-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getCompanyByID', () => {
    it('calls GET with loading true by default', async () => {
      await getCompanyByID('comp-1')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/comp-1', { loading: true })
    })
    it('calls GET with loading false when passed', async () => {
      await getCompanyByID('comp-1', false)
      expect(testRequest.get).toHaveBeenCalledWith('/companies/comp-1', { loading: false })
    })
  })

  describe('searchCompanyGroups', () => {
    it('calls POST search', async () => {
      await searchCompanyGroups({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/search', { page: 1 })
    })
  })

  describe('createCompanyGroups', () => {
    it('calls POST with snackbar', async () => {
      await createCompanyGroups({ name: 'Group1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/company-groups',
        { name: 'Group1' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })
})
