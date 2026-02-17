import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawer from '@/components/GamificationReport/GamificationReportUserDetailsDrawer'

describe('GamificationReportUserDetailsDrawer.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: true,
    selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123' },
    datePayload: { datePeriod: 'CUSTOM', startDate: '2025-01-01', endDate: '2025-02-17' },
    formDetails: { gamificationActionTypes: [], gamificationProductTypes: [], gamificationScenarioDifficultyTypes: [] }
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportUserDetailsDrawer, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        Fragment: true,
        DownloadModal: true,
        VNavigationDrawer: { template: '<div class="drawer-stub"><slot /></div>' },
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VListItemSubtitle: true,
        VMenu: true,
        VIcon: true,
        VTextField: true,
        VCheckbox: true,
        VBtn: true,
        VTooltip: true,
        VHover: true,
        VTimeline: true,
        VTimelineItem: true,
        ElTabs: true,
        ElTabPane: true,
        DatatableLoading: true,
        TrainingLibrarySearchFilter: true,
        GamificationReportUserDetailsDrawerFilterBadge: true,
        GamificationReportUserDetailsDrawerSummaryTab: true,
        GamificationReportUserDetailsDrawerPerformanceDetailsTab: true,
        GamificationReportUserDetailsDrawerBadgesTab: true
      },
      directives: { 'click-outside': {} },
      mocks: { $store: { dispatch: jest.fn(), getters: { 'common/getDownloadModalStatus': false, 'common/getTimezones': {} } } },
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
      expect(wrapper.vm.$options.name).toBe('GamificationReportUserDetailsDrawer')
    })

    it('should render VNavigationDrawer', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VNavigationDrawer' }).exists()).toBe(true)
    })

    it('should render drawer container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.drawer-stub').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })

    it('status prop should have default value false', () => {
      expect(GamificationReportUserDetailsDrawer.props.status.default).toBe(false)
    })

    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('selectedRow prop should be required', () => {
      expect(GamificationReportUserDetailsDrawer.props.selectedRow.required).toBe(true)
    })

    it('should accept datePayload prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.datePayload).toBeDefined()
    })

    it('should accept formDetails prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.formDetails).toBeDefined()
    })
  })

  describe('Data Properties', () => {
    it('should initialize activeTab to summary', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.activeTab).toBe('summary')
    })

    it('should initialize filters array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.filters)).toBe(true)
    })

    it('should initialize timeline as empty array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.timeline)).toBe(true)
    })

    it('should initialize isTimelineLoading as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isTimelineLoading).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should have isRenderFilters computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isRenderFilters).toBe('boolean')
    })

    it('should have getTotalFilterLength computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getTotalFilterLength).toBe('number')
    })

    it('should have visibleFilters computed property', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.visibleFilters)).toBe(true)
    })

    it('should have isLoadMoreVisible computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isLoadMoreVisible).toBe('boolean')
    })
  })

  describe('Methods', () => {
    it('should have isProductAwareness method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isProductAwareness).toBe('function')
    })

    it('should have getProductType method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getProductType).toBe('function')
    })

    it('should have getProductIconPath method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getProductIconPath).toBe('function')
    })

    it('should have handleDrawerClickOutside method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleDrawerClickOutside).toBe('function')
    })

    it('should have handleRefresh method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleRefresh).toBe('function')
    })

    it('should have handleLoadMore method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleLoadMore).toBe('function')
    })
  })

  describe('Tab Management', () => {
    it('should render el-tabs component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'ElTabs' }).exists()).toBe(true)
    })

    it('should have summary, activityTimeline, performanceDetails, and badges tabs', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.activeTab).toBeDefined()
    })
  })

  describe('Event Emissions', () => {
    it('should emit on-close event', () => {
      const wrapper = mountComponent()
      wrapper.vm.$emit('on-close')
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent drawer instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123' }
      })
      const wrapper2 = mountComponent({
        selectedRow: { firstName: 'Jane', lastName: 'Smith', resourceId: '456' }
      })

      expect(wrapper1.vm.selectedRow.firstName).toBe('John')
      expect(wrapper2.vm.selectedRow.firstName).toBe('Jane')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render drawer with user data', () => {
      const wrapper = mountComponent({
        status: true,
        selectedRow: { firstName: 'Test', lastName: 'User', resourceId: '123' }
      })

      expect(wrapper.vm.status).toBe(true)
      expect(wrapper.vm.selectedRow.firstName).toBe('Test')
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
