import { shallowMount } from '@vue/test-utils'
import TestConnection from '@/components/QuishingSettings/Domains/TestConnection.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  testDomainConnection: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingSettings Domains TestConnection.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TestConnection, {
      propsData: {
        values: {
          dnsServiceProviderId: 'dns-1',
          zoneId: 'zone-1'
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

  it('emits loading false when checkApiConnectivity is loading', () => {
    const wrapper = createWrapper()
    wrapper.setData({ checkApiConnectivity: 'loading' })

    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.emitted('loading').pop()).toEqual([false])
  })

  it('emits loading true when checkApiConnectivity is not loading', () => {
    const wrapper = createWrapper()
    wrapper.setData({ checkApiConnectivity: null })

    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.emitted('loading').pop()).toEqual([true])
  })

  it('checkIfAllSuccess emits result and returns boolean', () => {
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

  it('setLoadingStates sets loading flag state', () => {
    const wrapper = createWrapper()
    wrapper.vm.setLoadingStates()
    expect(wrapper.vm.checkApiConnectivity).toBe('loading')
  })

  it('testConnection handles success response', async () => {
    const wrapper = createWrapper()

    wrapper.vm.testConnection(true)
    await flushPromises()

    expect(QuishingService.testDomainConnection).toHaveBeenCalledWith({
      dnsServiceProviderId: 'dns-1',
      zoneId: 'zone-1'
    })
    expect(wrapper.vm.isLoadingStarted).toBe(true)
    expect(wrapper.vm.checkApiConnectivity).toBe('success')
    expect(wrapper.vm.checkApiConnectivityMessage).toBe('Connected successfully ')
    expect(wrapper.emitted('testConnectionValues')[0]).toEqual([true, true])
    expect(wrapper.emitted('save-button-disabled')[0]).toEqual([true])
    expect(wrapper.emitted('save-button-disabled')[1]).toEqual([false])
  })

  it('testConnection handles error with validationMessages', async () => {
    QuishingService.testDomainConnection.mockRejectedValueOnce({
      response: {
        data: {
          validationMessages: ['Validation failed'],
          message: 'fallback'
        }
      }
    })
    const wrapper = createWrapper()

    wrapper.vm.testConnection(false)
    await flushPromises()

    expect(wrapper.vm.checkApiConnectivity).toBe('error')
    expect(wrapper.vm.checkApiConnectivityMessage).toBe('Validation failed')
    expect(wrapper.emitted('testConnectionValues')[0]).toEqual([false, false])
    expect(wrapper.emitted('save-button-disabled')[1]).toEqual([true])
  })

  it('testConnection handles error fallback message', async () => {
    QuishingService.testDomainConnection.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Bad request'
        }
      }
    })
    const wrapper = createWrapper()

    wrapper.vm.testConnection(false)
    await flushPromises()

    expect(wrapper.vm.checkApiConnectivityMessage).toBe('Bad request')
  })
})
