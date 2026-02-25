import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryLandingPage from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryLandingPage.vue'

describe('SmishingReport Summary CampaignManagerReportSummaryLandingPage.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSummaryLandingPage, {
      propsData: {
        formData: null,
        isFetchingSummary: false,
        ...propsData
      },
      stubs: { CampaignManagerSummaryCard: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('isFormData', () => {
    it('returns falsy when formData is null', () => {
      const wrapper = createWrapper({ formData: null })
      expect(wrapper.vm.isFormData).toBe(0)
    })

    it('returns truthy when formData exists', () => {
      const wrapper = createWrapper({ formData: { name: 'Test' } })
      expect(wrapper.vm.isFormData).toBe(1)
    })
  })

  describe('getCurrentTemplate', () => {
    it('returns first template when templates length is 1', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        templates: [{ content: '<p>Single</p>' }],
        selectedTab: '1'
      })
      expect(wrapper.vm.getCurrentTemplate).toBe('<p>Single</p>')
    })

    it('returns template by selectedTab when multiple templates', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        templates: [
          { content: '<p>Page 1</p>' },
          { content: '<p>Page 2</p>' }
        ],
        selectedTab: '2'
      })
      expect(wrapper.vm.getCurrentTemplate).toBe('<p>Page 2</p>')
    })

    it('returns empty string when templates is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({ templates: [], selectedTab: '1' })
      expect(wrapper.vm.getCurrentTemplate).toBe('')
    })
  })
})
