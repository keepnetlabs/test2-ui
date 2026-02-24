import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPerformanceDetailsTable from '@/components/GamificationReport/GamificationReportPerformanceDetails/GamificationReportPerformanceDetailsTable.vue'

describe('GamificationReportPerformanceDetailsTable.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(GamificationReportPerformanceDetailsTable, {
      localVue,
      propsData: {
        columns: [],
        data: [],
        ...propsData
      },
      stubs: {
        Badge: true
      }
    })

  it('getCommonTDStyle handles mixed/partial style config', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.getCommonTDStyle({ align: 'center' })).toEqual({
      textAlign: 'center',
      maxWidth: 'auto',
      minWidth: 'auto'
    })

    expect(wrapper.vm.getCommonTDStyle({ maxWidth: '120px' })).toEqual({
      textAlign: 'left',
      maxWidth: '120px',
      minWidth: 'auto'
    })
  })

  it('renders link column with empty href when value is missing', () => {
    const wrapper = mountComponent({
      columns: [{ label: 'Link', key: 'url', type: 'link' }],
      data: [{}]
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBeUndefined()
  })

  it('renders badge column class and badge stub for badge type', () => {
    const wrapper = mountComponent({
      columns: [{ label: 'Priority', key: 'priority', type: 'badge' }],
      data: [{ priority: 'Critical' }]
    })

    const cell = wrapper.find('tbody td')
    expect(cell.classes()).toContain('gamification-report-performance-details-table-column--badge')
    expect(wrapper.findComponent({ name: 'Badge' }).exists()).toBe(true)
  })

  it('renders no text/link/badge content for unsupported column type', () => {
    const wrapper = mountComponent({
      columns: [{ label: 'Custom', key: 'x', type: 'custom' }],
      data: [{ x: 'value' }]
    })

    const cell = wrapper.find('tbody td')
    expect(cell.find('span').exists()).toBe(false)
    expect(cell.find('a').exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'Badge' }).exists()).toBe(false)
  })

  it('renders exact number of rows/columns for mixed table schema', () => {
    const wrapper = mountComponent({
      columns: [
        { label: 'Text', key: 't', type: 'text' },
        { label: 'Number', key: 'n', type: 'number' },
        { label: 'Link', key: 'l', type: 'link' }
      ],
      data: [
        { t: 'A', n: 1, l: 'https://a.test' },
        { t: 'B', n: 2, l: 'https://b.test' }
      ]
    })

    expect(wrapper.findAll('thead th')).toHaveLength(3)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.findAll('tbody td')).toHaveLength(6)
  })
})
