import { shallowMount } from '@vue/test-utils'
import DeleteSystemUserModal from '@/components/SystemUsers/DeleteSystemUserModal.vue'

describe('DeleteSystemUserModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteSystemUserModal, {
      propsData: {
        status: true,
        selectedRow: { email: 'user@test.com' },
        isMultiple: false,
        userCount: 0,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('getSystemUserEmail returns email for single user', () => {
    const wrapper = createWrapper({ selectedRow: { email: 'admin@company.com' } })
    expect(wrapper.vm.getSystemUserEmail).toBe('admin@company.com')
  })

  it('getSystemUserEmail returns userCount users when multiple', () => {
    const wrapper = createWrapper({ selectedRow: null, isMultiple: true, userCount: 5 })
    expect(wrapper.vm.getSystemUserEmail).toBe('5 users')
  })

  it('getSubTitle returns single user text when not multiple', () => {
    const wrapper = createWrapper({ isMultiple: false })
    expect(wrapper.vm.getSubTitle).toContain('The system user')
  })

  it('getSubTitle returns userCount when multiple', () => {
    const wrapper = createWrapper({ isMultiple: true, userCount: 3 })
    expect(wrapper.vm.getSubTitle).toContain('3 user(s)')
  })

  it('closeModal emits closeOverlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })

  it('handleDelete single emits handleDelete with selectedRow', () => {
    const row = { email: 'x@x.com' }
    const wrapper = createWrapper({ selectedRow: row, isMultiple: false })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('handleDelete')).toBeTruthy()
    expect(wrapper.emitted('handleDelete')[0][0]).toEqual(row)
  })

  it('handleDelete multiple emits handleMultipleDelete', () => {
    const wrapper = createWrapper({ isMultiple: true })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('handleMultipleDelete')).toBeTruthy()
  })
})
