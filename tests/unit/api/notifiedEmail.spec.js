jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({}))
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
})
