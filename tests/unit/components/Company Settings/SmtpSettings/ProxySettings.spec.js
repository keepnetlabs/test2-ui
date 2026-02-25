import ProxySettings from '@/components/Company Settings/SmtpSettings/ProxySettings.vue'
import {
  searchProxySettings,
  exportProxySettings,
  deleteProxySettings
} from '@/api/proxySettings'

jest.mock('@/api/proxySettings', () => ({
  __esModule: true,
  searchProxySettings: jest.fn(),
  exportProxySettings: jest.fn(),
  deleteProxySettings: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ProxySettings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(ProxySettings.name).toBe('PROXYSettings')
  })

  it('callForData returns early without search permission', () => {
    const ctx = {
      getProxySettingsSearchPermissions: false,
      loading: false,
      axiosPayload: {}
    }
    ProxySettings.methods.callForData.call(ctx)
    expect(searchProxySettings).not.toHaveBeenCalled()
  })

  it('callForData maps server response when permission exists', async () => {
    searchProxySettings.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'p1' }],
          totalNumberOfRecords: 5,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getProxySettingsSearchPermissions: true,
      loading: false,
      axiosPayload: {},
      tableData: [],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 }
    }
    ProxySettings.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchProxySettings).toHaveBeenCalled()
    expect(ctx.tableData).toEqual([{ resourceId: 'p1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(ctx.loading).toBe(false)
  })

  it('handleSearchChange maps AuthenticationTypeName and fetches data', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    ProxySettings.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'AuthenticationTypeName', Value: 'Basic' }]
          }
        ]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'AuthenticationType', Value: 'Basic' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('toggleProxyModalStatus resets edit state while closing', () => {
    const ctx = { newProxyModalStatus: true, isEdit: true, resourceId: 'r1' }
    ProxySettings.methods.toggleProxyModalStatus.call(ctx)
    expect(ctx.newProxyModalStatus).toBe(false)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.resourceId).toBeNull()
  })

  it('edit and delete handlers set modal and selection states', () => {
    const editCtx = {
      isEdit: false,
      selectedEditProxySettings: null,
      toggleProxyModalStatus: jest.fn()
    }
    ProxySettings.methods.handleEditAction.call(editCtx, { resourceId: 'p9' })
    expect(editCtx.isEdit).toBe(true)
    expect(editCtx.selectedEditProxySettings).toBe('p9')
    expect(editCtx.toggleProxyModalStatus).toHaveBeenCalled()

    const deleteCtx = {
      selectedDeleteProxySettings: null,
      toggleDeleteProxyModalStatus: jest.fn()
    }
    ProxySettings.methods.handleDeleteAction.call(deleteCtx, { resourceId: 'p2' })
    expect(deleteCtx.selectedDeleteProxySettings).toEqual({ resourceId: 'p2' })
    expect(deleteCtx.toggleDeleteProxyModalStatus).toHaveBeenCalled()
  })

  it('delete flow calls api and unselects row', async () => {
    deleteProxySettings.mockResolvedValue({})
    const ctx = {
      $refs: { refProxySettingsList: { unSelectRow: jest.fn() } },
      callForDeleteProxySettings: jest.fn()
    }
    const row = { resourceId: 'p3' }
    ProxySettings.methods.handleDeleteProxySettings.call(ctx, row)
    expect(ctx.$refs.refProxySettingsList.unSelectRow).toHaveBeenCalledWith(row)
    expect(ctx.callForDeleteProxySettings).toHaveBeenCalledWith('p3')
  })

  it('exportProxySettingsList creates downloads for requested types', async () => {
    exportProxySettings.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click
    })
    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: { FilterGroups: [] } }
    }

    ProxySettings.methods.exportProxySettingsList.call(ctx, {
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: true,
      exportTypes: ['XLS', 'CSV']
    })
    await flushPromises()

    expect(exportProxySettings).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'Excel' }))
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
