jest.mock('@/api/direct-creation', () => ({
  __esModule: true,
  default: {
    searchEmailCreations: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ resourceId: 'r1', name: 'DEC A', isDefault: false }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    ),
    makeDefault: jest.fn(() => Promise.resolve()),
    removeDefault: jest.fn(() => Promise.resolve()),
    exportDirectEmailCreation: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
  }
}))

import DirectEmailCreationTable from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreationTable.vue'
import DirectCreationService from '@/api/direct-creation'

describe('DirectEmailCreationTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DirectEmailCreationTable.name).toBe('DirectEmailCreationTable')
  })

  it('callForData fills table data and pagination props', async () => {
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: []
    }
    DirectEmailCreationTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.searchEmailCreations).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1', name: 'DEC A', isDefault: false }])
  })

  it('handleMakeDefault uses removeDefault for default rows', async () => {
    const ctx = {
      setLoading: jest.fn(),
      callForData: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }
    DirectEmailCreationTable.methods.handleMakeDefault.call(ctx, {
      resourceId: 'r1',
      isDefault: true
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.removeDefault).toHaveBeenCalledWith('r1')
    expect(ctx.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleMakeDefault uses makeDefault for non-default rows', async () => {
    const ctx = {
      setLoading: jest.fn(),
      callForData: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }
    DirectEmailCreationTable.methods.handleMakeDefault.call(ctx, {
      resourceId: 'r2',
      isDefault: false
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(DirectCreationService.makeDefault).toHaveBeenCalledWith('r2')
    expect(ctx.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleAddConfiguration emits platform specific events', () => {
    const ctx = {
      addConfigurationItems: [{ text: 'Google Workspace' }, { text: 'Microsoft 365' }],
      $emit: jest.fn()
    }
    DirectEmailCreationTable.methods.handleAddConfiguration.call(ctx, { text: 'Google Workspace' })
    DirectEmailCreationTable.methods.handleAddConfiguration.call(ctx, { text: 'Microsoft 365' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-add-google-workspace')
    expect(ctx.$emit).toHaveBeenCalledWith('on-add-microsoft-365')
  })

  it('exportDirectEmailCreationList exports and downloads file', async () => {
    const link = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const prevCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = {
      axiosPayload: { orderBy: 'createTime', ascending: true, filter: {} }
    }

    DirectEmailCreationTable.methods.exportDirectEmailCreationList.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(DirectCreationService.exportDirectEmailCreation).toHaveBeenCalled()
    expect(link.download).toBe('Direct-Email-Creations.xlsx')

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = prevCreateObjectURL
  })
})
