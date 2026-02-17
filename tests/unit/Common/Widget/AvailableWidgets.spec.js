import { shallowMount } from '@vue/test-utils'
import AvailableWidgets from '@/components/Common/Widget/AvailableWidgets'

describe('AvailableWidgets.vue', () => {
  const widgets = [
    { key: 'a', name: 'A', isAllowed: true },
    { key: 'b', name: 'B', isAllowed: false }
  ]

  it('computes edit mode disabled from permissions', async () => {
    const wrapper = shallowMount(AvailableWidgets, {
      propsData: {
        availableWidgets: widgets,
        permissions: {}
      }
    })

    expect(wrapper.vm.isEditModeDisabled).toBe(true)
    await wrapper.setProps({ permissions: { widgets: true } })
    expect(wrapper.vm.isEditModeDisabled).toBe(false)
  })

  it('computes menu render availability from widgets', () => {
    const wrapper = shallowMount(AvailableWidgets, {
      propsData: {
        availableWidgets: widgets,
        permissions: { widgets: true }
      }
    })

    expect(wrapper.vm.canRenderMenu).toBe(true)
    wrapper.setData({ widgets: [{ key: 'x', isAllowed: false }] })
    expect(wrapper.vm.canRenderMenu).toBe(false)
  })

  it('emits all action events', () => {
    const wrapper = shallowMount(AvailableWidgets, {
      propsData: {
        availableWidgets: widgets,
        permissions: { widgets: true }
      }
    })

    const payload = { key: 'a' }
    wrapper.vm.handleAddWidget(payload)
    wrapper.vm.handleCancel()
    wrapper.vm.handleEdit()
    wrapper.vm.handleSave()
    wrapper.vm.handleOpenMenu()

    expect(wrapper.emitted('addWidget')[0]).toEqual([payload])
    expect(wrapper.emitted('handleCancel')).toBeTruthy()
    expect(wrapper.emitted('handleEdit')).toBeTruthy()
    expect(wrapper.emitted('handleSave')).toBeTruthy()
    expect(wrapper.emitted('handleOpenMenu')).toBeTruthy()
  })

  it('updates widgets from availableWidgets watcher', async () => {
    const wrapper = shallowMount(AvailableWidgets, {
      propsData: {
        availableWidgets: widgets,
        permissions: { widgets: true }
      }
    })

    expect(wrapper.vm.widgets.length).toBe(2)
    await wrapper.setProps({
      availableWidgets: [{ key: 'z', name: 'Z', isAllowed: true }]
    })
    expect(wrapper.vm.widgets).toEqual([{ key: 'z', name: 'Z', isAllowed: true }])
  })
})
