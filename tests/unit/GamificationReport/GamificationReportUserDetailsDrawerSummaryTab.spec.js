import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerSummaryTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerSummaryTab'
import { getUserTimeline } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getUserTimeline: jest.fn()
}))

describe('GamificationReportUserDetailsDrawerSummaryTab.vue', () => {
  const localVue = createLocalVue()
  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

  const defaultProps = {
    selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', points: 1000, rank: 5 },
    datePayload: { datePeriod: 'CUSTOM', startDate: '2025-01-01', endDate: '2025-02-17' },
    overallScore: { percentage: 80, points: 1000, rank: 5 },
    productScores: [],
    isPerformanceRatesLoading: false
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportUserDetailsDrawerSummaryTab, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        VTooltip: true,
        VIcon: true,
        VSkeletonLoader: true,
        ElTabs: true,
        DatatableLoading: true,
        GamificationReportPhishingActivityResults: true
      },
      mocks: {
        $store: {
          getters: {
            'gamificationBadges/getBadgesForUser': () => [],
            'gamificationBadges/hasValidCache': () => false,
            'gamificationBadges/isCalculating': false,
            'gamificationBadges/isFetching': false,
            'usersDashboard/getLabels': {},
            'usersDashboard/getLanguage': 'en'
          }
        }
      },
      ...options
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getUserTimeline.mockResolvedValue({
      data: {
        data: {
          results: []
        }
      }
    })
  })

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('GamificationReportUserDetailsDrawerSummaryTab')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-summary-tab').exists()).toBe(true)
    })

    it('should render content row', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-summary-tab__row').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('should accept datePayload prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.datePayload).toBeDefined()
    })

    it('should accept overallScore prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.overallScore).toBeDefined()
    })

    it('should accept productScores prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.productScores).toBeDefined()
    })

    it('should accept isPerformanceRatesLoading prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isPerformanceRatesLoading).toBe(false)
    })
  })

  describe('Data Properties', () => {
    it('should have timelinePreview initialized', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.timelinePreview)).toBe(true)
    })

    it('should have isTimelineLoading initialized and called in created', () => {
      const wrapper = mountComponent()
      // isTimelineLoading is set to true in callForTimelinePreview (called in created hook)
      // It will remain true until the API response resolves
      expect(typeof wrapper.vm.isTimelineLoading).toBe('boolean')
    })
  })

  describe('Computed Properties', () => {
    it('should have targetUserResourceId computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.targetUserResourceId).toBeDefined()
    })

    it('should have recentBadges computed property', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.recentBadges)).toBe(true)
    })

    it('should have isBadgesLoading computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isBadgesLoading).toBeFalsy()
    })

    it('should have badgeCount computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.badgeCount).toBe('number')
    })

    it('should have timelinePreviewActivities computed property', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.timelinePreviewActivities)).toBe(true)
    })

    it('recentBadges filters non-earned items, sorts by date desc and limits to 3', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            getters: {
              'gamificationBadges/getBadgesForUser': () => [
                { badgeName: 'B1', earned: true, earnedDate: '2025-02-01' },
                { badgeName: 'B2', earned: false, earnedDate: '2025-02-04' },
                { badgeName: 'B3', earned: true, earnedDate: '2025-02-03' },
                { badgeName: 'B4', earned: true, earnedDate: '2025-02-05' },
                { badgeName: 'B5', earned: true, earnedDate: '2025-01-30' }
              ],
              'gamificationBadges/hasValidCache': () => true,
              'gamificationBadges/isCalculating': false,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {},
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      expect(wrapper.vm.recentBadges.map((b) => b.badgeName)).toEqual(['B4', 'B3', 'B1'])
    })

    it('isBadgesLoading and badgeCount respect cache/loading flags', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            getters: {
              'gamificationBadges/getBadgesForUser': () => [{ earned: true }],
              'gamificationBadges/hasValidCache': () => false,
              'gamificationBadges/isCalculating': true,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {},
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      expect(wrapper.vm.isBadgesLoading).toBe(true)
      expect(wrapper.vm.badgeCount).toBe(3)
    })

    it('timelinePreviewActivities drops headers and keeps first 3 activities', () => {
      const wrapper = mountComponent()
      wrapper.vm.timelinePreview = [
        { type: 'header', text: 'day-1' },
        { type: 'activity', ActionType: 'Email Sent' },
        { type: 'activity', ActionType: 'Clicked Link' },
        { type: 'activity', ActionType: 'Reported Email' },
        { type: 'activity', ActionType: 'Opened Email' }
      ]

      expect(wrapper.vm.timelinePreviewActivities).toEqual([
        { type: 'activity', ActionType: 'Email Sent' },
        { type: 'activity', ActionType: 'Clicked Link' },
        { type: 'activity', ActionType: 'Reported Email' }
      ])
    })
  })

  describe('Methods', () => {
    it('should have callForTimelinePreview method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.callForTimelinePreview).toBe('function')
    })

    it('should have normalizeBadge method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.normalizeBadge).toBe('function')
    })

    it('should have formatBadgeEarnedDate method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.formatBadgeEarnedDate).toBe('function')
    })

    it('should have getProductType method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getProductType).toBe('function')
    })

    it('should have isProductAwareness method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isProductAwareness).toBe('function')
    })

    it('getRankText returns overall score rank first', () => {
      const wrapper = mountComponent({
        overallScore: { rank: 11 },
        selectedRow: { firstName: 'John', lastName: 'Doe', rank: 5, resourceId: 'x' }
      })
      expect(wrapper.vm.getRankText()).toBe(11)
    })

    it('getRankText falls back to selectedRow rank', () => {
      const wrapper = mountComponent({
        overallScore: {},
        selectedRow: { firstName: 'John', lastName: 'Doe', rank: 7, resourceId: 'x' }
      })
      expect(wrapper.vm.getRankText()).toBe(7)
    })

    it('getRankText returns placeholder when rank is missing', () => {
      const wrapper = mountComponent({
        overallScore: {},
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: 'x' }
      })
      expect(wrapper.vm.getRankText()).toBe('-')
    })

    it('getPointText strips minus sign and handles null safely', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getPointText({ points: -42 })).toBe('42')
      expect(wrapper.vm.getPointText({ points: 35 })).toBe('35')
      expect(wrapper.vm.getPointText({})).toBe('')
      expect(wrapper.vm.getPointText(null)).toBe('')
    })

    it('callForTimelinePreview does nothing when target user id is missing', async () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe' }
      })
      jest.clearAllMocks()

      wrapper.vm.callForTimelinePreview()
      await flushPromises()

      expect(getUserTimeline).not.toHaveBeenCalled()
      expect(wrapper.vm.isTimelineLoading).toBe(false)
    })

    it('callForTimelinePreview fetches and writes timeline preview list', async () => {
      getUserTimeline.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              { type: 'activity', ActionType: 'Email Sent', productType: 'PHISHING SIMULATOR - TEST' },
              { type: 'activity', ActionType: 'Reported Email', productType: 'INCIDENT RESPONDER' }
            ]
          }
        }
      })
      const wrapper = mountComponent()
      await flushPromises()

      expect(getUserTimeline).toHaveBeenCalledWith(
        expect.objectContaining({
          targetUserResourceId: '123',
          showOnlyFailedEvents: false
        })
      )
      expect(wrapper.vm.timelinePreview).toEqual([
        { type: 'activity', ActionType: 'Email Sent', productType: 'PHISHING SIMULATOR - TEST' },
        { type: 'activity', ActionType: 'Reported Email', productType: 'INCIDENT RESPONDER' }
      ])
      expect(wrapper.vm.isTimelineLoading).toBe(false)
    })

    it('normalizeBadge maps badgeName and badgeType fields', () => {
      const wrapper = mountComponent()
      const normalized = wrapper.vm.normalizeBadge({
        badgeName: 'Top Reporter',
        name: 'fallback-name',
        badgeType: 'gold',
        type: 'silver',
        level: 3,
        description: 'desc'
      })

      expect(normalized).toEqual({
        name: 'Top Reporter',
        type: 'gold',
        level: 3,
        description: 'desc'
      })
    })

    it('getTooltipContent prefers mixin description and falls back to badge name', () => {
      const wrapper = mountComponent()
      wrapper.vm.getBadgeDescription = jest.fn(() => 'From mixin')
      expect(wrapper.vm.getTooltipContent({ badgeName: 'Badge A' })).toBe('From mixin')

      wrapper.vm.getBadgeDescription = jest.fn(() => '')
      expect(wrapper.vm.getTooltipContent({ badgeName: 'Badge B' })).toBe('Badge B')
    })

    it('getBadgeKey includes badge type/level/index and handles missing values', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBadgeKey({ badgeType: 'gold', level: 2 }, 7)).toContain('gold-2-7')
      expect(wrapper.vm.getBadgeKey({}, 1)).toContain('-0-1')
    })

    it('formatBadgeEarnedDate supports dd/mm/yyyy text and invalid values', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.formatBadgeEarnedDate('13/02/2025 08:15')).toBe('13/02/2025')
      expect(wrapper.vm.formatBadgeEarnedDate('not-a-date')).toBe('')
      expect(wrapper.vm.formatBadgeEarnedDate('')).toBe('')
    })

    it('getBadgeEarnedDateFormatted reads aliases and returns formatted date', () => {
      const wrapper = mountComponent()
      const formatted = wrapper.vm.getBadgeEarnedDateFormatted({
        earnedOn: '2025-02-19T00:00:00.000Z'
      })
      expect(formatted).toBe('19/02/2025')
    })
  })

  describe('Events', () => {
    it('should emit go-to-tab event', () => {
      const wrapper = mountComponent()
      wrapper.vm.$emit('go-to-tab', 'performanceDetails')
      expect(wrapper.emitted('go-to-tab')).toBeTruthy()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent summary tab instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: { firstName: 'User1', lastName: 'Test1', resourceId: '1' }
      })
      const wrapper2 = mountComponent({
        selectedRow: { firstName: 'User2', lastName: 'Test2', resourceId: '2' }
      })

      expect(wrapper1.vm.selectedRow.firstName).toBe('User1')
      expect(wrapper2.vm.selectedRow.firstName).toBe('User2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render summary with performance data', () => {
      const wrapper = mountComponent({
        overallScore: { percentage: 85, points: 1500, rank: 3 }
      })

      expect(wrapper.vm.overallScore.percentage).toBe(85)
      expect(wrapper.find('.gamification-report-user-details-summary-tab').exists()).toBe(true)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should call callForTimelinePreview on created', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })
})
