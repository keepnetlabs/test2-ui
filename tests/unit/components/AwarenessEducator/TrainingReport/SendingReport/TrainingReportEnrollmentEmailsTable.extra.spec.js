import TrainingReportEnrollmentEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportEnrollmentEmailsTable.vue'

describe('TrainingReportEnrollmentEmailsTable.vue (extra)', () => {
  it('getTargetUserStatusDisplay returns status or empty string', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({
        targetUserStatus: 'Active'
      })
    ).toBe('Active')
    expect(TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({})).toBe('')
  })

  it('isRowTypeDeleted handles case/whitespace and non-deleted values', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.isRowTypeDeleted({
        targetUserStatus: '  Deleted  '
      })
    ).toBe(true)
    expect(
      TrainingReportEnrollmentEmailsTable.methods.isRowTypeDeleted({
        targetUserStatus: 'Active'
      })
    ).toBe(false)
  })

  it('getDeletedRowClassName returns deleted row class only for deleted users', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(
        TrainingReportEnrollmentEmailsTable.methods,
        { row: { targetUserStatus: 'Deleted' } }
      )
    ).toContain('deleted-row')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(
        TrainingReportEnrollmentEmailsTable.methods,
        { row: { targetUserStatus: 'Active' } }
      )
    ).toBe('')
  })

  it('getDeletedRowCellClass returns class except on targetUserStatus column', () => {
    const ctx = TrainingReportEnrollmentEmailsTable.methods
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'email' }
      })
    ).toBe('training-report-enrollment__deleted-row-cell')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'targetUserStatus' }
      })
    ).toBe('')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx, {
        row: { targetUserStatus: 'Active' },
        column: { property: 'email' }
      })
    ).toBe('')
  })

  it('getDeletedRowTooltipText returns tooltip only for deleted non-status columns', () => {
    const ctx = TrainingReportEnrollmentEmailsTable.methods
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'department' }
      })
    ).toBe('This user has been deleted')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'targetUserStatus' }
      })
    ).toBe('')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: {}
      })
    ).toBe('')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Active' },
        column: { property: 'department' }
      })
    ).toBe('')
  })

  it('getEvents returns empty array when extended view data has no events', () => {
    const mapped = TrainingReportEnrollmentEmailsTable.computed.getEvents.call({
      extendedViewValue: [{}],
      getEventReason: jest.fn()
    })
    expect(mapped).toEqual([])
  })

  it('getNoEventMessage falls back to SMTP text when provider is empty', () => {
    const message = TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: []
    })
    expect(message).toBe('Event history is only available for SMTP')
  })

  it('customFields watcher inserts columns at start when department column is missing', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'email' }, { property: 'firstName' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.customFields.handler.call(ctx, [
      { name: 'Branch', fieldDataType: 'string' }
    ])
    expect(ctx.tableOptions.columns[0].property).toBe('Branch')
    expect(ctx.tableOptions.columns[1].property).toBe('email')
  })

  it('isScormProxy watcher keeps row actions unchanged when resend action is not present', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Details' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('deleted row helpers are safe with missing args', () => {
    const ctx = TrainingReportEnrollmentEmailsTable.methods
    expect(TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(ctx)).toBe('')
    expect(TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx)).toBe('')
    expect(TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx)).toBe('')
  })

  it('getTargetUserStatusDisplay returns empty for nullish status', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({
        targetUserStatus: null
      })
    ).toBe('')
    expect(TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay()).toBe('')
  })
})
