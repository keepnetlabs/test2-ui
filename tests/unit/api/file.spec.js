import * as FileAPI from '@/api/file'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('File API', () => {
  it('should export getUploadedFiles function', () => {
    expect(typeof FileAPI.getUploadedFiles).toBe('function')
  })

  it('should export uploadFiles function', () => {
    expect(typeof FileAPI.uploadFiles).toBe('function')
  })

  it('should export deleteFiles function', () => {
    expect(typeof FileAPI.deleteFiles).toBe('function')
  })

  it('should export parseEmailOrMessageFile function', () => {
    expect(typeof FileAPI.parseEmailOrMessageFile).toBe('function')
  })

  describe('API Calls', () => {
    it('getUploadedFiles should return a promise', () => {
      const result = FileAPI.getUploadedFiles()
      expect(result).toHaveProperty('then')
    })

    it('uploadFiles should return a promise', () => {
      const result = FileAPI.uploadFiles({ file: 'data' })
      expect(result).toHaveProperty('then')
    })

    it('deleteFiles should return a promise', () => {
      const result = FileAPI.deleteFiles(['id1', 'id2'])
      expect(result).toHaveProperty('then')
    })

    it('parseEmailOrMessageFile should return a promise', () => {
      const result = FileAPI.parseEmailOrMessageFile({ file: 'data' })
      expect(result).toHaveProperty('then')
    })
  })
})
