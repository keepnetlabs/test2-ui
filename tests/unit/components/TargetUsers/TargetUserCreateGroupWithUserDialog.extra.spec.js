import { shallowMount } from '@vue/test-utils'
import TargetUserCreateGroupWithUserDialog from '@/components/TargetUsers/TargetUserCreateGroupWithUserDialog.vue'

describe('TargetUserCreateGroupWithUserDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TargetUserCreateGroupWithUserDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true, InputEntityName: true }
    })

  it('handleClose emits onClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('onClose')).toBeTruthy()
  })

  it('handleConfirm emits onConfirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('onConfirm')).toBeTruthy()
  })

  it('confirmButtonDisabled is true when groupName empty', () => {
    const wrapper = createWrapper()
    wrapper.setData({ groupName: '' })
    expect(wrapper.vm.confirmButtonDisabled).toBe(true)
  })

  it('watch groupName sets confirmButtonDisabled false when has value', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ groupName: 'My Group' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.confirmButtonDisabled).toBe(false)
  })

  it('watch groupName sets confirmButtonDisabled true when empty', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ groupName: 'x' })
    await wrapper.vm.$nextTick()
    wrapper.setData({ groupName: '' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.confirmButtonDisabled).toBe(true)
  })
})
