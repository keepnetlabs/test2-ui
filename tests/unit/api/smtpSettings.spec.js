jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
  })
})
