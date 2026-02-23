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

  it('checkIfCanCloseDomainModal delegates to child modal cancelDomain', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingDomainFormDetailsPermissions': false
    })
    const cancelDomain = jest.fn()
    wrapper.vm.$refs = { newEditDomainModal: { cancelDomain } }

    wrapper.vm.checkIfCanCloseDomainModal()

    expect(cancelDomain).toHaveBeenCalled()
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
    expect(createObjectURLSpy).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
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
})
