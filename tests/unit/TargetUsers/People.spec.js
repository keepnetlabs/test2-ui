import People from '@/components/TargetUsers/People.vue'
import { bulkDeleteTargetUsers } from '@/api/targetUsers'

jest.mock('@/api/targetUsers', () => ({
  bulkDeleteTargetUsers: jest.fn(() => Promise.resolve()),
  deleteTargetUser: jest.fn(),
  exportTargetUsers: jest.fn(),
  getTargetUserCustomFieldsByCompanyId: jest.fn(),
  getTargetUsersCountSummary: jest.fn(),
  getTargetUsers: jest.fn(),
  searchTargetGroups: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUsers/People.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('normalizeStatusValues supports arrays and comma-separated values', () => {
    expect(People.methods.normalizeStatusValues.call({}, ['1', '0'])).toEqual(['1', '0'])
    expect(People.methods.normalizeStatusValues.call({}, '1, 0, Deleted')).toEqual([
      '1',
      '0'
    ])
  })

  it('normalizeStatusFilterItems maps mixed status + deleted into OR filters', () => {
    const ctx = {}
    const result = People.methods.normalizeStatusFilterItems.call(
      ctx,
      [{ FieldName: 'Status', Value: '1,Deleted', Operator: 'Include' }],
      [{ FieldName: 'Email', Value: 'a@b.com', Operator: 'Contains' }]
    )

    expect(result.andItems).toEqual([])
    expect(result.orItems).toEqual([
      { FieldName: 'Email', Value: 'a@b.com', Operator: 'Contains' },
      { FieldName: 'IsDeleted', Value: true, Operator: 'Contains' },
      { FieldName: 'Status', Value: '1', Operator: 'Include' }
    ])
  })

  it('normalizeStatusFilterItems creates IsDeleted false when deleted is not selected', () => {
    const result = People.methods.normalizeStatusFilterItems.call(
      {},
      [{ FieldName: 'Status', Value: '0', Operator: 'Contains' }],
      []
    )

    expect(result.andItems).toEqual([
      { FieldName: 'IsDeleted', Value: false, Operator: 'Contains' },
      { FieldName: 'Status', Value: '0', Operator: 'Contains' }
    ])
    expect(result.orItems).toEqual([])
  })

  it('handleSearchChange removes TimeZone and PreferredLanguage filters', () => {
    const ctx = {
      payload: {
        filter: {
          FilterGroups: [[], { FilterItems: [] }]
        }
      },
      resetPageNumber: jest.fn(),
      callForGetTargetUserCustomFieldsByCompanyId: jest.fn()
    }

    People.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'Email', Value: 'a@b.com' },
              { FieldName: 'TimeZone', Value: 'UTC' },
              { FieldName: 'PreferredLanguage', Value: 'English' }
            ]
          }
        ]
      }
    })

    expect(ctx.payload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Email', Value: 'a@b.com' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForGetTargetUserCustomFieldsByCompanyId).toHaveBeenCalled()
  })

  it('handleMultipleDelete blocks when selection has deleted users', () => {
    const ctx = {
      isMultipleDelete: false,
      changeDeleteModalStatus: jest.fn()
    }

    People.methods.handleMultipleDelete.call(
      ctx,
      [{ resourceId: 'u-1', status: 'Deleted' }],
      [],
      false
    )

    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.changeDeleteModalStatus).not.toHaveBeenCalled()
  })

  it('handleMultipleDelete builds payload and opens modal for valid selection', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      serverSideProps: { totalNumberOfRecords: 20 },
      payload: { filter: { FilterGroups: [] } },
      multipleTargetUserPayload: {},
      changeDeleteModalStatus: jest.fn()
    }

    People.methods.handleMultipleDelete.call(
      ctx,
      [{ resourceId: 'u-1' }, { resourceId: 'u-2' }],
      ['u-9'],
      false
    )

    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedUserCount).toBe(2)
    expect(ctx.multipleTargetUserPayload.items).toEqual(['u-1', 'u-2'])
    expect(ctx.changeDeleteModalStatus).toHaveBeenCalledWith(true)
  })

  it('callForMultipleDelete sets error message when api fails and resets button/loading', async () => {
    bulkDeleteTargetUsers.mockRejectedValueOnce({
      response: { data: { message: 'bulk delete failed' } }
    })
    const ctx = {
      deleteButtonDisabled: false,
      loading: false,
      multipleTargetUserPayload: { items: ['u-1'] },
      bulkDeleteErrorMessage: '',
      $refs: {},
      callForTargetUsers: jest.fn(),
      callForTargetUsersCountSummary: jest.fn(),
      changeDeleteModalStatus: jest.fn()
    }

    People.methods.callForMultipleDelete.call(ctx)
    expect(ctx.deleteButtonDisabled).toBe(true)
    expect(ctx.loading).toBe(true)
    await flushPromises()

    expect(ctx.bulkDeleteErrorMessage).toBe('bulk delete failed')
    expect(ctx.loading).toBe(false)
    expect(ctx.deleteButtonDisabled).toBe(false)
  })

  it('handleAddUsersSelectionClick builds payload for server-side select-all mode', () => {
    const toggle = jest.fn()
    const ctx = {
      selection: [{ resourceId: 'u-1' }],
      selectedUserToAddToGroup: null,
      payload: { filter: { FilterGroups: [] } },
      serverSideProps: { totalNumberOfRecords: 50 },
      $refs: {
        refPeopleTable: {
          getServerSideSelectionParams: jest.fn(() => ({
            isSelectedAllEver: true,
            excludedResourceIdList: ['u-2', 'u-3']
          }))
        }
      },
      bulkImportPayload: {},
      toggleShowingTargetUserAddToGroup: toggle
    }

    People.methods.handleAddUsersSelectionClick.call(ctx)

    expect(ctx.selectedUserToAddToGroup).toEqual([{ resourceId: 'u-1' }])
    expect(ctx.bulkImportPayload).toEqual({
      targetUserResourceIds: [],
      selectAll: true,
      excludedResourceIdList: ['u-2', 'u-3'],
      filter: { FilterGroups: [] },
      selectedRowCount: 48
    })
    expect(toggle).toHaveBeenCalled()
  })

  it('changeDeleteModalStatus resets delete state on close', () => {
    const ctx = {
      isWantToShowDeleteUserModal: true,
      selectedRow: { resourceId: 'u-1' },
      multipleTargetUserPayload: { items: ['u-1'] },
      isMultipleDelete: true,
      multipleDeletedUserCount: 1
    }

    People.methods.changeDeleteModalStatus.call(ctx, false)
    expect(ctx.isWantToShowDeleteUserModal).toBe(false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.multipleTargetUserPayload).toEqual({})
    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.multipleDeletedUserCount).toBe(0)
  })
})
