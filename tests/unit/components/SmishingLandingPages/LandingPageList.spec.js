import { shallowMount } from '@vue/test-utils'
import LandingPageList from '@/components/SmishingLandingPages/LandingPageList.vue'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

jest.mock('@/api/smishing', () => ({
  searchLandingPageTemplates: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            {
              resourceId: 'lp-1',
              languageTypeName: 'English',
              name: 'Template 1'
            }
          ]
        }
      }
    })
  ),
  getLandingPageTemplate: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Template 1',
          urlTemplate: 'https://test.local/{url}',
          landingPages: [{ content: '<p>a</p>' }, { content: '<p>b</p>' }]
        }
      }
    })
  ),
  getLandingPageTemplateFormDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          methodTypes: [{ text: 'Click-Only' }],
          difficultyTypes: [{ text: 'Hard' }],
          domainRecords: [{ id: 1, domain: 'a.test', urlSchemaType: 'https', urlSchemaTypeId: 1, isStopBotActivity: true }]
        }
      }
    })
  ),
  exportLandingPageTemplates: jest.fn(() => Promise.resolve({ data: {} })),
  deleteLandingPageTemplate: jest.fn(() => Promise.resolve()),
  bulkDeleteLandingPageTemplates: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingLandingPages LandingPageList.vue', () => {
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

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(LandingPageList, {
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingLandingPageTemplatesSearchPermissions': true,
            'permissions/getSmishingLandingPageTemplatesEditPermissions': true,
            'permissions/getSmishingLandingPageTemplatesDeletePermissions': true,
            'permissions/getSmishingLandingPageTemplatesExportPermissions': true,
            'permissions/getSmishingLandingPageTemplatesCreatePermissions': true,
            ...getterOverrides
          }
        }
      },
      stubs: {
        NewLandingPage: true,
        DataTable: DataTableStub,
        AppDialog: true,
        DatatableLoading: true,
        LandingPageTemplateModalPreview: true,
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true,
        ScenariosRowActionsEditButton: true,
        ScenariosRowActionsDeleteButton: true,
        CommonSimulatorEmailTemplateDeleteDialog: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('mounted loads data and lookups', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalled()
    expect(SmishingService.getLandingPageTemplateFormDetails).toHaveBeenCalled()
    expect(SmishingService.searchLandingPageTemplates).toHaveBeenCalled()
    expect(wrapper.vm.tableData[0].languageTypeName).toBe('English')
  })

  it('handleSearchChange removes isInvisibleCaptchaEnabled filter and refreshes', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetPageNumber = jest.fn()
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'name', Value: 'x' },
              { FieldName: 'isInvisibleCaptchaEnabled', Value: true }
            ]
          }
        ]
      }
    })

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Value: 'x' }
    ])
    expect(wrapper.vm.resetPageNumber).toHaveBeenCalled()
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handlePreview sets preview fields and stops loader after timeout', async () => {
    const timeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((cb) => {
      cb()
      return 0
    })
    const wrapper = createWrapper()

    wrapper.vm.handlePreview({ resourceId: 'lp-1' })
    await flushPromises()

    expect(SmishingService.getLandingPageTemplate).toHaveBeenCalledWith('lp-1')
    expect(wrapper.vm.isTemplateDetails).toBe(true)
    expect(wrapper.vm.landingPageParams.name).toBe('Template 1')
    expect(wrapper.vm.landingPageTemplates.length).toBe(2)
    expect(wrapper.vm.isPreviewLoading).toBe(false)
    timeoutSpy.mockRestore()
  })

  it('changeNewEmailTemplateModalStatus resets state and reloads on restart', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.modalStatus = true
    wrapper.vm.emailTemplateId = 'id-1'
    wrapper.vm.isEdit = true
    wrapper.vm.isDuplicate = true
    wrapper.vm.editableFormValues = { name: 'x' }

    wrapper.vm.changeNewEmailTemplateModalStatus(false, true)

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.emailTemplateId).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.editableFormValues).toEqual({})
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleMultipleDelete prepares correct payloads', () => {
    const wrapper = createWrapper()
    wrapper.vm.serverSideProps.totalNumberOfRecords = 50
    wrapper.vm.axiosPayload.filter = { FilterGroups: [] }

    wrapper.vm.handleMultipleDelete([{ resourceId: 'a' }, { resourceId: 'b' }], ['x'], false)
    expect(wrapper.vm.multipleDeletedTemplatesCount).toBe(2)
    expect(wrapper.vm.multipleTemplatesPayload.items).toEqual(['a', 'b'])
    expect(wrapper.vm.showDeleteModal).toBe(true)

    wrapper.vm.handleMultipleDelete([], ['x'], true)
    expect(wrapper.vm.multipleDeletedTemplatesCount).toBe(50)
    expect(wrapper.vm.multipleTemplatesPayload.items).toEqual([])
  })

  it('exportLandingPage maps XLS to Excel and clicks links', async () => {
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

    wrapper.vm.exportLandingPage({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 2,
      pageSize: 25
    })
    await flushPromises()

    expect(SmishingService.exportLandingPageTemplates).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true })
    )
    expect(SmishingService.exportLandingPageTemplates).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
