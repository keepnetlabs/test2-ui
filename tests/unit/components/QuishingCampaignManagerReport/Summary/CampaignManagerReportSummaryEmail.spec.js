import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryEmail from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryEmail.vue'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn().mockResolvedValue([])
}))

describe('QuishingCampaignManagerReport Summary CampaignManagerReportSummaryEmail.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSummaryEmail, {
      propsData: {
        formData: { name: 'Test Template' },
        isFetchingSummary: false,
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonSimulatorEmailTemplatePreviewDialog: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getIcon', () => {
    it('returns pdf-file when isQuishingPrintout is true', () => {
      const wrapper = createWrapper({ isQuishingPrintout: true })
      expect(wrapper.vm.getIcon).toBe('$pdf-file')
    })

    it('returns mdi-email when isQuishingPrintout is false', () => {
      const wrapper = createWrapper({ isQuishingPrintout: false })
      expect(wrapper.vm.getIcon).toBe('mdi-email')
    })
  })

  describe('getTitle', () => {
    it('returns Individual Printout Template when isQuishingPrintout', () => {
      const wrapper = createWrapper({
        formData: { name: 'My Template' },
        isQuishingPrintout: true
      })
      expect(wrapper.vm.getTitle).toBe('Individual Printout Template: My Template')
    })

    it('returns Email Template when not isQuishingPrintout', () => {
      const wrapper = createWrapper({
        formData: { name: 'My Template' },
        isQuishingPrintout: false
      })
      expect(wrapper.vm.getTitle).toBe('Email Template: My Template')
    })

    it('handles empty formData name', () => {
      const wrapper = createWrapper({ formData: {} })
      expect(wrapper.vm.getTitle).toBe('Email Template: ')
    })
  })
})
