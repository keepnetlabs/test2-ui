import { shallowMount } from '@vue/test-utils'
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine.vue'

describe('CampaignManagerSummaryCardOneLine.vue (extra branching)', () => {
  const mountCard = (propsData = {}) =>
    shallowMount(CampaignManagerSummaryCardOneLine, {
      propsData: {
        icon: 'mdi-email',
        title: 'One line',
        items: { field: 'v' },
        ...propsData
      },
      stubs: {
        CardLoading: true,
        'v-icon': true,
        'v-btn': true
      }
    })

  it('shows loading stub and hides one-line card while isLoading', () => {
    const wrapper = mountCard({ isLoading: true })
    expect(wrapper.find('cardloading-stub').exists()).toBe(true)
    expect(wrapper.find('.campaign-manager-summary-card--one-line').exists()).toBe(false)
  })

  it('applies one-line layout classes when not loading', () => {
    const wrapper = mountCard({ isLoading: false })
    expect(wrapper.find('.campaign-manager-summary-card--one-line').exists()).toBe(true)
    expect(wrapper.find('.campaign-manager-summary-card__body-container-one-line').exists()).toBe(
      true
    )
  })

  it('does not render Preview when detailable is false', () => {
    const wrapper = mountCard({ detailable: false })
    expect(wrapper.find('.campaign-manager-summary-card__button').exists()).toBe(false)
  })

  it('renders Preview when detailable is true', () => {
    const wrapper = mountCard({
      detailable: true,
      detailableButtonId: 'btn-one-line-preview'
    })
    expect(wrapper.find('#btn-one-line-preview').exists()).toBe(true)
  })

  it('hides body keys when hideLabel is true', () => {
    const wrapper = mountCard({ hideLabel: true, items: { x: '1' } })
    expect(wrapper.find('.campaign-manager-summary-card__body-item-key').exists()).toBe(false)
  })

  it('capitalizes first letter of keys when hideLabel is false', () => {
    const wrapper = mountCard({ hideLabel: false, items: { gamma: 'z' } })
    expect(wrapper.find('.campaign-manager-summary-card__body-item-key').text()).toBe('Gamma')
  })
})
