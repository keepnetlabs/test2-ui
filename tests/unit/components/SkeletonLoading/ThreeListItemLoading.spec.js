import { shallowMount } from '@vue/test-utils'
import ThreeListItemLoading from '@/components/SkeletonLoading/ThreeListItemLoading.vue'

describe('ThreeListItemLoading.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ThreeListItemLoading, {
      propsData: { loading: true, ...propsData }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('ThreeListItemLoading')
  })

  it('has boilerplate false in attrs', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.attrs.boilerplate).toBe(false)
  })
})
