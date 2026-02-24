import {
  getNotifiedEmail,
  getNotifiedEmailForEdit,
  downloadAttachment,
  exportNotifiedEmails,
  downloadMsgFiles
} from '@/api/notifiedEmail'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('notifiedEmail API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getNotifiedEmail', () => {
    it('calls GET with loading false by default', async () => {
      await getNotifiedEmail('id-1')
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/id-1', { loading: false })
    })
    it('calls GET with loading true when passed', async () => {
      await getNotifiedEmail('id-1', true)
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/id-1', { loading: true })
    })
  })

  describe('getNotifiedEmailForEdit', () => {
    it('calls GET for-edit', async () => {
      await getNotifiedEmailForEdit('id-1')
      expect(testRequest.get).toHaveBeenCalledWith('notified-emails/for-edit/id-1', {
        loading: false
      })
    })
  })

  describe('downloadAttachment', () => {
    it('calls POST attachments with blob', async () => {
      await downloadAttachment({ id: 'att-1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/notified-emails/attachments',
        { id: 'att-1' },
        { responseType: 'blob' }
      )
    })
  })

  describe('exportNotifiedEmails', () => {
    it('calls POST search/export with blob', async () => {
      await exportNotifiedEmails({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/notified-emails/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
  })

  describe('downloadMsgFiles', () => {
    it('calls POST msg-files with blob', async () => {
      await downloadMsgFiles({ id: 'msg-1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/notified-emails/msg-files',
        { id: 'msg-1' },
        { responseType: 'blob' }
      )
    })
  })
})
