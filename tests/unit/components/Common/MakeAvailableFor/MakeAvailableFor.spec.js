jest.mock('@/api/smtpSettings', () => ({
  __esModule: true,
  searchAvailableFor: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          companies: { totalNumberOfPages: 1, results: [{ companyResourceId: 'c1', companyName: 'Comp 1' }] },
          groups: { totalNumberOfPages: 1, results: [{ resourceId: 'g1', name: 'Group 1' }] }
        }
      }
    })
  )
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  getAvailableForListFromBackend: jest.fn((list) => list),
  getAvailableForValues: jest.fn((list) => list)
}))

import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor.vue'
import { searchAvailableFor } from '@/api/smtpSettings'

describe('MakeAvailableFor.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name from source', () => {
    expect(MakeAvailableFor.name).toBe('MakeAvailableFor.vue')
  })

  it('showMakeAvailableFor is false for CompanyAdmin role', () => {
    expect(
      MakeAvailableFor.computed.showMakeAvailableFor.call({
        getRole: 'Company Admin'
      })
    ).toBe(false)
  })

  it('validateAvailableFor marks valid by list length for non-admin role', () => {
    const $emit = jest.fn()
    const ctx = {
      isAvailableForValidated: false,
      isAvailableForValid: false,
      getRole: 'User',
      $emit
    }
    MakeAvailableFor.methods.validateAvailableFor.call(ctx, [{ id: 'x' }])
    expect(ctx.isAvailableForValidated).toBe(true)
    expect(ctx.isAvailableForValid).toBe(true)
    expect($emit).toHaveBeenCalledWith('validation', true)
  })

  it('handleInputChange enforces MyCompanyOnly exclusive selection', () => {
    const $emit = jest.fn()
    const ctx = {
      value: [{ type: 'Group' }],
      treeSelectOptions: [
        { type: 'MyCompanyOnly', id: 'MyCompanyOnly' },
        { type: 'AllCompanies', id: 'AllCompanies' },
        { children: [] },
        { children: [] }
      ],
      treeSelectionStatus: false,
      setTreeSelectOptions: jest.fn(),
      closeMenuAndResetStatus: jest.fn(),
      validateAvailableFor: jest.fn(),
      $emit
    }
    MakeAvailableFor.methods.handleInputChange.call(ctx, [
      { type: 'MyCompanyOnly', id: 'MyCompanyOnly' },
      { type: 'Group', id: 'g1' }
    ])

    expect(ctx.treeSelectionStatus).toBe(true)
    expect($emit).toHaveBeenCalledWith('input', [ctx.treeSelectOptions[0]])
    expect(ctx.closeMenuAndResetStatus).toHaveBeenCalled()
  })

  it('callForSearchAvailableFor sets tree options and pagination counts', async () => {
    const ctx = {
      searchAvailableForPayload: {},
      treeSelectOptions: null,
      apiCount: 0,
      maximumApiCount: 1,
      defaultCompanyItems: [],
      defaultCompanyGroupItems: [],
      isInfiniteLoading: true,
      $set: (obj, key, val) => {
        obj[key] = val
      },
      $nextTick: (cb) => cb()
    }
    await MakeAvailableFor.methods.callForSearchAvailableFor.call(ctx, '')
    expect(searchAvailableFor).toHaveBeenCalled()
    expect(ctx.treeSelectOptions).toBeTruthy()
    expect(ctx.maximumApiCount).toBe(1)
    expect(ctx.isInfiniteLoading).toBe(false)
  })
})
