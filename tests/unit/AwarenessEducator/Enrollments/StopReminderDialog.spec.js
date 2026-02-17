import { shallowMount } from '@vue/test-utils'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog.vue'

describe('StopReminderDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(StopReminderDialog, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('StopReminderDialog')
  })

  it('contains expected dialog constants', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.CONSTANTS).toEqual({
      icon: 'mdi-delete',
      title: 'Stop Reminder?'
    })
  })

  it('emits close when handleClose is called', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('close')).toEqual([[]])
  })

  it('emits confirm when handleConfirm is called', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toEqual([[]])
  })
})
