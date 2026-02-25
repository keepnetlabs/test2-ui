import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import MFASetup from '@/components/MFA/MFASetup.vue'

describe('MFASetup.vue', () => {
  let store

  const createWrapper = (propsData = {}) => {
    store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          getters: {
            getErrors: () => '',
            getErrorStatus: () => false
          }
        }
      }
    })
    return shallowMount(MFASetup, {
      store,
      propsData: { mfaSetupDetails: null, rules: {}, isLogin: false, ...propsData }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name MFASetup', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('MFASetup')
  })

  describe('isLogin prop', () => {
    it('adds mfa-setup--dashboard class when isLogin is false', () => {
      const wrapper = createWrapper({ isLogin: false })
      expect(wrapper.find('.mfa-setup--dashboard').exists()).toBe(true)
    })

    it('does not add mfa-setup--dashboard class when isLogin is true', () => {
      const wrapper = createWrapper({ isLogin: true })
      expect(wrapper.find('.mfa-setup--dashboard').exists()).toBe(false)
    })

    it('shows SETUP MFA button when isLogin is true', () => {
      const wrapper = createWrapper({ isLogin: true })
      expect(wrapper.find('#btn-setup--mfa-dashboard-popup').exists()).toBe(true)
    })

    it('hides SETUP MFA button when isLogin is false', () => {
      const wrapper = createWrapper({ isLogin: false })
      expect(wrapper.find('#btn-setup--mfa-dashboard-popup').exists()).toBe(false)
    })
  })

  it('has mfaCode in data', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.mfaCode).toBeNull()
  })
})
