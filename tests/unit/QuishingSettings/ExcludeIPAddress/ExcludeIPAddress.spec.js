import { shallowMount } from '@vue/test-utils'
import ExcludeIPAddress from '@/components/QuishingSettings/ExcludeIPAddress/ExcludeIPAddress.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  getQuishingExcludedIPAddresses: jest.fn(() =>
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
  postQuishingExcludedIPAddresses: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingSettings ExcludeIPAddress.vue', () => {
  const createWrapper = (storeOverrides = {}) =>
    shallowMount(ExcludeIPAddress, {
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingExcludedIpAddressPostPermissions': true,
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

    expect(QuishingService.getQuishingExcludedIPAddresses).toHaveBeenCalled()
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['192.168.1.1', '10.0.0.1'])
    expect(wrapper.vm.initialData).toEqual(['192.168.1.1', '10.0.0.1'])
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('handles empty list from getQuishingExcludedIPAddresses', async () => {
    QuishingService.getQuishingExcludedIPAddresses.mockResolvedValueOnce({
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

  it('isInitialDataAndModelEqual false when data changed', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.dataContainerWithSearchItems = ['192.168.1.1', '10.0.0.1', '172.16.0.1']

    expect(wrapper.vm.isInitialDataAndModelEqual).toBe(false)
  })

  it('getSaveButtonStyle reflects disabled state', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.getSaveButtonStyle.opacity).toBe(0.5)
    expect(wrapper.vm.getSaveButtonStyle.cursor).toBe('default')
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

  it('handleBatchImport does nothing when empty array', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const before = [...wrapper.vm.dataContainerWithSearchItems]

    wrapper.vm.handleBatchImport([])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(before)
  })

  it('toggleBatchImportPopup toggles popup state', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(true)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
  })

  it('handleIpAddressesAdd adds IP and resets input', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.ipAddressSearch = '8.8.8.8'

    wrapper.vm.handleIpAddressesAdd()

    expect(wrapper.vm.dataContainerWithSearchItems[0]).toBe('8.8.8.8')
    expect(wrapper.vm.ipAddressSearch).toBe('')
  })

  it('handleIpAddressesAdd does nothing when input empty', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const before = [...wrapper.vm.dataContainerWithSearchItems]

    wrapper.vm.handleIpAddressesAdd()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(before)
  })

  it('handleInput updates dataContainerWithSearchItems', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.handleInput(['a', 'b'])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['a', 'b'])
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

    expect(QuishingService.postQuishingExcludedIPAddresses).not.toHaveBeenCalled()
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

    expect(QuishingService.postQuishingExcludedIPAddresses).toHaveBeenCalledWith({
      excludedIPs: ['192.168.1.1', '10.0.0.1']
    })
    expect(QuishingService.getQuishingExcludedIPAddresses).toHaveBeenCalledTimes(2)
  })

  it('ipAddressSearch watcher sets rules when value present', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.ipAddressSearch = '1.2.3.4'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.rules).toEqual(wrapper.vm.ipRules)
  })

  it('ipAddressSearch watcher clears rules when value empty', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.ipAddressSearch = '1.2.3.4'
    await wrapper.vm.$nextTick()

    wrapper.vm.ipAddressSearch = ''
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.rules).toEqual([])
  })
})
