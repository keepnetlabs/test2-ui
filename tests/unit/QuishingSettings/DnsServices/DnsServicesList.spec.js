import { shallowMount } from '@vue/test-utils'
import DnsServicesList from '@/components/QuishingSettings/DnsServices/DnsServicesList.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
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
  deleteDnsService: jest.fn(() => Promise.resolve()),
  exportDnsService: jest.fn(() => Promise.resolve({ data: {} }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingSettings DnsServicesList.vue', () => {
  const createStoreGetters = (overrides = {}) => ({
    'permissions/getQuishingDnsSearchPermissions': true,
    'permissions/getQuishingDnsCreatePermissions': true,
    'permissions/getQuishingDnsUpdatePermissions': true,
    'permissions/getQuishingDnsDeletePermissions': true,
    'permissions/getQuishingDnsExportPermissions': true,
    ...overrides
  })

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(DnsServicesList, {
      mocks: {
        $store: {
          getters: createStoreGetters(getterOverrides)
        }
      },
      stubs: {
        DataTable: true,
        DeleteServiceModal: true,
        NewEditDnsService: true,
        CantDeleteDnsServiceDialog: true,
        DefaultButtonRowAction: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads dns service list on created when search permission exists', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(QuishingService.getDnsServiceList).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'dns-1', dnsServiceProviderName: 'Cloudflare' }])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('skips created data load when search permission is missing', async () => {
    createWrapper({
      'permissions/getQuishingDnsSearchPermissions': false
    })
    await flushPromises()

    expect(QuishingService.getDnsServiceList).not.toHaveBeenCalled()
  })

  it('callForData updates server-side metadata and loading state on success', async () => {
    const wrapper = createWrapper({
      'permissions/getQuishingDnsSearchPermissions': true
    })

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'dns-1', dnsServiceProviderName: 'Cloudflare' }])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData handles API errors by clearing tableData', async () => {
    QuishingService.getDnsServiceList.mockRejectedValueOnce(new Error('failed'))
    const wrapper = createWrapper()
    wrapper.vm.tableData = [{ resourceId: 'old' }]

    await wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('changeStatus toggles modal and restarts table when requested', () => {
    const wrapper = createWrapper()
    wrapper.vm.modalStatus = false
    wrapper.vm.resourceId = 'row-1'
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.changeStatus(false, true)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.resourceId).toBe('')
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleEdit sets resourceId and opens modal', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'dns-2' }

    wrapper.vm.handleEdit(row)

    expect(wrapper.vm.resourceId).toBe('dns-2')
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.modalStatus).toBe(true)
  })

  it('handleAdd opens modal in create mode', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleAdd()

    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.modalStatus).toBe(true)
  })

  it('handleDelete removes selected row and refreshes list', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    wrapper.vm.$refs = { refDnsServiceListList: { unSelectRow } }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleDelete({ resourceId: 'dns-3' })
    await flushPromises()

    expect(QuishingService.deleteDnsService).toHaveBeenCalledWith('dns-3')
    expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'dns-3' })
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleSuccessDeleteAction closes modal and refreshes', () => {
    const wrapper = createWrapper()
    wrapper.vm.showDeleteModal = true
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleSuccessDeleteAction()

    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleActionDelete sets selected row and opens delete modal', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'dns-7' }

    wrapper.vm.handleActionDelete(row)

    expect(wrapper.vm.selectedDnsService).toEqual(row)
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })
})
