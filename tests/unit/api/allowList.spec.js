import * as AllowListAPI from '@/api/allowList'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('AllowList API', () => {
  it('should export getAllowListList function', () => {
    expect(typeof AllowListAPI.getAllowListList).toBe('function')
  })

  it('should export createAllowListList function', () => {
    expect(typeof AllowListAPI.createAllowListList).toBe('function')
  })

  it('should export createTxtRecord function', () => {
    expect(typeof AllowListAPI.createTxtRecord).toBe('function')
  })

  it('should export getAllowListListVerify function', () => {
    expect(typeof AllowListAPI.getAllowListListVerify).toBe('function')
  })

  it('should export markAsVerified function', () => {
    expect(typeof AllowListAPI.markAsVerified).toBe('function')
  })

  it('should export deleteAllowListItems function', () => {
    expect(typeof AllowListAPI.deleteAllowListItems).toBe('function')
  })

  describe('Function calls', () => {
    it('getAllowListList should call testRequest.post', async () => {
      const payload = { test: 'data' }
      await AllowListAPI.getAllowListList(payload)
      expect(require('@/utils/testRequest').post).toHaveBeenCalled()
    })

    it('createAllowListList should call testRequest.post', async () => {
      const payload = { test: 'data' }
      await AllowListAPI.createAllowListList(payload)
      expect(require('@/utils/testRequest').post).toHaveBeenCalled()
    })

    it('markAsVerified should call testRequest.put', async () => {
      await AllowListAPI.markAsVerified('123')
      expect(require('@/utils/testRequest').put).toHaveBeenCalled()
    })
  })
})
