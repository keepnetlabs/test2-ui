jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

  describe('return values', () => {
    it('getLDAPSettingDetailForMyCompany should return thenable', () => {
      const result = ldapApi.getLDAPSettingDetailForMyCompany()
      expect(typeof result.then).toBe('function')
    })

    it('createLDAPSetting should return thenable', () => {
      const result = ldapApi.createLDAPSetting({})
      expect(typeof result.then).toBe('function')
    })

    it('updateLDAPSetting should return thenable', () => {
      const result = ldapApi.updateLDAPSetting({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('testLDAPConnection should return thenable', () => {
      const result = ldapApi.testLDAPConnection({})
      expect(typeof result.then).toBe('function')
    })

    it('searchLDAPSchedule should return thenable', () => {
      const result = ldapApi.searchLDAPSchedule({})
      expect(typeof result.then).toBe('function')
    })

    it('updateLDAPSchedule should return thenable', () => {
      const result = ldapApi.updateLDAPSchedule({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('deleteLDAPSchedule should return thenable', () => {
      const result = ldapApi.deleteLDAPSchedule('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getLDAPConfigDetail should return thenable', () => {
      const result = ldapApi.getLDAPConfigDetail('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('searchADUsers should return thenable', () => {
      const result = ldapApi.searchADUsers({})
      expect(typeof result.then).toBe('function')
    })

    it('searchADGroups should return thenable', () => {
      const result = ldapApi.searchADGroups({})
      expect(typeof result.then).toBe('function')
    })

    it('createLDAPMapping should return thenable', () => {
      const result = ldapApi.createLDAPMapping({})
      expect(typeof result.then).toBe('function')
    })

    it('checkLDAPMappingStatus should return thenable', () => {
      const result = ldapApi.checkLDAPMappingStatus('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getLDAPFields should return thenable', () => {
      const result = ldapApi.getLDAPFields()
      expect(typeof result.then).toBe('function')
    })

    it('getTargetGroupsForLDAP should return thenable', () => {
      const result = ldapApi.getTargetGroupsForLDAP()
      expect(typeof result.then).toBe('function')
    })

    it('searchTmpTargetUsersForLdap should return thenable', () => {
      const result = ldapApi.searchTmpTargetUsersForLdap({}, 'trans-1')
      expect(typeof result.then).toBe('function')
    })

    it('createLDAPConfig should return thenable', () => {
      const result = ldapApi.createLDAPConfig({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 16 items (15 named functions + default)', () => {
      const functions = Object.keys(ldapApi).filter(key => typeof ldapApi[key] === 'function')
      expect(functions).toHaveLength(16)
    })

    it('should have all LDAP functions', () => {
      expect(typeof ldapApi.getLDAPSettingDetailForMyCompany).toBe('function')
      expect(typeof ldapApi.createLDAPSetting).toBe('function')
      expect(typeof ldapApi.updateLDAPSetting).toBe('function')
      expect(typeof ldapApi.testLDAPConnection).toBe('function')
      expect(typeof ldapApi.searchLDAPSchedule).toBe('function')
      expect(typeof ldapApi.updateLDAPSchedule).toBe('function')
      expect(typeof ldapApi.deleteLDAPSchedule).toBe('function')
      expect(typeof ldapApi.getLDAPConfigDetail).toBe('function')
      expect(typeof ldapApi.searchADUsers).toBe('function')
      expect(typeof ldapApi.searchADGroups).toBe('function')
      expect(typeof ldapApi.createLDAPMapping).toBe('function')
      expect(typeof ldapApi.checkLDAPMappingStatus).toBe('function')
      expect(typeof ldapApi.getLDAPFields).toBe('function')
      expect(typeof ldapApi.getTargetGroupsForLDAP).toBe('function')
      expect(typeof ldapApi.searchTmpTargetUsersForLdap).toBe('function')
      expect(typeof ldapApi.createLDAPConfig).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle LDAP configuration workflow', async () => {
      // Get setting details
      await ldapApi.getLDAPSettingDetailForMyCompany()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Test connection
      testRequest.post.mockClear()
      await ldapApi.testLDAPConnection({ serverAddress: 'ldap.example.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create LDAP setting
      testRequest.post.mockClear()
      await ldapApi.createLDAPSetting({ serverAddress: 'ldap.example.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Update LDAP setting
      testRequest.put.mockClear()
      await ldapApi.updateLDAPSetting({ serverAddress: 'ldap.example.com' }, 'setting-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle LDAP schedule workflow', async () => {
      // Search schedules
      await ldapApi.searchLDAPSchedule({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Update schedule
      testRequest.put.mockClear()
      await ldapApi.updateLDAPSchedule({ frequency: 'daily' }, 'schedule-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete schedule
      testRequest.delete.mockClear()
      await ldapApi.deleteLDAPSchedule('schedule-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle Active Directory search workflow', async () => {
      // Search users
      await ldapApi.searchADUsers({ searchTerm: 'john' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Search groups
      testRequest.post.mockClear()
      await ldapApi.searchADGroups({ searchTerm: 'admin' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle LDAP mapping workflow', async () => {
      // Get LDAP fields
      await ldapApi.getLDAPFields()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Create mapping
      testRequest.post.mockClear()
      await ldapApi.createLDAPMapping({ fieldMappings: {} })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Check status
      testRequest.get.mockClear()
      await ldapApi.checkLDAPMappingStatus('mapping-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel LDAP operations', async () => {
      const results = await Promise.all([
        ldapApi.getLDAPSettingDetailForMyCompany(),
        ldapApi.getLDAPFields(),
        ldapApi.getTargetGroupsForLDAP()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle LDAP connection test payload', async () => {
      const payload = { serverAddress: 'ldap.example.com', port: 389 }
      await ldapApi.testLDAPConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-setting/test-connection', payload)
    })

    it('should handle LDAP setting creation', async () => {
      const payload = { serverAddress: 'ldap.example.com', baseDN: 'dc=example,dc=com' }
      await ldapApi.createLDAPSetting(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-setting', payload, expect.any(Object))
    })

    it('should handle LDAP setting update with ID', async () => {
      const payload = { serverAddress: 'ldap2.example.com' }
      await ldapApi.updateLDAPSetting(payload, 'setting-123')
      expect(testRequest.put).toHaveBeenCalledWith('/ldap-setting/setting-123', payload, expect.any(Object))
    })

    it('should handle schedule search', async () => {
      const payload = { page: 1, pageSize: 50 }
      await ldapApi.searchLDAPSchedule(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-schedule/search', payload)
    })

    it('should handle schedule update with frequency', async () => {
      const payload = { frequency: 'weekly', dayOfWeek: 'Monday', time: '02:00' }
      await ldapApi.updateLDAPSchedule(payload, 'schedule-456')
      expect(testRequest.put).toHaveBeenCalledWith('/ldap-schedule/schedule-456', payload, expect.any(Object))
    })

    it('should handle AD user search with multiple filters', async () => {
      const payload = { searchTerm: 'user', department: 'IT', manager: 'admin' }
      await ldapApi.searchADUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/active-directory/users', payload)
    })

    it('should handle LDAP mapping creation', async () => {
      const payload = { fieldMappings: { email: 'mail', name: 'displayName' } }
      await ldapApi.createLDAPMapping(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-setting/mapping', payload)
    })

    it('should handle LDAP config creation', async () => {
      const payload = { config: { name: 'default', enabled: true } }
      await ldapApi.createLDAPConfig(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/ldap-config', payload, expect.any(Object))
    })

    it('should handle temporary target users search with transaction ID', async () => {
      const payload = { page: 1, pageSize: 25 }
      const transactionId = 'trans-789'
      await ldapApi.searchTmpTargetUsersForLdap(payload, transactionId)
      expect(testRequest.post).toHaveBeenCalledWith(`/target-users/${transactionId}/search`, payload)
    })
  })

  describe('Error Handling', () => {
    it('should propagate getLDAPSettingDetailForMyCompany errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(ldapApi.getLDAPSettingDetailForMyCompany()).rejects.toThrow('Fetch failed')
    })

    it('should propagate createLDAPSetting errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.createLDAPSetting({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateLDAPSetting errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(ldapApi.updateLDAPSetting({}, 'id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate testLDAPConnection errors', async () => {
      const error = new Error('Connection test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.testLDAPConnection({})).rejects.toThrow('Connection test failed')
    })

    it('should propagate searchLDAPSchedule errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.searchLDAPSchedule({})).rejects.toThrow('Search failed')
    })

    it('should propagate updateLDAPSchedule errors', async () => {
      const error = new Error('Schedule update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(ldapApi.updateLDAPSchedule({}, 'id-1')).rejects.toThrow('Schedule update failed')
    })

    it('should propagate deleteLDAPSchedule errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(ldapApi.deleteLDAPSchedule('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate searchADUsers errors', async () => {
      const error = new Error('User search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.searchADUsers({})).rejects.toThrow('User search failed')
    })

    it('should propagate searchADGroups errors', async () => {
      const error = new Error('Group search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.searchADGroups({})).rejects.toThrow('Group search failed')
    })

    it('should propagate createLDAPMapping errors', async () => {
      const error = new Error('Mapping creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.createLDAPMapping({})).rejects.toThrow('Mapping creation failed')
    })

    it('should propagate checkLDAPMappingStatus errors', async () => {
      const error = new Error('Status check failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(ldapApi.checkLDAPMappingStatus('id-1')).rejects.toThrow('Status check failed')
    })

    it('should propagate getLDAPFields errors', async () => {
      const error = new Error('Fields fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(ldapApi.getLDAPFields()).rejects.toThrow('Fields fetch failed')
    })

    it('should propagate createLDAPConfig errors', async () => {
      const error = new Error('Config creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(ldapApi.createLDAPConfig({})).rejects.toThrow('Config creation failed')
    })
  })
})
