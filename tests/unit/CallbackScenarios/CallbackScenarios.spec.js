import CallbackScenarios from '@/components/CallbackScenarios/CallbackScenarios.vue'
import CallbackService from '@/api/callback'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    searchCallbackScenarios: jest.fn(),
    exportCallbackScenarios: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackScenarios.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('toggleShowPreviewDialog toggles state and resets selected scenario on close', () => {
    const ctx = {
      isShowPreviewDialog: false,
      selectedPhishingScenario: { resourceId: 's-1' }
    }

    CallbackScenarios.methods.toggleShowPreviewDialog.call(ctx)
    expect(ctx.isShowPreviewDialog).toBe(true)
    expect(ctx.selectedPhishingScenario).toEqual({ resourceId: 's-1' })

    CallbackScenarios.methods.toggleShowPreviewDialog.call(ctx)
    expect(ctx.isShowPreviewDialog).toBe(false)
    expect(ctx.selectedPhishingScenario).toEqual({})
  })

  it('toggleShowFastLaunch toggles state and resets selected row on close', () => {
    const ctx = {
      isShowFastLaunch: false,
      selectedRow: { resourceId: 's-1' }
    }

    CallbackScenarios.methods.toggleShowFastLaunch.call(ctx)
    expect(ctx.isShowFastLaunch).toBe(true)

    CallbackScenarios.methods.toggleShowFastLaunch.call(ctx)
    expect(ctx.isShowFastLaunch).toBe(false)
    expect(ctx.selectedRow).toBe(null)
  })

  it('handleEdit sets modal/edit/duplicate flags and scenario id', () => {
    const row = { resourceId: 'sc-1', name: 'Scenario' }
    const ctx = {
      selectedRow: null,
      editableFormValues: {},
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null
    }

    CallbackScenarios.methods.handleEdit.call(ctx, row, true)

    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.editableFormValues).toEqual(row)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isDuplicate).toBe(true)
    expect(ctx.scenarioId).toBe('sc-1')
  })

  it('changeNewScenarioModalStatus resets state and refreshes on restart', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      selectedRow: { resourceId: 'sc-1' },
      editableFormValues: { name: 'x' },
      scenarioId: 'sc-1',
      isEdit: true,
      isDuplicate: true,
      callForData
    }

    CallbackScenarios.methods.changeNewScenarioModalStatus.call(ctx, false, true)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.editableFormValues).toEqual({})
    expect(ctx.scenarioId).toBe(null)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(callForData).toHaveBeenCalled()
  })

  it('callForData maps language names and updates server-side props', async () => {
    CallbackService.searchCallbackScenarios.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 3,
          pageNumber: 1,
          results: [
            { resourceId: '1', languageTypeName: 'English' },
            { resourceId: '2', languageTypeName: 'UnknownLang' }
          ]
        }
      }
    })
    const ctx = {
      loading: false,
      getCallbackScenariosSearchPermissions: true,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      tableData: []
    }

    CallbackScenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(CallbackService.searchCallbackScenarios).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(3)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([
      { resourceId: '1', languageTypeName: 'EN' },
      { resourceId: '2', languageTypeName: 'UnknownLang' }
    ])
    expect(ctx.loading).toBe(false)
  })

  it('callForData sets empty table on api failure', async () => {
    CallbackService.searchCallbackScenarios.mockRejectedValueOnce(new Error('fail'))
    const ctx = {
      loading: false,
      getCallbackScenariosSearchPermissions: true,
      axiosPayload: { filter: {} },
      serverSideProps: {},
      languageFilterOptions: [],
      tableData: [{ resourceId: 'x' }]
    }

    CallbackScenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('handleMultipleDelete prepares payload for selected rows mode', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      multipleScenariosPayload: {},
      axiosPayload: { filter: { FilterGroups: [] } },
      showDeleteModal: false,
      serverSideProps: { totalNumberOfRecords: 10 }
    }
    const selections = [{ resourceId: '1' }, { resourceId: '2' }]

    CallbackScenarios.methods.handleMultipleDelete.call(ctx, selections, ['x'], false)

    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedScenariosCount).toBe(2)
    expect(ctx.multipleScenariosPayload).toEqual({
      items: ['1', '2'],
      excludedItems: ['x'],
      selectAll: false,
      filter: { FilterGroups: [] }
    })
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('handleMultipleDelete uses total count in selectAll mode', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      multipleScenariosPayload: {},
      axiosPayload: { filter: {} },
      showDeleteModal: false,
      serverSideProps: { totalNumberOfRecords: 42 }
    }

    CallbackScenarios.methods.handleMultipleDelete.call(ctx, [{ resourceId: '1' }], [], true)

    expect(ctx.multipleDeletedScenariosCount).toBe(42)
    expect(ctx.multipleScenariosPayload.items).toEqual([])
  })

  it('exportScenario creates downloadable file links for each export type', async () => {
    const blob = new Blob(['x'], { type: 'text/plain' })
    CallbackService.exportCallbackScenarios
      .mockResolvedValueOnce({ data: blob })
      .mockResolvedValueOnce({ data: blob })

    const click = jest.fn()
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:url')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(v) {},
      set download(v) {}
    })

    const ctx = { axiosPayload: { filter: { FilterGroups: [] } } }
    CallbackScenarios.methods.exportScenario.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 20
    })
    await flushPromises()

    expect(CallbackService.exportCallbackScenarios).toHaveBeenCalledTimes(2)
    expect(CallbackService.exportCallbackScenarios).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(CallbackService.exportCallbackScenarios).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })
})
