import PasswordCheckerComponent from '@/components/Common/PasswordChecker/PasswordChecker'
import { mount } from '@vue/test-utils'
import MFASetupComponent from '@/components/MFA/MFASetup'

export default class PasswordChecker {
  constructor(localVue, propsData) {
    this.wrapper = mount(PasswordCheckerComponent, {
      localVue,
      ...propsData
    })
  }
}
