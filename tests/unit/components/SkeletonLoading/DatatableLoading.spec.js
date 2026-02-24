import { shallowMount } from '@vue/test-utils'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading.vue'

describe('DatatableLoading.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DatatableLoading, {
      propsData: {
        loading: true,
        loaderType: 0,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('DatatableLoading')
  })

  it('renders when loading true', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.find('.data-table-loading').exists()).toBe(true)
  })

  it('does not render when loading false', () => {
    const wrapper = createWrapper({ loading: false })
    expect(wrapper.find('.data-table-loading').exists()).toBe(false)
  })

  it('has boilerplate false in attrs', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.attrs.boilerplate).toBe(false)
  })
})
