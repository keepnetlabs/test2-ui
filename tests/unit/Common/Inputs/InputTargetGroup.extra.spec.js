import InputTargetGroup from '@/components/Common/Inputs/InputTargetGroup.vue'
import { searchTargetGroups } from '@/api/targetUsers'

jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  getDefaultAxiosPayload: jest.fn(() => ({ pageNumber: 1, filter: {} })),
  getSelectSearchPayload: jest.fn((payload, search) => ({ ...payload, search }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InputTargetGroup.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setTargetGroups branching', () => {
    it('handles response with empty results', () => {
      const ctx = {
        items: [{ resourceId: 'existing' }],
        isUserGroupsLoading: true,
        manipulateItems: null
      }

      InputTargetGroup.methods.setTargetGroups.call(ctx, {
        data: { data: { results: [] } }
      })

      expect(ctx.items).toEqual([{ resourceId: 'existing' }])
      expect(ctx.isUserGroupsLoading).toBe(false)
    })

    it('appends raw results when manipulateItems is absent', () => {
      const ctx = {
        items: [{ resourceId: 'a' }],
        isUserGroupsLoading: true,
        manipulateItems: undefined
      }

      InputTargetGroup.methods.setTargetGroups.call(ctx, {
        data: {
          data: {
            results: [
              { resourceId: 'r1', name: 'Group 1' },
              { resourceId: 'r2', name: 'Group 2' }
            ]
          }
        }
      })

      expect(ctx.items).toHaveLength(3)
      expect(ctx.items[1]).toEqual({ resourceId: 'r1', name: 'Group 1' })
      expect(ctx.items[2]).toEqual({ resourceId: 'r2', name: 'Group 2' })
      expect(ctx.isUserGroupsLoading).toBe(false)
    })

    it('uses manipulateItems when provided with multiple results', () => {
      const ctx = {
        items: [],
        isUserGroupsLoading: true,
        manipulateItems: jest.fn((items) => items.map((i) => ({ ...i, transformed: true })))
      }

      InputTargetGroup.methods.setTargetGroups.call(ctx, {
        data: {
          data: {
            results: [
              { resourceId: 'r1', name: 'Group 1' },
              { resourceId: 'r2', name: 'Group 2' }
            ]
          }
        }
      })

      expect(ctx.manipulateItems).toHaveBeenCalledWith([
        { resourceId: 'r1', name: 'Group 1' },
        { resourceId: 'r2', name: 'Group 2' }
      ])
      expect(ctx.items).toHaveLength(2)
      expect(ctx.items[0].transformed).toBe(true)
      expect(ctx.isUserGroupsLoading).toBe(false)
    })
  })

  describe('callForTargetGroups branching', () => {
    it('fetches when addPage is true and pageNumber does not exceed total', async () => {
      searchTargetGroups.mockResolvedValueOnce({
        data: { data: { totalNumberOfPages: 3, results: [{ resourceId: 'g-2' }] } }
      })

      const ctx = {
        axiosPayload: { pageNumber: 1 },
        totalNumberOfPagesOfTargetGroups: 3,
        isUserGroupsLoading: false,
        setTargetGroups: jest.fn()
      }

      InputTargetGroup.methods.callForTargetGroups.call(ctx, true)
      await flushPromises()

      expect(ctx.axiosPayload.pageNumber).toBe(2)
      expect(searchTargetGroups).toHaveBeenCalledWith({ pageNumber: 2 })
      expect(ctx.setTargetGroups).toHaveBeenCalled()
    })

    it('fetches when addPage is false', async () => {
      searchTargetGroups.mockResolvedValueOnce({
        data: { data: { totalNumberOfPages: 1, results: [] } }
      })

      const ctx = {
        axiosPayload: { pageNumber: 1 },
        totalNumberOfPagesOfTargetGroups: 1,
        isUserGroupsLoading: false,
        setTargetGroups: jest.fn()
      }

      InputTargetGroup.methods.callForTargetGroups.call(ctx, false)
      await flushPromises()

      expect(searchTargetGroups).toHaveBeenCalledWith({ pageNumber: 1 })
      expect(ctx.setTargetGroups).toHaveBeenCalled()
    })
  })
})
