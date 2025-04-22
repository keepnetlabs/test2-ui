import MFASetupComponent from '@/components/MFA/MFASetup'
import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import { customVuetify as vuetify } from '../utils'
export default class MFASetup {
  constructor(localVue, propsData) {
    this.wrapper = mount(MFASetupComponent, {
      localVue,
      vuetify,
      store: new Vuex.Store({
        modules: {
          common: {
            namespaced: true,
            getters: {
              getErrors() {
                return 'error'
              },
              getErrorStatus() {
                return false
              }
            }
          }
        }
      }),
      propsData: {
        mfaCode: null,
        mfaSetupDetails: null,
        isLogin: false,
        rules: {
          required: () => {
            return true
          }
        },
        ...propsData
      }
    })
  }
  getWrapper() {
    return this.wrapper
  }
}
