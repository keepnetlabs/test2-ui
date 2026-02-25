import { shallowMount } from '@vue/test-utils'
import CampaignManagerPreview from '@/components/SmishingCampaignManager/CampaignManagerPreview.vue'

jest.mock('@/api/smishing', () => ({
  previewSmishingCampaign: jest.fn().mockResolvedValue({
    data: {
      data: {
        smishingScenarioPreviewList: [
          {
            name: 'Scenario 1',
            methodTypeId: 1,
            textTemplate: { template: 'Hello', name: 'T1' },
            landingPageTemplate: {
              name: 'LP1',
              description: 'Desc',
              urlTemplate: 'http://x.com',
              landings: []
            }
          }
        ]
      }
    }
  })
}))

describe('SmishingCampaignManager CampaignManagerPreview.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerPreview, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'r1', name: 'Campaign 1' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        DatatableLoading: true,
        TabsWithMfaSettings: true,
        ElTabs: true,
        ElTabPane: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getTitle', () => {
    it('returns Smishing Campaign Preview', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTitle).toBe('Smishing Campaign Preview')
    })
  })

  describe('getSubtitle', () => {
    it('returns selectedRow name', () => {
      const wrapper = createWrapper({
        selectedRow: { resourceId: 'r1', name: 'My Campaign' }
      })
      expect(wrapper.vm.getSubtitle).toBe('My Campaign')
    })

    it('returns empty when selectedRow has no name', () => {
      const wrapper = createWrapper({ selectedRow: {} })
      expect(wrapper.vm.getSubtitle).toBe('')
    })
  })

  describe('setActiveScenario', () => {
    it('sets isMethodMfa true when methodTypeId is 4', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({ methodTypeId: 4 })
      expect(wrapper.vm.isMethodMfa).toBe(true)
    })

    it('sets isMethodMfa false when methodTypeId is not 4', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({ methodTypeId: 1 })
      expect(wrapper.vm.isMethodMfa).toBe(false)
    })

    it('sets textTemplate from phishingScenarioPreviewDto', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({
        textTemplate: { template: 'Test message' }
      })
      expect(wrapper.vm.textTemplate).toBe('Test message')
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })
})
