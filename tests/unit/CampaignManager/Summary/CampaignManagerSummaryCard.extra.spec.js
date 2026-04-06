import { shallowMount } from '@vue/test-utils'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard.vue'

describe('CampaignManagerSummaryCard.vue (extra branching)', () => {
  const mountCard = (propsData = {}) =>
    shallowMount(CampaignManagerSummaryCard, {
      propsData: {
        icon: 'mdi-send',
        title: 'Summary',
        items: { status: 'ok', count: 3 },
        ...propsData
      },
      stubs: {
        CardLoading: true,
        'v-icon': true,
        'v-btn': true
      }
    })

  it('shows CardLoading stub and hides main card while isLoading', () => {
    const wrapper = mountCard({ isLoading: true })
    expect(wrapper.find('cardloading-stub').exists()).toBe(true)
    expect(wrapper.find('.campaign-manager-summary-card').exists()).toBe(false)
  })

  it('hides header block when hideHeader is true', () => {
    const wrapper = mountCard({ hideHeader: true, detailable: false })
    expect(wrapper.find('.campaign-manager-summary-card__header').exists()).toBe(false)
  })

  it('shows header when hideHeader is false', () => {
    const wrapper = mountCard({ hideHeader: false, detailable: false })
    expect(wrapper.find('.campaign-manager-summary-card__header').exists()).toBe(true)
  })

  it('does not render Preview button when detailable is false', () => {
    const wrapper = mountCard({ detailable: false })
    expect(wrapper.find('.campaign-manager-summary-card__button').exists()).toBe(false)
  })

  it('renders Preview button when detailable is true', () => {
    const wrapper = mountCard({ detailable: true, detailableButtonId: 'btn-preview-x' })
    const btn = wrapper.find('#btn-preview-x')
    expect(btn.exists()).toBe(true)
  })

  it('applies training-specific button class when isTraining and detailable', () => {
    const wrapper = mountCard({ detailable: true, isTraining: true })
    const btn = wrapper.find('.campaign-manager-summary-card__button')
    expect(btn.classes()).toContain('pr-4')
  })

  it('hides default body list when isTraining (training layout branch)', () => {
    const wrapper = mountCard({ isTraining: true })
    expect(wrapper.find('.campaign-manager-summary-card__body').exists()).toBe(false)
  })

  it('shows default body list when not training', () => {
    const wrapper = mountCard({ isTraining: false })
    expect(wrapper.find('.campaign-manager-summary-card__body').exists()).toBe(true)
  })

  it('hides item labels when hideLabel is true', () => {
    const wrapper = mountCard({ hideLabel: true, items: { alpha: '1' } })
    expect(wrapper.find('.campaign-manager-summary-card__body-item-key').exists()).toBe(false)
  })

  it('shows capitalized keys when hideLabel is false', () => {
    const wrapper = mountCard({ hideLabel: false, items: { beta: 'x' } })
    expect(wrapper.find('.campaign-manager-summary-card__body-item-key').text()).toBe('Beta')
  })
})
