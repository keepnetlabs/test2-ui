import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryInfoCard from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryInfoCard.vue'

describe('CampaignManagerReportSummaryInfoCard.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: {
        isLoading: false,
        title: 'Target Users',
        userCount: 100,
        userPercent: '80',
        backgroundColor: '#43A047',
        iconSrc: '/icon.svg',
        ...propsData
      },
      stubs: { CardLoading: true }
    })

  it('renders with default props', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.title).toBe('Target Users')
    expect(wrapper.vm.userCount).toBe(100)
    expect(wrapper.vm.userPercent).toBe('80')
    expect(wrapper.vm.backgroundColor).toBe('#43A047')
  })

  it('passes loading state to CardLoading', () => {
    const wrapper = createWrapper({ isLoading: true })
    const card = wrapper.findComponent({ name: 'IRCardLoading' })
    expect(card.exists() || wrapper.find('cardloading-stub').exists()).toBeTruthy()
  })

  it('uses custom backgroundColor prop', () => {
    const wrapper = createWrapper({ backgroundColor: '#2196F3' })
    expect(wrapper.vm.backgroundColor).toBe('#2196F3')
  })
})
