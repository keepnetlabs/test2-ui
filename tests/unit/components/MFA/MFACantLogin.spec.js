import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import MFACantLogin from '@/components/MFA/MFACantLogin.vue'

describe('MFACantLogin.vue', () => {
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
    return shallowMount(MFACantLogin, {
      store,
      propsData: { phoneNumber: '+1234567890', rules: { required: () => true }, ...propsData }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name MFACantLogin', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('MFACantLogin')
  })

  describe('resendMessageButtonClick', () => {
    it('emits onCantLoginButtonClick when showCount is false', () => {
      const wrapper = createWrapper()
      wrapper.vm.showCount = false
      wrapper.vm.resendMessageButtonClick()
      expect(wrapper.emitted('onCantLoginButtonClick')).toBeTruthy()
    })

    it('does not emit when showCount is true', () => {
      const wrapper = createWrapper()
      wrapper.vm.showCount = true
      wrapper.vm.resendMessageButtonClick()
      expect(wrapper.emitted('onCantLoginButtonClick')).toBeFalsy()
    })
  })

  describe('changeButtonStatus', () => {
    it('sets showCount to false', () => {
      const wrapper = createWrapper()
      wrapper.vm.showCount = true
      wrapper.vm.changeButtonStatus()
      expect(wrapper.vm.showCount).toBe(false)
    })
  })

  it('shows Resend message when showCount is false', async () => {
    const wrapper = createWrapper()
    wrapper.vm.showCount = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.verification-code-wrapper__cant-login').text()).toContain('Resend message')
  })
})
