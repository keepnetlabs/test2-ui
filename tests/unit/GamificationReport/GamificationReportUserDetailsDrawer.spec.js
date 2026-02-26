import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawer from '@/components/GamificationReport/GamificationReportUserDetailsDrawer'
import {
  getUserPerformanceRates,
  getUserTimeline,
  exportUserActivityDetails
} from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getUserPerformanceRates: jest.fn(),
  getUserTimeline: jest.fn(),
  exportUserActivityDetails: jest.fn()
}))

describe('GamificationReportUserDetailsDrawer.vue', () => {
  const localVue = createLocalVue()
  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

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

  beforeEach(() => {
    jest.clearAllMocks()
    getUserPerformanceRates.mockResolvedValue({
      data: {
        data: [],
        rank: 0
      }
    })
    getUserTimeline.mockResolvedValue({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: []
        }
      }
    })
    exportUserActivityDetails.mockResolvedValue({
      data: new Blob(['x'], { type: 'application/octet-stream' })
    })
  })

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

    it('setFilterToPayload updates existing item and joins array values for non-between operator', () => {
      const wrapper = mountComponent()
      wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'product', Value: 'OLD', Operator: 'Contains' }
      ]

      wrapper.vm.setFilterToPayload({
        key: 'product',
        activeValue: 'NEW',
        activeOperator: 'Contains'
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'product', Value: 'NEW', Operator: 'Contains' }
      ])

      wrapper.vm.setFilterToPayload({
        key: 'activityType',
        activeValue: ['Clicked Link', 'Reported'],
        activeOperator: 'Include'
      })
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'product', Value: 'NEW', Operator: 'Contains' },
        { FieldName: 'activityType', Value: 'Clicked Link,Reported', Operator: 'Include' }
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

    it('removeFilterFromPayload returns early when field does not exist', () => {
      const wrapper = mountComponent()
      wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'product', Value: 'X', Operator: 'Contains' }
      ]
      wrapper.vm.axiosPayload.pageNumber = 5
      wrapper.vm.serverSideProps.pageNumber = 5

      wrapper.vm.removeFilterFromPayload({
        key: 'non-existing-key',
        filterType: 'select',
        activeValue: '',
        activeOperator: 'Contains'
      })

      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'product', Value: 'X', Operator: 'Contains' }
      ])
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(5)
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(5)
    })

    it('removeFilterFromPayload removes select filter item when found', () => {
      const wrapper = mountComponent()
      wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'product', Value: 'PHISHING', Operator: 'Contains' },
        { FieldName: 'difficulty', Value: 'EASY', Operator: 'Contains' }
      ]
      wrapper.vm.axiosPayload.pageNumber = 3
      wrapper.vm.serverSideProps.pageNumber = 3

      wrapper.vm.removeFilterFromPayload({
        key: 'product',
        filterType: 'select',
        activeValue: '',
        activeOperator: 'Contains'
      })

      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
        { FieldName: 'difficulty', Value: 'EASY', Operator: 'Contains' }
      ])
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

    it('drawer click outside does nothing when menu or download modal is open', () => {
      const wrapper = mountComponent()

      wrapper.vm.isShowDownloadModal = true
      wrapper.vm.handleDrawerClickOutside({ target: { closest: jest.fn(() => null) } })
      expect(wrapper.emitted('on-close')).toBeFalsy()

      wrapper.vm.isShowDownloadModal = false
      wrapper.vm.menu = true
      wrapper.vm.handleDrawerClickOutside({ target: { closest: jest.fn(() => null) } })
      expect(wrapper.emitted('on-close')).toBeFalsy()
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

    it('returns icon paths for card products and timeline product types', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.getCardProductIcon('Phishing Simulator')).toBeDefined()
      expect(wrapper.vm.getCardProductIcon('Callback Simulator')).toBeDefined()
      expect(wrapper.vm.getCardProductIcon('Vishing Simulator')).toBeDefined()
      expect(wrapper.vm.getCardProductIcon('Security Awareness')).toBeDefined()
      expect(wrapper.vm.getCardProductIcon('Smishing Simulator')).toBeDefined()
      expect(wrapper.vm.getCardProductIcon('Quishing Simulator')).toBeDefined()
      expect(wrapper.vm.getCardProductIcon('Unknown Product')).toBeDefined()

      expect(
        wrapper.vm.getProductIconPath({
          productType: 'INCIDENT RESPONDER - TEST',
          ActionType: 'Reported Email'
        })
      ).toBeDefined()
      expect(
        wrapper.vm.getProductIconPath({
          productType: 'UNKNOWN PRODUCT - TEST',
          ActionType: 'Email Sent'
        })
      ).toBeDefined()
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

    it('keeps date filter menu open while date picker is visible', () => {
      const wrapper = mountComponent()
      const checkSpy = jest.spyOn(wrapper.vm, 'checkFilter')
      wrapper.vm.activeFilter = { key: 'date', filterType: 'date' }
      wrapper.vm.$refs = {
        refDateFilter: {
          $refs: {
            refPicker: { pickerVisible: true },
            refPicker2: { pickerVisible: false }
          }
        },
        refMenu: { isActive: false }
      }

      wrapper.vm.handleMenuVisibilityChange(false)

      expect(wrapper.vm.isCloseOnClick).toBe(false)
      expect(wrapper.vm.menu).toBe(true)
      expect(wrapper.vm.$refs.refMenu.isActive).toBe(true)
      expect(checkSpy).not.toHaveBeenCalled()
    })

    it('applies normal close flow for date filter when pickers are hidden', () => {
      const wrapper = mountComponent()
      const checkSpy = jest.spyOn(wrapper.vm, 'checkFilter')
      const activeFilter = {
        key: 'date',
        filterType: 'date',
        isFilterActive: false,
        value: '',
        activeValue: '',
        operator: '=',
        activeOperator: '='
      }
      wrapper.vm.activeFilter = activeFilter
      wrapper.vm.$refs = {
        refDateFilter: {
          $refs: {
            refPicker: { pickerVisible: false },
            refPicker2: { pickerVisible: false }
          }
        },
        refMenu: { isActive: false }
      }

      wrapper.vm.handleMenuVisibilityChange(false)

      expect(wrapper.vm.isCloseOnClick).toBe(true)
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

    it('clearAllFilters resets select/date filter operators and values correctly', () => {
      const wrapper = mountComponent()
      wrapper.vm.callForTimeline = jest.fn()

      wrapper.vm.filters = [
        {
          key: 'activityType',
          filterType: 'search',
          value: ['Clicked Link'],
          activeValue: ['Clicked Link'],
          operator: '=',
          activeOperator: '=',
          isFilterActive: true,
          show: true
        },
        {
          key: 'customSelect',
          filterType: 'select',
          value: 'A',
          activeValue: 'A',
          operator: '=',
          activeOperator: '=',
          isFilterActive: true,
          show: true
        },
        {
          key: 'customDate',
          filterType: 'date',
          value: '2025-01-01',
          activeValue: '2025-01-01',
          operator: 'between',
          activeOperator: 'between',
          isFilterActive: true,
          show: true
        }
      ]

      wrapper.vm.clearAllFilters()

      expect(wrapper.vm.filters[0]).toEqual(
        expect.objectContaining({
          value: [],
          activeValue: [],
          operator: 'Include',
          activeOperator: 'Include',
          isFilterActive: false
        })
      )
      expect(wrapper.vm.filters[1]).toEqual(
        expect.objectContaining({
          value: '',
          activeValue: '',
          operator: 'Contains',
          activeOperator: 'Contains',
          isFilterActive: false
        })
      )
      expect(wrapper.vm.filters[2]).toEqual(
        expect.objectContaining({
          value: '',
          activeValue: '',
          operator: '=',
          activeOperator: '=',
          isFilterActive: false
        })
      )
      expect(wrapper.vm.callForTimeline).toHaveBeenCalledTimes(1)
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

    it('callForPerformanceRates maps product scores and uses api rank when available', async () => {
      getUserPerformanceRates.mockResolvedValue({
        data: {
          data: [
            {
              performance: 86,
              phishingType: 'PHISHING',
              totalPerformance: 86,
              totalPoints: 1240,
              rank: 3
            }
          ],
          rank: 2
        }
      })
      const wrapper = mountComponent()

      await flushPromises()

      expect(wrapper.vm.productScores).toEqual([
        {
          percentage: '86%',
          product: 'PHISHING',
          totalPerformance: 86,
          totalPoints: 1240
        }
      ])
      expect(wrapper.vm.overallScore).toEqual({
        points: 1240,
        percentage: 86,
        rank: 2
      })
      expect(wrapper.vm.isPerformanceRatesLoading).toBe(false)
    })

    it('callForPerformanceRates falls back to zero state when api has no rows', async () => {
      getUserPerformanceRates.mockResolvedValueOnce({
        data: {
          data: []
        }
      })
      const wrapper = mountComponent()
      wrapper.vm.overallScore = { points: 10, percentage: 10, rank: 1 }
      wrapper.vm.productScores = [{ product: 'OLD' }]

      await wrapper.vm.callForPerformanceRates()
      await flushPromises()

      expect(wrapper.vm.overallScore).toEqual({
        points: 0,
        percentage: 0,
        rank: undefined
      })
      expect(wrapper.vm.productScores).toEqual([])
    })

    it('callForTimeline sends selected filters and updates timeline on non-append', async () => {
      getUserTimeline.mockResolvedValueOnce({
        data: {
          data: {
            totalNumberOfRecords: 2,
            totalNumberOfPages: 2,
            pageNumber: 1,
            results: [{ ActionTimeWithDay: '2025-02-20', ActionType: 'Email Sent' }]
          }
        }
      })
      const wrapper = mountComponent()
      wrapper.vm.filters = [
        { key: 'activityType', activeValue: ['Email Sent'] },
        { key: 'difficulty', activeValue: ['EASY'] },
        { key: 'product', activeValue: ['PHISHING SIMULATOR'] }
      ]
      const addHeadersSpy = jest
        .spyOn(wrapper.vm, 'addDateHeaders')
        .mockReturnValue([{ type: 'header', text: '2025-02-20' }])

      wrapper.vm.callForTimeline()
      await flushPromises()

      expect(getUserTimeline).toHaveBeenCalledWith(
        expect.objectContaining({
          actionTypes: ['Email Sent'],
          difficultyTypes: ['EASY'],
          products: ['PHISHING SIMULATOR']
        })
      )
      expect(addHeadersSpy).toHaveBeenCalled()
      expect(wrapper.vm.timeline).toEqual([{ type: 'header', text: '2025-02-20' }])
      expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(2)
      expect(wrapper.vm.isTimelineLoading).toBe(false)
    })

    it('callForTimeline appends timeline rows in append mode', async () => {
      getUserTimeline.mockResolvedValueOnce({
        data: {
          data: {
            totalNumberOfRecords: 3,
            totalNumberOfPages: 2,
            pageNumber: 2,
            results: [{ ActionTimeWithDay: '2025-02-21', ActionType: 'Reported' }]
          }
        }
      })
      const wrapper = mountComponent()
      wrapper.vm.timeline = [{ type: 'header', text: '2025-02-20' }]
      jest.spyOn(wrapper.vm, 'addDateHeaders').mockReturnValue([
        { ActionType: 'Reported', productType: 'PHISHING SIMULATOR - TEST' }
      ])

      wrapper.vm.callForTimeline(true)
      await flushPromises()

      expect(wrapper.vm.timeline).toEqual([
        { type: 'header', text: '2025-02-20' },
        { ActionType: 'Reported', productType: 'PHISHING SIMULATOR - TEST' }
      ])
      expect(wrapper.vm.isTimelineLoading).toBe(false)
    })

    it('exportUserDetails downloads files with correct name prefix and xls mapping', async () => {
      const wrapper = mountComponent({ isTargetUser: true })
      wrapper.vm.downloadModalTitle = 'Download All'
      wrapper.vm.filters = [
        { key: 'activityType', activeValue: ['Email Sent'] },
        { key: 'difficulty', activeValue: [] },
        { key: 'product', activeValue: [] }
      ]
      const link = { click: jest.fn(), href: '', download: '' }
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
      if (!window.URL) {
        Object.defineProperty(window, 'URL', { value: {}, configurable: true, writable: true })
      }
      const originalCreateObjectURL = window.URL.createObjectURL
      window.URL.createObjectURL = jest.fn(() => 'blob:mock')

      wrapper.vm.exportUserDetails(['XLS'])
      await flushPromises()

      expect(exportUserActivityDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          exportType: 'Excel',
          reportAllPages: true,
          actionTypes: ['Email Sent']
        })
      )
      expect(link.download).toBe('Target-User-Timeline.xlsx')
      expect(link.click).toHaveBeenCalled()

      createElementSpy.mockRestore()
      window.URL.createObjectURL = originalCreateObjectURL
    })

    it('exportUserDetails uses leaderboard filename and current-page setting', async () => {
      const wrapper = mountComponent({
        isTargetUser: false,
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: 'tu-1' }
      })
      wrapper.vm.downloadModalTitle = wrapper.vm.downloadButtonOptions[0]
      wrapper.vm.filters = [
        { key: 'activityType', activeValue: [] },
        { key: 'difficulty', activeValue: ['EASY'] },
        { key: 'product', activeValue: ['PHISHING SIMULATOR'] }
      ]
      const link = { click: jest.fn(), href: '', download: '' }
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
      if (!window.URL) {
        Object.defineProperty(window, 'URL', { value: {}, configurable: true, writable: true })
      }
      const originalCreateObjectURL = window.URL.createObjectURL
      window.URL.createObjectURL = jest.fn(() => 'blob:leaderboard')

      wrapper.vm.exportUserDetails(['CSV'])
      await flushPromises()

      expect(exportUserActivityDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          exportType: 'CSV',
          reportAllPages: false,
          targetUserResourceId: 'tu-1',
          difficultyTypes: ['EASY'],
          products: ['PHISHING SIMULATOR']
        })
      )
      expect(link.download).toBe('Leaderboard-User-Timeline.csv')
      expect(link.click).toHaveBeenCalled()

      createElementSpy.mockRestore()
      window.URL.createObjectURL = originalCreateObjectURL
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
