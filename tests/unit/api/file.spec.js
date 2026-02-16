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

  describe('Return Value Consistency', () => {
    it('all functions should return promise-like objects', () => {
      const funcs = [
        FileAPI.getUploadedFiles(),
        FileAPI.uploadFiles({ file: 'data' }),
        FileAPI.deleteFiles(['id1']),
        FileAPI.parseEmailOrMessageFile({ file: 'data' })
      ]

      funcs.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })

    it('should resolve with data property in response', async () => {
      const mockResponse = { data: { id: 'test' } }
      testRequest.get.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.getUploadedFiles()
      expect(result).toHaveProperty('data')
    })

    it('should handle responses without data property', async () => {
      const mockResponse = { id: 'test' }
      testRequest.post.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.uploadFiles({ file: 'data' })
      expect(result).toEqual(mockResponse)
    })

    it('should resolve with array response', async () => {
      const mockResponse = { data: [] }
      testRequest.get.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.getUploadedFiles()
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should resolve with object response', async () => {
      const mockResponse = { data: { uploaded: true } }
      testRequest.post.mockResolvedValueOnce(mockResponse)

      const result = await FileAPI.uploadFiles({ file: 'data' })
      expect(typeof result.data).toBe('object')
    })
  })

  describe('Parameter Edge Cases', () => {
    it('should handle null payload for getUploadedFiles', async () => {
      await FileAPI.getUploadedFiles(null)
      expect(testRequest.get).toHaveBeenCalledWith('/file/uploaded')
    })

    it('should handle undefined payload for uploadFiles', async () => {
      await FileAPI.uploadFiles(undefined)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', undefined)
    })

    it('should handle empty array for deleteFiles', async () => {
      await FileAPI.deleteFiles([])
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: [] }
      })
    })

    it('should handle special characters in file data', async () => {
      const payload = { file: 'data\n\r\t"\'\\' }
      await FileAPI.uploadFiles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/file/upload', payload)
    })

    it('should handle very large file list for deletion', async () => {
      const ids = Array.from({ length: 1000 }, (_, i) => `file-${i}`)
      await FileAPI.deleteFiles(ids)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ids }
      })
    })

    it('should handle numeric IDs in deletion', async () => {
      const ids = [1, 2, 3, 4, 5]
      await FileAPI.deleteFiles(ids)
      expect(testRequest.delete).toHaveBeenCalledWith('/file/delete', {
        data: { ResourceIdList: ids }
      })
    })
  })

  describe('Endpoint URL Verification', () => {
    it('getUploadedFiles should use correct endpoint', async () => {
      await FileAPI.getUploadedFiles()
      const calls = testRequest.get.mock.calls
      expect(calls[calls.length - 1][0]).toBe('/file/uploaded')
    })

    it('uploadFiles should use correct endpoint', async () => {
      await FileAPI.uploadFiles({ file: 'data' })
      const calls = testRequest.post.mock.calls
      expect(calls[calls.length - 1][0]).toBe('/file/upload')
    })

    it('deleteFiles should use correct endpoint', async () => {
      await FileAPI.deleteFiles(['id1'])
      const calls = testRequest.delete.mock.calls
      expect(calls[calls.length - 1][0]).toBe('/file/delete')
    })

    it('parseEmailOrMessageFile should use correct endpoint', async () => {
      await FileAPI.parseEmailOrMessageFile({ file: 'data' })
      const calls = testRequest.post.mock.calls
      expect(calls[calls.length - 1][0]).toBe('/file/parse-email-file')
    })

    it('endpoints should be properly formatted', async () => {
      await FileAPI.getUploadedFiles()
      const endpoint = testRequest.get.mock.calls[0][0]
      expect(endpoint).toMatch(/^\/file\//)
    })
  })

  describe('Payload Structure Validation', () => {
    it('deleteFiles should structure payload with ResourceIdList', async () => {
      const ids = ['id1', 'id2']
      await FileAPI.deleteFiles(ids)

      const callArgs = testRequest.delete.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('data')
      expect(callArgs[1].data).toHaveProperty('ResourceIdList')
    })

    it('uploadFiles should pass payload directly', async () => {
      const payload = { file: 'base64', fileName: 'test.pdf' }
      await FileAPI.uploadFiles(payload)

      const callArgs = testRequest.post.mock.calls[0]
      expect(callArgs[1]).toEqual(payload)
    })

    it('parseEmailOrMessageFile should pass payload directly', async () => {
      const payload = { file: 'emaildata', fileName: 'email.eml' }
      await FileAPI.parseEmailOrMessageFile(payload)

      const callArgs = testRequest.post.mock.calls[0]
      expect(callArgs[1]).toEqual(payload)
    })

    it('getUploadedFiles should not include data in request', async () => {
      await FileAPI.getUploadedFiles()

      const callArgs = testRequest.get.mock.calls[0]
      expect(callArgs).toHaveLength(1)
    })
  })

  describe('Sequential Operations', () => {
    it('should handle multiple upload operations sequentially', async () => {
      await FileAPI.uploadFiles({ file: 'data1' })
      await FileAPI.uploadFiles({ file: 'data2' })
      await FileAPI.uploadFiles({ file: 'data3' })

      expect(testRequest.post).toHaveBeenCalledTimes(3)
    })

    it('should handle get followed by delete operation', async () => {
      testRequest.get.mockResolvedValueOnce({ data: [{ id: 'file-1' }] })

      const files = await FileAPI.getUploadedFiles()
      const fileIds = files.data.map(f => f.id)

      await FileAPI.deleteFiles(fileIds)

      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should maintain independent state across operations', async () => {
      testRequest.post.mockClear()

      await FileAPI.uploadFiles({ file: 'upload1' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()

      await FileAPI.parseEmailOrMessageFile({ file: 'parse1' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid successive calls', async () => {
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(FileAPI.uploadFiles({ file: `data${i}` }))
      }

      await Promise.all(promises)
      expect(testRequest.post).toHaveBeenCalledTimes(10)
    })
  })

  describe('Performance Characteristics', () => {
    it('getUploadedFiles should execute quickly', async () => {
      const start = Date.now()
      await FileAPI.getUploadedFiles()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(50)
    })

    it('uploadFiles should execute quickly', async () => {
      const start = Date.now()
      await FileAPI.uploadFiles({ file: 'data' })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(50)
    })

    it('deleteFiles should execute quickly', async () => {
      const start = Date.now()
      await FileAPI.deleteFiles(['id1'])
      const duration = Date.now() - start
      expect(duration).toBeLessThan(50)
    })

    it('parseEmailOrMessageFile should execute quickly', async () => {
      const start = Date.now()
      await FileAPI.parseEmailOrMessageFile({ file: 'data' })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(50)
    })

    it('should handle 100 operations efficiently', async () => {
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        await FileAPI.uploadFiles({ file: `data${i}` })
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Multiple Instance Isolation', () => {
    it('should handle concurrent uploads independently', async () => {
      const promises = [
        FileAPI.uploadFiles({ file: 'file1' }),
        FileAPI.uploadFiles({ file: 'file2' }),
        FileAPI.uploadFiles({ file: 'file3' })
      ]

      await Promise.all(promises)

      const calls = testRequest.post.mock.calls
      expect(calls).toHaveLength(3)
      expect(calls[0][1]).toEqual({ file: 'file1' })
      expect(calls[1][1]).toEqual({ file: 'file2' })
      expect(calls[2][1]).toEqual({ file: 'file3' })
    })

    it('should not share state between different operations', async () => {
      testRequest.get.mockResolvedValueOnce({ data: [{ id: 'file-1' }] })
      testRequest.post.mockResolvedValueOnce({ data: { fileId: 'file-2' } })

      const getResult = await FileAPI.getUploadedFiles()
      const uploadResult = await FileAPI.uploadFiles({ file: 'data' })

      expect(getResult.data).toHaveLength(1)
      expect(uploadResult.data.fileId).toBe('file-2')
    })

    it('should handle different request types in parallel', async () => {
      const results = await Promise.all([
        FileAPI.getUploadedFiles(),
        FileAPI.uploadFiles({ file: 'data' }),
        FileAPI.deleteFiles(['id1']),
        FileAPI.parseEmailOrMessageFile({ file: 'data' })
      ])

      expect(results).toHaveLength(4)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })
  })
})

