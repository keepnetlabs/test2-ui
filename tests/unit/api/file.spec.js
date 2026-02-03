jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import * as fileApi from '@/api/file'

describe('file API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('file operations', () => {
    it('should call getUploadedFiles', async () => {
      await fileApi.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalledWith('/file/uploaded')
    })

    it('should call uploadFiles', async () => {
      const payload = new FormData()
      payload.append('file', new File(['content'], 'test.txt'))
      await fileApi.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', payload)
    })

    it('should call deleteFiles', async () => {
      const ResourceIdList = ['file-1', 'file-2']
      await fileApi.deleteFiles(ResourceIdList)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList }
      })
    })

    it('should call parseEmailOrMessageFile', async () => {
      const payload = { fileContent: 'email content' }
      await fileApi.parseEmailOrMessageFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', payload)
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for file retrieval', async () => {
      await fileApi.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for upload and parsing', async () => {
      const payload = new FormData()
      await fileApi.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use DELETE for file deletion', async () => {
      const ResourceIdList = ['file-1']
      await fileApi.deleteFiles(ResourceIdList)
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle file upload with multiple files', async () => {
      const payload = new FormData()
      payload.append('file', new File(['content1'], 'file1.txt'))
      payload.append('file', new File(['content2'], 'file2.txt'))
      await fileApi.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle deletion of multiple files', async () => {
      const ResourceIdList = ['file-1', 'file-2', 'file-3']
      await fileApi.deleteFiles(ResourceIdList)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/file/delete',
        { data: { ResourceIdList } }
      )
    })

    it('should handle email file parsing', async () => {
      const payload = { emailFormat: 'eml', content: 'email data' }
      await fileApi.parseEmailOrMessageFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', payload)
    })

    it('should handle empty file list', async () => {
      const ResourceIdList = []
      await fileApi.deleteFiles(ResourceIdList)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/file/delete',
        { data: { ResourceIdList: [] } }
      )
    })
  })
})
