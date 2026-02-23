import CallbackTemplates from '@/components/CallbackScenarios/CallbackTemplates.vue'
import CallbackService from '@/api/callback'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    searchCallbackTemplates: jest.fn(),
    exportCallbackTemplates: jest.fn(),
    getCallbackTemplateLanguages: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackTemplates.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getTemplateId returns selected template id or empty string', () => {
    expect(CallbackTemplates.computed.getTemplateId.call({ selectedTemplate: { resourceId: 't-1' } })).toBe('t-1')
    expect(CallbackTemplates.computed.getTemplateId.call({ selectedTemplate: null })).toBe('')
  })

  it('beforeRouteLeave blocks navigation when modal is open', () => {
    const next = jest.fn()
    const changeCallbackTemplateModalStatus = jest.fn()
    const ctx = {
      $refs: {
        refCallbackTemplateModal: {
          status: true,
          changeCallbackTemplateModalStatus
        }
      }
    }

    CallbackTemplates.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(changeCallbackTemplateModalStatus).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave allows navigation when modal is closed or missing', () => {
    const next = jest.fn()
    CallbackTemplates.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('onToggleShowPreviewModal toggles visibility and clears selected template on close', () => {
    const ctx = {
      isPreviewVisible: false,
      selectedTemplate: { resourceId: 't-1' }
    }

    CallbackTemplates.methods.onToggleShowPreviewModal.call(ctx)
    expect(ctx.isPreviewVisible).toBe(true)

    CallbackTemplates.methods.onToggleShowPreviewModal.call(ctx)
    expect(ctx.isPreviewVisible).toBe(false)
    expect(ctx.selectedTemplate).toBe(null)
  })

  it('handleEdit and handlePreview set states correctly', () => {
    const row = { resourceId: 't-2' }
    const ctx = {
      selectedTemplate: null,
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      onToggleShowPreviewModal: jest.fn()
    }

    CallbackTemplates.methods.handleEdit.call(ctx, row, true)
    expect(ctx.selectedTemplate).toEqual(row)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isDuplicate).toBe(true)

    CallbackTemplates.methods.handlePreview.call(ctx, row)
    expect(ctx.onToggleShowPreviewModal).toHaveBeenCalled()
  })

  it('changeNewCallbackTemplateModalStatus resets state and refreshes in restart flow', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      selectedTemplate: { resourceId: 'x' },
      isEdit: true,
      isDuplicate: true,
      callForData
    }

    CallbackTemplates.methods.changeNewCallbackTemplateModalStatus.call(ctx, false, true)
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.selectedTemplate).toBe(null)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(callForData).toHaveBeenCalled()
  })

  it('changeNewCallbackTemplateModalStatus closes modal without restart refresh', () => {
    const ctx = {
      modalStatus: true,
      selectedTemplate: { resourceId: 'x' },
      isEdit: true,
      isDuplicate: true,
      callForData: jest.fn()
    }

    CallbackTemplates.methods.changeNewCallbackTemplateModalStatus.call(ctx, false, false)
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.selectedTemplate).toEqual({ resourceId: 'x' })
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('callForData redirects when search permission is missing', () => {
    const push = jest.fn()
    const ctx = {
      getCallbackTemplatesSearchPermissions: false,
      $router: { push }
    }

    CallbackTemplates.methods.callForData.call(ctx)
    expect(push).toHaveBeenCalledWith('/')
  })

  it('callForData populates table and server-side props on success', async () => {
    CallbackService.searchCallbackTemplates.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 3,
          totalNumberOfPages: 2,
          pageNumber: 1,
          results: [{ resourceId: '1' }]
        }
      }
    })
    const ctx = {
      getCallbackTemplatesSearchPermissions: true,
      isLoading: false,
      axiosPayload: { filter: {} },
      tableData: [],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 }
    }

    CallbackTemplates.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(3)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: '1' }])
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData clears table on api failure', async () => {
    CallbackService.searchCallbackTemplates.mockRejectedValueOnce(new Error('search fail'))
    const ctx = {
      getCallbackTemplatesSearchPermissions: true,
      isLoading: false,
      axiosPayload: { filter: {} },
      tableData: [{ resourceId: 'old' }],
      serverSideProps: {}
    }

    CallbackTemplates.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.isLoading).toBe(false)
  })

  it('callForLanguages sets unique language/voice filters and rerenders filters', async () => {
    CallbackService.getCallbackTemplateLanguages.mockResolvedValueOnce({
      data: {
        data: [
          { language: 'English', name: 'Amy' },
          { language: 'English', name: 'Jenny' },
          { language: 'Turkish', name: 'Cem' }
        ]
      }
    })
    const voiceColumn = { property: 'voice', filterableItems: [] }
    const languageColumn = { property: 'language', filterableItems: [] }
    const ctx = {
      languageItems: [],
      voices: [],
      languages: [],
      tableOptions: { columns: [voiceColumn, languageColumn] },
      $set: (obj, key, val) => {
        obj[key] = val
      },
      $refs: { refCallbackTemplatesTable: { reRenderFilters: jest.fn() } }
    }

    CallbackTemplates.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.voices).toEqual(['Amy', 'Jenny', 'Cem'])
    expect(ctx.languages).toEqual(['English', 'Turkish'])
    expect(voiceColumn.filterableItems).toEqual(['Amy', 'Jenny', 'Cem'])
    expect(languageColumn.filterableItems).toEqual(['English', 'Turkish'])
    expect(ctx.$refs.refCallbackTemplatesTable.reRenderFilters).toHaveBeenCalled()
  })

  it('handleMultipleDelete and handleActionDelete set delete modal states', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      multipleTemplatesPayload: {},
      serverSideProps: { totalNumberOfRecords: 10 },
      axiosPayload: { filter: { FilterGroups: [] } },
      isDeleteModalVisible: false,
      selectedTemplate: null
    }
    const selections = [{ resourceId: 'a' }, { resourceId: 'b' }]
    CallbackTemplates.methods.handleMultipleDelete.call(ctx, selections, ['x'], false)
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedTemplatesCount).toBe(2)
    expect(ctx.multipleTemplatesPayload.items).toEqual(['a', 'b'])
    expect(ctx.isDeleteModalVisible).toBe(true)

    CallbackTemplates.methods.handleActionDelete.call(ctx, { resourceId: 'z' })
    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.selectedTemplate).toEqual({ resourceId: 'z' })
    expect(ctx.isDeleteModalVisible).toBe(true)
  })

  it('delete success handlers reset selection and refresh data', () => {
    const resetSelectableParams = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      isDeleteModalVisible: true,
      callForData,
      $refs: { refCallbackTemplatesTable: { resetSelectableParams } }
    }

    CallbackTemplates.methods.handleSuccessDeleteAction.call(ctx, {})
    expect(resetSelectableParams).toHaveBeenCalledTimes(1)
    expect(ctx.isDeleteModalVisible).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)

    CallbackTemplates.methods.handleSuccessMultipleDeleteAction.call(ctx)
    expect(resetSelectableParams).toHaveBeenCalledTimes(2)
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('onCloseDeleteModal and handleFastLaunch update selected template state', () => {
    const ctx = {
      selectedTemplate: { resourceId: 'x' },
      isDeleteModalVisible: true
    }
    CallbackTemplates.methods.onCloseDeleteModal.call(ctx)
    expect(ctx.selectedTemplate).toBe(null)
    expect(ctx.isDeleteModalVisible).toBe(false)

    CallbackTemplates.methods.handleFastLaunch.call(ctx, { resourceId: 'y' })
    expect(ctx.selectedTemplate).toEqual({ resourceId: 'y' })
  })

  it('checkIfCanCloseCallbackTemplateModal calls guard only when modal ref exists', () => {
    const guard = jest.fn()
    const ctx = { $refs: { refCallbackTemplateModal: { changeCallbackTemplateModalStatus: guard } } }
    CallbackTemplates.methods.checkIfCanCloseCallbackTemplateModal.call(ctx)
    expect(guard).toHaveBeenCalled()

    expect(() =>
      CallbackTemplates.methods.checkIfCanCloseCallbackTemplateModal.call({ $refs: {} })
    ).not.toThrow()
  })

  it('exportCallbackTemplates triggers download for blob response', async () => {
    const blob = new Blob(['x'], { type: 'text/plain' })
    CallbackService.exportCallbackTemplates.mockResolvedValueOnce({ data: blob })

    const click = jest.fn()
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:url')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(v) {},
      set download(v) {}
    })
    const ctx = { axiosPayload: { filter: {} } }

    CallbackTemplates.methods.exportCallbackTemplates.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(CallbackService.exportCallbackTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportCallbackTemplates skips download when response is not blob', async () => {
    CallbackService.exportCallbackTemplates.mockResolvedValueOnce({ data: { ok: true } })
    const createElementSpy = jest.spyOn(document, 'createElement')
    const ctx = { axiosPayload: { filter: {} } }

    CallbackTemplates.methods.exportCallbackTemplates.call(ctx, {
      exportTypes: ['PDF'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(createElementSpy).not.toHaveBeenCalled()
    createElementSpy.mockRestore()
  })
})
