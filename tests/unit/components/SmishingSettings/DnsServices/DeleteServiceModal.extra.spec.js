import { shallowMount } from '@vue/test-utils'
import DeleteServiceModal from '@/components/SmishingSettings/DnsServices/DeleteServiceModal.vue'

describe('DeleteServiceModal.vue (SmishingSettings DnsServices) (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteServiceModal, {
      propsData: {
        status: true,
        selectedDnsService: { dnsServiceProviderName: 'Cloudflare' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('closeModal emits handleCloseModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('handleDelete emits handleDelete with selectedDnsService and closes modal', () => {
    const dnsService = { dnsServiceProviderName: 'Test DNS' }
    const wrapper = createWrapper({ selectedDnsService: dnsService })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('handleDelete')).toBeTruthy()
    expect(wrapper.emitted('handleDelete')[0][0]).toEqual(dnsService)
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })
})
