jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import * as notifiedEmailApi from '@/api/notifiedEmail'

describe('notifiedEmail API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('notified email retrieval', () => {
    it('should call getNotifiedEmail without loading', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmail(id)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/email-123', { loading: false })
    })

    it('should call getNotifiedEmail with loading enabled', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmail(id, true)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/email-123', { loading: true })
    })

    it('should call getNotifiedEmailForEdit without loading', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmailForEdit(id)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/for-edit/email-123', { loading: false })
    })

    it('should call getNotifiedEmailForEdit with loading enabled', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmailForEdit(id, true)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/for-edit/email-123', { loading: true })
    })
  })

  describe('attachment and file operations', () => {
    it('should call downloadAttachment', async () => {
      const payload = { attachmentIds: ['att-1'] }
      await notifiedEmailApi.downloadAttachment(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/notified-emails/attachments',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call downloadMsgFiles', async () => {
      const payload = { emailIds: ['email-1'] }
      await notifiedEmailApi.downloadMsgFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/notified-emails/msg-files',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('export operations', () => {
    it('should call exportNotifiedEmails', async () => {
      const payload = { filters: {} }
      await notifiedEmailApi.exportNotifiedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/notified-emails/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmail(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for download and export operations', async () => {
      const payload = { attachmentIds: ['att-1'] }
      await notifiedEmailApi.downloadAttachment(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for attachment download', async () => {
      const payload = { attachmentIds: ['att-1'] }
      await notifiedEmailApi.downloadAttachment(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for MSG file download', async () => {
      const payload = { emailIds: ['email-1'] }
      await notifiedEmailApi.downloadMsgFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for export', async () => {
      const payload = { filters: {} }
      await notifiedEmailApi.exportNotifiedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('loading state', () => {
    it('should allow disabling loading state for getNotifiedEmail', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmail(id, false)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        { loading: false }
      )
    })

    it('should allow enabling loading state for getNotifiedEmailForEdit', async () => {
      const id = 'email-123'
      await notifiedEmailApi.getNotifiedEmailForEdit(id, true)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        { loading: true }
      )
    })
  })

  describe('edge cases', () => {
    it('should handle downloading multiple attachments', async () => {
      const payload = { attachmentIds: ['att-1', 'att-2', 'att-3'] }
      await notifiedEmailApi.downloadAttachment(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle downloading multiple MSG files', async () => {
      const payload = { emailIds: ['email-1', 'email-2', 'email-3'] }
      await notifiedEmailApi.downloadMsgFiles(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['suspicious', 'malicious'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          senders: ['sender1@example.com', 'sender2@example.com']
        }
      }
      await notifiedEmailApi.exportNotifiedEmails(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle email ID with special characters', async () => {
      const id = 'email-123!@#'
      await notifiedEmailApi.getNotifiedEmail(id, true)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.stringContaining('email-123!@#'),
        expect.any(Object)
      )
    })
  })

  describe('return values', () => {
    it('getNotifiedEmail should return thenable', () => {
      const result = notifiedEmailApi.getNotifiedEmail('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getNotifiedEmailForEdit should return thenable', () => {
      const result = notifiedEmailApi.getNotifiedEmailForEdit('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('downloadAttachment should return thenable', () => {
      const result = notifiedEmailApi.downloadAttachment({ attachmentIds: [] })
      expect(typeof result.then).toBe('function')
    })

    it('downloadMsgFiles should return thenable', () => {
      const result = notifiedEmailApi.downloadMsgFiles({ emailIds: [] })
      expect(typeof result.then).toBe('function')
    })

    it('exportNotifiedEmails should return thenable', () => {
      const result = notifiedEmailApi.exportNotifiedEmails({ filters: {} })
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 5 functions', () => {
      const functions = Object.values(notifiedEmailApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(5)
    })

    it('should have all notified email functions', () => {
      expect(typeof notifiedEmailApi.getNotifiedEmail).toBe('function')
      expect(typeof notifiedEmailApi.getNotifiedEmailForEdit).toBe('function')
      expect(typeof notifiedEmailApi.downloadAttachment).toBe('function')
      expect(typeof notifiedEmailApi.downloadMsgFiles).toBe('function')
      expect(typeof notifiedEmailApi.exportNotifiedEmails).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle email retrieval and download workflow', async () => {
      // Get email
      await notifiedEmailApi.getNotifiedEmail('email-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Download attachments
      testRequest.post.mockClear()
      await notifiedEmailApi.downloadAttachment({ attachmentIds: ['att-1'] })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle email edit workflow', async () => {
      // Get email for edit
      await notifiedEmailApi.getNotifiedEmailForEdit('email-1', true)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel email retrieval', async () => {
      const results = await Promise.all([
        notifiedEmailApi.getNotifiedEmail('email-1'),
        notifiedEmailApi.getNotifiedEmailForEdit('email-2')
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })

    it('should handle parallel download operations', async () => {
      const results = await Promise.all([
        notifiedEmailApi.downloadAttachment({ attachmentIds: ['att-1'] }),
        notifiedEmailApi.downloadMsgFiles({ emailIds: ['email-1'] })
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })

    it('should handle complete email workflow', async () => {
      // Retrieve email
      await notifiedEmailApi.getNotifiedEmail('email-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Get for edit
      testRequest.get.mockClear()
      await notifiedEmailApi.getNotifiedEmailForEdit('email-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Download attachments
      testRequest.post.mockClear()
      await notifiedEmailApi.downloadAttachment({ attachmentIds: ['att-1'] })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Download MSG files
      testRequest.post.mockClear()
      await notifiedEmailApi.downloadMsgFiles({ emailIds: ['email-1'] })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Export emails
      testRequest.post.mockClear()
      await notifiedEmailApi.exportNotifiedEmails({ filters: {} })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle numeric and string IDs for getNotifiedEmail', async () => {
      await notifiedEmailApi.getNotifiedEmail(123)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/123', expect.any(Object))

      testRequest.get.mockClear()
      await notifiedEmailApi.getNotifiedEmail('email-abc')
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/email-abc', expect.any(Object))
    })

    it('should handle numeric and string IDs for getNotifiedEmailForEdit', async () => {
      await notifiedEmailApi.getNotifiedEmailForEdit(456)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/for-edit/456', expect.any(Object))

      testRequest.get.mockClear()
      await notifiedEmailApi.getNotifiedEmailForEdit('email-xyz')
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/for-edit/email-xyz', expect.any(Object))
    })

    it('should handle loading parameter false by default', async () => {
      await notifiedEmailApi.getNotifiedEmail('email-1')
      expect(testRequest.get).toHaveBeenCalledWith(expect.any(String), { loading: false })
    })

    it('should handle loading parameter true when specified', async () => {
      await notifiedEmailApi.getNotifiedEmail('email-1', true)
      expect(testRequest.get).toHaveBeenCalledWith(expect.any(String), { loading: true })
    })

    it('should handle empty attachment payload', async () => {
      await notifiedEmailApi.downloadAttachment({ attachmentIds: [] })
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/attachments', expect.any(Object), expect.any(Object))
    })

    it('should handle multiple attachment IDs', async () => {
      const payload = { attachmentIds: ['att-1', 'att-2', 'att-3', 'att-4'] }
      await notifiedEmailApi.downloadAttachment(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/attachments', payload, expect.any(Object))
    })

    it('should handle empty email IDs for MSG files', async () => {
      await notifiedEmailApi.downloadMsgFiles({ emailIds: [] })
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/msg-files', expect.any(Object), expect.any(Object))
    })

    it('should handle multiple email IDs for MSG files', async () => {
      const payload = { emailIds: ['email-1', 'email-2', 'email-3'] }
      await notifiedEmailApi.downloadMsgFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/msg-files', payload, expect.any(Object))
    })

    it('should handle export with empty filters', async () => {
      await notifiedEmailApi.exportNotifiedEmails({ filters: {} })
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/search/export', expect.any(Object), expect.any(Object))
    })

    it('should handle export with complex filter payload', async () => {
      const payload = {
        filters: {
          status: ['new', 'acknowledged', 'closed'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          senders: ['sender1@example.com'],
          recipients: ['recipient1@example.com']
        },
        page: 1,
        pageSize: 50
      }
      await notifiedEmailApi.exportNotifiedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/search/export', payload, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate getNotifiedEmail errors', async () => {
      const error = new Error('Email fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.getNotifiedEmail('id-1')).rejects.toThrow('Email fetch failed')
    })

    it('should propagate getNotifiedEmailForEdit errors', async () => {
      const error = new Error('Edit data fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.getNotifiedEmailForEdit('id-1')).rejects.toThrow('Edit data fetch failed')
    })

    it('should propagate downloadAttachment errors', async () => {
      const error = new Error('Attachment download failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.downloadAttachment({ attachmentIds: ['att-1'] })).rejects.toThrow('Attachment download failed')
    })

    it('should propagate downloadMsgFiles errors', async () => {
      const error = new Error('MSG file download failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.downloadMsgFiles({ emailIds: ['email-1'] })).rejects.toThrow('MSG file download failed')
    })

    it('should propagate exportNotifiedEmails errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.exportNotifiedEmails({ filters: {} })).rejects.toThrow('Export failed')
    })

    it('should handle network errors during retrieval', async () => {
      const error = new Error('Network timeout')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.getNotifiedEmail('id-1')).rejects.toThrow('Network timeout')
    })

    it('should handle network errors during download', async () => {
      const error = new Error('Download network error')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(notifiedEmailApi.downloadAttachment({ attachmentIds: ['att-1'] })).rejects.toThrow('Download network error')
    })
  })
})
