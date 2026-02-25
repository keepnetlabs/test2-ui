import ExecutiveReportsSecurityCultureScore from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsSecurityCultureScore.vue'

describe('ExecutiveReportsSecurityCultureScore.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsSecurityCultureScore.name).toBe('ExecutiveReportsSecurityCultureScore')
  })

  it('normalizeScore converts percentage style score and clamps negatives', () => {
    expect(ExecutiveReportsSecurityCultureScore.methods.normalizeScore.call({}, 380)).toBe(3.8)
    expect(ExecutiveReportsSecurityCultureScore.methods.normalizeScore.call({}, -5)).toBe(0)
  })

  it('extractValue matches by name and label', () => {
    const values = [{ name: 'OverallScoreX100', value: 350 }]
    const result = ExecutiveReportsSecurityCultureScore.methods.extractValue.call(
      {},
      values,
      ['OverallScoreX100']
    )
    expect(result).toBe(350)
  })

  it('normalizeWidgetDatas handles different payload shapes', () => {
    expect(
      ExecutiveReportsSecurityCultureScore.methods.normalizeWidgetDatas.call({}, [{ widgetDatas: [1] }])
    ).toEqual([1])
    expect(
      ExecutiveReportsSecurityCultureScore.methods.normalizeWidgetDatas.call({}, { widgetDatas: [2] })
    ).toEqual([2])
  })

  it('applyWidgetData sets empty state on invalid payload', () => {
    const ctx = {
      isEmpty: false,
      normalizeWidgetDatas: ExecutiveReportsSecurityCultureScore.methods.normalizeWidgetDatas,
      setScoreData: jest.fn()
    }
    ExecutiveReportsSecurityCultureScore.methods.applyWidgetData.call(ctx, null)
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const ctx = { $emit: jest.fn() }
    ExecutiveReportsSecurityCultureScore.methods.handleDelete.call(ctx)
    ExecutiveReportsSecurityCultureScore.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete')
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit')
  })
})
