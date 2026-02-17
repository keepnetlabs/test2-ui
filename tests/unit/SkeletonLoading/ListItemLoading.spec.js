import { shallowMount } from '@vue/test-utils'
import ListItemLoading from '@/components/SkeletonLoading/ListItemLoading'

describe('ListItemLoading.vue', () => {
  it('passes loading prop and boilerplate attrs to skeleton loader', () => {
    const wrapper = shallowMount(ListItemLoading, {
      propsData: {
        loading: true
      }
    })

    const loader = wrapper.find('v-skeleton-loader-stub')
    expect(loader.exists()).toBe(true)
    expect(wrapper.props('loading')).toBe(true)
    expect(wrapper.vm.attrs).toEqual({ boilerplate: false })
  })
})

