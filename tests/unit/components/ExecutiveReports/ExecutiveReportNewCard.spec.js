import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'

describe('ExecutiveReportNewCard.vue', () => {
  it('has expected component name', () => {
    expect(ExecutiveReportNewCard.name).toBe('ExecutiveReportNewCard')
  })

  it('getIsStatic handles preview route logic', () => {
    const previewCtx = {
      $route: { name: 'Preview Executive Report' },
      editMode: true,
      forcePreview: false,
      isPreview: true,
      activatePreview: false
    }
    const nonPreviewCtx = {
      $route: { name: 'Executive Reports' },
      editMode: true,
      forcePreview: false,
      isPreview: false,
      activatePreview: false,
      get isShowPreview() {
        return ExecutiveReportNewCard.computed.isShowPreview.call(this)
      }
    }

    expect(ExecutiveReportNewCard.computed.getIsStatic.call(previewCtx)).toBe(false)
    expect(ExecutiveReportNewCard.computed.getIsStatic.call(nonPreviewCtx)).toBe(false)
  })

  it('toggleShowScheduleReportDialog and toggleShowDownloadModal update state', () => {
    const ctx = {
      isShowScheduleReportDialog: false,
      isShowDownloadModal: false,
      $route: { params: {} },
      $router: { push: jest.fn() }
    }

    ExecutiveReportNewCard.methods.toggleShowScheduleReportDialog.call(ctx)
    expect(ctx.isShowScheduleReportDialog).toBe(true)

    ExecutiveReportNewCard.methods.toggleShowDownloadModal.call(ctx)
    expect(ctx.isShowDownloadModal).toBe(true)
  })

  it('routeToExecutiveReports routes scheduled and default flows', () => {
    const scheduledCtx = {
      $route: { params: { isFromScheduledReport: true } },
      $router: { push: jest.fn() }
    }
    const normalCtx = {
      $route: { params: {} },
      $router: { push: jest.fn() }
    }

    ExecutiveReportNewCard.methods.routeToExecutiveReports.call(scheduledCtx)
    ExecutiveReportNewCard.methods.routeToExecutiveReports.call(normalCtx)

    expect(scheduledCtx.$router.push).toHaveBeenCalledWith({ name: 'Scheduled Reports' })
    expect(normalCtx.$router.push).toHaveBeenCalledWith('/reports/executive-reports')
  })
})
