import { shallowMount } from '@vue/test-utils'
import ThreeRowLoading from '@/components/SkeletonLoading/ThreeRowLoading.vue'

describe('ThreeRowLoading.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ThreeRowLoading, {
      propsData: { loading: true, ...propsData }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('ThreeRowLoading')
  })

  it('has boilerplate false in attrs', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.attrs.boilerplate).toBe(false)
  })

  it('has three-row-loading class', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.three-row-loading').exists()).toBe(true)
  })
})
