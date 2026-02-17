import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCampaignInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo'

describe('CampaignManagerReportSummaryCampaignInfo.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryCampaignInfo, {
      propsData: {
        items: {
          'Target Users': 25,
          'Target Groups': 2
        },
        helperData: {
          sendOnlyActiveUsers: true,
          sendRandomlyUsers: true,
          randomlyUsersCount: 25,
          totalTargetUserCount: 100,
          targetGroups: [{ name: 'A' }, { name: 'B' }],
          smartGroupInfo: { name: 'Failed Users', resourceId: 'sg-1' }
        },
        isTestCampaign: false,
        ...propsData
      },
      mocks: {
        $router: { push: jest.fn() }
      },
      stubs: {
        Fragment: true,
        CampaignManagerSummaryCard: true,
        CommonReportViewTargetGroupsModal: true,
        Badge: true,
        VTooltip: true,
        VBtn: true,
        VIcon: true
      }
    })

  it('computes tooltip, body value and target group data', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.isTooltip).toBe(true)
    expect(wrapper.vm.getTooltipText).toContain('Only active and random 25 of 100 total users')
    expect(wrapper.vm.getBodyValue).toContain('25 users of 100')
    expect(wrapper.vm.getTargetGroups).toHaveLength(2)
    expect(wrapper.vm.getSmartGroupingName).toBe('Failed Users')
  })

  it('handles modal and smart-group redirect methods', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleViewTargetGroupsClick()
    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(true)
    wrapper.vm.handleCloseTargetGroupsModal()
    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(false)

    wrapper.vm.handleRedirectToSmartGroup()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Target Group Users',
      params: { id: 'sg-1', label: 'Failed Users' }
    })
  })

  it('does not navigate when smart group id is missing', () => {
    const wrapper = createWrapper({
      helperData: { smartGroupInfo: { name: 'No Id' } }
    })

    wrapper.vm.handleRedirectToSmartGroup()
    expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
  })
})
