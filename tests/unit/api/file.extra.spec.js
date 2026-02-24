import * as fileApi from '@/api/file'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('file API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUploadedFiles', () => {
    it('calls GET /file/uploaded', async () => {
      await fileApi.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalledWith('/file/uploaded')
    })
  })

  describe('uploadFiles', () => {
    it('calls POST with payload', async () => {
      const payload = new FormData()
      await fileApi.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', payload)
    })
  })

  describe('deleteFiles', () => {
    it('calls DELETE with ResourceIdList in data', async () => {
      await fileApi.deleteFiles(['id1', 'id2'])
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ['id1', 'id2'] }
      })
    })
  })

  describe('parseEmailOrMessageFile', () => {
    it('calls POST parse endpoint', async () => {
      await fileApi.parseEmailOrMessageFile({ file: 'base64data' })
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', { file: 'base64data' })
    })
  })
})
