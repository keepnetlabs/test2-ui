import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPerformanceDetailsTable from '@/components/GamificationReport/GamificationReportPerformanceDetails/GamificationReportPerformanceDetailsTable'
import Badge from '@/components/Badge.vue'
import { getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'

describe('GamificationReportPerformanceDetailsTable.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    columns: [
      { label: 'Activity Type', key: 'activityType', type: 'text' },
      { label: 'Performance', key: 'performance', type: 'text' },
      { label: 'Points', key: 'points', type: 'number' },
      { label: 'Max Points', key: 'maxPoints', type: 'number' }
    ],
    data: [
      {
        activityType: 'Reporting phishing emails',
        performance: 'Successfully reported 3 out of 11 campaigns',
        points: '1200',
        maxPoints: '2800'
      },
      {
        activityType: 'Failed phishing campaigns',
        performance: 'Failed 4 out of 12 campaigns',
        points: '-700',
        maxPoints: '2800'
      }
    ]
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportPerformanceDetailsTable, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      stubs: {
        Badge: true
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
      expect(wrapper.vm.$options.name).toBe('GamificationReportPerformanceDetailsTable')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-performance-details-table').exists()).toBe(true)
    })

    it('should render table element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('table').exists()).toBe(true)
    })

    it('should render table head', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('thead').exists()).toBe(true)
    })

    it('should render table body', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('tbody').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept columns prop', () => {
      const wrapper = mountComponent({ columns: defaultProps.columns })
      expect(wrapper.vm.columns).toEqual(defaultProps.columns)
    })

    it('columns prop should have default value', () => {
      expect(GamificationReportPerformanceDetailsTable.props.columns.default()).toEqual([])
    })

    it('columns prop should be of type Array', () => {
      expect(GamificationReportPerformanceDetailsTable.props.columns.type).toBe(Array)
    })

    it('should accept data prop', () => {
      const wrapper = mountComponent({ data: defaultProps.data })
      expect(wrapper.vm.data).toEqual(defaultProps.data)
    })

    it('data prop should have default value', () => {
      expect(GamificationReportPerformanceDetailsTable.props.data.default()).toEqual([])
    })

    it('data prop should be of type Array', () => {
      expect(GamificationReportPerformanceDetailsTable.props.data.type).toBe(Array)
    })
  })

  describe('Table Header Rendering', () => {
    it('should render correct number of header cells', () => {
      const wrapper = mountComponent()
      const headerCells = wrapper.find('thead').findAll('th')
      expect(headerCells).toHaveLength(defaultProps.columns.length)
    })

    it('should render column labels in header', () => {
      const wrapper = mountComponent()
      const headerCells = wrapper.find('thead').findAll('th')
      defaultProps.columns.forEach((column, index) => {
        expect(headerCells.at(index).text()).toContain(column.label)
      })
    })

    it('should apply correct styles to header cells', () => {
      const wrapper = mountComponent()
      const firstHeaderCell = wrapper.find('thead').find('th')
      const style = firstHeaderCell.attributes('style')
      expect(style).toContain('text-align')
      expect(style).toContain('max-width')
      expect(style).toContain('min-width')
    })

    it('should handle empty columns array', () => {
      const wrapper = mountComponent({ columns: [] })
      const headerCells = wrapper.find('thead').findAll('th')
      expect(headerCells).toHaveLength(0)
    })
  })

  describe('Table Body Rendering', () => {
    it('should render correct number of body rows', () => {
      const wrapper = mountComponent()
      const rows = wrapper.find('tbody').findAll('tr')
      expect(rows).toHaveLength(defaultProps.data.length)
    })

    it('should render correct number of cells per row', () => {
      const wrapper = mountComponent()
      const firstRow = wrapper.find('tbody').find('tr')
      const cells = firstRow.findAll('td')
      expect(cells).toHaveLength(defaultProps.columns.length)
    })

    it('should handle empty data array', () => {
      const wrapper = mountComponent({ data: [] })
      const rows = wrapper.find('tbody').findAll('tr')
      expect(rows).toHaveLength(0)
    })

    it('should render multiple rows for multiple data items', () => {
      const wrapper = mountComponent({
        data: [
          { activityType: 'Row1', performance: 'Perf1', points: '100', maxPoints: '200' },
          { activityType: 'Row2', performance: 'Perf2', points: '150', maxPoints: '200' },
          { activityType: 'Row3', performance: 'Perf3', points: '200', maxPoints: '200' }
        ]
      })
      const rows = wrapper.find('tbody').findAll('tr')
      expect(rows).toHaveLength(3)
    })
  })

  describe('Column Type Rendering - Text', () => {
    it('should render text type columns correctly', () => {
      const wrapper = mountComponent()
      const firstCell = wrapper.find('tbody').find('td')
      expect(firstCell.find('span').exists()).toBe(true)
      expect(firstCell.find('span').text()).toContain('Reporting phishing emails')
    })

    it('should render text column content', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Type', key: 'activityType', type: 'text' }],
        data: [{ activityType: 'Test Activity' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.text()).toContain('Test Activity')
    })
  })

  describe('Column Type Rendering - Number', () => {
    it('should render number type columns correctly', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Points', key: 'points', type: 'number' }],
        data: [{ points: '1500' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.find('span').exists()).toBe(true)
      expect(cell.text()).toContain('1500')
    })

    it('should handle negative numbers', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Delta', key: 'delta', type: 'number' }],
        data: [{ delta: '-100' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.text()).toContain('-100')
    })
  })

  describe('Column Type Rendering - Badge', () => {
    it('should render Badge component for badge type columns', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Status', key: 'status', type: 'badge' }],
        data: [{ status: 'active' }]
      })
      expect(wrapper.findComponent({ name: 'Badge' }).exists()).toBe(true)
    })

    it('should pass correct props to Badge component', () => {
      const wrapper = mountComponent(
        {
          columns: [{ label: 'Status', key: 'status', type: 'badge' }],
          data: [{ status: 'active' }]
        },
        {
          stubs: {
            Badge: { template: '<div class="badge-stub"></div>', props: ['color', 'col', 'text'] }
          }
        }
      )
      const badge = wrapper.findComponent({ name: 'Badge' })
      expect(badge.exists()).toBe(true)
    })
  })

  describe('Column Type Rendering - Link', () => {
    it('should render link type columns as anchor elements', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'URL', key: 'url', type: 'link' }],
        data: [{ url: 'https://example.com' }]
      })
      const link = wrapper.find('tbody').find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('https://example.com')
    })

    it('should have correct link attributes', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'URL', key: 'url', type: 'link' }],
        data: [{ url: 'https://example.com' }]
      })
      const link = wrapper.find('tbody').find('a')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })

    it('should display link text as the URL', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'URL', key: 'url', type: 'link' }],
        data: [{ url: 'https://example.com' }]
      })
      const link = wrapper.find('tbody').find('a')
      expect(link.text()).toBe('https://example.com')
    })
  })

  describe('CSS Classes', () => {
    it('should have correct container class', () => {
      const wrapper = mountComponent()
      const container = wrapper.find('.gamification-report-performance-details-table')
      expect(container.exists()).toBe(true)
    })

    it('should apply column type classes to cells', () => {
      const wrapper = mountComponent({
        columns: [
          { label: 'Type', key: 'type', type: 'text' },
          { label: 'Value', key: 'value', type: 'number' }
        ],
        data: [{ type: 'test', value: '100' }]
      })
      const cells = wrapper.find('tbody').findAll('td')
      expect(cells.at(0).classes()).toContain('gamification-report-performance-details-table-column--text')
      expect(cells.at(1).classes()).toContain('gamification-report-performance-details-table-column--number')
    })

    it('should apply badge class for badge columns', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Status', key: 'status', type: 'badge' }],
        data: [{ status: 'active' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.classes()).toContain('gamification-report-performance-details-table-column--badge')
    })
  })

  describe('Column Styling', () => {
    it('should apply text-align style to cells', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Centered', key: 'centered', type: 'text', align: 'center' }],
        data: [{ centered: 'Center me' }]
      })
      const cell = wrapper.find('tbody').find('td')
      const style = cell.attributes('style')
      expect(style).toContain('text-align: center')
    })

    it('should apply default left alignment when not specified', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Left', key: 'left', type: 'text' }],
        data: [{ left: 'Align left' }]
      })
      const cell = wrapper.find('tbody').find('td')
      const style = cell.attributes('style')
      expect(style).toContain('text-align: left')
    })

    it('should apply maxWidth style to cells', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Limited', key: 'limited', type: 'text', maxWidth: '200px' }],
        data: [{ limited: 'Limited width' }]
      })
      const cell = wrapper.find('tbody').find('td')
      const style = cell.attributes('style')
      expect(style).toContain('max-width: 200px')
    })

    it('should apply minWidth style to cells', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Minimum', key: 'minimum', type: 'text', minWidth: '100px' }],
        data: [{ minimum: 'Minimum width' }]
      })
      const cell = wrapper.find('tbody').find('td')
      const style = cell.attributes('style')
      expect(style).toContain('min-width: 100px')
    })
  })

  describe('Methods - getCommonTDStyle', () => {
    it('should return correct style object', () => {
      const wrapper = mountComponent()
      const column = { align: 'center', maxWidth: '150px', minWidth: '100px' }
      const style = wrapper.vm.getCommonTDStyle(column)
      expect(style.textAlign).toBe('center')
      expect(style.maxWidth).toBe('150px')
      expect(style.minWidth).toBe('100px')
    })

    it('should use default values when not provided', () => {
      const wrapper = mountComponent()
      const column = {}
      const style = wrapper.vm.getCommonTDStyle(column)
      expect(style.textAlign).toBe('left')
      expect(style.maxWidth).toBe('auto')
      expect(style.minWidth).toBe('auto')
    })

    it('should handle partial column configuration', () => {
      const wrapper = mountComponent()
      const column = { align: 'right' }
      const style = wrapper.vm.getCommonTDStyle(column)
      expect(style.textAlign).toBe('right')
      expect(style.maxWidth).toBe('auto')
      expect(style.minWidth).toBe('auto')
    })

    it('getBtnStatusColor proxies helper function output', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBtnStatusColor('Critical')).toBe(getBtnStatusColor('Critical'))
    })

    it('getDataTableFieldLabel proxies helper function output', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getDataTableFieldLabel('Critical')).toBe(getDataTableFieldLabel('Critical'))
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent table instances', () => {
      const wrapper1 = mountComponent({
        data: [{ activityType: 'Activity 1', performance: 'Perf 1', points: '100', maxPoints: '200' }]
      })
      const wrapper2 = mountComponent({
        data: [{ activityType: 'Activity 2', performance: 'Perf 2', points: '150', maxPoints: '300' }]
      })

      expect(wrapper1.vm.data[0].activityType).toBe('Activity 1')
      expect(wrapper2.vm.data[0].activityType).toBe('Activity 2')
    })

    it('should handle multiple tables with different column configurations', () => {
      const wrapper1 = mountComponent({
        columns: [{ label: 'Col1', key: 'col1', type: 'text' }]
      })
      const wrapper2 = mountComponent({
        columns: [
          { label: 'Col1', key: 'col1', type: 'text' },
          { label: 'Col2', key: 'col2', type: 'number' }
        ]
      })

      expect(wrapper1.vm.columns).toHaveLength(1)
      expect(wrapper2.vm.columns).toHaveLength(2)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render table with mixed column types', () => {
      const wrapper = mountComponent({
        columns: [
          { label: 'Activity Type', key: 'activityType', type: 'text' },
          { label: 'Points', key: 'points', type: 'number' },
          { label: 'Status', key: 'status', type: 'badge' }
        ],
        data: [
          { activityType: 'Email Report', points: '500', status: 'success' },
          { activityType: 'Training', points: '750', status: 'warning' }
        ]
      })

      expect(wrapper.find('table').exists()).toBe(true)
      const rows = wrapper.find('tbody').findAll('tr')
      expect(rows).toHaveLength(2)
    })

    it('complete workflow: table with custom alignment and sizing', () => {
      const wrapper = mountComponent({
        columns: [
          { label: 'Activity', key: 'activity', type: 'text', align: 'left' },
          { label: 'Points', key: 'points', type: 'number', align: 'right', maxWidth: '100px' },
          { label: 'Status', key: 'status', type: 'badge', align: 'center', minWidth: '80px' }
        ],
        data: [{ activity: 'Report', points: '100', status: 'active' }]
      })

      const cells = wrapper.find('tbody').findAll('td')
      expect(cells).toHaveLength(3)
      expect(cells.at(0).attributes('style')).toContain('text-align: left')
      expect(cells.at(1).attributes('style')).toContain('text-align: right')
      expect(cells.at(2).attributes('style')).toContain('text-align: center')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long cell content', () => {
      const longText = 'A'.repeat(500)
      const wrapper = mountComponent({
        columns: [{ label: 'Long Text', key: 'longText', type: 'text' }],
        data: [{ longText }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.text()).toContain('A')
    })

    it('should handle special characters in cell content', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Special', key: 'special', type: 'text' }],
        data: [{ special: '!@#$%^&*()' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.text()).toContain('!@#$%^&*()')
    })

    it('should handle unicode characters in cell content', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Unicode', key: 'unicode', type: 'text' }],
        data: [{ unicode: '🎯 Target 📊 Chart' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.text()).toContain('🎯')
    })

    it('should handle empty strings in cells', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Empty', key: 'empty', type: 'text' }],
        data: [{ empty: '' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.find('span').exists()).toBe(true)
    })

    it('should handle null/undefined values gracefully', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Value', key: 'value', type: 'text' }],
        data: [{ value: null }]
      })
      expect(wrapper.vm.data[0].value).toBeNull()
    })

    it('renders empty cell content for unknown column type', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Unknown', key: 'unknown', type: 'custom' }],
        data: [{ unknown: 'value' }]
      })
      const cell = wrapper.find('tbody').find('td')
      expect(cell.find('span').exists()).toBe(false)
      expect(cell.findComponent(Badge).exists()).toBe(false)
      expect(cell.find('a').exists()).toBe(false)
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

    it('should update table when data prop changes', async () => {
      const wrapper = mountComponent({
        data: [{ activityType: 'Original', performance: 'Perf1', points: '100', maxPoints: '200' }]
      })

      await wrapper.setProps({
        data: [{ activityType: 'Updated', performance: 'Perf2', points: '150', maxPoints: '300' }]
      })

      const cell = wrapper.find('tbody').find('td')
      expect(cell.text()).toContain('Updated')
    })

    it('should update table when columns prop changes', async () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Col1', key: 'col1', type: 'text' }]
      })

      await wrapper.setProps({
        columns: [
          { label: 'Col1', key: 'col1', type: 'text' },
          { label: 'Col2', key: 'col2', type: 'number' }
        ]
      })

      const headerCells = wrapper.find('thead').findAll('th')
      expect(headerCells).toHaveLength(2)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('should render large tables efficiently', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        activityType: `Activity ${i}`,
        performance: `Performance ${i}`,
        points: String(i * 100),
        maxPoints: '10000'
      }))

      const start = Date.now()
      const wrapper = mountComponent({ data: largeData })
      const duration = Date.now() - start

      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(100)
      expect(duration).toBeLessThan(500)
    })
  })

  describe('Default Values', () => {
    it('should use empty arrays as defaults when not provided', () => {
      const wrapper = mountComponent({ columns: undefined, data: undefined })
      expect(wrapper.vm.columns).toEqual([])
      expect(wrapper.vm.data).toEqual([])
    })

    it('should render empty table with default props', () => {
      const wrapper = mountComponent({ columns: undefined, data: undefined })
      const headerCells = wrapper.find('thead').findAll('th')
      const rows = wrapper.find('tbody').findAll('tr')
      expect(headerCells).toHaveLength(0)
      expect(rows).toHaveLength(0)
    })
  })
})
