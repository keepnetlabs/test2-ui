import { shallowMount } from '@vue/test-utils'
import VishingReportCampaignInfo from '@/components/VishingReport/VishingReportCampaignInfo.vue'

describe('VishingReportCampaignInfo.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportCampaignInfo, {
      propsData: {
        items: {
          'Target Groups': { show: true, value: [{ name: 'G1' }] },
          'Target Users': { show: true, value: 10 },
          'Language / Voice': { show: true, value: 'en-US / Male' }
        },
        isLoading: false,
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonReportViewTargetGroupsModal: true,
        Badge: true,
        Fragment: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getItems filters out items with show false', () => {
    const wrapper = mountComponent({
      items: {
        A: { show: true, value: 1 },
        B: { show: false, value: 2 }
      }
    })
    expect(wrapper.vm.getItems).toEqual({ A: 1 })
  })

  it('getItems keeps items with show true', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getItems['Target Users']).toBe(10)
  })

  it('getBodyValue returns users count', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getBodyValue).toBe('10 users')
  })

  it('getTargetGroups returns empty when Target Groups value missing', () => {
    const wrapper = mountComponent({
      items: { 'Target Groups': { show: false, value: [] }, 'Target Users': { show: true, value: 5 } }
    })
    expect(wrapper.vm.getTargetGroups).toEqual([])
  })

  it('getTargetGroups returns value when present', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTargetGroups).toEqual([{ name: 'G1' }])
  })

  it('handleViewTargetGroupsClick opens modal', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleViewTargetGroupsClick()
    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(true)
  })

  it('handleCloseTargetGroupsModal closes modal', () => {
    const wrapper = mountComponent()
    wrapper.vm.isTargetGroupsModalVisible = true
    wrapper.vm.handleCloseTargetGroupsModal()
    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(false)
  })
})
