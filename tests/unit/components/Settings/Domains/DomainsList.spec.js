import { shallowMount } from '@vue/test-utils'
import DomainsList from '@/components/Settings/Domains/DomainsList.vue'
import { deleteEmailTemplate, exportDnsService, getDomainData, getDomainsList } from '@/api/domains'
import { getAllDomainBlocklistStatuses } from '@/api/domainBlocklist'

jest.mock('@/api/domainBlocklist', () => ({
  getAllDomainBlocklistStatuses: jest.fn(() =>
    Promise.resolve({
      data: {
        domains: [
          { domain: 'a.test', status: 'clean', reason: null },
          { domain: 'bad.test', status: 'malicious', reason: 'Blocked by browsers' }
        ]
      }
    })
  )
}))

jest.mock('@/api/domains', () => ({
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
  deleteEmailTemplate: jest.fn(() => Promise.resolve()),
  exportDnsService: jest.fn(() => Promise.resolve({ data: {} }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Settings DomainsList.vue', () => {
  const createStoreGetters = (overrides = {}) => ({
    'permissions/getDomainUpdatePermissions': true,
    'permissions/getDomainDeletePermissions': true,
    'permissions/getDomainExportPermissions': true,
    'permissions/getDomainCreatePermissions': true,
    'permissions/getDomainSearchPermissions': true,
    'permissions/getDomainFormDetailsPermissions': true,
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

  it('loads domain details and list on created when details permission exists', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getDomainData).toHaveBeenCalled()
    expect(getDomainsList).toHaveBeenCalled()
    expect(wrapper.vm.domainData).toEqual({ dns: ['Cloudflare'] })
    expect(wrapper.vm.tableData).toEqual([
      expect.objectContaining({ resourceId: 'domain-1', domain: 'a.test' })
    ])
  })

  it('skips created data load when details permission is missing', async () => {
    createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
    })
    await flushPromises()
    expect(getDomainData).not.toHaveBeenCalled()
  })

  it('callForData updates server-side metadata and loading state on success', async () => {
    const wrapper = createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
    })
    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(wrapper.vm.tableData).toEqual([
      expect.objectContaining({ resourceId: 'domain-1', domain: 'a.test' })
    ])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData handles API errors by clearing tableData', async () => {
    getDomainsList.mockRejectedValueOnce(new Error('failed'))
    const wrapper = createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
    })
    wrapper.vm.tableData = [{ resourceId: 'old' }]

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handleSearchChange remaps AnalysisEngineName filter and refreshes list', () => {
    const wrapper = createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
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
      'permissions/getDomainFormDetailsPermissions': false
    })
    wrapper.vm.modalStatus = false
    wrapper.vm.resourceId = 'row-1'
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.changeStatus(false, true)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.resourceId).toBe('')
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleDelete removes selected row and refreshes list', async () => {
    const wrapper = createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
    })
    const unSelectRow = jest.fn()
    wrapper.vm.$refs = { refDomainsListList: { unSelectRow } }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleDelete({ resourceId: 'domain-3' })
    await flushPromises()

    expect(deleteEmailTemplate).toHaveBeenCalledWith('domain-3')
    expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'domain-3' })
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('exportDomains maps XLS to Excel payload and triggers download links', async () => {
    const wrapper = createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
    })
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

    wrapper.vm.exportDomains({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 3,
      pageSize: 50
    })
    await flushPromises()

    expect(exportDnsService).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        exportType: 'Excel',
        reportAllPages: true,
        pageNumber: 3,
        pageSize: 50
      })
    )
    expect(exportDnsService).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        exportType: 'CSV'
      })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  describe('Blocklist Enrichment', () => {
    it('callForData sets initial loading state on tableData', async () => {
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      await wrapper.vm.callForData()
      await flushPromises()

      // After callForData, enrichWithBlocklistStatus is called
      // tableData should have blocklistStatus field
      expect(getAllDomainBlocklistStatuses).toHaveBeenCalled()
    })

    it('enrichWithBlocklistStatus merges blocklist data into table rows', async () => {
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      const results = [
        { resourceId: 'd1', domain: 'a.test' },
        { resourceId: 'd2', domain: 'bad.test' },
        { resourceId: 'd3', domain: 'unknown.test' }
      ]

      await wrapper.vm.enrichWithBlocklistStatus(results)
      await flushPromises()

      expect(wrapper.vm.tableData[0].blocklistStatus).toBe('clean')
      expect(wrapper.vm.tableData[0].blocklistDetail).toBeNull()
      expect(wrapper.vm.tableData[1].blocklistStatus).toBe('blocklisted')
      expect(wrapper.vm.tableData[1].blocklistDetail).toBe('Blocked by browsers')
      expect(wrapper.vm.tableData[2].blocklistStatus).toBe('pending')
      expect(wrapper.vm.tableData[2].blocklistDetail).toBeNull()
    })

    it('enrichWithBlocklistStatus handles API error without affecting table', async () => {
      getAllDomainBlocklistStatuses.mockRejectedValueOnce(new Error('API down'))
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      const results = [{ resourceId: 'd1', domain: 'a.test' }]
      wrapper.vm.tableData = results

      await wrapper.vm.enrichWithBlocklistStatus(results)
      await flushPromises()

      // tableData should remain unchanged on error
      expect(wrapper.vm.tableData).toEqual(results)
    })

    it('callForData sets blocklistStatus loading on initial tableData', async () => {
      getDomainsList.mockResolvedValueOnce({
        data: {
          data: {
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1,
            results: [{ resourceId: 'd1', domain: 'test.com' }]
          }
        }
      })
      getAllDomainBlocklistStatuses.mockImplementationOnce(
        () => new Promise(() => {}) // never resolves — simulates pending
      )
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      await wrapper.vm.callForData()
      await flushPromises()

      expect(wrapper.vm.tableData[0].blocklistStatus).toBe('loading')
    })

    it('enrichWithBlocklistStatus uses reason from API response', async () => {
      getAllDomainBlocklistStatuses.mockResolvedValueOnce({
        data: {
          domains: [
            { domain: 'warned.test', status: 'suspicious', reason: 'Flagged by 2 vendors' }
          ]
        }
      })
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      await wrapper.vm.enrichWithBlocklistStatus([
        { resourceId: 'd1', domain: 'warned.test' }
      ])
      await flushPromises()

      expect(wrapper.vm.tableData[0].blocklistStatus).toBe('suspicious')
      expect(wrapper.vm.tableData[0].blocklistDetail).toBe('Flagged by 2 vendors')
    })

    it('enrichWithBlocklistStatus sets null detail for clean domains', async () => {
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      await wrapper.vm.enrichWithBlocklistStatus([
        { resourceId: 'd1', domain: 'a.test' }
      ])
      await flushPromises()

      expect(wrapper.vm.tableData[0].blocklistDetail).toBeNull()
    })

    it('enrichWithBlocklistStatus preserves original row fields', async () => {
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      await wrapper.vm.enrichWithBlocklistStatus([
        { resourceId: 'd1', domain: 'a.test', healthStatus: 0, dnsRecord: 'A' }
      ])
      await flushPromises()

      expect(wrapper.vm.tableData[0].resourceId).toBe('d1')
      expect(wrapper.vm.tableData[0].healthStatus).toBe(0)
      expect(wrapper.vm.tableData[0].dnsRecord).toBe('A')
      expect(wrapper.vm.tableData[0].blocklistStatus).toBe('clean')
    })

    it('blocklistStatus column exists in table options', () => {
      const wrapper = createWrapper({
        'permissions/getDomainFormDetailsPermissions': false
      })
      const blocklistCol = wrapper.vm.tableOptions.columns.find(
        (c) => c.property === 'blocklistStatus'
      )
      expect(blocklistCol).toBeDefined()
      expect(blocklistCol.type).toBe('status')
      expect(blocklistCol.hideSort).toBe(true)
      expect(blocklistCol.sortable).toBe(false)
      expect(blocklistCol.badgeColorMap).toBeDefined()
      expect(blocklistCol.badgeColorMap.blocklisted).toBe('#b83a3a')
      expect(blocklistCol.badgeColorMap.clean).toBe('#217124')
      expect(blocklistCol.tooltipKey).toBe('blocklistDetail')
    })
  })

  it('handleActionDelete and handleSuccessDeleteAction update modal flow', () => {
    const wrapper = createWrapper({
      'permissions/getDomainFormDetailsPermissions': false
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
