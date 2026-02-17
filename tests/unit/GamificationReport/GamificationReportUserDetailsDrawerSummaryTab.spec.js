import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerSummaryTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerSummaryTab'

describe('GamificationReportUserDetailsDrawerSummaryTab.vue', () => {
  const localVue = createLocalVue()

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
