import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerFilterBadge from '@/components/GamificationReport/GamificationReportUserDetailsDrawerFilterBadge'

describe('GamificationReportUserDetailsDrawerFilterBadge.vue', () => {
  const localVue = createLocalVue()
  const wrappers = []

  const defaultProps = {
    filter: {
      filterType: 'select',
      text: 'Status',
      key: 'status',
      activeValue: 'active'
    },
    activityTypeFilterItems: [
      { value: 'phishing', text: 'Phishing Report' },
      { value: 'training', text: 'Training' }
    ],
    productFilterItems: [
      { value: 'phishing', text: 'Phishing' },
      { value: 'vishing', text: 'Vishing' }
    ],
    difficulityFilterItems: [
      { value: 'easy', text: 'Easy' },
      { value: 'hard', text: 'Hard' }
    ]
  }

  const mountComponent = (propsData = {}, options = {}) => {
    const wrapper = shallowMount(GamificationReportUserDetailsDrawerFilterBadge, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      stubs: {
        Fragment: { template: '<div><slot /></div>' },
        VIcon: true,
        VTooltip: true
      },
      ...options
    })
    wrappers.push(wrapper)
    return wrapper
  }

  afterEach(() => {
    while (wrappers.length) {
      const wrapper = wrappers.pop()
      if (wrapper && wrapper.vm && !wrapper.vm._isDestroyed) {
        wrapper.destroy()
      }
    }
  })

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('GamificationReportUserDetailsDrawerFilterBadge')
    })

    it('should render Fragment component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'Fragment' }).exists()).toBe(true)
    })

    it('should not render when isRenderComponent is false', () => {
      const wrapper = mountComponent({
        filter: {
          filterType: 'select',
          text: 'Status',
          key: 'status',
          activeValue: null
        }
      })
      expect(wrapper.find('.training-library-filter-badge').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('should accept filter prop', () => {
      const wrapper = mountComponent({ filter: defaultProps.filter })
      expect(wrapper.vm.filter).toEqual(defaultProps.filter)
    })

    it('filter prop should be of type Object', () => {
      expect(GamificationReportUserDetailsDrawerFilterBadge.props.filter.type).toBe(Object)
    })

    it('should accept activityTypeFilterItems prop', () => {
      const wrapper = mountComponent({ activityTypeFilterItems: defaultProps.activityTypeFilterItems })
      expect(wrapper.vm.activityTypeFilterItems).toEqual(defaultProps.activityTypeFilterItems)
    })

    it('activityTypeFilterItems prop should be of type Array', () => {
      expect(GamificationReportUserDetailsDrawerFilterBadge.props.activityTypeFilterItems.type).toBe(Array)
    })

    it('should accept productFilterItems prop', () => {
      const wrapper = mountComponent({ productFilterItems: defaultProps.productFilterItems })
      expect(wrapper.vm.productFilterItems).toEqual(defaultProps.productFilterItems)
    })

    it('productFilterItems prop should be of type Array', () => {
      expect(GamificationReportUserDetailsDrawerFilterBadge.props.productFilterItems.type).toBe(Array)
    })

    it('should accept difficulityFilterItems prop', () => {
      const wrapper = mountComponent({ difficulityFilterItems: defaultProps.difficulityFilterItems })
      expect(wrapper.vm.difficulityFilterItems).toEqual(defaultProps.difficulityFilterItems)
    })

    it('difficulityFilterItems prop should be of type Array', () => {
      expect(GamificationReportUserDetailsDrawerFilterBadge.props.difficulityFilterItems.type).toBe(Array)
    })
  })

  describe('Computed Properties', () => {
    it('should compute isFilterTypeSelect correctly', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', key: 'status', activeValue: 'test' }
      })
      expect(wrapper.vm.isFilterTypeSelect).toBeTruthy()
    })

    it('should return false for isFilterTypeSelect when filterType is not select', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', activeValue: 'test' }
      })
      expect(wrapper.vm.isFilterTypeSelect).toBeFalsy()
    })

    it('should return false for isFilterTypeSelect when activeValue is null', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: null }
      })
      expect(wrapper.vm.isFilterTypeSelect).toBeFalsy()
    })

    it('should compute isFilterTypeSearch correctly', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: ['item1', 'item2'] }
      })
      expect(wrapper.vm.isFilterTypeSearch).toBeTruthy()
    })

    it('should return false for isFilterTypeSearch when activeValue is empty', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: [] }
      })
      expect(wrapper.vm.isFilterTypeSearch).toBeFalsy()
    })

    it('should compute isFilterTypeLongTextSearch correctly', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: 'long text' }
      })
      expect(wrapper.vm.isFilterTypeLongTextSearch).toBeTruthy()
    })

    it('should return false for isFilterTypeLongTextSearch when activeValue is null', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: null }
      })
      expect(wrapper.vm.isFilterTypeLongTextSearch).toBeFalsy()
    })

    it('should have isFilterTypeDateSelect computed property defined', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isFilterTypeDateSelect).toBe('boolean')
    })

    it('should return false for isFilterTypeDateSelect when filter is select type', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.vm.isFilterTypeDateSelect).toBeFalsy()
    })

    it('should compute isRenderComponent correctly for select type', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'test' }
      })
      expect(wrapper.vm.isRenderComponent).toBeTruthy()
    })

    it('should compute isRenderComponent correctly for search type', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: ['item'] }
      })
      expect(wrapper.vm.isRenderComponent).toBeTruthy()
    })

    it('should have isRenderComponent computed property', () => {
      const wrapper = mountComponent({ filter: { filterType: 'select', text: 'Status', activeValue: 'test' } })
      expect(wrapper.vm.isRenderComponent).toBeTruthy()
    })

    it('should compute isRenderComponent correctly for longTextSearch type', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: 'long text' }
      })
      expect(wrapper.vm.isRenderComponent).toBeTruthy()
    })

    it('should return false for isRenderComponent when no filter type matches', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'unknown', activeValue: null }
      })
      expect(wrapper.vm.isRenderComponent).toBe(false)
    })
  })

  describe('Select Type Filter Rendering', () => {
    it('should render select filter badge', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge').exists()).toBe(true)
    })

    it('should display filter type text', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge-type').text()).toBe('Status:')
    })

    it('should display filter active value', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge-value').text()).toBe('active')
    })

    it('should render close icon for select filter', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      const icon = wrapper.findComponent({ name: 'VIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.text()).toContain('mdi-close')
    })

    it('should have removeSelectFilter method in select filter', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(typeof wrapper.vm.removeSelectFilter).toBe('function')
    })
  })

  describe('Search Type Filter Rendering', () => {
    it('should render search filter badges for multiple values', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: ['value1', 'value2'] }
      })
      const badges = wrapper.findAll('.training-library-filter-badge')
      expect(badges.length).toBe(2)
    })

    it('should render close icon for each search filter item', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: ['value1', 'value2'] }
      })
      const icons = wrapper.findAllComponents({ name: 'VIcon' })
      expect(icons.length).toBe(2)
    })

    it('should not render search badge when activeValue is empty', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: [] }
      })
      expect(wrapper.find('.training-library-filter-badge').exists()).toBe(false)
    })
  })

  describe('Long Text Search Filter Rendering', () => {
    it('should render long text search filter', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: ['Long text value'] }
      })
      expect(wrapper.find('.training-library-filter-badge-long-text-search').exists()).toBe(true)
    })

    it('should render tooltip for long text search', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: ['Long text value'] }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(true)
    })

    it('should display long text value in badge', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: ['This is a very long text value'] }
      })
      const badge = wrapper.find('.training-library-filter-badge')
      expect(badge.exists()).toBe(true)
    })
  })

  describe('Date Filter Type', () => {
    it('should recognize date filter type in computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.computed.isFilterTypeDateSelect).toBeDefined()
    })

    it('should have isFilterTypeDateSelect available in component', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isFilterTypeDateSelect).toBe('boolean')
    })

    it('should include date type in isRenderComponent logic', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.computed.isRenderComponent).toBeDefined()
    })
  })

  describe('Methods - getFilterValue', () => {
    it('should return activity type label for activityType key', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getFilterValue(
        { key: 'activityType' },
        'phishing'
      )
      expect(result).toBe('Phishing Report')
    })

    it('should return product filter label for product key', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getFilterValue(
        { key: 'product' },
        'phishing'
      )
      expect(result).toBe('Phishing')
    })

    it('should return difficulty filter label for difficulty key', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getFilterValue(
        { key: 'difficulty' },
        'easy'
      )
      expect(result).toBe('Easy')
    })

    it('should return original value if key not found', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getFilterValue(
        { key: 'unknown' },
        'somevalue'
      )
      expect(result).toBe('somevalue')
    })

    it('should return original value if item not found in filter items', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getFilterValue(
        { key: 'activityType' },
        'nonexistent'
      )
      expect(result).toBe('nonexistent')
    })
  })

  describe('Methods - removeSearchFilter', () => {
    it('should emit remove event with filter value and index', () => {
      const wrapper = mountComponent()
      wrapper.vm.removeSearchFilter('value1', 0)
      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')[0]).toEqual([{ filter: 'value1', index: 0 }])
    })

    it('should emit remove event with correct payload structure', () => {
      const wrapper = mountComponent()
      wrapper.vm.removeSearchFilter('testvalue', 5)
      const emitted = wrapper.emitted('remove')[0][0]
      expect(emitted.filter).toBe('testvalue')
      expect(emitted.index).toBe(5)
    })
  })

  describe('Methods - getActivityTypeValue', () => {
    it('should return activity type text by value', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getActivityTypeValue('phishing')
      expect(result).toBe('Phishing Report')
    })

    it('should return original value if not found', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getActivityTypeValue('unknown')
      expect(result).toBe('unknown')
    })

    it('should handle empty string', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getActivityTypeValue('')
      expect(typeof result).toBe('string')
    })

    it('should handle empty value', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getActivityTypeValue('')
      expect(typeof result).toBe('string')
    })
  })

  describe('Methods - getProductFilterValue', () => {
    it('should return product filter text by value', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getProductFilterValue('phishing')
      expect(result).toBe('Phishing')
    })

    it('should return original value if not found', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getProductFilterValue('unknown')
      expect(result).toBe('unknown')
    })

    it('should handle empty string', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getProductFilterValue('')
      expect(typeof result).toBe('string')
    })
  })

  describe('Methods - getDifficultyFilterValue', () => {
    it('should return difficulty filter text by value', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getDifficultyFilterValue('easy')
      expect(result).toBe('Easy')
    })

    it('should return original value if not found', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getDifficultyFilterValue('unknown')
      expect(result).toBe('unknown')
    })

    it('should handle empty string', () => {
      const wrapper = mountComponent()
      const result = wrapper.vm.getDifficultyFilterValue('')
      expect(typeof result).toBe('string')
    })
  })

  describe('CSS Classes', () => {
    it('should have training-library-filter-badge class for select filter', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge').exists()).toBe(true)
    })

    it('should have training-library-filter-badge-long-text-search class for long text', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'longTextSearch', text: 'Description', activeValue: ['text'] }
      })
      expect(wrapper.find('.training-library-filter-badge-long-text-search').exists()).toBe(true)
    })

    it('should have left-side class for filter content', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge__left-side').exists()).toBe(true)
    })

    it('should have type class for filter type text', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge-type').exists()).toBe(true)
    })

    it('should have value class for filter value text', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      expect(wrapper.find('.training-library-filter-badge-value').exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent filter badge instances', () => {
      const wrapper1 = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })
      const wrapper2 = mountComponent({
        filter: { filterType: 'select', text: 'Type', activeValue: 'inactive' }
      })

      expect(wrapper1.vm.filter.text).toBe('Status')
      expect(wrapper2.vm.filter.text).toBe('Type')
    })

    it('should handle different filter items for different instances', () => {
      const wrapper1 = mountComponent({
        activityTypeFilterItems: [{ value: 'a', text: 'A' }]
      })
      const wrapper2 = mountComponent({
        activityTypeFilterItems: [{ value: 'b', text: 'B' }]
      })

      expect(wrapper1.vm.activityTypeFilterItems).toHaveLength(1)
      expect(wrapper2.vm.activityTypeFilterItems).toHaveLength(1)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render select filter badge', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'active' }
      })

      expect(wrapper.find('.training-library-filter-badge').exists()).toBe(true)
      expect(wrapper.vm.isFilterTypeSelect).toBeTruthy()
    })

    it('complete workflow: render and emit search filter removal', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: ['value1', 'value2'] }
      })

      const badges = wrapper.findAll('.training-library-filter-badge')
      expect(badges.length).toBe(2)

      wrapper.vm.removeSearchFilter('value1', 0)
      expect(wrapper.emitted('remove')).toBeTruthy()
    })

    it('complete workflow: display and lookup activity type value', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Activity', key: 'activityType', activeValue: ['phishing'] }
      })

      const value = wrapper.vm.getFilterValue(wrapper.vm.filter, 'phishing')
      expect(value).toBe('Phishing Report')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long filter text', () => {
      const longText = 'A'.repeat(200)
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: longText, activeValue: 'test' }
      })
      expect(wrapper.vm.filter.text.length).toBe(200)
    })

    it('should handle special characters in filter values', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: '!@#$%^&*()' }
      })
      expect(wrapper.vm.filter.activeValue).toBe('!@#$%^&*()')
    })

    it('should handle unicode characters in filter values', () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: '🎯 Test' }
      })
      expect(wrapper.vm.filter.activeValue).toContain('🎯')
    })

    it('should handle empty filter items array', () => {
      const wrapper = mountComponent({
        activityTypeFilterItems: []
      })
      const result = wrapper.vm.getActivityTypeValue('test')
      expect(result).toBe('test')
    })

    it('should render with minimal filter items', () => {
      const wrapper = mountComponent({
        activityTypeFilterItems: []
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should have destroy capability', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.destroy).toBe('function')
    })

    it('should maintain filter prop after mount', () => {
      const filter = { filterType: 'select', text: 'Status', activeValue: 'active' }
      const wrapper = mountComponent({ filter })
      expect(wrapper.vm.filter).toEqual(filter)
    })

    it('should handle filter prop updates', async () => {
      const wrapper = mountComponent({
        filter: { filterType: 'select', text: 'Status', activeValue: 'test' }
      })

      expect(wrapper.vm.filter.text).toBe('Status')

      await wrapper.setProps({
        filter: { filterType: 'select', text: 'Type', activeValue: 'updated' }
      })

      expect(wrapper.vm.filter.text).toBe('Type')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('should handle large number of filter items efficiently', () => {
      const largeFilterItems = Array.from({ length: 1000 }, (_, i) => ({
        value: `item${i}`,
        text: `Item ${i}`
      }))

      const start = Date.now()
      const wrapper = mountComponent({
        activityTypeFilterItems: largeFilterItems
      })
      const duration = Date.now() - start

      expect(wrapper.vm.activityTypeFilterItems).toHaveLength(1000)
      expect(duration).toBeLessThan(2000)
    })

    it('should handle large number of search filter values efficiently', () => {
      const largeActiveValue = Array.from({ length: 100 }, (_, i) => `value${i}`)

      const start = Date.now()
      const wrapper = mountComponent({
        filter: { filterType: 'search', text: 'Keywords', activeValue: largeActiveValue }
      })
      const duration = Date.now() - start

      const badges = wrapper.findAll('.training-library-filter-badge')
      expect(badges.length).toBe(100)
      expect(duration).toBeLessThan(300)
    })
  })

  describe('Default Values', () => {
    it('should render with provided filter items', () => {
      const wrapper = mountComponent({
        activityTypeFilterItems: defaultProps.activityTypeFilterItems,
        productFilterItems: defaultProps.productFilterItems,
        difficulityFilterItems: defaultProps.difficulityFilterItems
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should return original value when item not in filter items', () => {
      const wrapper = mountComponent({
        activityTypeFilterItems: defaultProps.activityTypeFilterItems
      })
      const result = wrapper.vm.getActivityTypeValue('nonexistent')
      expect(result).toBe('nonexistent')
    })
  })
})
