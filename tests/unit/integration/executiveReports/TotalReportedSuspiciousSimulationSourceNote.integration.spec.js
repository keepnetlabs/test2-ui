import { shallowMount } from '@vue/test-utils'
import ExecutiveReportsTotalReportedSuspicious from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspicious.vue'
import ExecutiveReportsTotalReportedSuspiciousPie from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspiciousPie.vue'
import ExecutiveReportsTotalReportedSuspiciousDoughnut from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspiciousDoughnut.vue'
import { SIMULATION_SOURCE_NOTE } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

const makeWidgetData = () => [
  {
    widgetDatas: [
      {
        dataObject: { ActionRange: 'Undetected' },
        values: [{ value: 91 }, { value: 29 }]
      },
      {
        dataObject: { ActionRange: 'Malicious' },
        values: [{ value: 6 }, { value: 2 }]
      },
      {
        dataObject: { ActionRange: 'Phishing' },
        values: [{ value: 0 }, { value: 0 }]
      },
      {
        dataObject: {
          ActionRange: 'Simulation',
          sourceBreakdown: {
            incidentResponderCount: 0,
            campaignCount: 1,
            campaigns: [{ campaignName: 'SpearTip Test', count: 1 }]
          }
        },
        values: [{ value: 3 }, { value: 1 }]
      }
    ]
  }
]

const widgetLoadingStub = {
  template: '<div><slot name="skeleton-content" /></div>'
}

const passthroughStub = {
  template: '<div v-bind="$attrs"><slot /></div>'
}

const createWrapper = (component) =>
  shallowMount(component, {
    propsData: {
      card: {
        title: 'Total Reported Suspicious Emails and Percentage',
        parentKey: 'Phishing Metrics',
        resourceId: 'widget-1',
        key: 'totalReportedSuspicious'
      },
      defaultWidgetData: makeWidgetData()
    },
    stubs: {
      WidgetLoading: widgetLoadingStub,
      ExecutiveWidgetContainer: passthroughStub,
      ExecutiveWidgetHeader: true,
      ExecutiveWidgetBody: passthroughStub,
      HorizontalBarChart: true,
      PieChart: true,
      DoughnutChart: true,
      VBtn: true,
      VIcon: true
    }
  })

describe('TotalReportedSuspicious simulation source note integration', () => {
  it.each([
    ['bar', ExecutiveReportsTotalReportedSuspicious],
    ['pie', ExecutiveReportsTotalReportedSuspiciousPie],
    ['doughnut', ExecutiveReportsTotalReportedSuspiciousDoughnut]
  ])('renders the simulation source note for %s chart', (name, component) => {
    const wrapper = createWrapper(component)

    expect(wrapper.find('.executive-report-total-reported-suspicious-note').text()).toBe(
      SIMULATION_SOURCE_NOTE
    )
    expect(wrapper.find('.executive-report-total-reported-suspicious-container').exists()).toBe(
      true
    )
  })
})
