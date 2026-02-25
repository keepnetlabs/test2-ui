import ExecutiveReportPhishingActivityTable from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPhishingActivity/ExecutiveReportPhishingActivityTable.vue'

describe('ExecutiveReportPhishingActivityTable.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportPhishingActivityTable.name).toBe('ExecutiveReportPhishingActivityTable')
  })

  it('currentColumns returns grouped and ungrouped columns', () => {
    const grouped = ExecutiveReportPhishingActivityTable.computed.currentColumns.call({
      isGrouped: true,
      groupedColumns: [1],
      ungroupedColumns: [2]
    })
    const ungrouped = ExecutiveReportPhishingActivityTable.computed.currentColumns.call({
      isGrouped: false,
      groupedColumns: [1],
      ungroupedColumns: [2]
    })
    expect(grouped).toEqual([1])
    expect(ungrouped).toEqual([2])
  })

  it('setTableData maps grouped rows', () => {
    const ctx = { isGrouped: true, tableData: [] }
    ExecutiveReportPhishingActivityTable.methods.setTableData.call(ctx, [
      { firstName: 'A', opened: 1, clicked: 2, attachmentOpened: 3, dataSubmitted: 4, reported: 5 }
    ])
    expect(ctx.tableData[0].reported).toBe(5)
  })

  it('setTableData maps ungrouped rows', () => {
    const ctx = { isGrouped: false, tableData: [] }
    ExecutiveReportPhishingActivityTable.methods.setTableData.call(ctx, [
      { firstName: 'A', campaignName: 'C', scenarioName: 'S', categoryName: 'Cat', difficulty: 'Hard', opened: 1, clicked: 2 }
    ])
    expect(ctx.tableData[0].campaignName).toBe('C')
    expect(ctx.tableData[0].difficulty).toBe('Hard')
  })

  it('handleGroupedClick enables grouping and resets unsupported sort', () => {
    const ctx = {
      isGrouped: false,
      groupedColumns: [{ property: 'firstName' }],
      axiosPayload: {
        groupByUser: false,
        orderBy: 'campaignName',
        ascending: false,
        filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'campaignName' }, { FieldName: 'firstName' }] }] }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    ExecutiveReportPhishingActivityTable.methods.handleGroupedClick.call(ctx)
    expect(ctx.isGrouped).toBe(true)
    expect(ctx.axiosPayload.groupByUser).toBe(true)
    expect(ctx.axiosPayload.orderBy).toBe('firstName')
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([{ FieldName: 'firstName' }])
  })
})
