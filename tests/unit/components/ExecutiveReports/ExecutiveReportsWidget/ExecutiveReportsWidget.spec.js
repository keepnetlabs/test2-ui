jest.mock('@/api/reports', () => ({
  __esModule: true,
  getExecutiveReportChartData: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            widgetDatas: [
              {
                tableDefinitions: [{ name: 'department', label: 'Department' }],
                tableValues: [{ department: 'IT' }]
              }
            ]
          }
        ]
      }
    })
  )
}))

jest.mock('@/components/ExecutiveReports/ExecutiveReportsWidget/utils', () => ({
  __esModule: true,
  createExecutiveReportChartData: jest.fn(() => ({ datasets: [{ x: 1 }], valueEnums: ['A'] }))
}))

import ExecutiveReportsWidget from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveReportsWidget.vue'
import { getExecutiveReportChartData } from '@/api/reports'

describe('ExecutiveReportsWidget.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(ExecutiveReportsWidget.name).toBe('ExecutiveReportsWidget')
  })

  it('hasData computed returns by chart types', () => {
    expect(
      ExecutiveReportsWidget.computed.hasData.call({
        card: { chartType: 'gauge' },
        gaugeChartData: 5
      })
    ).toBe(5)
    expect(
      ExecutiveReportsWidget.computed.hasData.call({
        card: { chartType: 'pie' },
        pieChartData: [1]
      })
    ).toEqual([1])
    expect(
      ExecutiveReportsWidget.computed.hasData.call({
        card: { chartType: 'table' },
        isTypeTable: true,
        executiveReportData: [{ a: 1 }]
      })
    ).toBe(true)
  })

  it('callForData sets table mode when table values exist', async () => {
    const ctx = {
      isLoading: false,
      card: { resourceId: 'r1' },
      datePeriod: 1,
      dateRange: ['2026-01-01', '2026-01-31'],
      executiveReportColumns: [],
      executiveReportData: [],
      isTypeTable: false
    }
    ExecutiveReportsWidget.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getExecutiveReportChartData).toHaveBeenCalled()
    expect(ctx.isTypeTable).toBe(true)
    expect(ctx.executiveReportColumns[0].property).toBe('department')
    expect(ctx.executiveReportData).toEqual([{ department: 'IT' }])
  })

  it('handleDelete and handleEdit emit card payload', () => {
    const card = { resourceId: 'r2' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsWidget.methods.handleDelete.call(ctx)
    ExecutiveReportsWidget.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
