import { shallowMount } from '@vue/test-utils'
import DeleteUserModal from '@/components/TargetUsers/DeleteUserModal.vue'

describe('DeleteUserModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteUserModal, {
      propsData: {
        isShow: true,
        selectedRow: { email: 'user@test.com' },
        isMultiple: false,
        userCount: 0,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('getTargetUserEmail returns email for single user', () => {
    const wrapper = createWrapper({ selectedRow: { email: 'admin@co.com' } })
    expect(wrapper.vm.getTargetUserEmail).toBe('admin@co.com')
  })

  it('getTargetUserEmail returns userCount when no selectedRow', () => {
    const wrapper = createWrapper({ selectedRow: null, userCount: 5 })
    expect(wrapper.vm.getTargetUserEmail).toBe('5 users')
  })

  it('closeModal emits changeModalStatus with false', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('changeModalStatus')).toEqual([[false]])
  })

  it('handleDelete single emits deleteAction and changeModalStatus', () => {
    const row = { email: 'x@x.com' }
    const wrapper = createWrapper({ selectedRow: row, isMultiple: false })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('deleteAction')).toEqual([[row]])
    expect(wrapper.emitted('changeModalStatus')).toEqual([[false]])
  })

  it('handleDelete multiple emits deleteMultiple and changeModalStatus', () => {
    const wrapper = createWrapper({ isMultiple: true })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('deleteMultiple')).toBeTruthy()
    expect(wrapper.emitted('changeModalStatus')).toEqual([[false]])
  })
})
