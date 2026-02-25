import ExecutiveReportSearchCard from '@/components/ExecutiveReports/ExecutiveReportSearchCard.vue'

describe('ExecutiveReportSearchCard.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportSearchCard.name).toBe('ExecutiveReportSearchCard')
  })

  it('isManagerMetricCard returns true when card has manager widget', () => {
    const result = ExecutiveReportSearchCard.computed.isManagerMetricCard.call({
      card: { widgets: [{ isSupportManager: false }, { isSupportManager: true }] }
    })
    expect(result).toBe(true)
  })

  it('isChartDisabled applies manager metric rules', () => {
    const ctx = { hasManagerMetricAdded: true, hasNonManagerMetricAdded: false }
    expect(
      ExecutiveReportSearchCard.methods.isChartDisabled.call(ctx, {
        isAdded: false,
        isSupportManager: false
      })
    ).toBe(true)
    expect(
      ExecutiveReportSearchCard.methods.isChartDisabled.call(
        { hasManagerMetricAdded: false, hasNonManagerMetricAdded: true },
        { isAdded: false, isSupportManager: true }
      )
    ).toBe(true)
  })

  it('getTooltipText returns proper messages by state', () => {
    const managerCtx = { hasManagerMetricAdded: true, hasNonManagerMetricAdded: false }
    expect(
      ExecutiveReportSearchCard.methods.getTooltipText.call(managerCtx, {
        isAdded: false,
        isSupportManager: true
      })
    ).toContain('Only one Manager Metric')

    const mixedCtx = { hasManagerMetricAdded: false, hasNonManagerMetricAdded: true }
    expect(
      ExecutiveReportSearchCard.methods.getTooltipText.call(mixedCtx, {
        isAdded: false,
        isSupportManager: true
      })
    ).toContain('cannot be added')
  })

  it('handleAddChart emits when chart is not disabled', () => {
    const chart = { isAdded: false, isSupportManager: false }
    const charts = [chart]
    const ctx = {
      $emit: jest.fn(),
      isChartDisabled: ExecutiveReportSearchCard.methods.isChartDisabled,
      hasManagerMetricAdded: false,
      hasNonManagerMetricAdded: false
    }
    ExecutiveReportSearchCard.methods.handleAddChart.call(ctx, chart, charts, 0)
    expect(ctx.$emit).toHaveBeenCalledWith('on-add-chart', chart, charts, 0)
  })
})
