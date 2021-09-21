import MFALoginComponent from '@/components/MFA/MFALogin'
import { mount } from '@vue/test-utils'
import Vuex from 'vuex'

export default class MFALogin {
  constructor(localVue, propsData) {
    this.wrapper = mount(MFALoginComponent, {
      localVue,
      store: new Vuex.Store({
        modules: {
          common: {
            namespaced: true,
            state: {
              downloadModalStatus: false
            },
            getters: {
              getErrors() {
                return 'error'
              },
              getErrorStatus() {
                return false
              },
              getReCaptcha() {
                return ''
              }
            }
          }
        }
      }),
      propsData: {
        validReset: false,
        verificationCode: '',
        rememberMeOnThisDevice: false,
        rules: {
          required: () => {
            return true
          }
        },
        ...propsData
      }
    })
  }
}
