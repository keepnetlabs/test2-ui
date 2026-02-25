import SMTPSettings from '@/components/Company Settings/SmtpSettings/SMTPSettings.vue'
import { searchSmtpSettings, exportSmtpSettings, deleteSmtpSettings } from '@/api/smtpSettings'

jest.mock('@/api/smtpSettings', () => ({
  __esModule: true,
  searchSmtpSettings: jest.fn(),
  exportSmtpSettings: jest.fn(),
  deleteSmtpSettings: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SMTPSettings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(SMTPSettings.name).toBe('SMTPSettings')
  })

  it('changeMultipleDeleteDisability toggles delete state by selection ownership', () => {
    const setMock = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      $set: setMock,
      selectedTableItems: [{ isOwner: true }, { isOwner: true }],
      tableOptions: { selectEvent: { disabledStatuses: { delete: false } } }
    }
    SMTPSettings.methods.changeMultipleDeleteDisability.call(ctx)
    expect(ctx.tableOptions.selectEvent.disabledStatuses.delete).toBe(false)

    ctx.selectedTableItems = [{ isOwner: true }, { isOwner: false }]
    SMTPSettings.methods.changeMultipleDeleteDisability.call(ctx)
    expect(ctx.tableOptions.selectEvent.disabledStatuses.delete).toBe(true)
  })

  it('callForData respects search permission and maps response payload', async () => {
    const denyCtx = { getSMTPSettingsSearchPermissions: false }
    SMTPSettings.methods.callForData.call(denyCtx)
    expect(searchSmtpSettings).not.toHaveBeenCalled()

    searchSmtpSettings.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 's1' }],
          totalNumberOfRecords: 8,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getSMTPSettingsSearchPermissions: true,
      loading: false,
      axiosPayload: {},
      tableData: [],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      changeMultipleDeleteDisability: jest.fn()
    }
    SMTPSettings.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchSmtpSettings).toHaveBeenCalled()
    expect(ctx.tableData).toEqual([{ resourceId: 's1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(8)
    expect(ctx.changeMultipleDeleteDisability).toHaveBeenCalled()
    expect(ctx.loading).toBe(false)
  })

  it('search and sort handlers map fields then refresh data', () => {
    const ctx = {
      axiosPayload: {
        ascending: true,
        orderBy: '',
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    SMTPSettings.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'StatusName', Value: 'Running' }] }]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Status', Value: 'Running' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()

    SMTPSettings.methods.sortChanged.call(ctx, { order: 'descending', prop: 'statusName' })
    expect(ctx.axiosPayload.ascending).toBe(false)
    expect(ctx.axiosPayload.orderBy).toBe('Status')
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('edit and delete handlers are permission-gated', () => {
    const noPermCtx = {
      getSMTPSettingsUpdatePermissions: false,
      getSMTPSettingsGetPermissions: true,
      getSMTPSettingsDeletePermissions: false,
      toggleSmtpModalStatus: jest.fn(),
      toggleDeleteSmtpModalStatus: jest.fn()
    }
    SMTPSettings.methods.handleEditAction.call(noPermCtx, { resourceId: 'x1' })
    SMTPSettings.methods.handleDeleteAction.call(noPermCtx, { resourceId: 'x1' })
    expect(noPermCtx.toggleSmtpModalStatus).not.toHaveBeenCalled()
    expect(noPermCtx.toggleDeleteSmtpModalStatus).not.toHaveBeenCalled()

    const permCtx = {
      getSMTPSettingsUpdatePermissions: true,
      getSMTPSettingsGetPermissions: true,
      getSMTPSettingsDeletePermissions: true,
      isEdit: false,
      selectedEditSmtpSettings: null,
      selectedDeleteSmtpSettings: null,
      toggleSmtpModalStatus: jest.fn(),
      toggleDeleteSmtpModalStatus: jest.fn()
    }
    SMTPSettings.methods.handleEditAction.call(permCtx, { resourceId: 'x2' })
    SMTPSettings.methods.handleDeleteAction.call(permCtx, { resourceId: 'x2' })
    expect(permCtx.isEdit).toBe(true)
    expect(permCtx.selectedEditSmtpSettings).toBe('x2')
    expect(permCtx.selectedDeleteSmtpSettings).toEqual({ resourceId: 'x2' })
    expect(permCtx.toggleSmtpModalStatus).toHaveBeenCalled()
    expect(permCtx.toggleDeleteSmtpModalStatus).toHaveBeenCalled()
  })

  it('handleDeleteMultipleSmtpSettings iterates only with delete permission', () => {
    const denyCtx = { getSMTPSettingsDeletePermissions: false, handleDeleteSmtpSettings: jest.fn() }
    SMTPSettings.methods.handleDeleteMultipleSmtpSettings.call(denyCtx, [{ resourceId: '1' }])
    expect(denyCtx.handleDeleteSmtpSettings).not.toHaveBeenCalled()

    const allowCtx = { getSMTPSettingsDeletePermissions: true, handleDeleteSmtpSettings: jest.fn() }
    SMTPSettings.methods.handleDeleteMultipleSmtpSettings.call(allowCtx, [
      { resourceId: '1' },
      { resourceId: '2' }
    ])
    expect(allowCtx.handleDeleteSmtpSettings).toHaveBeenCalledTimes(2)
  })

  it('exportSmtpSettingsList maps XLS to Excel and clicks generated links', async () => {
    exportSmtpSettings.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:smtp')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click
    })
    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: { FilterGroups: [] } }
    }
    SMTPSettings.methods.exportSmtpSettingsList.call(ctx, {
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false,
      exportTypes: ['XLS', 'CSV']
    })
    await flushPromises()

    expect(exportSmtpSettings).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'Excel' }))
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('callForDeleteSmtpSettings and handleDeleteSmtpSettings run delete flow with permission', async () => {
    deleteSmtpSettings.mockResolvedValue({})
    const callCtx = {
      getSMTPSettingsDeletePermissions: true,
      selectedDeleteSmtpSettings: { resourceId: 'x' },
      callForData: jest.fn()
    }
    SMTPSettings.methods.callForDeleteSmtpSettings.call(callCtx, 'x')
    await flushPromises()
    expect(deleteSmtpSettings).toHaveBeenCalledWith('x')
    expect(callCtx.callForData).toHaveBeenCalled()
    expect(callCtx.selectedDeleteSmtpSettings).toBeNull()

    const handleCtx = {
      getSMTPSettingsDeletePermissions: true,
      $refs: { refSmtpSettingsList: { unSelectRow: jest.fn() } },
      callForDeleteSmtpSettings: jest.fn()
    }
    const row = { resourceId: 'x2' }
    SMTPSettings.methods.handleDeleteSmtpSettings.call(handleCtx, row)
    expect(handleCtx.$refs.refSmtpSettingsList.unSelectRow).toHaveBeenCalledWith(row)
    expect(handleCtx.callForDeleteSmtpSettings).toHaveBeenCalledWith('x2')
  })
})
