import { shallowMount } from '@vue/test-utils'
import CustomFieldsLoading from '@/components/SkeletonLoading/CustomFieldsLoading'

describe('CustomFieldsLoading.vue', () => {
  it('renders skeleton loader and default attrs', () => {
    const wrapper = shallowMount(CustomFieldsLoading, {
      propsData: {
        loading: true
      }
    })

    expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    expect(wrapper.props('loading')).toBe(true)
    expect(wrapper.vm.attrs).toEqual({ boilerplate: false })
  })
})

