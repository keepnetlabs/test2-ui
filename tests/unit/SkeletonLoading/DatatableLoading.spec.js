import { createLocalVue, shallowMount } from '@vue/test-utils'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading.vue'
import Vuetify from 'vuetify'

describe('DatatableLoading.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders correctly when loading is true', () => {
    const wrapper = shallowMount(DatatableLoading, {
      localVue,
      vuetify,
      propsData: { loading: true }
    })
    expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
  })

  it('hides when loading is false', () => {
    const wrapper = shallowMount(DatatableLoading, {
      localVue,
      vuetify,
      propsData: { loading: false }
    })
    expect(wrapper.find('.data-table-loading').exists()).toBe(false)
  })
})
