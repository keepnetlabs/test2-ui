import { shallowMount } from '@vue/test-utils'
import AppRouterItem from '@/layout/AppRouterItem.vue'

describe('AppRouterItem.vue', () => {
  it('has correct component name', () => {
    expect(AppRouterItem.name).toBe('AppRouterItem')
  })

  it('renders icon and title props', () => {
    const wrapper = shallowMount(AppRouterItem, {
      propsData: {
        icon: 'mdi-home',
        title: 'Dashboard'
      }
    })
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.vm.icon).toBe('mdi-home')
    expect(wrapper.vm.title).toBe('Dashboard')
  })

  it('icon and title props are required', () => {
    expect(AppRouterItem.props.icon.required).toBe(true)
    expect(AppRouterItem.props.title.required).toBe(true)
  })
})
