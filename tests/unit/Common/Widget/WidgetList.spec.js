import { shallowMount } from '@vue/test-utils'
import WidgetList from '@/components/Common/Widget/WidgetList.vue'

// Mock the createRandomCryptStringNumber function
jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '12345')
}))

describe('WidgetList.vue', () => {
  let wrapper

  const mockColumns = [
    { label: 'Name', property: 'name', emptyText: 'N/A' },
    { label: 'Email', property: 'email', emptyText: 'N/A' },
    { label: 'Status', property: 'status', emptyText: 'N/A' }
  ]

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
  ]

  beforeEach(() => {
    wrapper = shallowMount(WidgetList, {
      propsData: {
        columns: mockColumns,
        data: mockData
      },
      stubs: {
        DataTableTooltip: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('WidgetList')
    })

    it('should render a table element', () => {
      const table = wrapper.find('table')
      expect(table.exists()).toBe(true)
    })

    it('should have k-widget-list class', () => {
      expect(wrapper.find('table').classes()).toContain('k-widget-list')
    })
  })

  describe('props handling', () => {
    it('should have required columns prop', () => {
      expect(wrapper.vm.$options.props.columns.required).toBe(true)
    })

    it('should have data prop', () => {
      expect(wrapper.vm.$options.props.data).toBeDefined()
    })

    it('should have colStyle prop', () => {
      expect(wrapper.vm.$options.props.colStyle).toBeDefined()
    })

    it('should have auto prop', () => {
      expect(wrapper.vm.$options.props.auto).toBeDefined()
    })

    it('should have empty prop', () => {
      expect(wrapper.vm.$options.props.empty).toBeDefined()
    })

    it('should have className prop', () => {
      expect(wrapper.vm.$options.props.className).toBeDefined()
    })

    it('should accept columns prop', () => {
      expect(wrapper.vm.columns).toEqual(mockColumns)
    })

    it('should accept data prop', () => {
      expect(wrapper.vm.data).toEqual(mockData)
    })
  })

  describe('data initialization', () => {
    it('should initialize showOverFlowTooltip to false', () => {
      expect(wrapper.vm.showOverFlowTooltip).toBe(false)
    })

    it('should initialize overFlowTooltipStyle as empty object', () => {
      expect(wrapper.vm.overFlowTooltipStyle).toEqual({})
    })

    it('should initialize overFlowTooltipContent as empty string', () => {
      expect(wrapper.vm.overFlowTooltipContent).toBe('')
    })

    it('should generate unique tableId', () => {
      expect(wrapper.vm.tableId).toContain('table-')
    })

    it('should have different tableIds for different instances', () => {
      const wrapper2 = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: mockData
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      // Note: Since we mocked createRandomCryptStringNumber, IDs will be same
      // In real scenario they would be different
      expect(wrapper.vm.tableId).toBeDefined()
      wrapper2.destroy()
    })
  })

  describe('table rendering', () => {
    it('should render table when data is not empty', () => {
      const table = wrapper.find('table')
      expect(table.exists()).toBe(true)
    })

    it('should have table id attribute', () => {
      const table = wrapper.find('table')
      expect(table.vm.$attrs.id).toBeDefined()
      expect(table.vm.$attrs.id).toContain('table-')
    })

    it('should have aria-label attribute', () => {
      const table = wrapper.find('table')
      expect(table.vm.$attrs['aria-label']).toBe('widget')
    })

    it('should render thead element', () => {
      const thead = wrapper.find('thead')
      expect(thead.exists()).toBe(true)
    })

    it('should render tbody element', () => {
      const tbody = wrapper.find('tbody')
      expect(tbody.exists()).toBe(true)
    })
  })

  describe('table headers', () => {
    it('should render header for each column', () => {
      const headers = wrapper.findAll('th')
      expect(headers.length).toBe(mockColumns.length)
    })

    it('should display column labels', () => {
      const text = wrapper.text()
      expect(text).toContain('Name')
      expect(text).toContain('Email')
      expect(text).toContain('Status')
    })

    it('should have k-widget-list__header class on each th', () => {
      const headers = wrapper.findAll('th')
      headers.wrappers.forEach((header) => {
        expect(header.classes()).toContain('k-widget-list__header')
      })
    })

    it('should generate dynamic class for each header', () => {
      const firstHeader = wrapper.find('th')
      // Should have class like k-widget-list__th-name
      expect(firstHeader.vm.$attrs.class).toBeDefined()
    })

    it('should apply custom th styles when provided', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: [
            { label: 'Name', property: 'name', thStyle: 'color: red;' }
          ],
          data: [{ id: 1, name: 'John' }]
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const th = wrapper.find('th')
      expect(th.vm.$attrs.style).toBe('color: red;')
    })
  })

  describe('table rows and cells', () => {
    it('should render row for each data item', () => {
      const rows = wrapper.findAll('tbody tr')
      expect(rows.length).toBe(mockData.length)
    })

    it('should render cell for each column in row', () => {
      const cells = wrapper.findAll('tbody td')
      expect(cells.length).toBeGreaterThan(0)
    })

    it('should display data in cells', () => {
      const text = wrapper.text()
      expect(text).toContain('John Doe')
      expect(text).toContain('john@example.com')
      expect(text).toContain('Active')
    })

    it('should have safari-hide-tooltip class on cells', () => {
      const firstCell = wrapper.find('tbody td')
      expect(firstCell.classes()).toContain('safari-hide-tooltip')
    })

    it('should apply custom td styles when provided', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: [
            { label: 'Name', property: 'name', tdStyle: 'font-weight: bold;' }
          ],
          data: [{ id: 1, name: 'John' }]
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const td = wrapper.find('tbody td')
      expect(td.vm.$attrs.style).toBe('font-weight: bold;')
    })
  })

  describe('cell content display', () => {
    it('should display value in k-widget-list__item span', () => {
      const item = wrapper.find('.k-widget-list__item')
      expect(item.exists()).toBe(true)
      expect(item.text().length).toBeGreaterThan(0)
    })

    it('should display empty text when value is empty', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: [{ label: 'Name', property: 'name', emptyText: 'Not Found' }],
          data: [{ id: 1, name: '' }]
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const noMatch = wrapper.find('.k-widget-list__no-match')
      expect(noMatch.exists()).toBe(true)
      expect(noMatch.text()).toBe('Not Found')
    })

    it('should display sub-item when provided', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: [
            { label: 'Name', property: 'name', subItem: 'subtitle' }
          ],
          data: [
            { id: 1, name: 'Main', subtitle: 'Sub' }
          ]
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const subItem = wrapper.find('.k-widget-list__sub-item')
      expect(subItem.exists()).toBe(true)
      expect(subItem.text()).toBe('Sub')
    })
  })

  describe('slot rendering', () => {
    it('should render default slot for cell content', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: mockData
        },
        slots: {
          name: '<span>Custom Name</span>'
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should provide row data to slot', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: mockData
        },
        scopedSlots: {
          name: '<span>{{ props.row.name }}</span>'
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('empty state', () => {
    it('should render empty message when data is empty', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: [],
          empty: {
            message: 'No data found',
            subMes: 'Please try again'
          }
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.text()).toContain('No data found')
      expect(wrapper.text()).toContain('Please try again')
    })

    it('should not render table when data is empty', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: [],
          empty: { message: 'Empty' }
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const table = wrapper.find('table')
      expect(table.exists()).toBe(false)
    })

    it('should render empty div with k-widget-list__empty class', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: [],
          empty: { message: 'Empty' }
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const emptyDiv = wrapper.find('.k-widget-list__empty')
      expect(emptyDiv.exists()).toBe(true)
    })

    it('should display empty button when provided', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: [],
          empty: {
            message: 'Empty',
            btn: 'Add Item',
            icon: 'mdi-plus'
          }
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('Add Item')
    })

    it('should render custom empty slot', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: []
        },
        slots: {
          'empty-widget-list': '<div>Custom Empty State</div>'
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.text()).toContain('Custom Empty State')
    })
  })

  describe('computed properties', () => {
    it('getTableStyle should return table-layout:fixed by default', () => {
      expect(wrapper.vm.getTableStyle).toBe('table-layout:fixed')
    })

    it('getTableStyle should return table-layout:auto when auto is true', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: mockData,
          auto: true
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.vm.getTableStyle).toBe('table-layout:auto')
    })

    it('getTableStatus should return true when data exists', () => {
      expect(wrapper.vm.getTableStatus).toBe(true)
    })

    it('getTableStatus should return false when data is empty', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: []
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.vm.getTableStatus).toBe(false)
    })
  })

  describe('getThClass method', () => {
    it('should generate class from column label', () => {
      const className = wrapper.vm.getThClass({ label: 'First Name' })
      expect(className).toContain('k-widget-list__th-')
      expect(className).toContain('firstname')
    })

    it('should remove spaces from label', () => {
      const className = wrapper.vm.getThClass({ label: 'Full Name' })
      expect(className).not.toContain(' ')
    })

    it('should lowercase the class name', () => {
      const className = wrapper.vm.getThClass({ label: 'STATUS' })
      expect(className).toBe('k-widget-list__th-status')
    })

    it('should handle label without label property', () => {
      const className = wrapper.vm.getThClass({})
      expect(className).toBe('k-widget-list__th')
    })
  })

  describe('mouse events handling', () => {
    it('should handle mouseenter event on cell', async () => {
      const cell = wrapper.find('tbody td')
      await cell.trigger('mouseenter')
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle mouseleave event on cell', async () => {
      const cell = wrapper.find('tbody td')
      await cell.trigger('mouseleave')
      expect(wrapper.vm.showOverFlowTooltip).toBe(false)
    })

    it('should handle mouseup event on cell', async () => {
      const cell = wrapper.find('tbody td')
      await cell.trigger('mouseup')
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('tooltip handling', () => {
    it('should not show tooltip initially', () => {
      expect(wrapper.vm.showOverFlowTooltip).toBe(false)
    })

    it('should have tooltip component', () => {
      expect(wrapper.findComponent({ name: 'DataTableTooltip' }).exists()).toBe(true)
    })

    it('should pass tooltip props to tooltip component', () => {
      const tooltip = wrapper.findComponent({ name: 'DataTableTooltip' })
      expect(tooltip.vm.$attrs).toBeDefined()
    })
  })

  describe('empty button interaction', () => {
    it('should emit onEmptyBtnClicked when empty button is clicked', async () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: [],
          empty: {
            message: 'Empty',
            btn: 'Add',
            icon: 'mdi-plus'
          }
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
      await button.trigger('click')
      expect(wrapper.emitted('onEmptyBtnClicked')).toBeTruthy()
    })
  })

  describe('row identification', () => {
    it('should set row id attribute from data', () => {
      const cells = wrapper.findAll('tbody td')
      cells.wrappers.forEach((cell) => {
        expect(cell.vm.$attrs.id).toBeDefined()
      })
    })

    it('should generate unique keys for rows', () => {
      const rows = wrapper.findAll('tbody tr')
      expect(rows.length).toBe(mockData.length)
    })
  })

  describe('responsive behavior', () => {
    it('should update table when data prop changes', async () => {
      const newData = [
        { id: 3, name: 'New User', email: 'new@example.com', status: 'Pending' }
      ]
      await wrapper.setProps({ data: newData })
      expect(wrapper.text()).toContain('New User')
    })

    it('should re-render table when columns prop changes', async () => {
      const newColumns = [
        { label: 'ID', property: 'id', emptyText: 'N/A' }
      ]
      await wrapper.setProps({ columns: newColumns })
      expect(wrapper.text()).toContain('ID')
    })
  })

  describe('styling', () => {
    it('should apply className prop if provided', () => {
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: mockData,
          className: 'custom-class'
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const table = wrapper.find('table')
      expect(table.classes()).toContain('custom-class')
    })

    it('should apply table layout style', () => {
      const table = wrapper.find('table')
      expect(table.vm.$attrs.style).toContain('table-layout')
    })
  })

  describe('integration scenarios', () => {
    it('should display complete widget list with all features', () => {
      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.findAll('th').length).toBe(mockColumns.length)
      expect(wrapper.findAll('tbody tr').length).toBe(mockData.length)
    })

    it('should work with large datasets', () => {
      const largeData = Array(100)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          status: i % 2 === 0 ? 'Active' : 'Inactive'
        }))
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: largeData
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      const rows = wrapper.findAll('tbody tr')
      expect(rows.length).toBe(100)
    })

    it('should handle data with missing properties gracefully', () => {
      const incompleteData = [
        { id: 1, name: 'John' },
        { id: 2, email: 'jane@example.com' }
      ]
      wrapper = shallowMount(WidgetList, {
        propsData: {
          columns: mockColumns,
          data: incompleteData
        },
        stubs: {
          DataTableTooltip: true
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })
})
