import { shallowMount } from '@vue/test-utils'
import Scenarios from '@/components/SmishingScenarios/Scenarios.vue'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getScenarioDataDetails } from '@/api/scenarios'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          preferredLanguageTypes: []
        }
      }
    })
  )
}))

jest.mock('@/api/smishing', () => ({
  getSmishingScenarioFormDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          methodTypes: [{ text: 'Click-Only' }],
          difficultyTypes: [{ text: 'Hard' }]
        }
      }
    })
  ),
  searchSmishingScenarios: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 's1', languageTypeName: 'English', name: 'Scenario 1' }]
        }
      }
    })
  ),
  exportSmishingScenarios: jest.fn(() => Promise.resolve({ data: {} })),
  deleteSmishingScenario: jest.fn(() => Promise.resolve()),
  bulkDeleteSmishingScenarios: jest.fn(() => Promise.resolve())
}))

const DataTableStub = {
  name: 'DataTable',
  render(h) {
    return h('div')
  },
  methods: {
    reRenderFilters() {},
    resetSelectableParams() {}
  }
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingScenarios Scenarios.vue', () => {
  const createWrapper = (getterOverrides = {}) =>
    shallowMount(Scenarios, {
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingScenariosSearchPermissions': true,
            'permissions/getSmishingScenariosEditPermissions': true,
            'permissions/getSmishingScenariosDeletePermissions': true,
            'permissions/getSmishingScenariosExportPermissions': true,
            'permissions/getSmishingScenariosCreatePermissions': true,
            ...getterOverrides
          }
        }
      },
      stubs: {
        DataTable: DataTableStub,
        NewScenario: true,
        CommonSimulatorDeleteScenario: true,
        SmishingScenarioPreview: true,
        NoTextMessageTemplateModal: true,
        NoLandingPageTemplateModal: true,
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true,
        ScenariosRowActionsDeleteButton: true,
        ScenariosRowActionsEditButton: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('mounted loads languages + scenario details + table data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalled()
    expect(SmishingService.getSmishingScenarioFormDetails).toHaveBeenCalled()
    expect(SmishingService.searchSmishingScenarios).toHaveBeenCalled()
    expect(wrapper.vm.scenarioDetailsLookup.methodTypes[0].text).toBe('Click-Only')
    expect(wrapper.vm.tableData[0].name).toBe('Scenario 1')
  })

  it('callForData handles API errors by clearing table', async () => {
    SmishingService.searchSmishingScenarios.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      loading: false,
      getSmishingScenariosSearchPermissions: true,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      languageFilterOptions: [],
      tableData: [{ resourceId: 'old' }]
    }
    await Scenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('callForData no-ops when search permission is false', async () => {
    const ctx = {
      loading: false,
      getSmishingScenariosSearchPermissions: false,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      languageFilterOptions: [],
      tableData: [{ resourceId: 'old' }]
    }

    await Scenarios.methods.callForData.call(ctx)
    await flushPromises()

    expect(SmishingService.searchSmishingScenarios).not.toHaveBeenCalled()
    expect(ctx.tableData).toEqual([{ resourceId: 'old' }])
    expect(ctx.loading).toBe(true)
  })

  it('changeNewScenarioModalStatus resets state and reloads on restart', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.modalStatus = true
    wrapper.vm.scenarioId = 's1'
    wrapper.vm.isEdit = true
    wrapper.vm.isDuplicate = true
    wrapper.vm.selectedRow = { resourceId: 's1' }
    wrapper.vm.editableFormValues = { name: 'x' }

    wrapper.vm.changeNewScenarioModalStatus(false, true)

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.scenarioId).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.editableFormValues).toEqual({})
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleMultipleDelete prepares correct payload', () => {
    const wrapper = createWrapper()
    wrapper.vm.serverSideProps.totalNumberOfRecords = 50
    wrapper.vm.axiosPayload.filter = { FilterGroups: [] }

    wrapper.vm.handleMultipleDelete([{ resourceId: 'a' }, { resourceId: 'b' }], ['x'], false)
    expect(wrapper.vm.multipleDeletedScenariosCount).toBe(2)
    expect(wrapper.vm.multipleScenariosPayload.items).toEqual(['a', 'b'])
    expect(wrapper.vm.showDeleteModal).toBe(true)

    wrapper.vm.handleMultipleDelete([], ['x'], true)
    expect(wrapper.vm.multipleDeletedScenariosCount).toBe(50)
    expect(wrapper.vm.multipleScenariosPayload.items).toEqual([])
  })

  it('toggle preview and fast-launch helper methods work as expected', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 's2' }

    wrapper.vm.handlePreview(row)
    expect(wrapper.vm.selectedPhishingScenario).toEqual(row)
    expect(wrapper.vm.isShowPreviewDialog).toBe(true)

    wrapper.vm.toggleShowPreviewDialog()
    expect(wrapper.vm.selectedPhishingScenario).toEqual({})
    expect(wrapper.vm.isShowPreviewDialog).toBe(false)

    wrapper.vm.handleFastLaunch(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowFastLaunch).toBe(true)
  })

  it('toggleShowFastLaunch clears selectedRow when modal is already open', () => {
    const wrapper = createWrapper()
    wrapper.vm.isShowFastLaunch = true
    wrapper.vm.selectedRow = { resourceId: 's-1' }

    wrapper.vm.toggleShowFastLaunch()

    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowFastLaunch).toBe(false)
  })

  it('check close handlers are safe when refs are missing and delegate when present', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}
    expect(() => wrapper.vm.checkIfCanCLoseNewScenarioModal()).not.toThrow()
    expect(() => wrapper.vm.checkIfCanCloseFastLaunchModal()).not.toThrow()

    const changeNewScenarioModalStatus = jest.fn()
    const closeOverlay = jest.fn()
    wrapper.vm.$refs = {
      newScenarioModal: { changeNewScenarioModalStatus },
      fastLaunch: { closeOverlay }
    }

    wrapper.vm.checkIfCanCLoseNewScenarioModal()
    wrapper.vm.checkIfCanCloseFastLaunchModal()
    expect(changeNewScenarioModalStatus).toHaveBeenCalled()
    expect(closeOverlay).toHaveBeenCalled()
  })

  it('handleSuccess actions close modal and refresh data', () => {
    const wrapper = createWrapper()
    const resetSelectableParams = jest.fn()
    wrapper.vm.$refs = { refScenariosList: { resetSelectableParams } }
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.showDeleteModal = true

    wrapper.vm.handleSuccessDeleteAction()
    expect(resetSelectableParams).toHaveBeenCalled()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalledTimes(1)

    wrapper.vm.$refs = {}
    wrapper.vm.showDeleteModal = true
    wrapper.vm.handleSuccessMultipleDeleteAction()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalledTimes(2)
  })

  it('exportScenario maps XLS to Excel and clicks links', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test-url')

    wrapper.vm.exportScenario({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 2,
      pageSize: 25
    })
    await flushPromises()

    expect(SmishingService.exportSmishingScenarios).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true })
    )
    expect(SmishingService.exportSmishingScenarios).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportScenario with empty exportTypes does not call API', async () => {
    const wrapper = createWrapper()
    wrapper.vm.exportScenario({
      exportTypes: [],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()
    expect(SmishingService.exportSmishingScenarios).not.toHaveBeenCalled()
  })

  it('callForScenarioDetails maps preferred languages and falls back to empty preferred list for missing data', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'en', isoFriendlyName: 'English' }
    ])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: [{ value: 'en', text: '' }, { value: 'tr', text: '' }] } }
    })
    const ctx = {
      scenarioDetailsLookup: {},
      tableOptions: { columns: [{}, {}, {}, {}, {}] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      callForData: jest.fn()
    }

    Scenarios.methods.callForScenarioDetails.call(ctx)
    await flushPromises()

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([{ value: 'en', text: 'English' }])
    expect(ctx.callForData).toHaveBeenCalled()

    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: {} }
    })
    const fallbackCtx = {
      scenarioDetailsLookup: {},
      tableOptions: { columns: [{}, {}, {}, {}, {}] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      callForData: jest.fn()
    }
    Scenarios.methods.callForScenarioDetails.call(fallbackCtx)
    await flushPromises()
    expect(fallbackCtx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([])
    expect(fallbackCtx.callForData).toHaveBeenCalled()
  })

  it('no-template modal handlers toggle flags and emit expected events', () => {
    const wrapper = createWrapper()
    const emitSpy = jest.spyOn(wrapper.vm, '$emit')

    wrapper.vm.handleShowNoTextMessageModal()
    expect(wrapper.vm.isShowNoTextMessageTemplateModal).toBe(true)
    wrapper.vm.handleCloseNoTextMessageModal()
    expect(wrapper.vm.isShowNoTextMessageTemplateModal).toBe(false)
    wrapper.vm.handleConfirmNoTextMessage()
    expect(emitSpy).toHaveBeenCalledWith('handleNoMessageTemplate')

    wrapper.vm.handleShowNoLandingPageTemplateModal()
    expect(wrapper.vm.isShowNoLandingPageTemplateModal).toBe(true)
    wrapper.vm.handleCloseNoLandingPageTemplateModal()
    expect(wrapper.vm.isShowNoLandingPageTemplateModal).toBe(false)
    wrapper.vm.handleConfirmNoLandingPageTemplate()
    expect(emitSpy).toHaveBeenCalledWith('handleNoLandingPageTemplate')
  })
})
