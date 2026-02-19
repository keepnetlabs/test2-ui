import IncidentResponderHeaderCards from '@/components/IncidentResponder/Dashboard/IncidentResponderHeaderCards.vue'

describe('IncidentResponderHeaderCards.vue', () => {
  const { computed, methods } = IncidentResponderHeaderCards

  it('computes phishing reporter summary counts and empty state', () => {
    const base = {
      irSummary: {
        phishingReporterUserStatusCount: {
          onlineUsersCount: 3,
          offlineUsersCount: 7
        }
      }
    }

    expect(computed.isPhishingEmpty.call(base)).toBe(false)
    expect(computed.getPhishingReporterOnlineUserCount.call(base)).toBe(3)
    expect(computed.getPhishingReporterTotalUserCount.call(base)).toBe(10)
    expect(computed.isPhishingEmpty.call({ irSummary: {} })).toBe(true)
  })

  it('computes investigation and roi summary values', () => {
    const ctx = {
      irSummary: {
        investigationTypeCount: {
          automaticInvestigationCount: 4,
          manualInvestigationCount: 2
        },
        roiSummary: {
          time: '6',
          revenue: '1200'
        },
        notifiedEmailResultCount: {
          harmfulCount: 5,
          reportedMailCount: 8
        }
      }
    }

    expect(computed.isInvestigationsEmpty.call(ctx)).toBe(true)
    expect(computed.getAutomaticInvestigationCount.call(ctx)).toBe(4)
    expect(computed.getManuelInvestigationCount.call(ctx)).toBe(2)
    expect(computed.isRoiSummaryEmpty.call(ctx)).toBe(false)
    expect(computed.getROISummaryTime.call(ctx)).toBe('6')
    expect(computed.getROISummaryRevenue.call(ctx)).toBe('1200')
    expect(computed.getIncidentAnalysisNotifiedHarmfulCount.call(ctx)).toBe(5)
    expect(computed.getIncidentAnalysisNotifiedReportedMailCount.call(ctx)).toBe(8)
  })

  it('toggleROIDialog toggles visibility and optionally refreshes data', () => {
    const callForData = jest.fn()
    const ctx = {
      isShowRoi: false,
      callForData
    }

    methods.toggleROIDialog.call(ctx, false)
    expect(ctx.isShowRoi).toBe(true)
    expect(callForData).not.toHaveBeenCalled()

    methods.toggleROIDialog.call(ctx, true)
    expect(ctx.isShowRoi).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData toggles loading around store dispatch', async () => {
    const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))
    const dispatch = jest.fn(() => Promise.resolve())
    const ctx = {
      incidentLoading: false,
      $store: { dispatch }
    }

    methods.callForData.call(ctx)
    expect(ctx.incidentLoading).toBe(true)

    await flushPromises()
    expect(dispatch).toHaveBeenCalledWith('investigations/getIrSummary')
    expect(ctx.incidentLoading).toBe(false)
  })

  it('addQuery updates container style for medium widths and resets for others', () => {
    const originalInnerWidth = window.innerWidth
    const cardNodes = [{ style: '' }, { style: '' }]
    const columnsRow = { style: '' }
    const nav = { style: { width: '250px' } }

    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === 'nav.page-nav') return nav
      if (selector === '.columns-row') return columnsRow
      return null
    })
    const querySelectorAllSpy = jest
      .spyOn(document, 'querySelectorAll')
      .mockReturnValue(cardNodes)

    window.innerWidth = 1001
    methods.addQuery.call({})
    expect(columnsRow.style).toBe('flex-wrap:wrap;')

    window.innerWidth = 1400
    methods.addQuery.call({})
    expect(columnsRow.style).toBe('')

    querySelectorSpy.mockRestore()
    querySelectorAllSpy.mockRestore()
    window.innerWidth = originalInnerWidth
  })
})
