import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportClicked from '@/components/SmishingReport/Clicked/CampaignManagerReportClicked.vue'

jest.mock('@/api/smishing', () => ({
  resendSmishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('SmishingReport Clicked CampaignManagerReportClicked.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportClicked, {
      propsData: {
        id: 'test-id',
        instanceGroup: 'g1',
        ...propsData
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportClickedTable: true,
        CampaignManagerReportClickedItemDetailDialog: true,
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
      wrapper.vm.handleSelectionChange(3)
      expect(wrapper.vm.resendItemCount).toBe(3)
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

  describe('toggleShowDetailDialog', () => {
    it('clears selectedRow when closing', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { id: 1 }, isShowDetailDialog: true })
      wrapper.vm.toggleShowDetailDialog()
      expect(wrapper.vm.selectedRow).toBeNull()
    })
  })
})
