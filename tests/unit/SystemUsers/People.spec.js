import People from '@/components/SystemUsers/People.vue'
import {
  bulkDeleteSystemUsers,
  deleteSystemUser,
  exportSystemUsers,
  getSystemUsers
} from '@/api/systemUsers'

jest.mock('@/api/systemUsers', () => ({
  bulkDeleteSystemUsers: jest.fn(() => Promise.resolve()),
  deleteSystemUser: jest.fn(() => Promise.resolve()),
  exportSystemUsers: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  getSystemUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 'u-1' }]
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SystemUsers/People.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isSameUser returns true only when selected row email matches current user', () => {
    expect(
      People.computed.isSameUser.call({
        getUser: { email: 'user@acme.com' },
        selectedRow: { email: 'user@acme.com' }
      })
    ).toBe(true)
    expect(
      People.computed.isSameUser.call({
        getUser: { email: 'user@acme.com' },
        selectedRow: { email: 'other@acme.com' }
      })
    ).toBe(false)
  })

  it('handleSearchChange maps StatusName filter to StatusId and triggers refresh', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    People.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'StatusName', Value: 'Active' },
              { FieldName: 'Email', Value: 'x@acme.com' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'StatusId', Value: 'Active' },
      { FieldName: 'Email', Value: 'x@acme.com' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData sets table and server side props on success', async () => {
    const ctx = {
      loading: false,
      getSystemUsersSearchPermission: true,
      axiosPayload: { pageNumber: 1 },
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    People.methods.callForData.call(ctx)
    await flushPromises()

    expect(getSystemUsers).toHaveBeenCalledWith({ pageNumber: 1 })
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'u-1' }])
    expect(ctx.loading).toBe(false)
  })

  it('callForData sets empty table on api error', async () => {
    getSystemUsers.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      loading: false,
      getSystemUsersSearchPermission: true,
      axiosPayload: {},
      serverSideProps: {},
      tableData: [{ id: 1 }]
    }

    People.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('handleMultipleDeleteOfSystemUsers builds payload and toggles delete modal', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      serverSideProps: { totalNumberOfRecords: 17 },
      axiosPayload: { filter: { FilterGroups: [] } },
      multipleSystemUserPayload: {},
      toggleShowDeleteSystemUserModal: jest.fn()
    }

    People.methods.handleMultipleDeleteOfSystemUsers.call(
      ctx,
      [{ resourceId: 'u-1' }, { resourceId: 'u-2' }],
      ['u-9'],
      false
    )

    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedUserCount).toBe(2)
    expect(ctx.multipleSystemUserPayload.items).toEqual(['u-1', 'u-2'])
    expect(ctx.toggleShowDeleteSystemUserModal).toHaveBeenCalled()
  })

  it('toggleShowDeleteSystemUserModal resets state when closing', () => {
    const ctx = {
      showDeleteSystemUserModal: true,
      selectedDeleteRow: { resourceId: 'u-1' },
      multipleSystemUserPayload: { items: ['u-1'] },
      isMultipleDelete: true,
      multipleDeletedUserCount: 1
    }

    People.methods.toggleShowDeleteSystemUserModal.call(ctx)

    expect(ctx.selectedDeleteRow).toBe(null)
    expect(ctx.multipleSystemUserPayload).toEqual({})
    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.multipleDeletedUserCount).toBe(0)
    expect(ctx.showDeleteSystemUserModal).toBe(false)
  })

  it('callForDeleteUser unselects row and refreshes list', async () => {
    const row = { resourceId: 'u-1' }
    const ctx = {
      deleteButtonDisabled: false,
      $refs: {
        refSystemUsersList: {
          unSelectRow: jest.fn(),
          changeServerSideSelectionCount: jest.fn()
        }
      },
      toggleShowDeleteSystemUserModal: jest.fn(),
      callForData: jest.fn()
    }

    People.methods.callForDeleteUser.call(ctx, row)
    expect(ctx.deleteButtonDisabled).toBe(true)
    await flushPromises()

    expect(deleteSystemUser).toHaveBeenCalledWith('u-1')
    expect(ctx.$refs.refSystemUsersList.unSelectRow).toHaveBeenCalledWith(row)
    expect(ctx.$refs.refSystemUsersList.changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(ctx.toggleShowDeleteSystemUserModal).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.deleteButtonDisabled).toBe(false)
  })

  it('exportSystemUsers maps XLS to Excel and triggers download link', async () => {
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const oldURL = globalThis.URL
    globalThis.URL = { ...(oldURL || {}), createObjectURL: jest.fn(() => 'blob:system-users') }

    const ctx = {
      axiosPayload: {
        orderBy: 'CreateTime',
        ascending: false,
        filter: { FilterGroups: [] }
      }
    }

    People.methods.exportSystemUsers.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 2,
      pageSize: 50,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportSystemUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        pageNumber: 2,
        pageSize: 50
      })
    )
    expect(link.download).toBe('System Users.xlsx')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL = oldURL
  })
})
