import { mount } from '@vue/test-utils'
import ShowMoreComponent from '@/components/Common/ShowMore/ShowMore'
import { customVuetify as vuetify } from '../utils'
export default class ShowMore {
  constructor(localVue, propsData) {
    this.wrapper = mount(ShowMoreComponent, {
      localVue,
      propsData,
      vuetify
    })
  }
  getWrapper() {
    return this.wrapper
  }
}
