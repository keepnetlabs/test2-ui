import { shallowMount } from '@vue/test-utils'
import DataTableDefaultTemplate from '@/components/DataTableComponents/DataTableDefaultTemplate'
import DataTableTextArray from '@/components/DataTableComponents/DataTableTextArray'
import DataTableArray from '@/components/DataTableComponents/DataTableArray'
import DataTableLink from '@/components/DataTableComponents/DataTableLink'

describe('DataTable mini components', () => {
  it('DataTableDefaultTemplate tooltip text with type name', () => {
    const wrapper = shallowMount(DataTableDefaultTemplate, {
      propsData: {
        scope: {
          row: { name: 'Template A', isDefault: true, typeName: 'Email' }
        }
      }
    })

    expect(wrapper.text()).toContain('Template A')
    expect(wrapper.vm.getTooltip).toContain('Email')
  })

  it('DataTableDefaultTemplate fallback tooltip text', () => {
    const wrapper = shallowMount(DataTableDefaultTemplate, {
      propsData: {
        scope: {
          row: { name: 'Template B', isDefault: false }
        }
      }
    })

    expect(wrapper.vm.getTooltip).toBe('Default option')
  })

  it('DataTableTextArray renders stringified value', () => {
    const wrapper = shallowMount(DataTableTextArray, {
      propsData: {
        scope: { row: { count: 12 } },
        col: { property: 'count' }
      }
    })

    expect(wrapper.text()).toContain('12')
  })

  it('DataTableArray returns empty text fallback', () => {
    const wrapper = shallowMount(DataTableArray, {
      propsData: {
        scope: { row: {} },
        col: { property: 'tags', emptyText: '-' }
      }
    })

    expect(wrapper.vm.getEmptyText).toBe('-')
    expect(wrapper.text()).toContain('-')
  })

  it('DataTableLink computes router link and empty text', () => {
    const wrapper = shallowMount(DataTableLink, {
      stubs: { 'router-link': true },
      propsData: {
        scope: { row: { name: 'Item', resourceId: 'id-1' } },
        col: { property: 'name', href: '/detail', hrefKey: 'resourceId', emptyText: 'N/A' }
      }
    })

    expect(wrapper.vm.getRouterLink).toBe('/detail/id-1')
    expect(wrapper.vm.getEmptyText).toBe('N/A')
    expect(wrapper.text()).toContain('Item')
  })
})

