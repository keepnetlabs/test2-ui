jest.mock('@/api/ldap', () => ({
  searchADGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1,
          pageSize: 10
        }
      }
    })
  )
}))

import TargetUserLDAPImportTable from '@/components/TargetUsers/LDAP/TargetUserLDAPImportTable.vue'
import LDAPService from '@/api/ldap'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data returns tableOptions with iEmpty message', () => {
    const data = TargetUserLDAPImportTable.data()
    expect(data.tableOptions.iEmpty.message).toBeDefined()
    expect(data.tableOptions.columns.length).toBeGreaterThan(0)
  })

  it('created calls callForData', () => {
    const ctx = {
      callForData: jest.fn()
    }

    TargetUserLDAPImportTable.created.call(ctx)

    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData updates pagination and table rows', async () => {
    LDAPService.searchADGroups.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ filterValue: 'group-1', displayName: 'Group 1', count: 3 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 2,
          pageSize: 25
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { pageNumber: 2 },
      resourceId: 'ldap-1',
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0,
        pageSize: 10
      },
      tableData: [],
      initialGroupFilterValues: [],
      isInitial: true,
      $refs: {},
      handleServerSideSelectionParams: jest.fn()
    }

    TargetUserLDAPImportTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(LDAPService.searchADGroups).toHaveBeenCalledWith({
      pageNumber: 2,
      lDAPSettingId: 'ldap-1'
    })
    expect(ctx.serverSideProps).toEqual({
      totalNumberOfRecords: 1,
      totalNumberOfPages: 1,
      pageNumber: 2,
      pageSize: 25
    })
    expect(ctx.tableData).toEqual([{ filterValue: 'group-1', displayName: 'Group 1', count: 3 }])
    expect(ctx.isInitial).toBe(false)
  })

  it('callForData applies initial group selection and select-all state', async () => {
    LDAPService.searchADGroups.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            { filterValue: 'group-1', displayName: 'Group 1', count: 3 },
            { filterValue: 'group-2', displayName: 'Group 2', count: 2 }
          ],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          pageSize: 10
        }
      }
    })
    const getServerSideSelectionParams = jest.fn(() => ({
      isSelectedAllEver: true,
      excludedResourceIdList: []
    }))
    const getSelectedObjectAndSelectRowsByRowKey = jest.fn()
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { pageNumber: 1 },
      resourceId: 'ldap-2',
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0,
        pageSize: 10
      },
      tableData: [],
      initialGroupFilterValues: ['group-1', 'group-2'],
      isInitial: true,
      handleServerSideSelectionParams: jest.fn(),
      $refs: {
        refTable: {
          $refs: { elTableRef: {} },
          getSelectedObjectAndSelectRowsByRowKey,
          serverSideSelectionCount: 0,
          isSelectedAllEver: false,
          getServerSideSelectionParams
        }
      }
    }

    TargetUserLDAPImportTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(getSelectedObjectAndSelectRowsByRowKey).toHaveBeenCalledWith([
      { filterValue: 'group-1' },
      { filterValue: 'group-2' }
    ])
    expect(ctx.$refs.refTable.serverSideSelectionCount).toBe(2)
    expect(ctx.$refs.refTable.isSelectedAllEver).toBe(true)
    expect(ctx.handleServerSideSelectionParams).toHaveBeenCalledWith({
      isSelectedAllEver: true,
      excludedResourceIdList: []
    })
    expect(ctx.isInitial).toBe(false)
  })

  it('handleSelectionChange emits on-selection-change', () => {
    const handleServerSideSelectionParams = jest.fn()
    const ctx = {
      $refs: { refTable: { getServerSideSelectionParams: () => ({}) } },
      handleServerSideSelectionParams,
      $emit: jest.fn()
    }
    TargetUserLDAPImportTable.methods.handleSelectionChange.call(ctx, [])
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-change', [])
  })

  it('handleSelectedAll forwards server-side selection params', () => {
    const handleServerSideSelectionParams = jest.fn()
    const ctx = {
      $refs: {
        refTable: {
          getServerSideSelectionParams: () => ({ isSelectedAllEver: true })
        }
      },
      handleServerSideSelectionParams
    }

    TargetUserLDAPImportTable.methods.handleSelectedAll.call(ctx)

    expect(handleServerSideSelectionParams).toHaveBeenCalledWith({ isSelectedAllEver: true })
  })
})
