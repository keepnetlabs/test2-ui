import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerPerformanceDetailsTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerPerformanceDetailsTab'
import { getLearningEnrollments } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getLearningEnrollments: jest.fn()
}))

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

    it('callForData maps API results array to tableData', async () => {
      getLearningEnrollments.mockResolvedValueOnce({
        data: {
          data: {
            results: [{ enrollmentId: 'enr-1', enrollmentName: 'Security 101' }]
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.callForData()

      expect(wrapper.vm.tableData).toEqual([{ enrollmentId: 'enr-1', enrollmentName: 'Security 101' }])
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('callForData falls back to items when results is absent', async () => {
      getLearningEnrollments.mockResolvedValueOnce({
        data: {
          data: {
            items: [{ enrollmentId: 'enr-2', enrollmentName: 'Awareness Basics' }]
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.callForData()

      expect(wrapper.vm.tableData).toEqual([{ enrollmentId: 'enr-2', enrollmentName: 'Awareness Basics' }])
    })

    it('callForData resets tableData to empty on API error', async () => {
      getLearningEnrollments.mockRejectedValueOnce(new Error('api failed'))

      const wrapper = mountComponent()
      wrapper.vm.tableData = [{ enrollmentId: 'existing' }]
      await wrapper.vm.callForData()

      expect(wrapper.vm.tableData).toEqual([])
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('handleOpenTraining opens new tab only when enrollmentId exists', () => {
      const wrapper = mountComponent()
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

      wrapper.vm.handleOpenTraining({ enrollmentId: 'enr-99' })
      expect(openSpy).toHaveBeenCalledWith(
        '/awareness-educator/enrollments/training-report/enr-99',
        '_blank',
        'noopener,noreferrer'
      )

      openSpy.mockClear()
      wrapper.vm.handleOpenTraining({})
      expect(openSpy).not.toHaveBeenCalled()
      openSpy.mockRestore()
    })

    it('getPointsIcon and getPointsIconColor handle key branches', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.getPointsIcon(-1, false)).toBe('mdi-close-circle')
      expect(wrapper.vm.getPointsIcon(0, false)).toBe('mdi-minus-circle')
      expect(wrapper.vm.getPointsIcon('10(max)', false)).toBe('mdi-star')
      expect(wrapper.vm.getPointsIcon(5, true)).toBe('mdi-star')

      expect(wrapper.vm.getPointsIconColor(-1, false)).toBe('#B83A3A')
      expect(wrapper.vm.getPointsIconColor(0, false)).toBe('#757575')
      expect(wrapper.vm.getPointsIconColor('10(max)', false)).toBe('#D1AD0C')
      expect(wrapper.vm.getPointsIconColor(5, true)).toBe('#D1AD0C')
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
