import { shallowMount } from '@vue/test-utils'
import TestConnection from '@/components/QuishingSettings/DnsServices/TestConnection.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  testDnsConnection: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingSettings DNS TestConnection.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TestConnection, {
      propsData: {
        values: {
          dnsServiceProviderTypeId: 1,
          username: 'user@test.com',
          password: 'secret',
          resourceId: 'dns-1'
        },
        ...propsData
      },
      stubs: {
        TestConnectivityStatus: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isLoading emits loading when connectivity state is not loading', () => {
    const wrapper = createWrapper()
    wrapper.setData({ checkApiConnectivity: null })

    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.emitted('loading')).toBeTruthy()
  })

  it('isLoading does not emit loading when state is loading', () => {
    const wrapper = createWrapper()
    const beforeCount = (wrapper.emitted('loading') || []).length
    wrapper.setData({ checkApiConnectivity: 'loading' })

    expect(wrapper.vm.isLoading).toBe(true)
    const afterCount = (wrapper.emitted('loading') || []).length
    expect(afterCount).toBe(beforeCount)
  })

  it('checkIfAllSuccess emits success payload and returns true', () => {
    const wrapper = createWrapper()
    wrapper.setData({ checkApiConnectivity: 'success', isSave: true })

    expect(wrapper.vm.checkIfAllSuccess()).toBe(true)
    expect(wrapper.emitted('testConnectionValues')[0]).toEqual([true, true])
  })

  it('handleTestConnectionClick emits testConnectionClicked', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleTestConnectionClick()
    expect(wrapper.emitted('testConnectionClicked')).toBeTruthy()
  })

  it('setLoadingStates sets loading state', () => {
    const wrapper = createWrapper()
    wrapper.vm.setLoadingStates()
    expect(wrapper.vm.checkApiConnectivity).toBe('loading')
  })

  it('testConnection returns existing success when already tested', () => {
    const wrapper = createWrapper()
    wrapper.setData({ checkApiConnectivity: 'success' })

    const result = wrapper.vm.testConnection(true, true)

    expect(result).toBe(true)
    expect(QuishingService.testDnsConnection).not.toHaveBeenCalled()
    expect(wrapper.emitted('testConnectionValues')[0]).toEqual([true, true])
  })

  it('testConnection handles api success', async () => {
    const wrapper = createWrapper()

    const promise = wrapper.vm.testConnection(true, false)
    await promise
    await flushPromises()

    expect(QuishingService.testDnsConnection).toHaveBeenCalledWith(
      {
        dnsServiceProviderTypeId: 1,
        username: 'user@test.com',
        password: 'secret',
        resourceId: 'dns-1'
      },
      'dns-1'
    )
    expect(wrapper.vm.isLoadingStarted).toBe(true)
    expect(wrapper.vm.checkApiConnectivity).toBe('success')
    expect(wrapper.vm.checkApiConnectivityMessage).toBe('Connected successfully ')
    expect(wrapper.emitted('testConnectionValues')[0]).toEqual([true, true])
  })

  it('testConnection handles error and uses validation message', async () => {
    QuishingService.testDnsConnection.mockRejectedValueOnce({
      response: {
        data: {
          validationMessages: ['Auth failed'],
          message: 'fallback'
        }
      }
    })
    const wrapper = createWrapper()

    await wrapper.vm.testConnection(false, false)
    await flushPromises()

    expect(wrapper.vm.checkApiConnectivity).toBe('error')
    expect(wrapper.vm.checkApiConnectivityMessage).toBe('Auth failed')
    expect(wrapper.emitted('testConnectionValues')[0]).toEqual([false, false])
  })

  it('testConnection handles error fallback message', async () => {
    QuishingService.testDnsConnection.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Request failed'
        }
      }
    })
    const wrapper = createWrapper()

    await wrapper.vm.testConnection(false, false)
    await flushPromises()

    expect(wrapper.vm.checkApiConnectivityMessage).toBe('Request failed')
  })
})
