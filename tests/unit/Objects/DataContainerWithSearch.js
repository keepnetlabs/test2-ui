import { mount } from '@vue/test-utils'
import DataContainerWithSearchComponent from '@/components/Common/Others/DataContainerWithSearch'
import { customVuetify as vuetify } from '../utils'
export default class DataContainerWithSearch {
  constructor(localVue, propsData) {
    this.wrapper = mount(DataContainerWithSearchComponent, {
      localVue,
      propsData,
      vuetify
    })
  }
  getWrapper() {
    return this.wrapper
  }
}
