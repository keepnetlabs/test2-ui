jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as smtpSettingsApi from '@/api/smtpSettings'

describe('smtpSettings API', () => {
  const URL = '/companies/smtp-settings'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('SMTP settings search and retrieval', () => {
    it('should call searchSmtpSettings', async () => {
      const payload = { page: 1 }
      await smtpSettingsApi.searchSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, payload)
    })

    it('should call searchSmtpSettings with empty payload', async () => {
      await smtpSettingsApi.searchSmtpSettings()
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, {})
    })

    it('should call getSmtpSettings', async () => {
      const resourceId = 'smtp-123'
      await smtpSettingsApi.getSmtpSettings(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/smtp-settings/${resourceId}`)
    })
  })

  describe('SMTP settings management', () => {
    it('should call createSMTPSettings', async () => {
      const payload = { name: 'SMTP Config', host: 'smtp.example.com' }
      await smtpSettingsApi.createSMTPSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/smtp-settings',
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSmtpSettings', async () => {
      const payload = { resourceId: 'smtp-123', name: 'Updated SMTP' }
      await smtpSettingsApi.updateSmtpSettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${URL}/smtp-123`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSmtpSettings', async () => {
      const id = 'smtp-123'
      await smtpSettingsApi.deleteSmtpSettings(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${URL}/${id}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SMTP connection testing', () => {
    it('should call testSmtpConnection', async () => {
      const payload = { host: 'smtp.example.com', port: 587 }
      const resourceId = 'smtp-123'
      await smtpSettingsApi.testSmtpConnection(payload, resourceId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/companies/smtp-settings/${resourceId}/test`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testSmtpConnection with empty payload', async () => {
      const resourceId = 'smtp-123'
      await smtpSettingsApi.testSmtpConnection({}, resourceId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/companies/smtp-settings/${resourceId}/test`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testConnectionWhenSmtpCreated', async () => {
      const payload = { host: 'smtp.example.com', port: 587 }
      await smtpSettingsApi.testConnectionWhenSmtpCreated(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/smtp-settings/test',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testConnectionWhenSmtpCreated with empty payload', async () => {
      await smtpSettingsApi.testConnectionWhenSmtpCreated()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/smtp-settings/test',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SMTP export operations', () => {
    it('should call exportSmtpSettings', async () => {
      const payload = { filters: {} }
      await smtpSettingsApi.exportSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${URL}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('availability operations', () => {
    it('should call searchAvailableFor', async () => {
      const payload = { type: 'users' }
      await smtpSettingsApi.searchAvailableFor(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/available-for/search', payload)
    })

    it('should call searchAvailableFor with empty payload', async () => {
      await smtpSettingsApi.searchAvailableFor()
      expect(testRequest.post).toHaveBeenCalledWith('/available-for/search', {})
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'smtp-123'
      await smtpSettingsApi.getSmtpSettings(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await smtpSettingsApi.searchSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { resourceId: 'smtp-123', name: 'Updated' }
      await smtpSettingsApi.updateSmtpSettings(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await smtpSettingsApi.deleteSmtpSettings('smtp-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar and loading consistency', () => {
    it('should include loading for SMTP creation', async () => {
      const payload = { name: 'SMTP' }
      await smtpSettingsApi.createSMTPSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: true })
      )
    })

    it('should include loading and snackbar for updates', async () => {
      const payload = { resourceId: 'smtp-123', name: 'Updated' }
      await smtpSettingsApi.updateSmtpSettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: true, snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for test operations', async () => {
      const payload = { host: 'smtp.example.com' }
      const resourceId = 'smtp-123'
      await smtpSettingsApi.testSmtpConnection(payload, resourceId)
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
      await smtpSettingsApi.exportSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchSmtpSettings with complex filters', async () => {
      const payload = {
        page: 1,
        filters: { status: ['active', 'inactive'] }
      }
      await smtpSettingsApi.searchSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SMTP creation with authentication', async () => {
      const payload = {
        name: 'Gmail SMTP',
        host: 'smtp.gmail.com',
        port: 587,
        username: 'user@example.com',
        password: 'app-password',
        useTLS: true
      }
      await smtpSettingsApi.createSMTPSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SMTP update with partial fields', async () => {
      const payload = {
        resourceId: 'smtp-123',
        port: 465
      }
      await smtpSettingsApi.updateSmtpSettings(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle testSmtpConnection with full credentials', async () => {
      const payload = {
        host: 'smtp.gmail.com',
        port: 587,
        username: 'user@example.com',
        password: 'app-password',
        useTLS: true,
        fromAddress: 'sender@example.com'
      }
      await smtpSettingsApi.testSmtpConnection(payload, 'smtp-123')
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportSmtpSettings with date filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active']
        }
      }
      await smtpSettingsApi.exportSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle searchAvailableFor with user context', async () => {
      const payload = {
        type: 'users',
        userId: 'user-123'
      }
      await smtpSettingsApi.searchAvailableFor(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle numeric and string IDs', async () => {
      await smtpSettingsApi.getSmtpSettings(123)
      expect(testRequest.get).toHaveBeenCalledWith('/companies/smtp-settings/123')

      testRequest.get.mockClear()
      await smtpSettingsApi.getSmtpSettings('smtp-abc')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/smtp-settings/smtp-abc')
    })

    it('should handle special characters in host names', async () => {
      const payload = { name: 'SMTP-Config@123', host: 'smtp-server.example.com' }
      await smtpSettingsApi.createSMTPSettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('searchSmtpSettings should return thenable', () => {
      const result = smtpSettingsApi.searchSmtpSettings({})
      expect(typeof result.then).toBe('function')
    })

    it('getSmtpSettings should return thenable', () => {
      const result = smtpSettingsApi.getSmtpSettings('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('createSMTPSettings should return thenable', () => {
      const result = smtpSettingsApi.createSMTPSettings({})
      expect(typeof result.then).toBe('function')
    })

    it('updateSmtpSettings should return thenable', () => {
      const result = smtpSettingsApi.updateSmtpSettings({})
      expect(typeof result.then).toBe('function')
    })

    it('deleteSmtpSettings should return thenable', () => {
      const result = smtpSettingsApi.deleteSmtpSettings('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('testSmtpConnection should return thenable', () => {
      const result = smtpSettingsApi.testSmtpConnection({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('testConnectionWhenSmtpCreated should return thenable', () => {
      const result = smtpSettingsApi.testConnectionWhenSmtpCreated({})
      expect(typeof result.then).toBe('function')
    })

    it('exportSmtpSettings should return thenable', () => {
      const result = smtpSettingsApi.exportSmtpSettings({})
      expect(typeof result.then).toBe('function')
    })

    it('searchAvailableFor should return thenable', () => {
      const result = smtpSettingsApi.searchAvailableFor({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof smtpSettingsApi.searchSmtpSettings).toBe('function')
      expect(typeof smtpSettingsApi.getSmtpSettings).toBe('function')
      expect(typeof smtpSettingsApi.createSMTPSettings).toBe('function')
      expect(typeof smtpSettingsApi.updateSmtpSettings).toBe('function')
      expect(typeof smtpSettingsApi.deleteSmtpSettings).toBe('function')
      expect(typeof smtpSettingsApi.testSmtpConnection).toBe('function')
      expect(typeof smtpSettingsApi.testConnectionWhenSmtpCreated).toBe('function')
      expect(typeof smtpSettingsApi.exportSmtpSettings).toBe('function')
      expect(typeof smtpSettingsApi.searchAvailableFor).toBe('function')
    })

    it('should export at least 9 functions', () => {
      const functions = Object.values(smtpSettingsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(9)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle SMTP settings CRUD workflow', async () => {
      await smtpSettingsApi.searchSmtpSettings({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await smtpSettingsApi.createSMTPSettings({ name: 'SMTP Config' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await smtpSettingsApi.getSmtpSettings('smtp-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await smtpSettingsApi.updateSmtpSettings({ resourceId: 'smtp-1', name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await smtpSettingsApi.deleteSmtpSettings('smtp-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle SMTP connection test workflow', async () => {
      const testPayload = { host: 'smtp.gmail.com', port: 587 }
      await smtpSettingsApi.testConnectionWhenSmtpCreated(testPayload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await smtpSettingsApi.testSmtpConnection(testPayload, 'smtp-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel SMTP operations', async () => {
      const results = await Promise.all([
        smtpSettingsApi.searchSmtpSettings({}),
        smtpSettingsApi.getSmtpSettings('smtp-1'),
        smtpSettingsApi.searchAvailableFor({})
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle SMTP creation with full configuration', async () => {
      const payload = {
        name: 'Gmail SMTP',
        host: 'smtp.gmail.com',
        port: 587,
        username: 'user@example.com',
        password: 'secret',
        useTLS: true
      }
      await smtpSettingsApi.createSMTPSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/smtp-settings',
        payload,
        expect.any(Object)
      )
    })

    it('should handle SMTP update with resourceId', async () => {
      const payload = {
        resourceId: 'smtp-123',
        host: 'newsmtp.example.com',
        port: 465
      }
      await smtpSettingsApi.updateSmtpSettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${URL}/smtp-123`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await smtpSettingsApi.searchSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, payload)
    })

    it('should handle test with resourceId parameter', async () => {
      const payload = { host: 'smtp.example.com' }
      const resourceId = 'smtp-456'
      await smtpSettingsApi.testSmtpConnection(payload, resourceId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/companies/smtp-settings/${resourceId}/test`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['active'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await smtpSettingsApi.exportSmtpSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${URL}/search/export`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle searchAvailableFor with type parameter', async () => {
      const payload = { type: 'users' }
      await smtpSettingsApi.searchAvailableFor(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/available-for/search', payload)
    })

    it('should handle different ID formats', async () => {
      await smtpSettingsApi.deleteSmtpSettings(456)
      expect(testRequest.delete).toHaveBeenCalledWith(`${URL}/456`, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchSmtpSettings errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.searchSmtpSettings({})).rejects.toThrow('Search failed')
    })

    it('should propagate getSmtpSettings errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.getSmtpSettings('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate createSMTPSettings errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.createSMTPSettings({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateSmtpSettings errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.updateSmtpSettings({})).rejects.toThrow('Update failed')
    })

    it('should propagate deleteSmtpSettings errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.deleteSmtpSettings('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate testSmtpConnection errors', async () => {
      const error = new Error('Connection test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.testSmtpConnection({}, 'id-1')).rejects.toThrow('Connection test failed')
    })

    it('should propagate testConnectionWhenSmtpCreated errors', async () => {
      const error = new Error('Connection test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.testConnectionWhenSmtpCreated({})).rejects.toThrow('Connection test failed')
    })

    it('should propagate exportSmtpSettings errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.exportSmtpSettings({})).rejects.toThrow('Export failed')
    })

    it('should propagate searchAvailableFor errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(smtpSettingsApi.searchAvailableFor({})).rejects.toThrow('Search failed')
    })
  })
})
