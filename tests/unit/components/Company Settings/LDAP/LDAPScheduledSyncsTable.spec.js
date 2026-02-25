jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    searchLDAPSchedule: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ resourceId: 'r1', name: 'Sync 1' }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    )
  }
}))

import LDAPScheduledSyncsTable from '@/components/Company Settings/LDAP/LDAPScheduledSyncsTable.vue'
import LDAPService from '@/api/ldap'

describe('LDAPScheduledSyncsTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(LDAPScheduledSyncsTable.name).toBe('LDAPScheduledSyncsTable')
  })

  it('callForData fills table and server side props', async () => {
    const ctx = {
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    LDAPScheduledSyncsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(LDAPService.searchLDAPSchedule).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1', name: 'Sync 1' }])
  })

  it('handleEdit and handleDelete emit events', () => {
    const row = { resourceId: 'r2' }
    const ctx = { $emit: jest.fn() }
    LDAPScheduledSyncsTable.methods.handleEdit.call(ctx, row)
    LDAPScheduledSyncsTable.methods.handleDelete.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', row)
  })

  it('unSelectRow delegates to datatable ref', () => {
    const row = { resourceId: 'r3' }
    const ctx = { $refs: { refTable: { unSelectRow: jest.fn() } } }
    LDAPScheduledSyncsTable.methods.unSelectRow.call(ctx, row)
    expect(ctx.$refs.refTable.unSelectRow).toHaveBeenCalledWith(row)
  })
})
