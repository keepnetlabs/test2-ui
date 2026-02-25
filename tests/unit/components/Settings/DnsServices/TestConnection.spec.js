import { shallowMount } from '@vue/test-utils'
import TestConnection from '@/components/Settings/DnsServices/TestConnection.vue'

jest.mock('@/api/dnsServices', () => ({
  testConnection: jest.fn()
}))

describe('Settings DnsServices TestConnection.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TestConnection, {
      propsData: {
        values: { dnsServiceProviderTypeId: 1, username: 'u', password: 'p' },
        ...propsData
      },
      stubs: { TestConnectivityStatus: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('isAllSuccess', () => {
    it('returns true when checkApiConnectivity is success', () => {
      const wrapper = createWrapper()
      wrapper.vm.checkApiConnectivity = 'success'
      expect(wrapper.vm.isAllSuccess).toBe(true)
    })

    it('returns false when checkApiConnectivity is not success', () => {
      const wrapper = createWrapper()
      wrapper.vm.checkApiConnectivity = 'error'
      expect(wrapper.vm.isAllSuccess).toBe(false)
    })
  })

  describe('checkIfAllSuccess', () => {
    it('emits testConnectionValues with success when isAllSuccess', () => {
      const wrapper = createWrapper()
      wrapper.vm.checkApiConnectivity = 'success'
      wrapper.vm.checkIfAllSuccess()
      expect(wrapper.emitted('testConnectionValues')[0][0]).toBe(true)
    })

    it('emits testConnectionValues with false when not success', () => {
      const wrapper = createWrapper()
      wrapper.vm.checkApiConnectivity = 'error'
      wrapper.vm.checkIfAllSuccess()
      expect(wrapper.emitted('testConnectionValues')[0][0]).toBe(false)
    })
  })

  describe('handleTestConnectionClick', () => {
    it('emits testConnectionClicked', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleTestConnectionClick()
      expect(wrapper.emitted('testConnectionClicked')).toBeTruthy()
    })
  })

  describe('setLoadingStates', () => {
    it('sets checkApiConnectivity to loading', () => {
      const wrapper = createWrapper()
      wrapper.vm.setLoadingStates()
      expect(wrapper.vm.checkApiConnectivity).toBe('loading')
    })
  })
})
