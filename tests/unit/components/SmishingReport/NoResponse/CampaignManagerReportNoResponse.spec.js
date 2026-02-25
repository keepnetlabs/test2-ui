import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportNoResponse from '@/components/SmishingReport/NoResponse/CampaignManagerReportNoResponse.vue'

jest.mock('@/api/smishing', () => ({
  resendSmishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('SmishingReport NoResponse CampaignManagerReportNoResponse.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportNoResponse, {
      propsData: {
        id: 'test-id',
        instanceGroup: 'g1',
        ...propsData
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportNoResponseTable: true,
        CampaignManagerReportResendDialog: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('handleSelectionChange', () => {
    it('sets resendItemCount', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleSelectionChange(5)
      expect(wrapper.vm.resendItemCount).toBe(5)
    })
  })

  describe('handleOnResend', () => {
    it('sets resendPayload and toggles dialog', () => {
      const wrapper = createWrapper()
      const payload = { items: ['r1'], selectAll: false }
      wrapper.vm.handleOnResend(payload)
      expect(wrapper.vm.resendPayload).toEqual(payload)
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })
  })
})
