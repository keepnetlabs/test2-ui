import { shallowMount } from '@vue/test-utils'
import ConnectionLost from '@/components/ConnectionLost.vue'

describe('ConnectionLost.vue', () => {
  const mountComponent = () => shallowMount(ConnectionLost, {
    stubs: {
      VListItem: { template: '<div><slot /></div>' },
      VListItemContent: { template: '<div><slot /></div>' },
      VListItemTitle: { template: '<div><slot /></div>' },
      VListItemSubtitle: { template: '<div><slot /></div>' },
      VIcon: { template: '<i><slot /></i>' }
    }
  })

  it('renders component name correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('ConnectionLost')
  })

  it('shows connection lost texts', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Connection Is Lost')
    expect(wrapper.text()).toContain('Cannot connect to the web')
    expect(wrapper.text()).toContain('You may lose your unsaved progress')
  })

  it('renders wifi-off icon marker', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('mdi-wifi-strength-off')
  })
})
