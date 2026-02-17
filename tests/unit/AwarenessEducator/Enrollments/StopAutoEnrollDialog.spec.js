import { shallowMount } from '@vue/test-utils'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog.vue'

describe('StopAutoEnrollDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(StopAutoEnrollDialog, {
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
    expect(wrapper.vm.$options.name).toBe('StopAutoEnrollDialog')
  })

  it('contains expected constants', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.CONSTANTS).toEqual({
      icon: 'mdi-delete',
      title: 'Stop Auto-enroll?'
    })
  })

  it('emits close in handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('close')).toEqual([[]])
  })

  it('emits confirm in handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toEqual([[]])
  })
})
