import Scenarios from '@/components/PhishingScenarios/Scenarios.vue'
import { getScenariosList, exportScenarios } from '@/api/scenarios'
import { getPhishingScenarioRoles } from '@/api/phishingsimulator'

jest.mock('@/api/scenarios', () => ({
  deleteScenario: jest.fn(),
  exportScenarios: jest.fn(() => Promise.resolve({ data: new Blob(['x']) })),
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
})
