import InputTargetGroup from '@/components/Common/Inputs/InputTargetGroup.vue'
import { searchTargetGroups } from '@/api/targetUsers'
import { getDefaultAxiosPayload, getSelectSearchPayload } from '@/utils/functions'

jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  getDefaultAxiosPayload: jest.fn(() => ({ pageNumber: 1, filter: {} })),
  getSelectSearchPayload: jest.fn((payload, search) => ({ ...payload, search }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InputTargetGroup.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('watch payload replaces axiosPayload only when payload has keys', () => {
    const ctx = {
      axiosPayload: { pageNumber: 1 }
    }

    InputTargetGroup.watch.payload.handler.call(ctx, {})
    expect(ctx.axiosPayload).toEqual({ pageNumber: 1 })

    InputTargetGroup.watch.payload.handler.call(ctx, { pageNumber: 3, pageSize: 20 })
    expect(ctx.axiosPayload).toEqual({ pageNumber: 3, pageSize: 20 })
  })

  it('handleInputChange emits input event', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    InputTargetGroup.methods.handleInputChange.call(ctx, ['g-1'])
    expect(emit).toHaveBeenCalledWith('input', ['g-1'])
  })

  it('setTargetGroups appends manipulated items when manipulateItems exists', () => {
    const ctx = {
      items: [{ resourceId: 'existing' }],
      isUserGroupsLoading: true,
      manipulateItems: jest.fn((items) => items.map((i) => ({ ...i, mapped: true })))
    }

    InputTargetGroup.methods.setTargetGroups.call(ctx, {
      data: {
        data: {
          results: [{ resourceId: 'new-1' }]
        }
      }
    })

    expect(ctx.manipulateItems).toHaveBeenCalledWith([{ resourceId: 'new-1' }])
    expect(ctx.items).toEqual([{ resourceId: 'existing' }, { resourceId: 'new-1', mapped: true }])
    expect(ctx.isUserGroupsLoading).toBe(false)
  })

  it('setTargetGroups appends raw items when manipulateItems is not provided', () => {
    const ctx = {
      items: [{ resourceId: 'existing' }],
      isUserGroupsLoading: true,
      manipulateItems: null
    }

    InputTargetGroup.methods.setTargetGroups.call(ctx, {
      data: {
        data: {
          results: [{ resourceId: 'new-1' }]
        }
      }
    })

    expect(ctx.items).toEqual([{ resourceId: 'existing' }, { resourceId: 'new-1' }])
    expect(ctx.isUserGroupsLoading).toBe(false)
  })

  it('callForTargetGroups returns early when addPage exceeds total page', () => {
    const ctx = {
      axiosPayload: { pageNumber: 1 },
      totalNumberOfPagesOfTargetGroups: 1
    }

    InputTargetGroup.methods.callForTargetGroups.call(ctx, true)
    expect(ctx.axiosPayload.pageNumber).toBe(2)
    expect(searchTargetGroups).not.toHaveBeenCalled()
  })

  it('callForTargetGroups fetches and updates total pages', async () => {
    searchTargetGroups.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfPages: 4,
          results: [{ resourceId: 'g-1' }]
        }
      }
    })

    const ctx = {
      axiosPayload: { pageNumber: 1 },
      totalNumberOfPagesOfTargetGroups: 10,
      isUserGroupsLoading: true,
      setTargetGroups: jest.fn()
    }

    InputTargetGroup.methods.callForTargetGroups.call(ctx)
    await flushPromises()

    expect(searchTargetGroups).toHaveBeenCalledWith({ pageNumber: 1 })
    expect(ctx.setTargetGroups).toHaveBeenCalled()
    expect(ctx.totalNumberOfPagesOfTargetGroups).toBe(4)
    expect(ctx.isUserGroupsLoading).toBe(false)
  })

  it('callForSearchTargetGroups uses search payload for non-empty query', async () => {
    searchTargetGroups.mockResolvedValueOnce({ data: { data: { results: [] } } })

    const ctx = {
      axiosPayload: { pageNumber: 1 },
      isUserGroupsLoading: true,
      setTargetGroups: jest.fn(),
      callForTargetGroups: jest.fn()
    }

    InputTargetGroup.methods.callForSearchTargetGroups.call(ctx, 'sales')
    await flushPromises()

    expect(getSelectSearchPayload).toHaveBeenCalledWith({ pageNumber: 1 }, 'sales')
    expect(searchTargetGroups).toHaveBeenCalledWith({ pageNumber: 1, search: 'sales' })
    expect(ctx.setTargetGroups).toHaveBeenCalled()
    expect(ctx.isUserGroupsLoading).toBe(false)
    expect(ctx.callForTargetGroups).not.toHaveBeenCalled()
  })

  it('callForSearchTargetGroups falls back to callForTargetGroups for empty query', () => {
    const ctx = {
      callForTargetGroups: jest.fn()
    }

    InputTargetGroup.methods.callForSearchTargetGroups.call(ctx, '')
    expect(ctx.callForTargetGroups).toHaveBeenCalled()
  })

  it('data initializes axiosPayload and items from defaults', () => {
    const data = InputTargetGroup.data.call({ defaultItems: [{ resourceId: 'd-1' }] })

    expect(getDefaultAxiosPayload).toHaveBeenCalled()
    expect(data.axiosPayload).toEqual({ pageNumber: 1, filter: {} })
    expect(data.items).toEqual([{ resourceId: 'd-1' }])
    expect(data.totalNumberOfPagesOfTargetGroups).toBe(1)
  })
})
