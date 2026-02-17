import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryScenarioInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryScenarioInfo'

describe('CampaignManagerReportSummaryScenarioInfo.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryScenarioInfo, {
      propsData: {
        items: { NumberOfCategories: 3 },
        campaignName: 'Campaign X',
        categories: ['Finance', 'HR'],
        ...propsData
      },
      stubs: {
        Fragment: true,
        CampaignManagerSummaryCardOneLine: true,
        CampaignManagerReportSummaryCategoriesPopup: true,
        VBtn: true,
        VIcon: true
      }
    })

  it('opens and closes categories popup by handlers', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.isCategoriesPopupVisible).toBe(false)
    wrapper.vm.handleCategoriesClick()
    expect(wrapper.vm.isCategoriesPopupVisible).toBe(true)
    wrapper.vm.handleCloseCategoriesPopuup()
    expect(wrapper.vm.isCategoriesPopupVisible).toBe(false)
  })

  it('passes popup props through component props', () => {
    const wrapper = createWrapper({
      categories: ['A', 'B', 'C'],
      campaignName: 'Campaign Y'
    })
    wrapper.setData({ isCategoriesPopupVisible: true })

    expect(wrapper.find('campaignmanagerreportsummarycategoriespopup-stub').attributes('categories')).toBeDefined()
    expect(wrapper.find('campaignmanagerreportsummarycategoriespopup-stub').attributes('campaignname')).toBe('Campaign Y')
  })
})
