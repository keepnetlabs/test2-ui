import ExecutiveReportsTrainingCompletionBar from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletionBar.vue'

describe('ExecutiveReportsTrainingCompletionBar.vue', () => {
  it('setChartData marks empty when no widget data exists', () => {
    const ctx = { isEmpty: false, industryAverageObj: {} }

    ExecutiveReportsTrainingCompletionBar.methods.setChartData.call(ctx, [])

    expect(ctx.isEmpty).toBe(true)
    expect(ctx.industryAverageObj).toBeNull()
  })

  it('setChartData builds chart datasets for training completion', () => {
    const ctx = { isEmpty: true, isLoading: true, chartOptions: {}, chartData: {} }

    ExecutiveReportsTrainingCompletionBar.methods.setChartData.call(ctx, [
      {
        widgetDatas: [
          {
            values: [
              { name: 'Completed', value: 70 },
              { name: 'CompletedCount', value: 70 },
              { name: 'InProgress', value: 20 },
              { name: 'InProgressCount', value: 20 },
              { name: 'Incomplete', value: 10 },
              { name: 'IncompleteCount', value: 10 }
            ]
          }
        ]
      }
    ])

    expect(ctx.isEmpty).toBe(false)
    expect(ctx.chartData.labels).toEqual(['Completed', 'In Progress', 'Incomplete'])
    expect(ctx.chartData.datasets[0].data).toEqual([70, 20, 10])
  })

  it('handleDelete and handleEdit emit selected card', () => {
    const ctx = { card: { key: 'k1' }, $emit: jest.fn() }

    ExecutiveReportsTrainingCompletionBar.methods.handleDelete.call(ctx)
    ExecutiveReportsTrainingCompletionBar.methods.handleEdit.call(ctx)

    expect(ctx.$emit).toHaveBeenNthCalledWith(1, 'on-delete', { key: 'k1' })
    expect(ctx.$emit).toHaveBeenNthCalledWith(2, 'on-edit', { key: 'k1' })
  })
})
