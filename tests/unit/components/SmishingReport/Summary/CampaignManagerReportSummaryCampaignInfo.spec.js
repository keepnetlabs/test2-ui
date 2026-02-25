import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCampaignInfo from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryCampaignInfo.vue'

describe('SmishingReport Summary CampaignManagerReportSummaryCampaignInfo.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSummaryCampaignInfo, {
      propsData: {
        items: { 'Target Users': 10 },
        helperData: {},
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonReportViewTargetGroupsModal: true,
        Badge: true,
        Fragment: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('isTooltip', () => {
    it('returns true when sendOnlyActiveUsers and sendRandomlyUsers are true', () => {
      const wrapper = createWrapper({
        helperData: { sendOnlyActiveUsers: true, sendRandomlyUsers: true }
      })
      expect(wrapper.vm.isTooltip).toBe(true)
    })

    it('returns false when either is false', () => {
      const wrapper = createWrapper({
        helperData: { sendOnlyActiveUsers: false, sendRandomlyUsers: true }
      })
      expect(wrapper.vm.isTooltip).toBe(false)
    })
  })

  describe('getBodyValue', () => {
    it('includes totalTargetUserCount when isTooltip', () => {
      const wrapper = createWrapper({
        items: { 'Target Users': 5 },
        helperData: {
          sendOnlyActiveUsers: true,
          sendRandomlyUsers: true,
          totalTargetUserCount: 50
        }
      })
      expect(wrapper.vm.getBodyValue).toContain('5 users')
      expect(wrapper.vm.getBodyValue).toContain('of 50')
    })

    it('excludes total when not isTooltip', () => {
      const wrapper = createWrapper({
        items: { 'Target Users': 10 },
        helperData: {}
      })
      expect(wrapper.vm.getBodyValue).toBe('10 users ')
    })
  })

  describe('getTargetGroups', () => {
    it('returns targetGroups from helperData', () => {
      const groups = [{ id: 1 }]
      const wrapper = createWrapper({ helperData: { targetGroups: groups } })
      expect(wrapper.vm.getTargetGroups).toEqual(groups)
    })
  })

  describe('handleViewTargetGroupsClick', () => {
    it('sets isTargetGroupsModalVisible to true', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleViewTargetGroupsClick()
      expect(wrapper.vm.isTargetGroupsModalVisible).toBe(true)
    })
  })

  describe('handleCloseTargetGroupsModal', () => {
    it('sets isTargetGroupsModalVisible to false', () => {
      const wrapper = createWrapper()
      wrapper.vm.isTargetGroupsModalVisible = true
      wrapper.vm.handleCloseTargetGroupsModal()
      expect(wrapper.vm.isTargetGroupsModalVisible).toBe(false)
    })
  })
})
