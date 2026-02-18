import { shallowMount } from '@vue/test-utils'
import DataTableArray from '@/components/DataTableComponents/DataTableArray'
import DataTableTextArray from '@/components/DataTableComponents/DataTableTextArray'
import DataTableDefaultTemplate from '@/components/DataTableComponents/DataTableDefaultTemplate'
import DataTableLink from '@/components/DataTableComponents/DataTableLink'

describe('DataTable core field components', () => {
  it('DataTableArray renders first item and extra count tooltip trigger', () => {
    const wrapper = shallowMount(DataTableArray, {
      propsData: {
        scope: { row: { tags: ['tag-1', 'tag-2', 'tag-3'] } },
        col: { property: 'tags' }
      },
      stubs: {
        'v-tooltip': true
      }
    })

    expect(wrapper.text()).toContain('tag-1')
    expect(wrapper.find('v-tooltip-stub').exists()).toBe(true)
  })

  it('DataTableArray falls back to empty text when data is missing', () => {
    const wrapper = shallowMount(DataTableArray, {
      propsData: {
        scope: { row: {} },
        col: { property: 'tags', emptyText: 'No tags' }
      }
    })

    expect(wrapper.vm.getEmptyText).toBe('No tags')
    expect(wrapper.text()).toContain('No tags')
  })

  it('DataTableTextArray is defined as functional component with expected props', () => {
    expect(DataTableTextArray.name).toBe('DataTableTextArray')
    expect(DataTableTextArray.functional).toBe(true)
    expect(DataTableTextArray.props).toHaveProperty('scope')
    expect(DataTableTextArray.props).toHaveProperty('col')
  })

  it('DataTableDefaultTemplate renders star tooltip only for default templates', () => {
    const wrapper = shallowMount(DataTableDefaultTemplate, {
      propsData: {
        scope: { row: { name: 'Template', isDefault: true, typeName: 'SMS' } }
      },
      stubs: {
        'v-tooltip': true,
        'v-icon': true
      }
    })

    expect(wrapper.find('v-tooltip-stub').exists()).toBe(true)
    expect(wrapper.vm.getTooltip).toContain('SMS')
  })

  it('DataTableLink renders plain text when href is not provided', () => {
    const wrapper = shallowMount(DataTableLink, {
      propsData: {
        scope: { row: { name: 'Item 1', id: '10' } },
        col: { property: 'name', hrefKey: 'id', emptyText: '-' }
      },
      stubs: {
        'router-link': true
      }
    })

    expect(wrapper.find('router-link-stub').exists()).toBe(false)
    expect(wrapper.text()).toContain('Item 1')
  })

  it('DataTableLink returns empty router link when custom mode is enabled', () => {
    const wrapper = shallowMount(DataTableLink, {
      propsData: {
        scope: { row: { name: 'Item 2', id: '22' } },
        col: { property: 'name', href: '/detail', hrefKey: 'id', custom: true }
      },
      stubs: {
        'router-link': true
      }
    })

    expect(wrapper.vm.getRouterLink).toBe('')
  })
})
