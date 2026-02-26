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
    expect(AppRouterItem.props.icon.type).toBe(String)
    expect(AppRouterItem.props.title.type).toBe(String)
  })

  it('renders expected structural elements for menu item', () => {
    const wrapper = shallowMount(AppRouterItem, {
      propsData: {
        icon: 'mdi-shield',
        title: 'Security'
      }
    })

    expect(wrapper.find('.menu-list-item').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VListItemIcon' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VListItemTitle' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('Security')
  })
})
