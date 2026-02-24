import { shallowMount } from '@vue/test-utils'
import ExcludeIPAddress from '@/components/SmishingSettings/ExcludeIPAddress/ExcludeIPAddress.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  getExcludedIPAddresses: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          phishingCampaignExcludedIPList: [
            { excludedIP: '192.168.1.1' },
            { excludedIP: '10.0.0.1' }
          ]
        }
      }
    })
  ),
  postExcludedIPAddresses: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingSettings ExcludeIPAddress.vue', () => {
  const createWrapper = (storeOverrides = {}) =>
    shallowMount(ExcludeIPAddress, {
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingExcludedIpPostPermissions': true,
            ...storeOverrides
          }
        }
      },
      stubs: {
        BatchImportPopup: true,
        DataContainerWithSearchInput: true,
        DataContainerWithSearch: true,
        InputIpAddress: true,
        DatatableLoading: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('loads excluded IPs on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(SmishingService.getExcludedIPAddresses).toHaveBeenCalled()
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['192.168.1.1', '10.0.0.1'])
    expect(wrapper.vm.initialData).toEqual(['192.168.1.1', '10.0.0.1'])
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('handles empty list from getExcludedIPAddresses', async () => {
    SmishingService.getExcludedIPAddresses.mockResolvedValueOnce({
      data: { data: { phishingCampaignExcludedIPList: [] } }
    })
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual([])
  })

  it('isInitialDataAndModelEqual true when data unchanged', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.isInitialDataAndModelEqual).toBe(true)
  })

  it('handleBatchImport adds items when data provided', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.handleBatchImport(['1.1.1.1', '2.2.2.2'])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual([
      '1.1.1.1',
      '2.2.2.2',
      '192.168.1.1',
      '10.0.0.1'
    ])
  })

  it('toggleBatchImportPopup toggles popup state', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(true)
  })

  it('handleIpAddressesAdd adds IP and resets input', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.ipAddressSearch = '8.8.8.8'

    wrapper.vm.handleIpAddressesAdd()

    expect(wrapper.vm.dataContainerWithSearchItems[0]).toBe('8.8.8.8')
    expect(wrapper.vm.ipAddressSearch).toBe('')
  })

  it('handleSaveChanges returns early when validation fails', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.$refs = {
      dataContainerWithSearch: {
        checkAllValid: jest.fn(),
        isAllValid: false
      }
    }

    wrapper.vm.handleSaveChanges()

    expect(SmishingService.postExcludedIPAddresses).not.toHaveBeenCalled()
  })

  it('handleSaveChanges posts and refreshes when valid', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.$refs = {
      dataContainerWithSearch: {
        checkAllValid: jest.fn(),
        isAllValid: true
      }
    }

    wrapper.vm.handleSaveChanges()
    await flushPromises()

    expect(SmishingService.postExcludedIPAddresses).toHaveBeenCalledWith({
      excludedIPs: ['192.168.1.1', '10.0.0.1']
    })
    expect(SmishingService.getExcludedIPAddresses).toHaveBeenCalledTimes(2)
  })
})
