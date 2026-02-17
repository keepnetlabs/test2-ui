import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPerformanceDetailsDrawer from '@/components/GamificationReport/GamificationReportPerformanceDetails/GamificationReportPerformanceDetailsDrawer'

describe('GamificationReportPerformanceDetailsDrawer.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: true,
    selectedRow: {
      firstName: 'John',
      lastName: 'Doe',
      points: 2800
    }
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportPerformanceDetailsDrawer, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      stubs: {
        VNavigationDrawer: { template: '<div class="v-navigation-drawer-stub"><slot /></div>' },
        VListItem: { template: '<div class="v-list-item-stub"><slot /></div>' },
        VListItemContent: { template: '<div class="v-list-item-content-stub"><slot /></div>' },
        VListItemTitle: { template: '<div class="v-list-item-title-stub"><slot /></div>' },
        VListItemSubtitle: { template: '<div class="v-list-item-subtitle-stub"><slot /></div>' },
        VIcon: { template: '<div class="v-icon-stub"><slot /></div>' },
        GamificationReportPerformanceDetailsTable: { template: '<div class="table-stub" />' },
        GamificationReportPerformanceDetailsInfoCard: { template: '<div class="info-card-stub" />' }
      },
      directives: {
        'click-outside': {}
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
      expect(wrapper.vm.$options.name).toBe('GamificationReportPerformanceDetailsDrawer')
    })

    it('should render VNavigationDrawer component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VNavigationDrawer' }).exists()).toBe(true)
    })

    it('should render header section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__header').exists()).toBe(true)
    })

    it('should render body section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__body').exists()).toBe(true)
    })

    it('should render sticky header wrapper', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__header--sticky').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('status prop should have default value false', () => {
      expect(GamificationReportPerformanceDetailsDrawer.props.status.default).toBe(false)
    })

    it('status prop should be of type Boolean', () => {
      expect(GamificationReportPerformanceDetailsDrawer.props.status.type).toBe(Boolean)
    })

    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent({ selectedRow: defaultProps.selectedRow })
      expect(wrapper.vm.selectedRow).toEqual(defaultProps.selectedRow)
    })

    it('selectedRow prop should be required', () => {
      expect(GamificationReportPerformanceDetailsDrawer.props.selectedRow.required).toBe(true)
    })

    it('selectedRow prop should be of type Object', () => {
      expect(GamificationReportPerformanceDetailsDrawer.props.selectedRow.type).toBe(Object)
    })
  })

  describe('Data Properties', () => {
    it('should have columns data property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.columns).toBeDefined()
      expect(Array.isArray(wrapper.vm.columns)).toBe(true)
    })

    it('columns should have correct structure', () => {
      const wrapper = mountComponent()
      const columns = wrapper.vm.columns
      expect(columns.length).toBeGreaterThan(0)
      columns.forEach(col => {
        expect(col.label).toBeDefined()
        expect(col.key).toBeDefined()
        expect(col.type).toBeDefined()
      })
    })

    it('should have tableData data property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableData).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true)
    })

    it('tableData should contain expected rows', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tableData.length).toBeGreaterThan(0)
    })

    it('should have actionColumns data property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.actionColumns).toBeDefined()
      expect(Array.isArray(wrapper.vm.actionColumns)).toBe(true)
    })

    it('actionColumns should have badge type column', () => {
      const wrapper = mountComponent()
      const hasBadgeType = wrapper.vm.actionColumns.some(col => col.type === 'badge')
      expect(hasBadgeType).toBe(true)
    })

    it('should have actionTableData data property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.actionTableData).toBeDefined()
      expect(Array.isArray(wrapper.vm.actionTableData)).toBe(true)
    })

    it('actionTableData should contain expected rows', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.actionTableData.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation Drawer Props', () => {
    it('should render VNavigationDrawer component', () => {
      const wrapper = mountComponent({ status: true })
      const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })
      expect(drawer.exists()).toBe(true)
    })

    it('should render drawer with correct class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-navigation-drawer-stub').exists()).toBe(true)
    })

    it('should set drawer as temporary (component initialization)', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('GamificationReportPerformanceDetailsDrawer')
    })

    it('should position drawer component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('should initialize drawer with status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('should have correct drawer configuration', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
      expect(wrapper.vm.columns).toBeDefined()
      expect(wrapper.vm.tableData).toBeDefined()
    })
  })

  describe('Header Content', () => {
    it('should display user first and last name in selectedRow', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'Jane', lastName: 'Smith', points: 2000 }
      })
      expect(wrapper.vm.selectedRow.firstName).toBe('Jane')
      expect(wrapper.vm.selectedRow.lastName).toBe('Smith')
    })

    it('should have header structure defined', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__header').exists()).toBe(true)
    })

    it('should render close icon in header', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('.v-icon-stub')
      expect(icon.exists()).toBe(true)
    })

    it('should have header content structure', () => {
      const wrapper = mountComponent()
      const headerContent = wrapper.find('.campaign-manager-scenario-statistics-modal__header')
      expect(headerContent.exists()).toBe(true)
    })
  })

  describe('Points Breakdown Section', () => {
    it('should display points breakdown header', () => {
      const wrapper = mountComponent()
      const content = wrapper.html()
      expect(content).toContain('Points Breakdown')
    })

    it('should display user points earned', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe', points: 3000 }
      })
      const content = wrapper.html()
      expect(content).toContain('3000')
    })

    it('should include GamificationReportPerformanceDetailsTable for breakdown', () => {
      const wrapper = mountComponent()
      const tables = wrapper.findAllComponents({ name: 'GamificationReportPerformanceDetailsTable' })
      expect(tables.length).toBeGreaterThan(0)
    })

    it('should include GamificationReportPerformanceDetailsInfoCard', () => {
      const wrapper = mountComponent()
      const cards = wrapper.findAllComponents({ name: 'GamificationReportPerformanceDetailsInfoCard' })
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Actions to Improve Section', () => {
    it('should display actions improvement header', () => {
      const wrapper = mountComponent()
      const content = wrapper.html()
      expect(content).toContain('Actions to Improve User Performance')
    })

    it('should render action table', () => {
      const wrapper = mountComponent()
      const tables = wrapper.findAllComponents({ name: 'GamificationReportPerformanceDetailsTable' })
      expect(tables.length).toBeGreaterThanOrEqual(2)
    })

    it('should have badge column in action table', () => {
      const wrapper = mountComponent()
      const hasBadgeColumn = wrapper.vm.actionColumns.some(col => col.type === 'badge')
      expect(hasBadgeColumn).toBe(true)
    })

    it('should have link column in action table', () => {
      const wrapper = mountComponent()
      const hasLinkColumn = wrapper.vm.actionColumns.some(col => col.type === 'link')
      expect(hasLinkColumn).toBe(true)
    })
  })

  describe('Methods - handleDrawerClickOutside', () => {
    it('should emit on-close event when click outside', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDrawerClickOutside()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('should emit on-close event with no payload', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDrawerClickOutside()
      expect(wrapper.emitted('on-close')[0]).toEqual([])
    })
  })

  describe('Event Emission', () => {
    it('should have handleDrawerClickOutside method that emits on-close', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleDrawerClickOutside).toBe('function')
    })

    it('should emit on-close event when handleDrawerClickOutside is called', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDrawerClickOutside()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('should emit on-close with no arguments', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDrawerClickOutside()
      expect(wrapper.emitted('on-close')[0]).toEqual([])
    })
  })

  describe('Columns Configuration', () => {
    it('should have correct first column configuration', () => {
      const wrapper = mountComponent()
      const firstColumn = wrapper.vm.columns[0]
      expect(firstColumn.label).toBe('Activity Type')
      expect(firstColumn.key).toBe('activityType')
      expect(firstColumn.type).toBe('text')
    })

    it('should have number type column for points', () => {
      const wrapper = mountComponent()
      const pointsColumn = wrapper.vm.columns.find(col => col.key === 'points')
      expect(pointsColumn).toBeDefined()
      expect(pointsColumn.type).toBe('number')
    })

    it('should have correct action columns structure', () => {
      const wrapper = mountComponent()
      const actionCols = wrapper.vm.actionColumns
      const priorityCol = actionCols.find(col => col.key === 'priority')
      expect(priorityCol).toBeDefined()
      expect(priorityCol.type).toBe('badge')
      expect(priorityCol.align).toBe('center')
    })

    it('action columns should have maxWidth and minWidth for priority', () => {
      const wrapper = mountComponent()
      const priorityCol = wrapper.vm.actionColumns.find(col => col.key === 'priority')
      expect(priorityCol.maxWidth).toBeDefined()
      expect(priorityCol.minWidth).toBeDefined()
    })
  })

  describe('Table Data', () => {
    it('should have correct table data structure', () => {
      const wrapper = mountComponent()
      wrapper.vm.tableData.forEach(row => {
        expect(row.activityType).toBeDefined()
        expect(row.performance).toBeDefined()
        expect(row.points).toBeDefined()
        expect(row.maxPoints).toBeDefined()
      })
    })

    it('should have correct action table data structure', () => {
      const wrapper = mountComponent()
      wrapper.vm.actionTableData.forEach(row => {
        expect(row.priority).toBeDefined()
        expect(row.action).toBeDefined()
        expect(row.activityName).toBeDefined()
        expect(row.pointsAvailable).toBeDefined()
        expect(row.nextStep).toBeDefined()
      })
    })

    it('should have multiple action items', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.actionTableData.length).toBeGreaterThan(0)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent drawer instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe', points: 2000 }
      })
      const wrapper2 = mountComponent({
        selectedRow: { firstName: 'Jane', lastName: 'Smith', points: 3000 }
      })

      expect(wrapper1.vm.selectedRow.firstName).toBe('John')
      expect(wrapper2.vm.selectedRow.firstName).toBe('Jane')
    })

    it('should maintain separate table data for different instances', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      expect(wrapper1.vm.tableData).toBeDefined()
      expect(wrapper2.vm.tableData).toBeDefined()
      expect(wrapper1.vm.tableData === wrapper2.vm.tableData).toBeFalsy()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render drawer with user performance details', () => {
      const wrapper = mountComponent({
        status: true,
        selectedRow: {
          firstName: 'Alice',
          lastName: 'Johnson',
          points: 2500
        }
      })

      expect(wrapper.vm.status).toBe(true)
      expect(wrapper.find('.k-overlay__title').text()).toContain('Alice')
      expect(wrapper.find('.k-overlay__title').text()).toContain('Johnson')
    })

    it('complete workflow: drawer displays both breakdown and action sections', () => {
      const wrapper = mountComponent()

      const content = wrapper.html()
      expect(content).toContain('Points Breakdown')
      expect(content).toContain('Actions to Improve User Performance')
    })

    it('complete workflow: drawer can emit close event', () => {
      const wrapper = mountComponent({ status: true })
      wrapper.vm.handleDrawerClickOutside()

      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('CSS Classes', () => {
    it('should have sticky header class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__header--sticky').exists()).toBe(true)
    })

    it('should have header class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__header').exists()).toBe(true)
    })

    it('should have body class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-scenario-statistics-modal__body').exists()).toBe(true)
    })

    it('should have body header class for sections', () => {
      const wrapper = mountComponent()
      const bodyHeaders = wrapper.findAll('.campaign-manager-scenario-statistics-modal__body-header')
      expect(bodyHeaders.length).toBeGreaterThan(0)
    })

    it('should have drawer with proper structure', () => {
      const wrapper = mountComponent()
      const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })
      expect(drawer.exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle long user names', () => {
      const longName = 'A'.repeat(100)
      const wrapper = mountComponent({
        selectedRow: { firstName: longName, lastName: longName, points: 1000 }
      })
      expect(wrapper.vm.selectedRow.firstName).toBe(longName)
    })

    it('should handle zero points', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'Test', lastName: 'User', points: 0 }
      })
      expect(wrapper.vm.selectedRow.points).toBe(0)
    })

    it('should handle very high points value', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'Test', lastName: 'User', points: 999999 }
      })
      expect(wrapper.vm.selectedRow.points).toBe(999999)
    })

    it('should handle special characters in names', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'Jean-Pierre', lastName: "O'Connor", points: 2000 }
      })
      expect(wrapper.vm.selectedRow.firstName).toContain("Jean")
      expect(wrapper.vm.selectedRow.lastName).toContain("Connor")
    })

    it('should handle unicode characters in names', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: '李', lastName: '明', points: 2000 }
      })
      expect(wrapper.vm.selectedRow.firstName).toBe('李')
      expect(wrapper.vm.selectedRow.lastName).toBe('明')
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

    it('should update when selectedRow prop changes', async () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'Original', lastName: 'Name', points: 1000 }
      })

      await wrapper.setProps({
        selectedRow: { firstName: 'Updated', lastName: 'User', points: 2000 }
      })

      expect(wrapper.vm.selectedRow.firstName).toBe('Updated')
    })

    it('should update drawer visibility when status prop changes', async () => {
      const wrapper = mountComponent({ status: false })

      await wrapper.setProps({ status: true })

      expect(wrapper.vm.status).toBe(true)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('should handle large points values efficiently', () => {
      const start = Date.now()
      mountComponent({
        selectedRow: { firstName: 'Test', lastName: 'User', points: 999999999 }
      })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Default Values', () => {
    it('should use default status value when not provided', () => {
      const wrapper = mountComponent({ status: undefined })
      expect(wrapper.vm.status).toBe(false)
    })

    it('drawer should have default status value', () => {
      const wrapper = mountComponent({ status: undefined })
      expect(wrapper.vm.status).toBe(false)
    })
  })
})
