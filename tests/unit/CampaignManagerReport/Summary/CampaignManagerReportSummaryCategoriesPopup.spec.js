import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCategoriesPopup from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCategoriesPopup.vue'

describe('CampaignManagerReportSummaryCategoriesPopup.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryCategoriesPopup, {
      propsData: {
        status: true,
        campaignName: 'Campaign A',
        categories: ['Finance', 'HR'],
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooterWithClose: true
      }
    })

  it('renders with expected component name and props', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('TrainingLibraryPreviewDialog')
    expect(wrapper.vm.status).toBe(true)
    expect(wrapper.vm.campaignName).toBe('Campaign A')
    expect(wrapper.vm.categories).toEqual(['Finance', 'HR'])
  })

  it('emits close on handleClose', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('works with empty/undefined categories', () => {
    const wrapper = mountComponent({ categories: undefined })
    expect(wrapper.vm.categories).toBeUndefined()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
