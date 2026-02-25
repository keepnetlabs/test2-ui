import { shallowMount } from '@vue/test-utils'
import DnsServicesList from '@/components/Settings/DnsServices/DnsServicesList.vue'
import { deleteEmailTemplate, exportDnsService, getDnsServiceList } from '@/api/dnsServices'

jest.mock('@/api/dnsServices', () => ({
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

describe('Settings DnsServicesList.vue extra', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(DnsServicesList, {
      mocks: {
        $store: {
          getters: {
            'permissions/getDnsSearchPermissions': true,
            'permissions/getDnsUpdatePermissions': true,
            'permissions/getDnsDeletePermissions': true,
            'permissions/getDnsExportPermissions': true,
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

  it('callForData populates table and server-side props', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getDnsServiceList).toHaveBeenCalled()
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'dns-1', dnsServiceProviderName: 'Cloudflare' }])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData handles api errors', async () => {
    getDnsServiceList.mockRejectedValueOnce(new Error('fail'))
    const wrapper = createWrapper()
    wrapper.vm.tableData = [{ resourceId: 'old' }]
    await wrapper.vm.callForData()
    await flushPromises()
    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handleDelete unselects row and refreshes', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    wrapper.vm.$refs = { refDnsServiceListList: { unSelectRow } }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleDelete({ resourceId: 'dns-3' })
    await flushPromises()

    expect(deleteEmailTemplate).toHaveBeenCalledWith('dns-3')
    expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'dns-3' })
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('exportDnsService maps XLS to Excel and triggers download', async () => {
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
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportDnsService).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true })
    )
    expect(exportDnsService).toHaveBeenNthCalledWith(2, expect.objectContaining({ exportType: 'CSV' }))
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
