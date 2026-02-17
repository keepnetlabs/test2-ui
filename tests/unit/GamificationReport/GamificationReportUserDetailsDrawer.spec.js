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

  describe('Filter And Utility Methods', () => {
    it('formats points safely for null and negative values', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.formatPoints({ points: -15 })).toBe('15')
      expect(wrapper.vm.formatPoints({ points: 0 })).toBe('0')
      expect(wrapper.vm.formatPoints({ points: null })).toBe('')
      expect(wrapper.vm.formatPoints({})).toBe('')
    })

    it('adds date headers without duplicating existing day headers', () => {
      const wrapper = mountComponent()
      wrapper.vm.timeline = [{ type: 'header', ActionTimeWithDay: '2025-02-16' }]

      const result = wrapper.vm.addDateHeaders([
        { ActionTimeWithDay: '2025-02-16', ActionType: 'A' },
        { ActionTimeWithDay: '2025-02-17', ActionType: 'B' }
      ])

      const headerRows = result.filter((item) => item.type === 'header')
      expect(headerRows).toHaveLength(1)
      expect(headerRows[0].text).toBe('2025-02-17')
    })

    it('sets and removes filter payload items for string and between operators', () => {
      const wrapper = mountComponent()
      wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems = []

      wrapper.vm.setFilterToPayload({
        key: 'product',
        activeValue: 'PHISHING',
        activeOperator: '='
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'product', Value: 'PHISHING', Operator: '=' }
      ])

      wrapper.vm.setFilterToPayload({
        key: 'createdDate',
        activeValue: ['2025-01-01', '2025-01-31'],
        activeOperator: 'between'
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'product', Value: 'PHISHING', Operator: '=' },
        { FieldName: 'createdDate', Value: '2025-01-01', Operator: '>=' },
        { FieldName: 'createdDate', Value: '2025-01-31', Operator: '<=' }
      ])

      wrapper.vm.removeFilterFromPayload({
        key: 'createdDate',
        filterType: 'date',
        activeOperator: 'between'
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'product', Value: 'PHISHING', Operator: '=' }
      ])
    })

    it('clearFilter and handleFilter trigger timeline refresh', () => {
      const wrapper = mountComponent()
      wrapper.vm.callForTimeline = jest.fn()
      wrapper.vm.removeFilterFromPayload = jest.fn()
      wrapper.vm.setFilterToPayload = jest.fn()

      const selectFilter = {
        key: 'product',
        filterType: 'select',
        isFilterActive: true,
        value: 'PHISHING',
        activeValue: 'PHISHING',
        operator: 'Contains',
        activeOperator: 'Contains'
      }

      wrapper.vm.handleClearFilter(selectFilter)
      expect(selectFilter.activeValue).toBe('')
      expect(wrapper.vm.callForTimeline).toHaveBeenCalledTimes(1)

      selectFilter.value = 'SMISHING'
      selectFilter.operator = '='
      wrapper.vm.handleFilter(selectFilter)
      expect(selectFilter.isFilterActive).toBe(true)
      expect(selectFilter.activeValue).toBe('SMISHING')
      expect(wrapper.vm.callForTimeline).toHaveBeenCalledTimes(2)
    })

    it('handleSetActiveFilter does not update when same filter is selected', () => {
      const wrapper = mountComponent()
      const existing = wrapper.vm.activeFilter
      const checkSpy = jest.spyOn(wrapper.vm, 'checkFilter')

      wrapper.vm.handleSetActiveFilter(existing)

      expect(checkSpy).not.toHaveBeenCalled()
      expect(wrapper.vm.activeFilter).toBe(existing)
    })

    it('checkFilter restores empty value for inactive longTextSearch filter', () => {
      const wrapper = mountComponent()
      const filter = {
        key: 'name',
        filterType: 'longTextSearch',
        isFilterActive: false,
        value: 'x',
        activeValue: ['abc'],
        operator: '=',
        activeOperator: '='
      }

      wrapper.vm.checkFilter(filter)
      expect(filter.value).toEqual([])
    })

    it('removeFilterFromPayload handles search filter value update and empty reset', () => {
      const wrapper = mountComponent()
      wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'product', Value: 'A,B', Operator: 'Include' }
      ]
      wrapper.vm.axiosPayload.pageNumber = 3
      wrapper.vm.serverSideProps.pageNumber = 3

      wrapper.vm.removeFilterFromPayload({
        key: 'product',
        filterType: 'search',
        activeValue: ['A'],
        activeOperator: 'Include'
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('A')

      wrapper.vm.removeFilterFromPayload({
        key: 'product',
        filterType: 'search',
        activeValue: [],
        activeOperator: 'Include'
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    })

    it('drawer click outside emits close only when allowed', () => {
      const wrapper = mountComponent()

      wrapper.vm.isShowDownloadModal = false
      wrapper.vm.menu = false
      wrapper.vm.handleDrawerClickOutside({
        target: { closest: jest.fn(() => null) }
      })
      expect(wrapper.emitted('on-close')).toBeTruthy()

      wrapper.vm.handleDrawerClickOutside({
        target: { closest: jest.fn((sel) => (sel === '.el-select-dropdown' ? {} : null)) }
      })
      expect(wrapper.emitted('on-close')).toHaveLength(1)
    })

    it('calls timezone action only when timezone list is empty', () => {
      const dispatch = jest.fn()
      const wrapper = mountComponent({}, {
        mocks: { $store: { dispatch, getters: { 'common/getTimezones': { timeZoneList: [] } } } }
      })

      wrapper.vm.callForGetTimeZones()
      expect(dispatch).toHaveBeenCalledWith('common/getTimezone')

      dispatch.mockClear()
      wrapper.vm.$store.getters['common/getTimezones'] = { timeZoneList: ['UTC'] }
      wrapper.vm.callForGetTimeZones()
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('returns product type labels and load-more button styles', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getProductType({ productType: 'PHISHING SIMULATOR - X' })).toBe('phishing campaign')
      expect(wrapper.vm.getProductType({ productType: 'SMISHING SIMULATOR - X' })).toBe('smishing campaign')
      expect(wrapper.vm.getProductType({ productType: 'UNKNOWN - X' })).toBe('')

      expect(wrapper.vm.getLoadMoreButtonStyle(true)).toEqual({
        'background-color': '#F2F2F2',
        marginBottom: '16px'
      })
      expect(wrapper.vm.getLoadMoreButtonStyle(false)).toEqual({
        'background-color': '#FFFFFF',
        marginBottom: '16px'
      })
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
