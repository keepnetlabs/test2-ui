import { shallowMount } from '@vue/test-utils'
import DeleteServiceModal from '@/components/QuishingSettings/Domains/DeleteServiceModal.vue'

describe('QuishingSettings Domains DeleteServiceModal.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(DeleteServiceModal, {
      propsData: {
        status: true,
        selectedDomain: null,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('closeModal', () => {
    it('emits handleCloseModal', () => {
      const wrapper = createWrapper()
      wrapper.vm.closeModal()
      expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    })
  })

  describe('handleDelete', () => {
    it('emits handleDelete with selectedDomain and calls closeModal', () => {
      const selectedDomain = { resourceId: '1', domain: 'example.com' }
      const wrapper = createWrapper({ selectedDomain })
      wrapper.vm.handleDelete()
      expect(wrapper.emitted('handleDelete')).toEqual([[selectedDomain]])
      expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    })
  })
})
