import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import TargetUserImportFromAFile from '@/components/TargetUsers/TargetUserImportFromAFile.vue'

describe('TargetUserImportFromAFile.vue', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          getters: {
            getTimezones: () => ({ timeZoneList: [] })
          }
        }
      }
    })
  })

  it('renders', () => {
    const wrapper = shallowMount(TargetUserImportFromAFile, {
      store,
      propsData: { status: false }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
