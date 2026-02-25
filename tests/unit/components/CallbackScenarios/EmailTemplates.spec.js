import CallbackService from '@/api/callback'
import EmailTemplates from '@/components/CallbackScenarios/EmailTemplates.vue'

jest.mock('@/api/callback', () => ({
  getEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  exportEmailTemplates: jest.fn(() => Promise.resolve({ data: {} })),
  searchEmailTemplates: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

describe('CallbackScenarios EmailTemplates.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('changeNewEmailTemplateModalStatus resets state and refreshes on restart', () => {
    const ctx = {
      modalStatus: true,
      emailTemplateId: 'x',
      isEdit: true,
      isDuplicate: true,
      editableFormValues: { a: 1 },
      callForData: jest.fn()
    }

    EmailTemplates.methods.changeNewEmailTemplateModalStatus.call(ctx, false, true)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.emailTemplateId).toBeNull()
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.editableFormValues).toEqual({})
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleMultipleDelete builds payload for selectAll and manual selections', () => {
    const baseCtx = {
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      multipleTemplatesPayload: {},
      serverSideProps: { totalNumberOfRecords: 10 },
      axiosPayload: { filter: { Condition: 'AND' } },
      showDeleteModal: false
    }

    EmailTemplates.methods.handleMultipleDelete.call(baseCtx, [{ resourceId: 'a' }], ['x'], false)
    expect(baseCtx.isMultipleDelete).toBe(true)
    expect(baseCtx.multipleDeletedTemplatesCount).toBe(1)
    expect(baseCtx.multipleTemplatesPayload).toEqual({
      items: ['a'],
      excludedItems: ['x'],
      selectAll: false,
      filter: { Condition: 'AND' }
    })

    EmailTemplates.methods.handleMultipleDelete.call(baseCtx, [{ resourceId: 'a' }], [], true)
    expect(baseCtx.multipleDeletedTemplatesCount).toBe(10)
    expect(baseCtx.multipleTemplatesPayload.items).toEqual([])
  })

  it('callForData maps language names for array and scalar languageTypeName', async () => {
    CallbackService.searchEmailTemplates.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            { languageTypeName: ['tr-TR', 'en-US'] },
            { languageTypeName: 'en-US' }
          ],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      getCallbackEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: {},
      serverSideProps: {},
      tableData: [],
      languageFilterOptions: [
        { languageName: 'tr-TR', text: 'Turkish' },
        { languageName: 'en-US', text: 'English' }
      ]
    }

    EmailTemplates.methods.callForData.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData[0].languageTypeName).toEqual(['Turkish', 'English'])
    expect(ctx.tableData[1].languageTypeName).toBe('English')
    expect(ctx.loading).toBe(false)
  })

  it('callForData handles api failure by clearing table', async () => {
    CallbackService.searchEmailTemplates.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      getCallbackEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: {},
      serverSideProps: {},
      tableData: [{ id: 1 }],
      languageFilterOptions: []
    }

    EmailTemplates.methods.callForData.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('exportEmailTemplates maps XLS to Excel and triggers link click', async () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    const ctx = {
      axiosPayload: { filter: { Condition: 'AND' } }
    }

    EmailTemplates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 20
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.exportEmailTemplates).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(CallbackService.exportEmailTemplates).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
