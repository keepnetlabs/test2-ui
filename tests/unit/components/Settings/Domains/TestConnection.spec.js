import { shallowMount } from '@vue/test-utils'
import TestConnection from '@/components/Settings/Domains/TestConnection.vue'

jest.mock('@/api/domains', () => ({
  testDomainConnection: jest.fn()
}))

describe('Settings Domains TestConnection.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TestConnection, {
      propsData: {
        values: { dnsServiceProviderId: '1', zoneId: 'z1' },
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
  })

  describe('checkIfAllSuccess', () => {
    it('emits testConnectionValues', () => {
      const wrapper = createWrapper()
      wrapper.vm.checkApiConnectivity = 'success'
      wrapper.vm.checkIfAllSuccess()
      expect(wrapper.emitted('testConnectionValues')).toBeTruthy()
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
