import { shallowMount } from '@vue/test-utils'
import PostCardLoading from '@/components/SkeletonLoading/PostCardLoading.vue'

describe('PostCardLoading.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(PostCardLoading, {
      propsData: {
        loading: true,
        ...propsData
      },
      stubs: {
        VSkeletonLoader: {
          name: 'VSkeletonLoader',
          props: ['loading', 'type'],
          template: '<div class="post-card-loading-stub"><slot /></div>'
        }
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('PostCardLoading')
  })

  it('keeps boilerplate attr disabled by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.attrs).toEqual({ boilerplate: false })
  })

  it('passes loading prop to skeleton loader', () => {
    const wrapper = mountComponent({ loading: false })
    const skeleton = wrapper.findComponent({ name: 'VSkeletonLoader' })

    expect(skeleton.exists()).toBe(true)
    expect(skeleton.props('loading')).toBe(false)
  })
})

