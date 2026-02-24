import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPerformanceDetailsInfoCard from '@/components/GamificationReport/GamificationReportPerformanceDetails/GamificationReportPerformanceDetailsInfoCard.vue'

describe('GamificationReportPerformanceDetailsInfoCard.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(GamificationReportPerformanceDetailsInfoCard, {
      localVue,
      propsData,
      stubs: {
        VIcon: true
      }
    })

  it('uses component defaults when props are not provided', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.icon).toBe('mdi-star')
    expect(wrapper.vm.title).toBe('Why Earning Full Points Matters')
    expect(wrapper.vm.description).toContain('Achieving the maximum score')
  })

  it('renders icon/title/description in template for custom props', () => {
    const wrapper = mountComponent({
      icon: 'mdi-check-circle',
      title: 'Custom Title',
      description: 'Custom Description'
    })

    expect(wrapper.findComponent({ name: 'VIcon' }).text()).toContain('mdi-check-circle')
    expect(wrapper.find('.gamification-report-performance-details-info-card__title').text()).toBe(
      'Custom Title'
    )
    expect(
      wrapper.find('.gamification-report-performance-details-info-card__description').text()
    ).toBe('Custom Description')
  })

  it('keeps empty-string props without falling back to defaults', () => {
    const wrapper = mountComponent({
      icon: '',
      title: '',
      description: ''
    })

    expect(wrapper.vm.icon).toBe('')
    expect(wrapper.vm.title).toBe('')
    expect(wrapper.vm.description).toBe('')
  })
})
