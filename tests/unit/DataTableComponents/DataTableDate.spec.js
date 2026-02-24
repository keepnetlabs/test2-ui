import { mount } from '@vue/test-utils'
import DataTableDate from '@/components/DataTableComponents/DataTableDate'

describe('DataTableDate.vue', () => {
  it('is declared as a functional component with expected name', () => {
    expect(DataTableDate.name).toBe('DataTableDate')
    expect(DataTableDate.functional).toBe(true)
  })

  it('exposes required scope and col props', () => {
    expect(DataTableDate.props).toHaveProperty('scope')
    expect(DataTableDate.props).toHaveProperty('col')
  })

  it('renders date substring when row has valid date value', () => {
    const wrapper = mount(DataTableDate, {
      propsData: {
        scope: { row: { createdDate: '2025-01-15T10:30:00' } },
        col: { property: 'createdDate', emptyText: '-' }
      }
    })
    expect(wrapper.text()).toContain('2025-01-15')
  })

  it('renders emptyText when scope.row is missing', () => {
    const wrapper = mount(DataTableDate, {
      propsData: {
        scope: {},
        col: { property: 'createdDate', emptyText: 'No date' }
      }
    })
    expect(wrapper.text()).toContain('No date')
  })

  it('renders first 10 chars when row has date string', () => {
    const wrapper = mount(DataTableDate, {
      propsData: {
        scope: { row: { createdDate: '2024-12-31T23:59:59' } },
        col: { property: 'createdDate', emptyText: '-' }
      }
    })
    expect(wrapper.text()).toContain('2024-12-31')
  })

  it('renders empty string when row value is empty string', () => {
    const wrapper = mount(DataTableDate, {
      propsData: {
        scope: { row: { createdDate: '' } },
        col: { property: 'createdDate', emptyText: 'N/A' }
      }
    })
    expect(wrapper.find('span').exists()).toBe(true)
  })
})
