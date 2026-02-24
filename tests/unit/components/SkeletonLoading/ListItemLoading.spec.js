import { shallowMount } from '@vue/test-utils'
import ListItemLoading from '@/components/SkeletonLoading/ListItemLoading.vue'

describe('ListItemLoading.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ListItemLoading, {
      propsData: {
        loading: true,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('ListItemLoading')
  })

  it('passes loading to v-skeleton-loader', () => {
    const wrapper = createWrapper({ loading: true })
    const loader = wrapper.find('v-skeleton-loader-stub')
    expect(loader.exists()).toBe(true)
  })

  it('has boilerplate false in attrs', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.attrs.boilerplate).toBe(false)
  })
})
