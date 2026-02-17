import { shallowMount } from '@vue/test-utils'
import DataTableDate from '@/components/DataTableComponents/DataTableDate'

describe('DataTableDate.vue', () => {
  it('renders date prefix when value exists', () => {
    const wrapper = shallowMount(DataTableDate, {
      propsData: {
        scope: { row: { createdAt: '2026-02-17T10:00:00Z' } },
        col: { property: 'createdAt' }
      }
    })

    expect(wrapper.text()).toContain('2026-02-17')
  })

  it('renders empty text when row does not exist', () => {
    const wrapper = shallowMount(DataTableDate, {
      propsData: {
        scope: { row: null },
        col: { property: 'createdAt', emptyText: '-' }
      }
    })

    expect(wrapper.text()).toContain('-')
  })
})

