import { shallowMount } from '@vue/test-utils'
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine.vue'

describe('CampaignManagerSummaryCardOneLine.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerSummaryCardOneLine, {
      propsData: {
        icon: 'mdi-send',
        title: 'Delivery',
        items: { Status: 'Sent', Count: 10 },
        ...propsData
      },
      stubs: { CardLoading: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('handlePreviewClick emits previewClicked and update:showBodyDetail', () => {
    const wrapper = mountComponent({ detailable: true, showBodyDetail: false })
    wrapper.vm.handlePreviewClick()
    expect(wrapper.emitted('previewClicked')).toBeTruthy()
    expect(wrapper.emitted('update:showBodyDetail')).toEqual([[true]])
  })

  it('handlePreviewClick toggles showBodyDetail from true to false', () => {
    const wrapper = mountComponent({ detailable: true, showBodyDetail: true })
    wrapper.vm.handlePreviewClick()
    expect(wrapper.emitted('update:showBodyDetail')).toEqual([[false]])
  })
})
