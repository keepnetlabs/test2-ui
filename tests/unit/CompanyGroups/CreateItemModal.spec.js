jest.mock('@/api/company', () => ({
  createCompanyGroups: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'new-g-1' } } })),
  searchCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ companyResourceId: 'c1', companyName: 'Acme' }],
          totalNumberOfPages: 2
        }
      }
    })
  ),
  searchGroupCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ companyResourceId: 'c2', companyName: 'Blue' }]
        }
      }
    })
  ),
  updateCompanyGroup: jest.fn(() => Promise.resolve({ data: { resourceId: 'g-updated' } }))
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getSelectSearchPayload: jest.fn((payload, search) => ({
      ...payload,
      filter: { ...payload.filter, SearchInputTextValue: search }
    }))
  }
})

import CreateItemModal from '@/components/CompanyGroups/CreateItemModal.vue'
import {
  createCompanyGroups,
  searchCompanies,
  searchGroupCompanies,
  updateCompanyGroup
} from '@/api/company'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CreateItemModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('computes title/subtitle for create and edit', () => {
    expect(CreateItemModal.computed.getTitle.call({ isEdit: false })).toBe('Create New Company Group')
    expect(CreateItemModal.computed.getSubtitle.call({ isEdit: false })).toBe(
      'Give a name to your new group and save'
    )
    expect(CreateItemModal.computed.getTitle.call({ isEdit: true })).toBe('Edit Company Group')
    expect(CreateItemModal.computed.getSubtitle.call({ isEdit: true })).toBe(
      'Edit a name to your group and save'
    )
  })

  it('created calls getCompanies and editHandler when selectedRow exists', () => {
    const ctx = {
      getCompanies: jest.fn(),
      editHandler: jest.fn(),
      selectedRow: { resourceId: 'g1' }
    }
    CreateItemModal.created.call(ctx)
    expect(ctx.getCompanies).toHaveBeenCalled()
    expect(ctx.editHandler).toHaveBeenCalled()
  })

  it('getCompanies loads and maps response', async () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      payload: { pageNumber: 1 },
      totalNumberOfPagesOfCompanies: 2,
      isCompaniesLoading: false,
      showLoader: true,
      companies: [],
      $set: set,
      setCompanies: CreateItemModal.methods.setCompanies
    }
    CreateItemModal.methods.getCompanies.call(ctx)
    await flushPromises()
    expect(searchCompanies).toHaveBeenCalled()
    expect(ctx.companies).toEqual([{ companyResourceId: 'c1', companyName: 'Acme' }])
    expect(ctx.totalNumberOfPagesOfCompanies).toBe(2)
    expect(ctx.isCompaniesLoading).toBe(false)
  })

  it('getCompanies with addPage returns when exceeding pages', async () => {
    const ctx = {
      payload: { pageNumber: 2 },
      totalNumberOfPagesOfCompanies: 2
    }
    CreateItemModal.methods.getCompanies.call(ctx, true)
    await flushPromises()
    expect(searchCompanies).not.toHaveBeenCalled()
  })

  it('setCompanies appends results to companies list', () => {
    const ctx = { companies: [{ companyResourceId: 'old' }] }
    CreateItemModal.methods.setCompanies.call(ctx, {
      data: { data: { results: [{ companyResourceId: 'new' }] } }
    })
    expect(ctx.companies).toEqual([{ companyResourceId: 'old' }, { companyResourceId: 'new' }])
  })

  it('getCompaniesSearch executes search or fallback getCompanies', async () => {
    const getCompanies = jest.fn()
    const ctx = {
      payload: { filter: {} },
      setCompanies: jest.fn(),
      isCompaniesLoading: true,
      getCompanies
    }
    CreateItemModal.methods.getCompaniesSearch.call(ctx, 'ac')
    await flushPromises()
    expect(searchCompanies).toHaveBeenCalled()

    CreateItemModal.methods.getCompaniesSearch.call(ctx, '')
    expect(getCompanies).toHaveBeenCalled()
  })

  it('editHandler loads selected companies for edit mode and forCompany mode', async () => {
    const editCtx = {
      isShow: true,
      isEdit: true,
      forCompany: false,
      selectedRow: { resourceId: 'g1', name: 'Group 1' },
      payload: {},
      selectedCompanies: [],
      companies: [],
      groupName: ''
    }
    CreateItemModal.methods.editHandler.call(editCtx)
    await flushPromises()
    expect(searchGroupCompanies).toHaveBeenCalledWith('g1', {})
    expect(editCtx.groupName).toBe('Group 1')
    expect(editCtx.selectedCompanies).toEqual([{ companyResourceId: 'c2', companyName: 'Blue' }])

    const forCompanyCtx = {
      isShow: true,
      isEdit: false,
      forCompany: true,
      selectedRow: { companyResourceId: 'c9' },
      payload: {},
      selectedCompanies: [],
      companies: [],
      groupName: 'x'
    }
    CreateItemModal.methods.editHandler.call(forCompanyCtx)
    expect(forCompanyCtx.groupName).toBe(null)
    expect(forCompanyCtx.selectedCompanies).toEqual([{ companyResourceId: 'c9' }])
  })

  it('changeStatus resets fields and emits modal status', () => {
    const emit = jest.fn()
    const ctx = {
      companies: [{ companyResourceId: 'c1' }],
      groupName: 'A',
      selectedCompanies: [{ companyResourceId: 'c1' }],
      $refs: { refCreateGroupForm: { reset: jest.fn() } },
      $emit: emit
    }
    CreateItemModal.methods.changeStatus.call(ctx, false)
    expect(ctx.companies).toBe(null)
    expect(ctx.groupName).toBe(null)
    expect(ctx.selectedCompanies).toEqual([])
    expect(emit).toHaveBeenCalledWith('changeModalStatus', false)
  })

  it('save creates company group when not edit', async () => {
    const emit = jest.fn()
    const ctx = {
      $refs: { refCreateGroupForm: { validate: () => true } },
      saveDisable: false,
      selectedCompanies: [{ companyResourceId: 'c1' }, { companyResourceId: 'c2' }],
      groupName: 'New Group',
      isEdit: false,
      forCompany: false,
      changeStatus: jest.fn(),
      $emit: emit
    }
    CreateItemModal.methods.save.call(ctx)
    await flushPromises()

    expect(createCompanyGroups).toHaveBeenCalledWith({
      name: 'New Group',
      companyResourceIdArray: ['c1', 'c2']
    })
    expect(emit).toHaveBeenCalledWith('companyGroupCreated', 'new-g-1', 'New Group')
    expect(ctx.changeStatus).toHaveBeenCalledWith(false)
    expect(ctx.saveDisable).toBe(false)
  })

  it('save updates company group when edit mode', async () => {
    const emit = jest.fn()
    const ctx = {
      $refs: { refCreateGroupForm: { validate: () => true } },
      saveDisable: false,
      selectedCompanies: [{ companyResourceId: 'c9' }],
      groupName: 'Edited Group',
      isEdit: true,
      forCompany: false,
      selectedRow: { resourceId: 'g1' },
      changeStatus: jest.fn(),
      $emit: emit
    }
    CreateItemModal.methods.save.call(ctx)
    await flushPromises()

    expect(updateCompanyGroup).toHaveBeenCalledWith('g1', {
      name: 'Edited Group',
      companyResourceIdArray: ['c9']
    })
    expect(localStorage.getItem('companyGroupName')).toBe('Edited Group')
    expect(emit).toHaveBeenCalledWith('companyGroupCreated', 'g-updated')
    expect(ctx.changeStatus).toHaveBeenCalledWith(false)
  })
})
