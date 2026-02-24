jest.mock('@/api/reports', () => ({
  getExecutiveReportChartData: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
import ExecutiveReportsImpactOfPhishingAwarenessTraining from '@/components/ExecutiveReports/ExecutiveReportsImpactOfPhishingAwarenessTraining.vue'
import { getExecutiveReportChartData } from '@/api/reports'

describe('ExecutiveReportsImpactOfPhishingAwarenessTraining.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(ExecutiveReportsImpactOfPhishingAwarenessTraining, {
      propsData: {
        card: { resourceId: 'card-1', key: 'impact', title: 'Impact', parentKey: 'Training' },
        dateRange: ['2025-01-01', '2025-01-31'],
        datePeriod: 1,
        ...props
      },
      stubs: {
        WidgetLoading: true,
        ExecutiveWidgetContainer: true,
        ExecutiveWidgetHeader: true,
        ExecutiveWidgetBody: true,
        BarChart: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getExecutiveReportChartData.mockResolvedValue({
      data: { data: [] }
    })
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: () => 'YYYY/MM/DD' },
      writable: true
    })
  })

  it('renders with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('ExecutiveReportsImpactOfPhishingAwarenessTraining')
  })

  it('handleDelete emits on-delete', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('on-delete')).toBeTruthy()
  })

  it('handleEdit emits on-edit', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleEdit()
    expect(wrapper.emitted('on-edit')).toBeTruthy()
  })

  it('setChartData sets isEmpty when no widget data', () => {
    const wrapper = mountComponent()
    wrapper.vm.setChartData([])
    expect(wrapper.vm.isEmpty).toBe(true)
  })

  it('setChartData sets isEmpty when widgetDatas empty', () => {
    const wrapper = mountComponent()
    wrapper.vm.setChartData([{ widgetDatas: [] }])
    expect(wrapper.vm.isEmpty).toBe(true)
  })

  it('callForData fetches chart data and sets loading', async () => {
    const data = [
      {
        widgetDatas: [
          {
            date: '2025/01/15 00:00',
            values: [
              { name: 'IndustryAverage', value: 50, label: 'Avg' },
              { name: 'Percentage', value: 45, label: 'Score', annotations: 'note' }
            ]
          }
        ]
      }
    ]
    getExecutiveReportChartData.mockResolvedValue({ data: { data } })

    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect(getExecutiveReportChartData).toHaveBeenCalledWith(
      expect.objectContaining({
        widgetIds: ['card-1'],
        datePeriod: 3
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('uses defaultWidgetData when provided in created', () => {
    const defaultData = [
      {
        widgetDatas: [
          {
            date: '2025/01/15 00:00',
            values: [
              { name: 'IndustryAverage', value: 40, label: 'Avg' },
              { name: 'Percentage', value: 35, label: 'Score' }
            ]
          }
        ]
      }
    ]
    const wrapper = mountComponent({ defaultWidgetData: defaultData })
    expect(wrapper.vm.isEmpty).toBe(false)
    expect(wrapper.vm.chartData.datasets).toBeDefined()
  })
})
