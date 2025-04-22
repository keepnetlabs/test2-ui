import PasswordCheckerComponent from '@/components/Common/PasswordChecker/PasswordChecker'
import { mount } from '@vue/test-utils'
export default class PasswordChecker {
  constructor(localVue, propsData) {
    this.wrapper = mount(PasswordCheckerComponent, {
      localVue,
      ...propsData
    })
  }
  getWrapper() {
    return this.wrapper
  }
}
