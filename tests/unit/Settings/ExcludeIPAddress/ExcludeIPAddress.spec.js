import { shallowMount } from '@vue/test-utils'
import ExcludeIPAddress from '@/components/Settings/ExcludeIPAddress/ExcludeIPAddress.vue'
import * as phishingsimulator from '@/api/phishingsimulator'

jest.mock('@/api/phishingsimulator', () => ({
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

describe('Settings ExcludeIPAddress.vue', () => {
  const createWrapper = (storeOverrides = {}) =>
    shallowMount(ExcludeIPAddress, {
      mocks: {
        $store: {
          getters: {
            'permissions/getExcludedIpAddressPostPermissions': true,
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

    expect(phishingsimulator.getExcludedIPAddresses).toHaveBeenCalled()
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['192.168.1.1', '10.0.0.1'])
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('handleBatchImport adds items', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.handleBatchImport(['1.1.1.1'])

    expect(wrapper.vm.dataContainerWithSearchItems).toContain('1.1.1.1')
  })

  it('handleSaveChanges posts when valid', async () => {
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

    expect(phishingsimulator.postExcludedIPAddresses).toHaveBeenCalledWith({
      excludedIPs: ['192.168.1.1', '10.0.0.1']
    })
  })
})
