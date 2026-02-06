import * as FileAPI from '@/api/file'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('File API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUploadedFiles', () => {
    it('should call GET endpoint', async () => {
      await FileAPI.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalledWith('/file/uploaded')
    })

    it('should not require parameters', async () => {
      await FileAPI.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = FileAPI.getUploadedFiles()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with file list', async () => {
      const mockFiles = { data: [{ id: '1', name: 'file.pdf' }] }
      testRequest.get.mockResolvedValueOnce(mockFiles)

      const result = await FileAPI.getUploadedFiles()
      expect(result).toEqual(mockFiles)
    })
  })

  describe('uploadFiles', () => {
    it('should call POST with payload', async () => {
      const payload = { file: 'base64data' }
      await FileAPI.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', payload)
    })

    it('should handle FormData payload', async () => {
      const formData = new FormData()
      formData.append('file', 'data')
      await FileAPI.uploadFiles(formData)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', formData)
    })

    it('should handle complex payload with metadata', async () => {
      const payload = {
        file: 'data',
        fileName: 'document.pdf',
        fileSize: 1024,
        fileType: 'application/pdf'
      }
      await FileAPI.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', payload)
    })

    it('should handle empty payload', async () => {
      await FileAPI.uploadFiles({})
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', {})
    })

    it('should return thenable', () => {
      const result = FileAPI.uploadFiles({ file: 'data' })
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with upload response', async () => {
      const mockResponse = { data: { fileId: 'new-file-123', size: 2048 } }
      testRequest.post.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.uploadFiles({ file: 'data' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteFiles', () => {
    it('should call DELETE with ResourceIdList', async () => {
      const ids = ['file-1', 'file-2']
      await FileAPI.deleteFiles(ids)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ids }
      })
    })

    it('should handle single file ID', async () => {
      const ids = ['file-123']
      await FileAPI.deleteFiles(ids)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ids }
      })
    })

    it('should handle empty array', async () => {
      const ids = []
      await FileAPI.deleteFiles(ids)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ids }
      })
    })

    it('should handle large list of IDs', async () => {
      const ids = Array.from({ length: 100 }, (_, i) => `file-${i}`)
      await FileAPI.deleteFiles(ids)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ids }
      })
    })

    it('should return thenable', () => {
      const result = FileAPI.deleteFiles(['id1'])
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with delete response', async () => {
      const mockResponse = { data: { deleted: 2, failed: 0 } }
      testRequest.delete.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.deleteFiles(['id1', 'id2'])
      expect(result).toEqual(mockResponse)
    })
  })

  describe('parseEmailOrMessageFile', () => {
    it('should call POST with payload', async () => {
      const payload = { file: 'emaildata' }
      await FileAPI.parseEmailOrMessageFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', payload)
    })

    it('should handle email file payload', async () => {
      const payload = {
        file: 'base64encodedfile',
        fileName: 'email.eml',
        fileType: 'message/rfc822'
      }
      await FileAPI.parseEmailOrMessageFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', payload)
    })

    it('should handle message file payload', async () => {
      const payload = {
        file: 'msgfiledata',
        fileName: 'message.msg'
      }
      await FileAPI.parseEmailOrMessageFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', payload)
    })

    it('should handle minimal payload', async () => {
      const payload = { file: 'data' }
      await FileAPI.parseEmailOrMessageFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', payload)
    })

    it('should return thenable', () => {
      const result = FileAPI.parseEmailOrMessageFile({ file: 'data' })
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with parsed data', async () => {
      const mockResponse = {
        data: {
          subject: 'Test Email',
          from: 'sender@example.com',
          to: 'recipient@example.com',
          body: 'Email content'
        }
      }
      testRequest.post.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.parseEmailOrMessageFile({ file: 'data' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use GET for read operations', async () => {
      await FileAPI.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should use POST for upload operations', async () => {
      await FileAPI.uploadFiles({ file: 'data' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should use DELETE for delete operations', async () => {
      await FileAPI.deleteFiles(['id1'])
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should use POST for parse operations', async () => {
      await FileAPI.parseEmailOrMessageFile({ file: 'data' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should not mix HTTP methods incorrectly', async () => {
      testRequest.get.mockClear()
      testRequest.post.mockClear()
      testRequest.delete.mockClear()

      await FileAPI.deleteFiles(['id1'])

      expect(testRequest.delete).toHaveBeenCalled()
      expect(testRequest.get).not.toHaveBeenCalled()
      expect(testRequest.post).not.toHaveBeenCalled()
    })
  })

  describe('All Exported Functions', () => {
    it('should export 4 functions', () => {
      const functions = Object.values(FileAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(4)
    })

    it('should have getUploadedFiles', () => {
      expect(typeof FileAPI.getUploadedFiles).toBe('function')
    })

    it('should have uploadFiles', () => {
      expect(typeof FileAPI.uploadFiles).toBe('function')
    })

    it('should have deleteFiles', () => {
      expect(typeof FileAPI.deleteFiles).toBe('function')
    })

    it('should have parseEmailOrMessageFile', () => {
      expect(typeof FileAPI.parseEmailOrMessageFile).toBe('function')
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle file upload workflow', async () => {
      testRequest.post.mockClear()

      const uploadPayload = { file: 'data' }
      await FileAPI.uploadFiles(uploadPayload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', uploadPayload)

      testRequest.post.mockClear()
      const parsePayload = { file: 'emaildata' }
      await FileAPI.parseEmailOrMessageFile(parsePayload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/parse-email-file', parsePayload)

      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle file retrieval and deletion', async () => {
      const mockFiles = { data: [{ id: 'file-1', name: 'doc.pdf' }] }
      testRequest.get.mockResolvedValueOnce(mockFiles)

      await FileAPI.getUploadedFiles()
      expect(testRequest.get).toHaveBeenCalledWith('/file/uploaded')

      await FileAPI.deleteFiles(['file-1'])
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ['file-1'] }
      })
    })

    it('should handle parallel requests', async () => {
      const results = await Promise.all([
        FileAPI.getUploadedFiles(),
        FileAPI.uploadFiles({ file: 'data' })
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('should propagate GET errors', async () => {
      const error = new Error('Network error')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(FileAPI.getUploadedFiles()).rejects.toThrow('Network error')
    })

    it('should propagate POST errors', async () => {
      const error = new Error('Upload failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(FileAPI.uploadFiles({ file: 'data' })).rejects.toThrow('Upload failed')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('Delete failed')
      testRequest.delete.mockRejectedValueOnce(error)

      await expect(FileAPI.deleteFiles(['id1'])).rejects.toThrow('Delete failed')
    })

    it('should handle parse errors', async () => {
      const error = new Error('Parse failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(FileAPI.parseEmailOrMessageFile({ file: 'data' })).rejects.toThrow('Parse failed')
    })
  })
})
