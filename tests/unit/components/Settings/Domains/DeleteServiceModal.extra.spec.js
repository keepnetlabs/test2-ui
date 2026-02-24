import { shallowMount } from '@vue/test-utils'
import DeleteServiceModal from '@/components/Settings/Domains/DeleteServiceModal.vue'

describe('DeleteServiceModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteServiceModal, {
      propsData: {
        status: true,
        selectedDomain: { domain: 'example.com' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('closeModal emits handleCloseModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('handleDelete emits handleDelete with selectedDomain and closes modal', () => {
    const domain = { domain: 'test.com' }
    const wrapper = createWrapper({ selectedDomain: domain })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('handleDelete')).toBeTruthy()
    expect(wrapper.emitted('handleDelete')[0][0]).toEqual(domain)
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })
})
