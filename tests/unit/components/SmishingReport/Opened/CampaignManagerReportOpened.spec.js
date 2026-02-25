import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportOpened from '@/components/SmishingReport/Opened/CampaignManagerReportOpened.vue'

jest.mock('@/api/phishingsimulator', () => ({
  resendPhishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('SmishingReport Opened CampaignManagerReportOpened.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportOpened, {
      propsData: {
        id: 'test-id',
        instanceGroup: 'g1',
        ...propsData
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportOpenedTable: true,
        CampaignManagerReportOpenedItemDetailDialog: true,
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
      wrapper.vm.handleSelectionChange(2)
      expect(wrapper.vm.resendItemCount).toBe(2)
    })
  })

  describe('handleOnResend', () => {
    it('sets resendPayload and toggles dialog', () => {
      const wrapper = createWrapper()
      const payload = { items: ['r1'] }
      wrapper.vm.handleOnResend(payload)
      expect(wrapper.vm.resendPayload).toEqual(payload)
      expect(wrapper.vm.isShowResendDialog).toBe(true)
    })
  })

  describe('handleOnDetail', () => {
    it('sets selectedRow and opens detail dialog', () => {
      const wrapper = createWrapper()
      const row = { resourceId: 'r1' }
      wrapper.vm.handleOnDetail(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDetailDialog).toBe(true)
    })
  })
})
