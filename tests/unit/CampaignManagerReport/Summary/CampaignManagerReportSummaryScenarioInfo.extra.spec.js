import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryScenarioInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryScenarioInfo'

describe('CampaignManagerReportSummaryScenarioInfo.vue (extra branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryScenarioInfo, {
      propsData: {
        items: { NumberOfCategories: 5, Method: 'Click-Only' },
        campaignName: 'Campaign Z',
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

  it('initial popup state is false and open/close methods toggle it', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isCategoriesPopupVisible).toBe(false)

    wrapper.vm.handleCategoriesClick()
    expect(wrapper.vm.isCategoriesPopupVisible).toBe(true)

    wrapper.vm.handleCloseCategoriesPopuup()
    expect(wrapper.vm.isCategoriesPopupVisible).toBe(false)
  })

  it('passes status/categories/campaignName props to popup stub', async () => {
    const wrapper = createWrapper({
      categories: ['A', 'B', 'C'],
      campaignName: 'Campaign Y'
    })

    wrapper.vm.handleCategoriesClick()
    await wrapper.vm.$nextTick()

    const popup = wrapper.find('campaignmanagerreportsummarycategoriespopup-stub')
    expect(popup.attributes('status')).toBe('true')
    expect(popup.attributes('campaignname')).toBe('Campaign Y')
    expect(popup.attributes('categories')).toBeDefined()
  })
})
