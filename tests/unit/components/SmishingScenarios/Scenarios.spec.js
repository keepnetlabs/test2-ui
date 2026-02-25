import { shallowMount } from '@vue/test-utils'
import Scenarios from '@/components/SmishingScenarios/Scenarios.vue'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
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
})
