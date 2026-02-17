import { shallowMount } from '@vue/test-utils'
import ExtendedViewLoading from '@/components/SkeletonLoading/ExtendedViewLoading.vue'

describe('ExtendedViewLoading.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(ExtendedViewLoading, {
      propsData: {
        loading: true,
        size: 'medium',
        ...propsData
      },
      stubs: {
        VSkeletonLoader: {
          name: 'VSkeletonLoader',
          props: ['loading', 'type'],
          template: '<div class="skeleton-stub"><slot /></div>'
        }
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('ExtendedViewLoading')
  })

  it('returns skeleton type for small, medium, big and fallback sizes', () => {
    expect(mountComponent({ size: 'small' }).vm.getType).toBe('table-heading,list-item,list-item,list-item')
    expect(mountComponent({ size: 'medium' }).vm.getType).toBe(
      'table-heading,list-item,list-item,list-item,list-item,list-item'
    )
    expect(mountComponent({ size: 'big' }).vm.getType).toBe(
      'table-heading,list-item,list-item,list-item,list-item,list-item,list-item,list-item'
    )
    expect(mountComponent({ size: 'unknown' }).vm.getType).toBe('table-heading,list-item,list-item,list-item')
  })

  it('has boilerplate attr disabled by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.attrs).toEqual({ boilerplate: false })
  })
})

