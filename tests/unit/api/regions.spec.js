import * as RegionsAPI from '@/api/regions'
import testRequest from '@/utils/testRequest'
import { expectNamespaceExportsOnlyFunctions } from '../helpers/expectNamespaceExportsOnlyFunctions'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Regions API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getRegions', () => {
    it('should call GET /regions with loading: false by default', async () => {
      await RegionsAPI.getRegions()
      expect(testRequest.get).toHaveBeenCalledWith('/regions', { loading: false })
    })

    it('should respect loading: true when passed', async () => {
      await RegionsAPI.getRegions({ loading: true })
      expect(testRequest.get).toHaveBeenCalledWith('/regions', { loading: true })
    })

    it('should respect loading: false when explicitly passed', async () => {
      await RegionsAPI.getRegions({ loading: false })
      expect(testRequest.get).toHaveBeenCalledWith('/regions', { loading: false })
    })

    it('should ignore unrelated options', async () => {
      await RegionsAPI.getRegions({ unrelated: true })
      expect(testRequest.get).toHaveBeenCalledWith('/regions', { loading: false })
    })

    it('should return thenable', () => {
      const result = RegionsAPI.getRegions()
      expect(typeof result.then).toBe('function')
    })

    it('should propagate request errors', async () => {
      const err = new Error('Network down')
      testRequest.get.mockRejectedValueOnce(err)
      await expect(RegionsAPI.getRegions()).rejects.toThrow('Network down')
    })
  })

  describe('All Exported Functions', () => {
    it('exports only request functions', () => {
      expectNamespaceExportsOnlyFunctions(RegionsAPI)
    })
  })
})
