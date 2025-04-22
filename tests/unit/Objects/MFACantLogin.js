import MFACantLoginComponent from '@/components/MFA/MFACantLogin'
import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { customVuetify as vuetify } from '../utils'
export default class MFACantLogin {
  constructor(localVue, propsData) {
    this.wrapper = mount(MFACantLoginComponent, {
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
        validReset: false,
        phoneNumber: null,
        verificationCode: '',
        rememberMeOnThisDevice: false,
        rules: {
          email: (v) => Validations.email(v),
          controlEmail: (v) => Validations.controlEmailLength(v, labels.InvalidEmailAddress),
          min: (v) => v.length >= 8 || 'Minimum 8 characters',
          max: (v) => v.length < 254 || 'Email address cannot exceed 320 characters',
          required: (value) => !!value || 'Required',
          minPassword: (value) => {
            const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
            return (
              pattern.test(value) ||
              'Password must be at least 8 characters with 1 capital letter, 1 lowercase letter, 1 special character and 1 number'
            )
          },
          equalToNewPassword: (v) => {
            return v === this.reNewPassword || "'New password' and 'Confirm password' do not match"
          },
          equalToConfirmPassword: (v) => {
            return v === this.newPassword || "'New password' and 'Confirm password' do not match"
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
