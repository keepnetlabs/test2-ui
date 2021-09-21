import { mount } from '@vue/test-utils'
import ShowMoreComponent from '@/components/Common/ShowMore/ShowMore'
export default class ShowMore {
  constructor(localVue, propsData) {
    this.wrapper = mount(ShowMoreComponent, {
      localVue,
      propsData
    })
  }
}
