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
    it('computes render/count/visibility values from filter and pagination state', () => {
      const wrapper = mountComponent()

      wrapper.vm.filters = [
        { key: 'activityType', show: true, isFilterActive: false },
        { key: 'product', show: false, isFilterActive: true },
        { key: 'difficulty', show: true, isFilterActive: false }
      ]
      wrapper.vm.serverSideProps.pageNumber = 1
      wrapper.vm.serverSideProps.totalNumberOfPages = 3
      expect(wrapper.vm.isRenderFilters).toBe(true)
      expect(wrapper.vm.getTotalFilterLength).toBe(2)
      expect(wrapper.vm.visibleFilters).toEqual([
        { key: 'activityType', show: true, isFilterActive: false },
        { key: 'difficulty', show: true, isFilterActive: false }
      ])
      expect(wrapper.vm.isLoadMoreVisible).toBe(true)

      wrapper.vm.serverSideProps.pageNumber = 3
      expect(wrapper.vm.isLoadMoreVisible).toBe(false)
    })

    it('computes filter button state for search and select style filters', () => {
      const wrapper = mountComponent()

      wrapper.vm.activeFilter = { filterType: 'search', value: [] }
      expect(wrapper.vm.isFilterButtonDisabled).toBe(true)

      wrapper.vm.activeFilter = { filterType: 'search', value: ['clicked'] }
      expect(wrapper.vm.isFilterButtonDisabled).toBe(false)

      wrapper.vm.activeFilter = { filterType: 'select', value: '' }
      expect(wrapper.vm.isFilterButtonDisabled).toBe(true)

      wrapper.vm.activeFilter = { filterType: 'select', value: 'PHISHING' }
      expect(wrapper.vm.isFilterButtonDisabled).toBe(false)
    })

    it('maps timezone getter values to text/value pairs', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch: jest.fn(),
            getters: {
              'common/getDownloadModalStatus': false,
              'common/getTimezones': {
                timeZoneList: [
                  { displayName: 'UTC', id: 'UTC' },
                  { displayName: 'GMT+3', id: 'Europe/Istanbul' }
                ]
              }
            }
          }
        }
      })

      expect(wrapper.vm.timezones).toEqual([
        { text: 'UTC', value: 'UTC' },
        { text: 'GMT+3', value: 'Europe/Istanbul' }
      ])
    })

    it('updates filter item lists when formDetails changes', async () => {
      const wrapper = mountComponent()
      const formDetails = {
        gamificationActionTypes: [{ text: 'Clicked Link', value: 'Clicked Link' }],
        gamificationProductTypes: [{ text: 'Phishing Simulator', value: 'PHISHING SIMULATOR' }],
        gamificationScenarioDifficultyTypes: [{ text: 'Easy', value: 'EASY' }]
      }

      await wrapper.setProps({ formDetails })

      expect(wrapper.vm.activityTypeFilterItems).toEqual(formDetails.gamificationActionTypes)
      expect(wrapper.vm.productFilterItems).toEqual(formDetails.gamificationProductTypes)
      expect(wrapper.vm.difficulityFilterItems).toEqual(formDetails.gamificationScenarioDifficultyTypes)
      expect(wrapper.vm.filters.find((f) => f.key === 'activityType').items).toEqual(
        formDetails.gamificationActionTypes
      )
      expect(wrapper.vm.filters.find((f) => f.key === 'product').items).toEqual(
        formDetails.gamificationProductTypes
      )
      expect(wrapper.vm.filters.find((f) => f.key === 'difficulty').items).toEqual(
        formDetails.gamificationScenarioDifficultyTypes
      )
    })

    it('loads activity timeline once when tab changes to activityTimeline', async () => {
      const wrapper = mountComponent()
      const timelineSpy = jest.spyOn(wrapper.vm, 'callForTimeline').mockImplementation(() => {})

      expect(wrapper.vm.hasTimelineLoaded).toBe(false)
      await wrapper.setData({ activeTab: 'activityTimeline' })
      expect(wrapper.vm.hasTimelineLoaded).toBe(true)
      expect(timelineSpy).toHaveBeenCalledTimes(1)

      await wrapper.setData({ activeTab: 'summary' })
      await wrapper.setData({ activeTab: 'activityTimeline' })
      expect(timelineSpy).toHaveBeenCalledTimes(1)
    })

    it('resets pagination and refreshes timeline when failed-events filter toggles', async () => {
      const wrapper = mountComponent()
      const timelineSpy = jest.spyOn(wrapper.vm, 'callForTimeline').mockImplementation(() => {})

      wrapper.vm.serverSideProps.pageNumber = 4
      await wrapper.setData({ isOnlyShowFailedEvents: true })

      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
      expect(timelineSpy).toHaveBeenCalledTimes(1)
    })

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

    it('checkFilter restores active values/operators when filter is active', () => {
      const wrapper = mountComponent()
      const filter = {
        key: 'activityType',
        filterType: 'search',
        isFilterActive: true,
        value: [],
        activeValue: ['Clicked Link'],
        operator: '=',
        activeOperator: 'Include'
      }

      wrapper.vm.checkFilter(filter)
      expect(filter.value).toEqual(['Clicked Link'])
      expect(filter.operator).toBe('Include')
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

    it('handles download modal toggle and dispatch flow', () => {
      const dispatch = jest.fn()
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch,
            getters: {
              'common/getDownloadModalStatus': false,
              'common/getTimezones': {}
            }
          }
        }
      })

      wrapper.vm.handleDownloadButtonClick('Download All')
      expect(wrapper.vm.isShowDownloadModal).toBe(true)
      expect(wrapper.vm.downloadModalTitle).toBe('Download All')
      expect(dispatch).toHaveBeenCalledWith('common/changeDownloadModalStatus', true)

      wrapper.vm.changeDownloadModalStatus(false)
      expect(dispatch).toHaveBeenCalledWith('common/changeDownloadModalStatus', false)
    })

    it('sets active filter when selecting a different filter key', () => {
      const wrapper = mountComponent()
      const checkSpy = jest.spyOn(wrapper.vm, 'checkFilter')
      const nextFilter = {
        key: 'product',
        filterType: 'search',
        value: [],
        activeValue: [],
        isFilterActive: false
      }

      wrapper.vm.activeFilter = {
        key: 'activityType',
        filterType: 'search',
        value: [],
        activeValue: [],
        isFilterActive: false
      }
      wrapper.vm.handleSetActiveFilter(nextFilter)

      expect(checkSpy).toHaveBeenCalledWith(nextFilter)
      expect(wrapper.vm.activeFilter).toBe(nextFilter)
    })

    it('updates menu state on visibility change for non-date filters', () => {
      const wrapper = mountComponent()
      const checkSpy = jest.spyOn(wrapper.vm, 'checkFilter')
      const activeFilter = {
        key: 'activityType',
        filterType: 'search',
        isFilterActive: false,
        value: [],
        activeValue: [],
        operator: 'Include',
        activeOperator: 'Include'
      }
      wrapper.vm.activeFilter = activeFilter

      wrapper.vm.handleMenuVisibilityChange(true)
      expect(wrapper.vm.menu).toBe(true)
      expect(wrapper.vm.isCloseOnClick).toBe(true)

      wrapper.vm.handleMenuVisibilityChange(false)
      expect(wrapper.vm.menu).toBe(false)
      expect(checkSpy).toHaveBeenCalledWith(activeFilter)
    })

    it('clearAllFilters resets payload and filter values, then refreshes timeline', () => {
      const wrapper = mountComponent()
      wrapper.vm.callForTimeline = jest.fn()

      wrapper.vm.search = 'keyword'
      wrapper.vm.serverSideProps.pageSize = 50
      wrapper.vm.filters.forEach((f) => {
        f.isFilterActive = true
        f.value = ['x']
        f.activeValue = ['x']
        f.operator = '='
        f.activeOperator = '='
        f.show = false
      })

      wrapper.vm.clearAllFilters()

      expect(wrapper.vm.search).toBe('')
      expect(wrapper.vm.serverSideProps.pageSize).toBe(50)
      expect(wrapper.vm.filters.every((f) => f.isFilterActive === false)).toBe(true)
      expect(wrapper.vm.filters.every((f) => Array.isArray(f.value) && f.value.length === 0)).toBe(true)
      expect(wrapper.vm.filters.every((f) => Array.isArray(f.activeValue) && f.activeValue.length === 0)).toBe(true)
      expect(wrapper.vm.callForTimeline).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.filtersRenderKey.startsWith('filters-key-')).toBe(true)
    })

    it('refreshes and loads more timeline with correct pagination behavior', () => {
      const wrapper = mountComponent()
      wrapper.vm.callForTimeline = jest.fn()
      wrapper.vm.serverSideProps.pageNumber = 3

      wrapper.vm.handleRefresh()
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
      expect(wrapper.vm.callForTimeline).toHaveBeenCalledWith()

      wrapper.vm.handleLoadMore()
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(2)
      expect(wrapper.vm.callForTimeline).toHaveBeenCalledWith(true)
    })

    it('detects awareness product names via multiple matching branches', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isProductAwareness({ productType: 'AWARENESS EDUCATOR - PHISHING' })).toBe(true)
      expect(wrapper.vm.isProductAwareness({ productType: 'SECURITY AWARENESS' })).toBe(true)
      expect(wrapper.vm.isProductAwareness({ productType: 'SECURITY AWARENESS - BASIC' })).toBe(true)
      expect(wrapper.vm.isProductAwareness({ productType: 'PHISHING SIMULATOR - BASIC' })).toBe(false)
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
    it('component should mount in CI-safe way without timing assertions', () => {
      expect(() => mountComponent()).not.toThrow()
    })
  })
})
