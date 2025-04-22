import MakeAvailableForComponent from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import { mount } from '@vue/test-utils'
import Vuex from 'vuex'

export default class MakeAvailableFor {
  constructor(localVue, propsData) {
    this.wrapper = mount(MakeAvailableForComponent, {
      localVue,
      propsData,
      store: new Vuex.Store({
        modules: {
          auth: {
            namespaced: true,
            state: {
              userRoleName: 'Root'
            }
          }
        }
      })
    })
  }
  getWrapper() {
    return this.wrapper
  }
}
