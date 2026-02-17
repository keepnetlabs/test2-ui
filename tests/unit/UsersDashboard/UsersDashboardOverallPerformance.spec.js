import { shallowMount } from '@vue/test-utils'
import UsersDashboardOverallPerformance from '@/components/UsersDashboard/UsersDashboardOverallPerformance.vue'

describe('UsersDashboardOverallPerformance.vue', () => {
  const labels = {
    overallPerformanceTitle: 'Overall',
    overallPerformanceSubtitle: 'Subtitle',
    overallPerformanceSeeRanking: 'See ranking',
    overallPerformancePoints: 'Points',
    overallPerformanceRank: 'Rank'
  }

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardOverallPerformance, {
      stubs: {
        'v-card': true,
        'v-skeleton-loader': true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getTopPerformance': [],
            'usersDashboard/getTopPerformanceLoading': false,
            'usersDashboard/getUserInfo': { email: 'user@example.com' },
            ...getterOverrides
          }
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardOverallPerformance')
  })

  it('returns default performanceData when topPerformance is empty', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.performanceData).toEqual({
      percentage: 0,
      points: 0,
      rank: 0
    })
  })

  it('returns current user performanceData when user exists', () => {
    const wrapper = createWrapper({
      'usersDashboard/getTopPerformance': [
        { email: 'other@example.com', performance: 50, points: 10, rank: 2 },
        { email: 'user@example.com', performance: 85, points: 120, rank: 1 }
      ]
    })

    expect(wrapper.vm.performanceData).toEqual({
      percentage: 85,
      points: 120,
      rank: 1
    })
  })

  it('uses default values when current user is not in leaderboard', () => {
    const wrapper = createWrapper({
      'usersDashboard/getTopPerformance': [{ email: 'other@example.com', performance: 30 }]
    })

    expect(wrapper.vm.performanceData).toEqual({
      percentage: 0,
      points: 0,
      rank: 0
    })
  })

  it('scrolls to leaderboard when handleSeeRankingDetails finds element', () => {
    const wrapper = createWrapper()
    const scrollIntoView = jest.fn()
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView
    })

    wrapper.vm.handleSeeRankingDetails()

    expect(getElementByIdSpy).toHaveBeenCalledWith('users-dashboard-leaderboard')
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })

    getElementByIdSpy.mockRestore()
  })

  it('does nothing when leaderboard element is missing', () => {
    const wrapper = createWrapper()
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(null)

    expect(() => wrapper.vm.handleSeeRankingDetails()).not.toThrow()

    getElementByIdSpy.mockRestore()
  })

  it('returns ribbon image, alt and class for rank helpers', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getRibbonImgSrc(1)).toBe(wrapper.vm.goldRibbonImg)
    expect(wrapper.vm.getRibbonImgSrc(2)).toBe(wrapper.vm.silverRibbonImg)
    expect(wrapper.vm.getRibbonImgSrc(3)).toBe(wrapper.vm.bronzeRibbonImg)

    expect(wrapper.vm.getRibbonAlt(1)).toBe('gold ribbon')
    expect(wrapper.vm.getRibbonAlt(2)).toBe('silver ribbon')
    expect(wrapper.vm.getRibbonAlt(3)).toBe('bronze ribbon')

    expect(wrapper.vm.getRankClass(1)).toBe('gold')
    expect(wrapper.vm.getRankClass(2)).toBe('silver')
    expect(wrapper.vm.getRankClass(3)).toBe('bronze')
  })
})
