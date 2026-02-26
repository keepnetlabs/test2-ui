import { shallowMount } from '@vue/test-utils'
import LeaderboardTopPerformerCardSkeleton from '@/components/GamificationReport/LeaderboardTopPerformerCardSkeleton.vue'

describe('LeaderboardTopPerformerCardSkeleton.vue', () => {
  const createWrapper = () =>
    shallowMount(LeaderboardTopPerformerCardSkeleton, {
      stubs: {
        'v-skeleton-loader': true
      }
    })

  it('renders component with correct name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('LeaderboardTopPerformerCardSkeleton')
  })

  it('renders top performers header', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Top Performers')
  })

  it('renders three skeleton cards', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('.gamification-report__top-performer-card-skeleton').length).toBe(3)
  })

  it('renders skeleton loader stubs for card parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('v-skeleton-loader-stub').length).toBeGreaterThan(0)
  })
})
