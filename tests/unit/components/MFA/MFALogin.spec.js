import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import MFALogin from '@/components/MFA/MFALogin.vue'

describe('MFALogin.vue', () => {
  let store

  const createWrapper = (getters = {}) => {
    store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          getters: {
            getErrors: () => getters.getErrors ?? '',
            getErrorStatus: () => getters.isErrorActive ?? false,
            getReCaptcha: () => getters.getReCaptcha ?? false
          }
        }
      }
    })
    return shallowMount(MFALogin, {
      store,
      propsData: { rules: { required: () => true } },
      stubs: { VueRecaptcha: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name MFALogin', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('MFALogin')
  })

  describe('onCaptchaVerified', () => {
    it('sets verifiedCaptchaResponse', () => {
      const wrapper = createWrapper()
      wrapper.vm.onCaptchaVerified('captcha-token')
      expect(wrapper.vm.verifiedCaptchaResponse).toBe('captcha-token')
    })
  })

  describe('onCaptchaExpired', () => {
    it('sets captchaVerified to false', () => {
      const wrapper = createWrapper()
      wrapper.vm.captchaVerified = true
      wrapper.vm.onCaptchaExpired()
      expect(wrapper.vm.captchaVerified).toBe(false)
    })

    it('calls recaptcha reset when ref exists', () => {
      const wrapper = createWrapper()
      const reset = jest.fn()
      wrapper.vm.$refs = { recaptcha: { reset } }
      wrapper.vm.onCaptchaExpired()
      expect(reset).toHaveBeenCalled()
    })
  })
})
