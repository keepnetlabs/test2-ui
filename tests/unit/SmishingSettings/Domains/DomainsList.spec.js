import { shallowMount } from '@vue/test-utils'
import DomainsList from '@/components/SmishingSettings/Domains/DomainsList.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  getDomainData: jest.fn(() => Promise.resolve({ data: { data: { dns: ['Cloudflare'] } } })),
  getDomainsList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 'domain-1', domain: 'a.test' }]
        }
      }
    })
  ),
  deleteDomainRecord: jest.fn(() => Promise.resolve()),
  exportDomains: jest.fn(() =>
    Promise.resolve({ data: new (globalThis.Blob || global.Blob)(['x']) })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DomainsList.vue', () => {
  const createStoreGetters = (overrides = {}) => ({
    'permissions/getSmishingDomainUpdatePermissions': true,
    'permissions/getSmishingDomainDeletePermissions': true,
    'permissions/getDomainExportPermissions': true,
    'permissions/getDomainCreatePermissions': true,
    'permissions/getSmishingDomainSearchPermissions': true,
    'permissions/getSmishingDomainFormDetailsPermissions': true,
    ...overrides
  })

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(DomainsList, {
      mocks: {
        $store: {
          getters: createStoreGetters(getterOverrides)
        }
      },
      stubs: {
        DataTable: true,
        DeleteServiceModal: true,
        NewEditDomain: true,
        DefaultButtonRowAction: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('loads domain details and list on created when details permission exists', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(SmishingService.getDomainData).toHaveBeenCalled()
    expect(SmishingService.getDomainsList).toHaveBeenCalled()
    expect(wrapper.vm.domainData).toEqual({ dns: ['Cloudflare'] })
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'domain-1', domain: 'a.test' }])
  })

  it('skips created data load when details permission is missing', async () => {
    createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    await flushPromises()

    expect(SmishingService.getDomainData).not.toHaveBeenCalled()
  })

  it('callForData updates server-side metadata and loading state on success', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'domain-1', domain: 'a.test' }])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData handles API errors by clearing tableData', async () => {
    SmishingService.getDomainsList.mockRejectedValueOnce(new Error('failed'))
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.tableData = [{ resourceId: 'old' }]

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData does not request list when search permission is missing', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false,
      'permissions/getSmishingDomainSearchPermissions': false
    })

    await wrapper.vm.callForData()
    await flushPromises()

    expect(SmishingService.getDomainsList).not.toHaveBeenCalled()
  })

  it('callForData keeps loading=true when search permission is missing', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false,
      'permissions/getSmishingDomainSearchPermissions': false
    })
    wrapper.vm.loading = false

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.loading).toBe(true)
  })

  it('handleSearchChange remaps AnalysisEngineName filter and refreshes list', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.resetPageNumber = jest.fn()
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'AnalysisEngineName', Value: 'A' },
              { FieldName: 'domain', Value: 'a.test' }
            ]
          }
        ]
      }
    })

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'analysisEngineTypeId', Value: 'A' },
      { FieldName: 'domain', Value: 'a.test' }
    ])
    expect(wrapper.vm.resetPageNumber).toHaveBeenCalled()
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('changeStatus toggles modal and restarts table when requested', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.modalStatus = false
    wrapper.vm.resourceId = 'row-1'
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.changeStatus(false, true)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.resourceId).toBe('')
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('changeStatus keeps resourceId when value=true and restart=false', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.modalStatus = false
    wrapper.vm.resourceId = 'row-2'
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.changeStatus(true, false)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.resourceId).toBe('row-2')
    expect(wrapper.vm.callForData).not.toHaveBeenCalled()
  })

  it('changeStatus clears resourceId without restart when value=false and restart=false', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.modalStatus = true
    wrapper.vm.resourceId = 'row-3'
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.changeStatus(false, false)

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.resourceId).toBe('')
    expect(wrapper.vm.callForData).not.toHaveBeenCalled()
  })

  it('checkIfCanCloseDomainModal delegates to child modal cancelDomain', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    const cancelDomain = jest.fn()
    wrapper.vm.$refs = { newEditDomainModal: { cancelDomain } }

    wrapper.vm.checkIfCanCloseDomainModal()

    expect(cancelDomain).toHaveBeenCalled()
  })

  it('checkIfCanCloseDomainModal is safe when modal ref does not exist', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.$refs = {}

    expect(() => wrapper.vm.checkIfCanCloseDomainModal()).not.toThrow()
  })

  it('handleDelete removes selected row and refreshes list', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    const unSelectRow = jest.fn()
    wrapper.vm.$refs = { refDomainsListList: { unSelectRow } }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleDelete({ resourceId: 'domain-3' })
    await flushPromises()

    expect(SmishingService.deleteDomainRecord).toHaveBeenCalledWith('domain-3')
    expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'domain-3' })
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('exportDomains maps XLS to Excel payload and triggers download links', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click }
      }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) {
      globalThis.URL = {}
    }
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    }
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test-url')
    const initialCreateObjectURLCallCount = createObjectURLSpy.mock.calls.length
    const initialClickCallCount = click.mock.calls.length

    wrapper.vm.exportDomains({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 3,
      pageSize: 50
    })
    await flushPromises()

    expect(SmishingService.exportDomains).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        exportType: 'Excel',
        reportAllPages: true,
        pageNumber: 3,
        pageSize: 50
      })
    )
    expect(SmishingService.exportDomains).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        exportType: 'CSV'
      })
    )
    expect(createObjectURLSpy.mock.calls.length - initialCreateObjectURLCallCount).toBe(2)
    expect(click.mock.calls.length - initialClickCallCount).toBe(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportDomains sets proper download file extensions for XLS and CSV', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    const createdLinks = []
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const link = { href: '', download: '', click: jest.fn() }
        createdLinks.push(link)
        return link
      }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test-url')

    wrapper.vm.exportDomains({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(createdLinks[0].download).toBe('Domains.xlsx')
    expect(createdLinks[1].download).toBe('Domains.csv')
    expect(createdLinks[0].click).toHaveBeenCalled()
    expect(createdLinks[1].click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportDomains keeps payload exportType for lowercase xls but still downloads xlsx', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    const createdLinks = []
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const link = { href: '', download: '', click: jest.fn() }
        createdLinks.push(link)
        return link
      }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test-url')

    wrapper.vm.exportDomains({
      exportTypes: ['xls'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(SmishingService.exportDomains).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'xls'
      })
    )
    expect(createdLinks[0].download).toBe('Domains.xlsx')
    expect(createdLinks[0].click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('callForData uses empty array when API response has no results', async () => {
    SmishingService.getDomainsList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.tableData = [{ resourceId: 'old' }]

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handleActionDelete and handleSuccessDeleteAction update modal flow', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.callForData = jest.fn()
    const row = { resourceId: 'domain-7' }

    wrapper.vm.handleActionDelete(row)
    expect(wrapper.vm.selectedDomain).toEqual(row)
    expect(wrapper.vm.showDeleteModal).toBe(true)

    wrapper.vm.handleSuccessDeleteAction()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleEdit and handleAdd set modal/edit state correctly', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })

    wrapper.vm.handleEdit({ resourceId: 'domain-99' })
    expect(wrapper.vm.resourceId).toBe('domain-99')
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.modalStatus).toBe(true)

    wrapper.vm.modalStatus = false
    wrapper.vm.handleAdd()
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.modalStatus).toBe(true)
  })

  it('handleSearchChange keeps non-analysis fields unchanged', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.resetPageNumber = jest.fn()
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'domain', Value: 'keepnet.com' }]
          }
        ]
      }
    })

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'domain', Value: 'keepnet.com' }
    ])
    expect(wrapper.vm.resetPageNumber).toHaveBeenCalled()
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleSearchChange is safe when filter payload is missing', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    wrapper.vm.resetPageNumber = jest.fn()
    wrapper.vm.callForData = jest.fn()

    expect(() => wrapper.vm.handleSearchChange({})).not.toThrow()
    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([])
    expect(wrapper.vm.resetPageNumber).toHaveBeenCalled()
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })
})
