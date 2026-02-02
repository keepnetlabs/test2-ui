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

  it('responds to loading prop changes', async () => {
    const wrapper = shallowMount(DatatableLoading, {
      localVue,
      vuetify,
      propsData: { loading: true }
    })
    expect(wrapper.find('.data-table-loading').exists()).toBe(true)

    await wrapper.setProps({ loading: false })
    expect(wrapper.find('.data-table-loading').exists()).toBe(false)

    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.data-table-loading').exists()).toBe(true)
  })

  it('renders skeleton loader with correct type', () => {
    const wrapper = shallowMount(DatatableLoading, {
      localVue,
      vuetify,
      propsData: { loading: true }
    })
    const skeletonLoader = wrapper.find('v-skeleton-loader-stub')
    expect(skeletonLoader.exists()).toBe(true)
    expect(skeletonLoader.attributes('type')).toContain('table')
  })

  it('applies correct CSS class when loading', () => {
    const wrapper = shallowMount(DatatableLoading, {
      localVue,
      vuetify,
      propsData: { loading: true }
    })
    const container = wrapper.find('.data-table-loading')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('data-table-loading')
  })

  it('initializes with default loading state', () => {
    const wrapper = shallowMount(DatatableLoading, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.loading).toBeFalsy()
  })
})
