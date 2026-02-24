import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSMSDelivery from '@/components/SmishingReport/Summary/CampaignManagerReportSMSDelivery.vue'

describe('CampaignManagerReportSMSDelivery.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSMSDelivery, {
      propsData: {
        items: { 'Sending Status': 'Sent', 'Sender Phone Number': ['+1234567890'] },
        helperData: {
          smsDeliveredUserCount: 10,
          totalTargetUserCount: 15,
          smsNotDeliveredUserCount: 5,
          phoneNumbers: ['+1234567890']
        },
        ...propsData
      },
      stubs: { Fragment: true, CampaignManagerSummaryCard: true, CampaignManagerSenderPhoneNumbersModal: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('isNotDelivered returns true when smsNotDeliveredUserCount > 0', () => {
    const wrapper = mountComponent({
      helperData: { smsNotDeliveredUserCount: 3, smsDeliveredUserCount: 10, totalTargetUserCount: 13 }
    })
    expect(wrapper.vm.isNotDelivered).toBe(true)
  })

  it('isNotDelivered returns false when smsNotDeliveredUserCount is 0', () => {
    const wrapper = mountComponent({
      helperData: { smsNotDeliveredUserCount: 0, smsDeliveredUserCount: 15, totalTargetUserCount: 15 }
    })
    expect(wrapper.vm.isNotDelivered).toBe(false)
  })

  it('getDeliveryValue returns formatted sent count', () => {
    const wrapper = mountComponent({
      helperData: { smsDeliveredUserCount: 10, totalTargetUserCount: 15 }
    })
    expect(wrapper.vm.getDeliveryValue).toBe('10 / 15 sent')
  })

  it('getNotDeliveredValue returns formatted not delivered count', () => {
    const wrapper = mountComponent({
      helperData: { smsNotDeliveredUserCount: 5 }
    })
    expect(wrapper.vm.getNotDeliveredValue).toBe('5 not delivered')
  })

  it('getPhoneNumbers returns phoneNumbers from helperData', () => {
    const wrapper = mountComponent({
      helperData: { phoneNumbers: ['+1', '+2'] }
    })
    expect(wrapper.vm.getPhoneNumbers).toEqual(['+1', '+2'])
  })

  it('getPhoneNumbers returns empty array when missing', () => {
    const wrapper = mountComponent({ helperData: {} })
    expect(wrapper.vm.getPhoneNumbers).toEqual([])
  })

  it('handleSenderPhoneNumbersClick opens modal', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSenderPhoneNumbersClick()
    expect(wrapper.vm.isSenderPhoneNumbersModalVisible).toBe(true)
  })

  it('handleCloseSenderPhoneNumbersModal closes modal', () => {
    const wrapper = mountComponent()
    wrapper.vm.isSenderPhoneNumbersModalVisible = true
    wrapper.vm.handleCloseSenderPhoneNumbersModal()
    expect(wrapper.vm.isSenderPhoneNumbersModalVisible).toBe(false)
  })
})
