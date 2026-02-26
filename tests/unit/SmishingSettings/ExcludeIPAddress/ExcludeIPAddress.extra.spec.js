import { shallowMount } from '@vue/test-utils'
import ExcludeIPAddress from '@/components/SmishingSettings/ExcludeIPAddress/ExcludeIPAddress.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  getExcludedIPAddresses: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          phishingCampaignExcludedIPList: [{ excludedIP: '192.168.1.1' }]
        }
      }
    })
  ),
  postExcludedIPAddresses: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingSettings ExcludeIPAddress.vue (extra)', () => {
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

  it('computed getIsActionButtonDisabled and getSaveButtonStyle reflect state', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingExcludedIpPostPermissions': false
    })
    await flushPromises()

    expect(wrapper.vm.getIsActionButtonDisabled).toBe(true)
    expect(wrapper.vm.getSaveButtonStyle).toEqual({
      opacity: 0.5,
      cursor: 'default',
      pointerEvents: 'none'
    })
  })

  it('ipAddressSearch watcher toggles rules array based on value', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.ipAddressSearch = '1.1.1.1'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.rules).toEqual(wrapper.vm.ipRules)

    wrapper.vm.ipAddressSearch = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.rules).toEqual([])
  })

  it('handleBatchImport does nothing when data is empty', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const original = [...wrapper.vm.dataContainerWithSearchItems]

    wrapper.vm.handleBatchImport([])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(original)
  })

  it('handleInput replaces dataContainerWithSearchItems with incoming items', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.handleInput(['2.2.2.2', '3.3.3.3'])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['2.2.2.2', '3.3.3.3'])
  })

  it('handleIpAddressesAdd does nothing when ipAddressSearch is empty', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const original = [...wrapper.vm.dataContainerWithSearchItems]
    wrapper.vm.ipAddressSearch = ''

    wrapper.vm.handleIpAddressesAdd()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(original)
  })

  it('handleSaveChanges does nothing when ref is missing', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.$refs = {}

    wrapper.vm.handleSaveChanges()
    await flushPromises()

    expect(SmishingService.postExcludedIPAddresses).not.toHaveBeenCalled()
  })

  it('getExcludedIPAddresses handles missing response path gracefully', async () => {
    SmishingService.getExcludedIPAddresses.mockResolvedValueOnce({})
    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual([])
    expect(wrapper.vm.initialData).toEqual([])
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
