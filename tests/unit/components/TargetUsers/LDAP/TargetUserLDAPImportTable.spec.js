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

describe('TargetUserLDAPImportTable.vue', () => {
  it('data returns tableOptions with iEmpty message', () => {
    const data = TargetUserLDAPImportTable.data()
    expect(data.tableOptions.iEmpty.message).toBeDefined()
    expect(data.tableOptions.columns.length).toBeGreaterThan(0)
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
})
