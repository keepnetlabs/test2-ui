import { shallowMount } from '@vue/test-utils'
import CardLoading from '@/components/SkeletonLoading/CardLoading.vue'

describe('CardLoading.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CardLoading, {
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
    expect(wrapper.vm.$options.name).toBe('CardLoading')
  })

  it('passes loading prop to v-skeleton-loader', () => {
    const wrapper = createWrapper({ loading: true })
    const loader = wrapper.find('v-skeleton-loader-stub')
    expect(loader.exists()).toBe(true)
    expect(loader.attributes('loading')).toBe('true')
  })

  it('loading false passes loading prop', () => {
    const wrapper = createWrapper({ loading: false })
    expect(wrapper.vm.loading).toBe(false)
  })

  it('has boilerplate false in attrs', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.attrs.boilerplate).toBe(false)
  })
})
