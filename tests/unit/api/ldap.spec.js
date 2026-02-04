jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import ldapApi from '@/api/ldap'

describe('ldap API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('LDAP settings operations', () => {
    it('should call getLDAPSettingDetailForMyCompany', async () => {
      await ldapApi.getLDAPSettingDetailForMyCompany()
      expect(testRequest.get).toHaveBeenCalledWith('/ldap-setting/detail')
    })

    it('should call createLDAPSetting', async () => {
      const payload = { serverAddress: 'ldap.example.com' }
      await ldapApi.createLDAPSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/ldap-setting',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateLDAPSetting', async () => {
      const resourceId = 'setting-123'
      const payload = { serverAddress: 'ldap.example.com' }
      await ldapApi.updateLDAPSetting(payload, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/ldap-setting/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testLDAPConnection', async () => {
      const payload = { serverAddress: 'ldap.example.com', username: 'admin' }
      await ldapApi.testLDAPConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-setting/test-connection', payload)
    })
  })

  describe('LDAP schedule operations', () => {
    it('should call searchLDAPSchedule', async () => {
      const payload = { page: 1 }
      await ldapApi.searchLDAPSchedule(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-schedule/search', payload)
    })

    it('should call updateLDAPSchedule', async () => {
      const resourceId = 'schedule-123'
      const payload = { frequency: 'daily' }
      await ldapApi.updateLDAPSchedule(payload, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/ldap-schedule/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteLDAPSchedule', async () => {
      const resourceId = 'schedule-123'
      await ldapApi.deleteLDAPSchedule(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/ldap-schedule/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getLDAPConfigDetail', async () => {
      const resourceId = 'schedule-123'
      await ldapApi.getLDAPConfigDetail(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`ldap-schedule/${resourceId}`)
    })
  })

  describe('Active Directory operations', () => {
    it('should call searchADUsers', async () => {
      const payload = { searchTerm: 'john' }
      await ldapApi.searchADUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/active-directory/users', payload)
    })

    it('should call searchADGroups', async () => {
      const payload = { searchTerm: 'admin' }
      await ldapApi.searchADGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/active-directory/groups', payload)
    })
  })

  describe('LDAP mapping operations', () => {
    it('should call createLDAPMapping', async () => {
      const payload = { mappings: {} }
      await ldapApi.createLDAPMapping(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-setting/mapping', payload)
    })

    it('should call checkLDAPMappingStatus', async () => {
      const resourceId = 'mapping-123'
      await ldapApi.checkLDAPMappingStatus(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`/ldap-setting/status/${resourceId}`)
    })

    it('should call searchTmpTargetUsersForLdap', async () => {
      const transactionId = 'transaction-123'
      const payload = { page: 1 }
      await ldapApi.searchTmpTargetUsersForLdap(payload, transactionId)
      expect(testRequest.post).toHaveBeenCalledWith(`/target-users/${transactionId}/search`, payload)
    })
  })

  describe('LDAP configuration operations', () => {
    it('should call createLDAPConfig', async () => {
      const payload = { config: {} }
      await ldapApi.createLDAPConfig(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/ldap-config',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getLDAPFields', async () => {
      await ldapApi.getLDAPFields()
      expect(testRequest.get).toHaveBeenCalledWith('/ldap-fields')
    })

    it('should call getTargetGroupsForLDAP', async () => {
      await ldapApi.getTargetGroupsForLDAP()
      expect(testRequest.get).toHaveBeenCalledWith('/ldap-setting/target-groups')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await ldapApi.getLDAPSettingDetailForMyCompany()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await ldapApi.searchLDAPSchedule(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { frequency: 'daily' }
      await ldapApi.updateLDAPSchedule(payload, 'schedule-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await ldapApi.deleteLDAPSchedule('schedule-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for LDAP settings', async () => {
      const payload = { serverAddress: 'ldap.example.com' }
      await ldapApi.createLDAPSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for schedule operations', async () => {
      const payload = { frequency: 'daily' }
      await ldapApi.updateLDAPSchedule(payload, 'schedule-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle LDAP connection test with credentials', async () => {
      const payload = {
        serverAddress: 'ldap.example.com',
        username: 'admin',
        password: 'password123',
        baseDN: 'dc=example,dc=com'
      }
      await ldapApi.testLDAPConnection(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle AD user search with filters', async () => {
      const payload = { searchTerm: 'john', department: 'IT' }
      await ldapApi.searchADUsers(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle LDAP schedule with complex frequency settings', async () => {
      const payload = {
        frequency: 'custom',
        days: ['Monday', 'Wednesday', 'Friday'],
        time: '10:00:00'
      }
      await ldapApi.updateLDAPSchedule(payload, 'schedule-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle LDAP mapping with multiple field mappings', async () => {
      const payload = {
        fieldMappings: {
          email: 'mail',
          firstName: 'givenName',
          lastName: 'sn',
          department: 'department'
        }
      }
      await ldapApi.createLDAPMapping(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
