import MakeAvailableForComponent from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import { mount } from '@vue/test-utils'

export default class MakeAvailableFor {
  constructor(localVue, propsData) {
    this.wrapper = mount(MakeAvailableForComponent, {
      localVue,
      propsData
    })
  }
}
