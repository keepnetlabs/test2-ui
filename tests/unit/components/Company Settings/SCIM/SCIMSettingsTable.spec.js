jest.mock('@/api/scimSettings', () => ({
  __esModule: true,
  searchSCIMSettings: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'r1', name: 'SCIM A' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportSCIMSettings: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import SCIMSettingsTable from '@/components/Company Settings/SCIM/SCIMSettingsTable.vue'
import { searchSCIMSettings, exportSCIMSettings } from '@/api/scimSettings'

describe('SCIMSettingsTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(SCIMSettingsTable.name).toBe('SCIMSettingsTable')
  })

  it('callForData returns early when search permission is false', () => {
    const ctx = {
      getSCIMSettingsSearchPermissions: false,
      setLoading: jest.fn()
    }
    SCIMSettingsTable.methods.callForData.call(ctx)
    expect(searchSCIMSettings).not.toHaveBeenCalled()
    expect(ctx.setLoading).not.toHaveBeenCalled()
  })

  it('callForData populates table and server side props with permission', async () => {
    const ctx = {
      getSCIMSettingsSearchPermissions: true,
      setLoading: jest.fn(),
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: []
    }
    SCIMSettingsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(searchSCIMSettings).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1', name: 'SCIM A' }])
  })

  it('emits edit/delete/revoke/add events', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 'r1' }
    SCIMSettingsTable.methods.handleEdit.call(ctx, row)
    SCIMSettingsTable.methods.handleDelete.call(ctx, row)
    SCIMSettingsTable.methods.handleRevoke.call(ctx, row)
    SCIMSettingsTable.methods.handleAddNewSCIM.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-revoke', row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-add')
  })

  it('exportSCIMSettingsList returns early when export permission is false', () => {
    const ctx = {
      getSCIMSettingsExportPermissions: false
    }
    SCIMSettingsTable.methods.exportSCIMSettingsList.call(ctx, {
      exportTypes: ['CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    expect(exportSCIMSettings).not.toHaveBeenCalled()
  })

  it('exportSCIMSettingsList calls export and downloads file', async () => {
    const link = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const prevCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')

    const ctx = {
      getSCIMSettingsExportPermissions: true,
      axiosPayload: { orderBy: 'createTime', ascending: true, filter: {} }
    }
    SCIMSettingsTable.methods.exportSCIMSettingsList.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(exportSCIMSettings).toHaveBeenCalled()
    expect(link.download).toBe('SCIM Settings.xlsx')

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = prevCreateObjectURL
  })
})
