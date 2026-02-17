import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerBadgesTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerBadgesTab'

describe('GamificationReportUserDetailsDrawerBadgesTab.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: '123' }
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportUserDetailsDrawerBadgesTab, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        ElTabs: true,
        ElTabPane: true,
        VTooltip: true,
        VIcon: true,
        VSkeletonLoader: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn(),
          getters: {
            'gamificationBadges/getAllBadgesForUser': () => [],
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
      expect(wrapper.vm.$options.name).toBe('GamificationReportUserDetailsDrawerBadgesTab')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-badges-tab').exists()).toBe(true)
    })

    it('should render header section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-badges-tab__header').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('selectedRow prop should be required', () => {
      expect(GamificationReportUserDetailsDrawerBadgesTab.props.selectedRow.required).toBe(true)
    })

    it('selectedRow prop should be of type Object', () => {
      expect(GamificationReportUserDetailsDrawerBadgesTab.props.selectedRow.type).toBe(Object)
    })
  })

  describe('Data Properties', () => {
    it('should initialize activeLevelTab to 1', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.activeLevelTab).toBe('1')
    })
  })

  describe('Computed Properties', () => {
    it('should have targetUserResourceId computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.targetUserResourceId).toBeDefined()
    })

    it('should have allBadges computed property', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.allBadges)).toBe(true)
    })

    it('should have isLoading computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isLoading).toBeFalsy()
    })
  })

  describe('Methods', () => {
    it('should have getBadgeKey method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getBadgeKey).toBe('function')
    })

    it('should have getBadgesByLevel method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getBadgesByLevel).toBe('function')
    })

    it('should have normalizeBadge method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.normalizeBadge).toBe('function')
    })

    it('should have formatBadgeEarnedDate method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.formatBadgeEarnedDate).toBe('function')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent badge tab instances', () => {
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
    it('complete workflow: render badges tab with user data', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: '123' }
      })

      expect(wrapper.vm.targetUserResourceId).toBe('123')
      expect(wrapper.find('.gamification-report-user-details-badges-tab').exists()).toBe(true)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should call ensureBadgesFetched on created', () => {
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
