import { shallowMount } from '@vue/test-utils'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'

describe('RowActionsMenu.vue', () => {
  it('renders menu with tooltip and default icon', () => {
    const wrapper = shallowMount(RowActionsMenu, {
      stubs: {
        VMenu: true,
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VList: true
      }
    })

    expect(wrapper.vm.$options.name).toBe('RowActionsMenu')
    expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(true)
    expect(wrapper.html()).toContain('vmenu-stub')
  })
})
