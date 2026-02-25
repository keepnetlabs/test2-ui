import ExecutiveReportTrainingActivityTable from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportTrainingActivity/ExecutiveReportTrainingActivityTable.vue'

describe('ExecutiveReportTrainingActivityTable.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportTrainingActivityTable.name).toBe('ExecutiveReportTrainingActivityTable')
  })

  it('currentColumns returns grouped or ungrouped columns', () => {
    const grouped = ExecutiveReportTrainingActivityTable.computed.currentColumns.call({
      isGrouped: true,
      groupedColumns: [1],
      ungroupedColumns: [2]
    })
    const ungrouped = ExecutiveReportTrainingActivityTable.computed.currentColumns.call({
      isGrouped: false,
      groupedColumns: [1],
      ungroupedColumns: [2]
    })
    expect(grouped).toEqual([1])
    expect(ungrouped).toEqual([2])
  })

  it('setTableData maps grouped data', () => {
    const ctx = { isGrouped: true, tableData: [] }
    ExecutiveReportTrainingActivityTable.methods.setTableData.call(ctx, [
      { firstName: 'A', openedTrainingEmail: 1, clickedTrainingEmail: 2, completedCount: 3, notCompletedCount: 4 }
    ])
    expect(ctx.tableData[0].opened).toBe(1)
    expect(ctx.tableData[0].incomplete).toBe(4)
  })

  it('setTableData maps ungrouped data', () => {
    const ctx = { isGrouped: false, tableData: [] }
    ExecutiveReportTrainingActivityTable.methods.setTableData.call(ctx, [
      { firstName: 'A', enrollmentName: 'E', contentType: 'Video', trainingStatus: 'Completed', examScore: 90, isMainScore: true }
    ])
    expect(ctx.tableData[0].enrollmentName).toBe('E')
    expect(ctx.tableData[0].status).toBe('Completed')
  })

  it('handleListBulleted resets grouping and unsupported filters', () => {
    const ctx = {
      isGrouped: true,
      ungroupedColumns: [{ property: 'firstName' }],
      axiosPayload: {
        groupByUser: true,
        orderBy: 'completed',
        ascending: false,
        filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'completed' }, { FieldName: 'firstName' }] }] }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    ExecutiveReportTrainingActivityTable.methods.handleListBulleted.call(ctx)
    expect(ctx.isGrouped).toBe(false)
    expect(ctx.axiosPayload.groupByUser).toBe(false)
    expect(ctx.axiosPayload.orderBy).toBe('firstName')
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([{ FieldName: 'firstName' }])
  })

  it('getStatusColor and getStatusText map status values', () => {
    expect(ExecutiveReportTrainingActivityTable.methods.getStatusColor.call({}, 'Completed')).toBe('#217124')
    expect(ExecutiveReportTrainingActivityTable.methods.getStatusText.call({}, 'Not Completed')).toBe('Incomplete')
  })
})
