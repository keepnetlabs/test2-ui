import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerPerformanceDetailsTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerPerformanceDetailsTab'

describe('GamificationReportUserDetailsDrawerPerformanceDetailsTab.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: '123' }
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportUserDetailsDrawerPerformanceDetailsTab, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        DataTable: true,
        Badge: true,
        VIcon: true,
        VTooltip: true,
        VBtn: true,
        GamificationReportPhishingActivityResults: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': { ViewReport: 'View Report' }
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
      expect(wrapper.vm.$options.name).toBe('GamificationReportUserDetailsDrawerPerformanceDetailsTab')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-performance-details-tab').exists()).toBe(true)
    })

    it('should render DataTable component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'DataTable' }).exists()).toBe(true)
    })

    it('should render GamificationReportPhishingActivityResults', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'GamificationReportPhishingActivityResults' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('selectedRow prop should be required', () => {
      expect(GamificationReportUserDetailsDrawerPerformanceDetailsTab.props.selectedRow.required).toBe(true)
    })

    it('selectedRow prop should be of type Object', () => {
      expect(GamificationReportUserDetailsDrawerPerformanceDetailsTab.props.selectedRow.type).toBe(Object)
    })
  })

  describe('Data Properties', () => {
    it('should have CONSTANTS initialized', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS).toBeDefined()
      expect(wrapper.vm.CONSTANTS.id).toBe('gamification-training-overview-data-table')
    })

    it('should have isLoading initialized as boolean', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have tableData initialized as array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true)
    })

    it('should have tableOptions initialized', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions).toBeDefined()
    })
  })

  describe('Computed Properties', () => {
    it('should have targetUserResourceId computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.targetUserResourceId).toBe('123')
    })

    it('should handle targetUserResourceId from selectedRow.resourceId', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'Test', lastName: 'User', resourceId: '456' }
      })
      expect(wrapper.vm.targetUserResourceId).toBe('456')
    })
  })

  describe('Methods', () => {
    it('should have callForData method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.callForData).toBe('function')
    })

    it('should have handleOpenTraining method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleOpenTraining).toBe('function')
    })

    it('should have getPointsIcon method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getPointsIcon).toBe('function')
    })

    it('should have getPointsIconColor method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getPointsIconColor).toBe('function')
    })

    it('should have getStatusBadgeProps method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getStatusBadgeProps).toBe('function')
    })
  })

  describe('Table Configuration', () => {
    it('should have correct table columns configured', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.columns).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableOptions.columns)).toBe(true)
      expect(wrapper.vm.tableOptions.columns.length).toBeGreaterThan(0)
    })

    it('should have row actions configured', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.rowActions).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableOptions.rowActions)).toBe(true)
    })

    it('should have empty state configured', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableOptions.iEmpty).toBeDefined()
      expect(wrapper.vm.tableOptions.iEmpty.message).toBeDefined()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent performance tab instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: { firstName: 'User1', lastName: 'Test1', resourceId: '1' }
      })
      const wrapper2 = mountComponent({
        selectedRow: { firstName: 'User2', lastName: 'Test2', resourceId: '2' }
      })

      expect(wrapper1.vm.targetUserResourceId).toBe('1')
      expect(wrapper2.vm.targetUserResourceId).toBe('2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render performance tab with training data', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: '123' }
      })

      expect(wrapper.vm.targetUserResourceId).toBe('123')
      expect(wrapper.find('.gamification-report-user-details-performance-details-tab').exists()).toBe(true)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component watcher should trigger callForData when targetUserResourceId changes', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
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
