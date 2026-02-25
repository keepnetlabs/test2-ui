import { shallowMount } from '@vue/test-utils'
import DeleteServiceModal from '@/components/SmishingSettings/DnsServices/DeleteServiceModal.vue'

describe('SmishingSettings DnsServices DeleteServiceModal.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(DeleteServiceModal, {
      propsData: {
        status: true,
        selectedDnsService: null,
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
    it('emits handleDelete with selectedDnsService and calls closeModal', () => {
      const selectedDnsService = { resourceId: '1', dnsServiceProviderName: 'Test DNS' }
      const wrapper = createWrapper({ selectedDnsService })
      wrapper.vm.handleDelete()
      expect(wrapper.emitted('handleDelete')).toEqual([[selectedDnsService]])
      expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    })
  })
})
