import { shallowMount } from '@vue/test-utils'
import CampaignManagerSenderPhoneNumbersModal from '@/components/SmishingCampaignManager/CampaignManagerSenderPhoneNumbersModal.vue'

describe('CampaignManagerSenderPhoneNumbersModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerSenderPhoneNumbersModal, {
      propsData: {
        status: true,
        phoneNumbers: ['+905551234567'],
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooterWithClose: true }
    })

  it('getPhoneNumberFormatted returns formatted number', () => {
    const wrapper = createWrapper({ phoneNumbers: ['+905551234567'] })
    const result = wrapper.vm.getPhoneNumberFormatted('+905551234567')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('getPhoneNumberCountry returns empty for empty input', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getPhoneNumberCountry('')).toBe('')
  })

  it('getPhoneNumberCountry returns country for valid number', () => {
    const wrapper = createWrapper()
    const result = wrapper.vm.getPhoneNumberCountry('+905551234567')
    expect(result).toBeTruthy()
  })

  it('closeModal emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
