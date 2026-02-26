import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import MFASetup from '@/components/MFA/MFASetup.vue'
import { customVuetify as vuetify } from '../../utils'

describe('MFASetup.vue (extra)', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const createWrapper = ({
    isLogin = false,
    mfaSetupDetails = null,
    errorStatus = false,
    errors = ''
  } = {}) => {
    const store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          getters: {
            getErrors: () => errors,
            getErrorStatus: () => errorStatus
          }
        }
      }
    })

    return mount(MFASetup, {
      localVue,
      vuetify,
      store,
      propsData: {
        isLogin,
        mfaSetupDetails,
        rules: { required: () => true }
      }
    })
  }

  it('renders login title only when isLogin=true', () => {
    const loginWrapper = createWrapper({ isLogin: true })
    expect(loginWrapper.find('.login-title').exists()).toBe(true)

    const dashboardWrapper = createWrapper({ isLogin: false })
    expect(dashboardWrapper.find('.login-title').exists()).toBe(false)
    expect(dashboardWrapper.classes()).toContain('mfa-setup--dashboard')
  })

  it('maps Vuex getters to computed error fields', () => {
    const wrapper = createWrapper({ errorStatus: true, errors: 'invalid code' })
    expect(wrapper.vm.isErrorActive).toBe(true)
    expect(wrapper.vm.getErrors).toBe('invalid code')
  })

  it('emits confirmSetupMFA with mfaCode on setup button click', async () => {
    const wrapper = createWrapper({ isLogin: true })
    await wrapper.setData({ mfaCode: '654321' })

    await wrapper.find('#btn-setup--mfa-dashboard-popup').trigger('click')

    expect(wrapper.emitted('confirmSetupMFA')).toBeTruthy()
    expect(wrapper.emitted('confirmSetupMFA')[0]).toEqual(['654321'])
  })

  it('emits confirmSetupMFA on enter key from MFA input', async () => {
    const wrapper = createWrapper({ isLogin: true })
    await wrapper.setData({ mfaCode: '111222' })

    await wrapper.find('#input--login-mfa-code').trigger('keyup.enter')

    expect(wrapper.emitted('confirmSetupMFA')).toBeTruthy()
    expect(wrapper.emitted('confirmSetupMFA')[0]).toEqual(['111222'])
  })

  it('renders manual key and qr image src when setup details provided', () => {
    const wrapper = createWrapper({
      mfaSetupDetails: {
        manualEntryKey: 'MANUAL-KEY-1',
        qrCodeSetupImageUrl: 'https://cdn.example.com/qr.png'
      }
    })

    expect(wrapper.text()).toContain('MANUAL-KEY-1')
    expect(wrapper.find('img[alt="qrCode"]').attributes('src')).toBe(
      'https://cdn.example.com/qr.png'
    )
  })

  it('uses empty fallbacks in template when setup details are missing', () => {
    const wrapper = createWrapper({ mfaSetupDetails: null })
    expect(wrapper.text()).not.toContain('undefined')
    expect(wrapper.find('img[alt="qrCode"]').attributes('src')).toBeUndefined()
  })
})
