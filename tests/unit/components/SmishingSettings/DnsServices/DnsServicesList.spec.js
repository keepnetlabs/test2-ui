import { shallowMount } from '@vue/test-utils'
import DnsServicesList from '@/components/SmishingSettings/DnsServices/DnsServicesList.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  getDnsServiceList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 'dns-1', dnsServiceProviderName: 'Cloudflare' }]
        }
      }
    })
  ),
  deleteEmailTemplate: jest.fn(() => Promise.resolve()),
  exportDnsService: jest.fn(() => Promise.resolve({ data: {} }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('components SmishingSettings DnsServicesList.vue', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(DnsServicesList, {
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingDnsSearchPermissions': true,
            'permissions/getSmishingDnsUpdatePermissions': true,
            'permissions/getSmishingDnsDeletePermissions': true,
            'permissions/getSmishingDnsExportPermissions': true,
            'permissions/getDnsCreatePermissions': true,
            ...overrides
          }
        }
      },
      stubs: {
        DataTable: true,
        NewEditDnsService: true,
        DeleteServiceModal: true,
        CantDeleteDnsServiceDialog: true,
        DefaultButtonRowAction: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created/callForData fills table and server side metadata', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(SmishingService.getDnsServiceList).toHaveBeenCalled()
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'dns-1', dnsServiceProviderName: 'Cloudflare' }])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData clears table on error', async () => {
    SmishingService.getDnsServiceList.mockRejectedValueOnce(new Error('fail'))
    const wrapper = createWrapper()
    wrapper.vm.tableData = [{ resourceId: 'old' }]
    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handleDelete calls API, unselects row, and reloads', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    wrapper.vm.$refs = { refDnsServiceListList: { unSelectRow } }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleDelete({ resourceId: 'dns-9' })
    await flushPromises()

    expect(SmishingService.deleteEmailTemplate).toHaveBeenCalledWith('dns-9')
    expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'dns-9' })
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleActionDelete opens cant-delete dialog only when last item', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'dns-2' }

    wrapper.vm.serverSideProps.totalNumberOfRecords = 1
    wrapper.vm.handleActionDelete(row)
    expect(wrapper.vm.selectedDnsService).toEqual(row)
    expect(wrapper.vm.isShowCantDeleteDialog).toBe(true)

    wrapper.vm.serverSideProps.totalNumberOfRecords = 3
    wrapper.vm.isShowCantDeleteDialog = false
    wrapper.vm.handleActionDelete(row)
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })

  it('exportDnsService maps XLS to Excel and triggers link click', async () => {
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

    wrapper.vm.exportDnsService({
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 2,
      pageSize: 25
    })
    await flushPromises()

    expect(SmishingService.exportDnsService).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true, pageNumber: 2, pageSize: 25 })
    )
    expect(SmishingService.exportDnsService).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
