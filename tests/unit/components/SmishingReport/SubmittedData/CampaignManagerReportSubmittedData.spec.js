import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedData from '@/components/SmishingReport/SubmittedData/CampaignManagerReportSubmittedData.vue'

jest.mock('@/api/smishing', () => ({
  resendSmishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('SmishingReport SubmittedData CampaignManagerReportSubmittedData.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSubmittedData, {
      propsData: {
        id: 'test-id',
        instanceGroup: 'g1',
        formDetails: {},
        ...propsData
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportSubmittedTable: true,
        CampaignManagerReportSubmittedItemDetailDialog: true,
        CampaignManagerReportResendDialog: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getPasswordComplexities', () => {
    it('returns passwordComplexityTypes from formDetails', () => {
      const wrapper = createWrapper({
        formDetails: {
          passwordComplexityTypes: [{ id: 1, name: 'Strong' }]
        }
      })
      expect(wrapper.vm.getPasswordComplexities).toEqual([{ id: 1, name: 'Strong' }])
    })

    it('returns empty array when formDetails has no passwordComplexityTypes', () => {
      const wrapper = createWrapper({ formDetails: {} })
      expect(wrapper.vm.getPasswordComplexities).toEqual([])
    })

    it('returns empty array when formDetails is null', () => {
      const wrapper = createWrapper({ formDetails: null })
      expect(wrapper.vm.getPasswordComplexities).toEqual([])
    })
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

    it('does not clear selectedRow when opening', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedRow: { id: 1 }, isShowDetailDialog: false })
      wrapper.vm.toggleShowDetailDialog()
      expect(wrapper.vm.selectedRow).toEqual({ id: 1 })
    })
  })
})
