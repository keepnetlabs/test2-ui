import InputTargetUsers from '@/components/Common/Inputs/InputTargetUsers.vue'
import { getTargetUsers } from '@/api/targetUsers'
import { getDefaultAxiosPayload, getSelectSearchPayload } from '@/utils/functions'

jest.mock('@/api/targetUsers', () => ({
  getTargetUsers: jest.fn(),
  searchTargetGroups: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  getDefaultAxiosPayload: jest.fn(() => ({ pageNumber: 1, filter: {} })),
  getSelectSearchPayload: jest.fn((payload, search, field) => ({ ...payload, search, field }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InputTargetUsers.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleInputChange emits selected value', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    InputTargetUsers.methods.handleInputChange.call(ctx, ['u-1'])
    expect(emit).toHaveBeenCalledWith('input', ['u-1'])
  })

  it('callForTargetUsers returns early when page exceeds total', () => {
    const ctx = {
      axiosPayload: { pageNumber: 1 },
      totalNumberOfPagesOfTargetUsers: 1
    }

    InputTargetUsers.methods.callForTargetUsers.call(ctx, true)
    expect(ctx.axiosPayload.pageNumber).toBe(2)
    expect(getTargetUsers).not.toHaveBeenCalled()
  })

  it('callForTargetUsers fetches users and updates total page count', async () => {
    getTargetUsers.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfPages: 3,
          results: [{ email: 'a@keepnet.com' }]
        }
      }
    })

    const ctx = {
      axiosPayload: { pageNumber: 1 },
      totalNumberOfPagesOfTargetUsers: 1,
      setTargetUsers: jest.fn()
    }

    InputTargetUsers.methods.callForTargetUsers.call(ctx)
    await flushPromises()

    expect(getTargetUsers).toHaveBeenCalledWith({ pageNumber: 1 })
    expect(ctx.setTargetUsers).toHaveBeenCalled()
    expect(ctx.totalNumberOfPagesOfTargetUsers).toBe(3)
  })

  it('callForSearchTargetUsers uses search payload when query exists', async () => {
    getTargetUsers.mockResolvedValueOnce({ data: { data: { results: [] } } })

    const ctx = {
      axiosPayload: { pageNumber: 2 },
      setTargetUsers: jest.fn(),
      callForTargetUsers: jest.fn()
    }

    InputTargetUsers.methods.callForSearchTargetUsers.call(ctx, 'john')
    await flushPromises()

    expect(getSelectSearchPayload).toHaveBeenCalledWith({ pageNumber: 2 }, 'john', 'Email')
    expect(getTargetUsers).toHaveBeenCalledWith({ pageNumber: 2, search: 'john', field: 'Email' })
    expect(ctx.setTargetUsers).toHaveBeenCalled()
    expect(ctx.callForTargetUsers).not.toHaveBeenCalled()
  })

  it('callForSearchTargetUsers falls back to normal fetch for empty search', () => {
    const ctx = { callForTargetUsers: jest.fn() }

    InputTargetUsers.methods.callForSearchTargetUsers.call(ctx, '')
    expect(ctx.callForTargetUsers).toHaveBeenCalled()
  })

  it('setTargetUsers filters already selected emails and appends mapped values', () => {
    const ctx = {
      value: ['used@keepnet.com'],
      items: [{ email: 'existing@keepnet.com' }],
      isTargetUsersLoading: true,
      manipulateItems: null
    }

    InputTargetUsers.methods.setTargetUsers.call(ctx, {
      data: {
        data: {
          results: [{ email: 'used@keepnet.com' }, { email: 'new@keepnet.com' }]
        }
      }
    })

    expect(ctx.items).toEqual([{ email: 'existing@keepnet.com' }, { email: 'new@keepnet.com' }])
    expect(ctx.isTargetUsersLoading).toBe(false)
  })

  it('setTargetUsers uses manipulateItems branch when provided', () => {
    const ctx = {
      value: [],
      items: [{ email: 'existing@keepnet.com' }],
      isTargetUsersLoading: true,
      manipulateItems: jest.fn((results) => results.map((r) => ({ text: r.email, value: r.email })))
    }

    InputTargetUsers.methods.setTargetUsers.call(ctx, {
      data: {
        data: {
          results: [{ email: 'new@keepnet.com' }]
        }
      }
    })

    expect(ctx.manipulateItems).toHaveBeenCalledWith([{ email: 'new@keepnet.com' }])
    expect(ctx.items).toEqual([
      { email: 'existing@keepnet.com' },
      { text: 'new@keepnet.com', value: 'new@keepnet.com' }
    ])
    expect(ctx.isTargetUsersLoading).toBe(false)
  })

  it('data initializes defaults from helper and props', () => {
    const data = InputTargetUsers.data.call({ defaultItems: [{ email: 'preset@keepnet.com' }] })

    expect(getDefaultAxiosPayload).toHaveBeenCalled()
    expect(data.axiosPayload).toEqual({ pageNumber: 1, filter: {} })
    expect(data.items).toEqual([{ email: 'preset@keepnet.com' }])
    expect(data.totalNumberOfPagesOfTargetUsers).toBe(1)
    expect(data.isTargetUsersLoading).toBe(true)
  })
})
