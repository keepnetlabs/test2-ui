import Scenarios from '@/components/PhishingScenarios/Scenarios.vue'
import { getScenariosList, exportScenarios } from '@/api/scenarios'
import { getPhishingScenarioRoles } from '@/api/phishingsimulator'

jest.mock('@/api/scenarios', () => ({
  deleteScenario: jest.fn(),
  exportScenarios: jest.fn(() => Promise.resolve({ data: 'mock-blob-data' })),
  getScenariosList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: []
        }
      }
    })
  ),
  bulkDeleteScenarios: jest.fn()
}))

jest.mock('@/api/phishingsimulator', () => ({
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn(),
  getPhishingScenarioRoles: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PhishingScenarios/Scenarios.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isAttachmentBasedScenario returns true only for Attachment method', () => {
    expect(Scenarios.computed.isAttachmentBasedScenario.call({ selectedRow: { method: 'Attachment' } })).toBe(
      true
    )
    expect(Scenarios.computed.isAttachmentBasedScenario.call({ selectedRow: { method: 'MFA' } })).toBeUndefined()
  })

  it('scenarioDetailsLookup watcher updates filter items and rerenders filters', () => {
    const ctx = {
      tableOptions: {
        columns: [{}, {}, {}, {}, {}, {}, {}]
      },
      scenarioDetailsLookup: {
        categories: [{ text: 'Finance' }],
        methodTypes: [{ text: 'Phishing' }],
        difficultyTypes: [{ text: 'Hard' }]
      },
      $refs: { refScenariosList: { reRenderFilters: jest.fn() } },
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    Scenarios.watch.scenarioDetailsLookup.handler.call(ctx)

    expect(ctx.tableOptions.columns[1].filterableItems).toEqual([{ text: 'Finance', value: 'Finance' }])
    expect(ctx.tableOptions.columns[2].filterableItems).toEqual([
      { text: 'Phishing', value: 'Phishing' }
    ])
    expect(ctx.tableOptions.columns[6].filterableItems).toEqual([{ text: 'Hard', value: 'Hard' }])
    expect(ctx.$refs.refScenariosList.reRenderFilters).toHaveBeenCalled()
  })

  it('callForRoles maps roles and updates roles filter column', async () => {
    getPhishingScenarioRoles.mockResolvedValueOnce({
      data: { data: [{ name: 'Admin', resourceId: 'r-1' }] }
    })
    const ctx = {
      tableOptions: {
        columns: [{ property: 'name' }, { property: 'roles' }]
      },
      scenarioRoles: [],
      roleFilterOptions: [],
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $nextTick: (cb) => cb(),
      $refs: { refScenariosList: { reRenderFilters: jest.fn() } }
    }

    Scenarios.methods.callForRoles.call(ctx)
    await flushPromises()

    expect(ctx.scenarioRoles).toEqual([{ name: 'Admin', resourceId: 'r-1' }])
    expect(ctx.roleFilterOptions).toEqual([{ text: 'Admin', value: 'r-1' }])
    expect(ctx.tableOptions.columns[1].filterableItems).toEqual([{ text: 'Admin', value: 'r-1' }])
    expect(ctx.$refs.refScenariosList.reRenderFilters).toHaveBeenCalled()
  })

  it('callForRoles skips table updates when roles column is missing', async () => {
    getPhishingScenarioRoles.mockResolvedValueOnce({
      data: { data: [{ name: 'Admin', resourceId: 'r-1' }] }
    })
    const ctx = {
      tableOptions: {
        columns: [{ property: 'name' }]
      },
      scenarioRoles: [],
      roleFilterOptions: [],
      $set: jest.fn(),
      $nextTick: jest.fn(),
      $refs: { refScenariosList: { reRenderFilters: jest.fn() } }
    }

    Scenarios.methods.callForRoles.call(ctx)
    await flushPromises()

    expect(ctx.scenarioRoles).toEqual([{ name: 'Admin', resourceId: 'r-1' }])
    expect(ctx.roleFilterOptions).toEqual([{ text: 'Admin', value: 'r-1' }])
    expect(ctx.$set).not.toHaveBeenCalled()
    expect(ctx.$refs.refScenariosList.reRenderFilters).not.toHaveBeenCalled()
  })

  it('callForRoles falls back to empty arrays on error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    getPhishingScenarioRoles.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      tableOptions: { columns: [] },
      scenarioRoles: [{ name: 'x' }],
      roleFilterOptions: [{ text: 'x', value: 'x' }]
    }

    Scenarios.methods.callForRoles.call(ctx)
    await flushPromises()

    expect(ctx.scenarioRoles).toEqual([])
    expect(ctx.roleFilterOptions).toEqual([])
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('callForData maps language and roles and updates server side props', async () => {
    getScenariosList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            {
              resourceId: 's-1',
              languageTypeName: ['Turkish'],
              roles: [{ name: 'Role A' }]
            },
            {
              resourceId: 's-2',
              languageTypeName: 'English',
              roles: []
            }
          ]
        }
      }
    })
    const ctx = {
      loading: false,
      getPhishingScenariosSearchPermissions: true,
      axiosPayload: { pageNumber: 1 },
      languageFilterOptions: [
        { languageName: 'Turkish', text: 'TR' },
        { languageName: 'English', text: 'EN' }
      ],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    Scenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.loading).toBe(false)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData[0].languageTypeName).toEqual(['TR'])
    expect(ctx.tableData[0].roles).toEqual(['Role A'])
    expect(ctx.tableData[1].languageTypeName).toBe('EN')
  })

  it('callForData keeps unknown language values and maps mixed role payloads', async () => {
    getScenariosList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            {
              resourceId: 's-x',
              languageTypeName: ['Klingon'],
              roles: [{ name: 'Role A' }, 'Role B']
            }
          ]
        }
      }
    })
    const ctx = {
      loading: false,
      getPhishingScenariosSearchPermissions: true,
      axiosPayload: { pageNumber: 1 },
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    Scenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languageTypeName).toEqual(['Klingon'])
    expect(ctx.tableData[0].roles).toEqual(['Role A', 'Role B'])
  })

  it('callForData sets empty table on api failure', async () => {
    getScenariosList.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      loading: false,
      getPhishingScenariosSearchPermissions: true,
      axiosPayload: {},
      languageFilterOptions: [],
      serverSideProps: {},
      tableData: [{ id: 1 }]
    }

    Scenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('handleFastLaunch selects row, toggles fast launch and closes preview if open', () => {
    const ctx = {
      selectedRow: null,
      isShowPreviewDialog: true,
      toggleShowFastLaunch: jest.fn(),
      toggleShowPreviewDialog: jest.fn()
    }
    Scenarios.methods.handleFastLaunch.call(ctx, { resourceId: 's-1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 's-1' })
    expect(ctx.toggleShowFastLaunch).toHaveBeenCalled()
    expect(ctx.toggleShowPreviewDialog).toHaveBeenCalled()
  })

  it('handleFastLaunch does not toggle preview when preview dialog is closed', () => {
    const ctx = {
      selectedRow: null,
      isShowPreviewDialog: false,
      toggleShowFastLaunch: jest.fn(),
      toggleShowPreviewDialog: jest.fn()
    }
    Scenarios.methods.handleFastLaunch.call(ctx, { resourceId: 's-2' })
    expect(ctx.selectedRow).toEqual({ resourceId: 's-2' })
    expect(ctx.toggleShowFastLaunch).toHaveBeenCalled()
    expect(ctx.toggleShowPreviewDialog).not.toHaveBeenCalled()
  })

  it('mounted calls language/role/data loaders', () => {
    const ctx = {
      callForLanguages: jest.fn(),
      callForRoles: jest.fn(),
      callForData: jest.fn()
    }

    Scenarios.mounted.call(ctx)
    expect(ctx.callForLanguages).toHaveBeenCalledWith('refScenariosList')
    expect(ctx.callForRoles).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handlePreview and handleEditTemplate update selected scenario and preview state', () => {
    const previewCtx = {
      selectedPhishingScenario: {},
      toggleShowPreviewDialog: jest.fn()
    }
    const row = { resourceId: 's-99' }
    Scenarios.methods.handlePreview.call(previewCtx, row)
    expect(previewCtx.selectedPhishingScenario).toEqual(row)
    expect(previewCtx.toggleShowPreviewDialog).toHaveBeenCalled()

    const editTemplateCtx = {
      selectedPhishingScenario: row,
      isShowPreviewDialog: true,
      handleEdit: jest.fn(),
      toggleShowPreviewDialog: jest.fn()
    }
    Scenarios.methods.handleEditTemplate.call(editTemplateCtx)
    expect(editTemplateCtx.handleEdit).toHaveBeenCalledWith(row, false)
    expect(editTemplateCtx.toggleShowPreviewDialog).toHaveBeenCalled()
  })

  it('handleEditTemplate keeps preview as-is when dialog is already closed', () => {
    const row = { resourceId: 's-100' }
    const ctx = {
      selectedPhishingScenario: row,
      isShowPreviewDialog: false,
      handleEdit: jest.fn(),
      toggleShowPreviewDialog: jest.fn()
    }

    Scenarios.methods.handleEditTemplate.call(ctx)
    expect(ctx.handleEdit).toHaveBeenCalledWith(row, false)
    expect(ctx.toggleShowPreviewDialog).not.toHaveBeenCalled()
  })

  it('toggleShowFastLaunch toggles state and clears selected row when closing', () => {
    const openCtx = { isShowFastLaunch: false, selectedRow: { resourceId: 'x' } }
    Scenarios.methods.toggleShowFastLaunch.call(openCtx)
    expect(openCtx.isShowFastLaunch).toBe(true)
    expect(openCtx.selectedRow).toEqual({ resourceId: 'x' })

    const closeCtx = { isShowFastLaunch: true, selectedRow: { resourceId: 'x' } }
    Scenarios.methods.toggleShowFastLaunch.call(closeCtx)
    expect(closeCtx.isShowFastLaunch).toBe(false)
    expect(closeCtx.selectedRow).toBeNull()
  })

  it('handleEdit sets modal/edit state and scenario identifiers', () => {
    const row = { resourceId: 's-2', name: 'Row' }
    const ctx = {
      selectedRow: null,
      editableFormValues: {},
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null
    }

    Scenarios.methods.handleEdit.call(ctx, row, true)
    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.editableFormValues).toEqual(row)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isDuplicate).toBe(true)
    expect(ctx.scenarioId).toBe('s-2')
  })

  it('close-check helpers delegate to refs when available', () => {
    const ctx = {
      $refs: {
        newScenarioModal: { changeNewScenarioModalStatus: jest.fn() },
        fastLaunch: { closeOverlay: jest.fn() }
      }
    }

    Scenarios.methods.checkIfCanCLoseNewScenarioModal.call(ctx)
    expect(ctx.$refs.newScenarioModal.changeNewScenarioModalStatus).toHaveBeenCalled()

    Scenarios.methods.checkIfCanCloseFastLaunchModal.call(ctx)
    expect(ctx.$refs.fastLaunch.closeOverlay).toHaveBeenCalled()
  })

  it('close-check helpers are no-op when refs are missing', () => {
    const ctx = { $refs: {} }
    expect(() => Scenarios.methods.checkIfCanCLoseNewScenarioModal.call(ctx)).not.toThrow()
    expect(() => Scenarios.methods.checkIfCanCloseFastLaunchModal.call(ctx)).not.toThrow()
  })

  it('handleActionDelete sets single-delete state and opens modal', () => {
    const row = { resourceId: 's-del' }
    const ctx = {
      isMultipleDelete: true,
      selectedScenario: null,
      showDeleteModal: false
    }

    Scenarios.methods.handleActionDelete.call(ctx, row)
    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.selectedScenario).toEqual(row)
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('toggleShowScenarioStatistics toggles modal visibility', () => {
    const ctx = { isShowScenarioStatistics: false }
    Scenarios.methods.toggleShowScenarioStatistics.call(ctx)
    expect(ctx.isShowScenarioStatistics).toBe(true)
    Scenarios.methods.toggleShowScenarioStatistics.call(ctx)
    expect(ctx.isShowScenarioStatistics).toBe(false)
  })

  it('handleStatisticsModalStatusChange closes drawer with timeout when status is false', () => {
    jest.useFakeTimers()
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue({
      style: { right: '0px' }
    })
    const ctx = { isShowScenarioStatistics: true }

    Scenarios.methods.handleStatisticsModalStatusChange.call(ctx, false)
    expect(document.querySelector('.k-navigation-drawer').style.right).toBe('-100%')
    jest.advanceTimersByTime(260)
    expect(ctx.isShowScenarioStatistics).toBe(false)

    querySelectorSpy.mockRestore()
    jest.useRealTimers()
  })

  it('handleStatisticsModalStatusChange sets modal directly when status is true', () => {
    const ctx = { isShowScenarioStatistics: false }
    Scenarios.methods.handleStatisticsModalStatusChange.call(ctx, true)
    expect(ctx.isShowScenarioStatistics).toBe(true)
  })

  it('toggleShowPreviewDialog toggles and clears selected scenario when closing', () => {
    const ctx = {
      isShowPreviewDialog: false,
      selectedPhishingScenario: { resourceId: 's-1' }
    }

    Scenarios.methods.toggleShowPreviewDialog.call(ctx)
    expect(ctx.isShowPreviewDialog).toBe(true)
    expect(ctx.selectedPhishingScenario).toEqual({ resourceId: 's-1' })

    Scenarios.methods.toggleShowPreviewDialog.call(ctx)
    expect(ctx.isShowPreviewDialog).toBe(false)
    expect(ctx.selectedPhishingScenario).toEqual({})
  })

  it('callForData does not call api when search permission is missing', async () => {
    const ctx = {
      loading: false,
      getPhishingScenariosSearchPermissions: false,
      axiosPayload: {},
      languageFilterOptions: [],
      serverSideProps: {},
      tableData: []
    }

    Scenarios.methods.callForData.call(ctx)
    await flushPromises()
    expect(getScenariosList).not.toHaveBeenCalled()
    expect(ctx.loading).toBe(true)
  })

  it('success delete handlers reset selection, close modal and refresh data', () => {
    const callForData = jest.fn()
    const resetSelectableParams = jest.fn()
    const ctx = {
      showDeleteModal: true,
      $refs: { refScenariosList: { resetSelectableParams } },
      callForData
    }

    Scenarios.methods.handleSuccessDeleteAction.call(ctx, {})
    expect(resetSelectableParams).toHaveBeenCalled()
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)

    callForData.mockClear()
    ctx.showDeleteModal = true
    Scenarios.methods.handleSuccessMultipleDeleteAction.call(ctx)
    expect(resetSelectableParams).toHaveBeenCalledTimes(2)
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleSuccessMultipleDeleteAction works without table ref via optional chaining', () => {
    const callForData = jest.fn()
    const ctx = {
      showDeleteModal: true,
      $refs: {},
      callForData
    }

    Scenarios.methods.handleSuccessMultipleDeleteAction.call(ctx)
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('changeNewScenarioModalStatus resets edit state and restarts data fetch when requested', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      scenarioId: 's-1',
      isEdit: true,
      isDuplicate: true,
      selectedRow: { id: 1 },
      editableFormValues: { a: 1 },
      callForData
    }
    Scenarios.methods.changeNewScenarioModalStatus.call(ctx, false, true)
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.editableFormValues).toEqual({})
    expect(ctx.scenarioId).toBe(null)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(callForData).toHaveBeenCalled()
  })

  it('changeNewScenarioModalStatus without restart closes modal and keeps editable form values', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      scenarioId: 's-1',
      isEdit: true,
      isDuplicate: true,
      selectedRow: { id: 1 },
      editableFormValues: { a: 1 },
      callForData
    }

    Scenarios.methods.changeNewScenarioModalStatus.call(ctx, false, false)
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.scenarioId).toBeNull()
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.editableFormValues).toEqual({ a: 1 })
    expect(callForData).not.toHaveBeenCalled()
  })

  it('handleMultipleDelete builds payload and opens delete modal', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      serverSideProps: { totalNumberOfRecords: 20 },
      axiosPayload: { filter: { FilterGroups: [] } },
      multipleScenariosPayload: {},
      showDeleteModal: false
    }
    Scenarios.methods.handleMultipleDelete.call(
      ctx,
      [{ resourceId: 's-1' }, { resourceId: 's-2' }],
      ['s-9'],
      false
    )
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedScenariosCount).toBe(2)
    expect(ctx.multipleScenariosPayload.items).toEqual(['s-1', 's-2'])
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('handleMultipleDelete uses total count when selectAll is true', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      serverSideProps: { totalNumberOfRecords: 77 },
      axiosPayload: { filter: { FilterGroups: [] } },
      multipleScenariosPayload: {},
      showDeleteModal: false
    }

    Scenarios.methods.handleMultipleDelete.call(ctx, [{ resourceId: 's-1' }], ['s-x'], true)
    expect(ctx.multipleDeletedScenariosCount).toBe(77)
    expect(ctx.multipleScenariosPayload.items).toEqual([])
    expect(ctx.multipleScenariosPayload.selectAll).toBe(true)
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('exportScenario converts XLS to Excel payload and creates download link', async () => {
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const oldURL = global.URL
    global.URL = { ...(oldURL || {}), createObjectURL: jest.fn(() => 'blob:mock') }

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }
    Scenarios.methods.exportScenario.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportScenarios).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        pageNumber: 1,
        pageSize: 10
      })
    )
    expect(link.download).toBe('Scenarios.xlsx')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    global.URL = oldURL
  })

  it('exportScenario keeps non-XLS extension and payload type', async () => {
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const oldURL = global.URL
    global.URL = { ...(oldURL || {}), createObjectURL: jest.fn(() => 'blob:mock-csv') }

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }
    Scenarios.methods.exportScenario.call(ctx, {
      exportTypes: ['CSV'],
      reportAllPages: true,
      pageNumber: 2,
      pageSize: 25
    })
    await flushPromises()

    expect(exportScenarios).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'CSV',
        reportAllPages: true,
        pageNumber: 2,
        pageSize: 25
      })
    )
    expect(link.download).toBe('Scenarios.csv')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    global.URL = oldURL
  })

  it('exportScenario supports multiple export types in one call', async () => {
    exportScenarios
      .mockResolvedValueOnce({ data: 'blob-xls' })
      .mockResolvedValueOnce({ data: 'blob-csv' })

    const links = [
      { click: jest.fn(), href: '', download: '' },
      { click: jest.fn(), href: '', download: '' }
    ]
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => links.shift())
    const oldURL = global.URL
    global.URL = { ...(oldURL || {}), createObjectURL: jest.fn(() => 'blob:mock') }

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }
    Scenarios.methods.exportScenario.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportScenarios).toHaveBeenCalledTimes(2)
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    global.URL = oldURL
  })

  it('exportScenario does not call api when exportTypes is empty', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }
    Scenarios.methods.exportScenario.call(ctx, {
      exportTypes: [],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportScenarios).not.toHaveBeenCalled()
  })
})
