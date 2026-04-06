import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerScheduleDialog from '@/components/CampaignManager/CampaignManagerScheduleDialog.vue'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

describe('CampaignManagerScheduleDialog.vue (extra branching)', () => {
  const localVue = createLocalVue()

  const mountDialog = (propsData = {}) => {
    return shallowMount(CampaignManagerScheduleDialog, {
      localVue,
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: {
          template: '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        DatatableLoading: true,
        AlertBox: true
      }
    })
  }

  describe('computed getTitle', () => {
    it('uses Phishing CONSTANTS title when type is PHISHING and scenarioType is Phishing', () => {
      const wrapper = mountDialog({
        type: DISTRIBUTION_TYPES.PHISHING,
        scenarioType: SCENARIO_TYPES.PHISHING
      })
      expect(wrapper.vm.getTitle).toBe('Phishing Scenarios Frequency Schedule')
    })

    it('uses Quishing CONSTANTS title when type is PHISHING and scenarioType is Quishing', () => {
      const wrapper = mountDialog({
        type: DISTRIBUTION_TYPES.PHISHING,
        scenarioType: SCENARIO_TYPES.QUISHING
      })
      expect(wrapper.vm.getTitle).toBe('Quishing Scenarios Frequency Schedule')
    })

    it('uses Smishing title when type is not PHISHING (Smishing distribution)', () => {
      const wrapper = mountDialog({
        type: DISTRIBUTION_TYPES.SMISHING,
        scenarioType: SCENARIO_TYPES.PHISHING
      })
      expect(wrapper.vm.getTitle).toBe('Smishing Scenarios Frequency Schedule')
    })
  })

  describe('computed getSubtitle', () => {
    it('is empty when campaignName is missing', () => {
      const wrapper = mountDialog({ campaignName: '' })
      expect(wrapper.vm.getSubtitle).toBe('')
    })

    it('returns campaignName when provided', () => {
      const wrapper = mountDialog({ campaignName: 'Q4 rollout' })
      expect(wrapper.vm.getSubtitle).toBe('Q4 rollout')
    })
  })

  describe('computed isPhishing', () => {
    it('is true only for Phishing scenarioType', () => {
      expect(
        mountDialog({ scenarioType: SCENARIO_TYPES.PHISHING }).vm.isPhishing
      ).toBe(true)
      expect(mountDialog({ scenarioType: SCENARIO_TYPES.QUISHING }).vm.isPhishing).toBe(
        false
      )
    })
  })

  describe('methods', () => {
    it('closeModal emits on-close', () => {
      const wrapper = mountDialog()
      wrapper.vm.closeModal()
      expect(wrapper.emitted('on-close')).toBeTruthy()
      expect(wrapper.emitted('on-close')).toHaveLength(1)
    })
  })

  describe('template branching', () => {
    it('shows AlertBox stub only when phishing and category-based distribution', () => {
      const withAlert = mountDialog({
        type: DISTRIBUTION_TYPES.PHISHING,
        scenarioType: SCENARIO_TYPES.PHISHING,
        isCategoryBasedDistribution: true,
        items: [{ scenarioName: 'A', scheduleDate: '2026-01-01' }]
      })
      expect(withAlert.find('alertbox-stub').exists()).toBe(true)

      const withoutAlert = mountDialog({
        type: DISTRIBUTION_TYPES.PHISHING,
        scenarioType: SCENARIO_TYPES.QUISHING,
        isCategoryBasedDistribution: true,
        items: []
      })
      expect(withoutAlert.find('alertbox-stub').exists()).toBe(false)
    })

    it('shows loading stub when isLoading is true', async () => {
      const wrapper = mountDialog({ items: [] })
      await wrapper.setData({ isLoading: true })
      expect(wrapper.find('datatableloading-stub').exists()).toBe(true)
    })
  })
})
