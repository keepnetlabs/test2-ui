import MFAWelcomeComponent from '@/components/MFA/MFAWelcome'
import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import { customVuetify as vuetify } from '../utils'
export default class MFAWelcome {
  constructor(localVue, propsData) {
    this.wrapper = mount(MFAWelcomeComponent, {
      localVue,
      vuetify,
      store: new Vuex.Store({
        modules: {
          common: {
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
        mfaDetails: null,
        ...propsData
      }
    })
  }
  getWrapper() {
    return this.wrapper
  }
}
