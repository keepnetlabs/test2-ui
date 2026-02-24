import * as ldapApi from '@/api/ldap'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}))

describe('ldap API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getLDAPSettingDetailForMyCompany', () => {
    it('calls GET /ldap-setting/detail', async () => {
      await ldapApi.getLDAPSettingDetailForMyCompany()
      expect(testRequest.get).toHaveBeenCalledWith('/ldap-setting/detail')
    })
  })

  describe('testLDAPConnection', () => {
    it('calls POST with payload', async () => {
      const payload = { host: 'ldap.example.com' }
      await ldapApi.testLDAPConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-setting/test-connection', payload)
    })
  })

  describe('getLDAPFields', () => {
    it('calls GET /ldap-fields', async () => {
      await ldapApi.getLDAPFields()
      expect(testRequest.get).toHaveBeenCalledWith('/ldap-fields')
    })
  })

  describe('searchADUsers', () => {
    it('calls POST /active-directory/users', async () => {
      await ldapApi.searchADUsers({ query: 'john' })
      expect(testRequest.post).toHaveBeenCalledWith('/active-directory/users', { query: 'john' })
    })
  })

  describe('searchADGroups', () => {
    it('calls POST /active-directory/groups', async () => {
      await ldapApi.searchADGroups({ query: 'admins' })
      expect(testRequest.post).toHaveBeenCalledWith('/active-directory/groups', { query: 'admins' })
    })
  })

  describe('getTargetGroupsForLDAP', () => {
    it('calls GET /ldap-setting/target-groups', async () => {
      await ldapApi.getTargetGroupsForLDAP()
      expect(testRequest.get).toHaveBeenCalledWith('/ldap-setting/target-groups')
    })
  })
})
