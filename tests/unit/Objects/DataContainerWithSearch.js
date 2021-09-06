import { mount } from '@vue/test-utils'
import DataContainerWithSearchComponent from '@/components/Common/Others/DataContainerWithSearch'
export default class DataContainerWithSearch {
  constructor(localVue, propsData) {
    this.wrapper = mount(DataContainerWithSearchComponent, {
      localVue,
      propsData
    })
  }
}
