import IncidentResponderHeaderCards from '@/components/IncidentResponder/Dashboard/IncidentResponderHeaderCards.vue'

describe('IncidentResponderHeaderCards.vue (extra branch coverage)', () => {
  const { computed, methods, created } = IncidentResponderHeaderCards

  it('isPhishingEmpty returns true when counts are zero', () => {
    const ctx = {
      irSummary: {
        phishingReporterUserStatusCount: {
          onlineUsersCount: 0,
          offlineUsersCount: 0
        }
      }
    }
    expect(computed.isPhishingEmpty.call(ctx)).toBe(true)
  })

  it('isNotifiedEmailEmpty handles missing and zero/non-zero reported counts', () => {
    expect(computed.isNotifiedEmailEmpty.call({ irSummary: {} })).toBe(true)
    expect(
      computed.isNotifiedEmailEmpty.call({
        irSummary: { notifiedEmailResultCount: { reportedMailCount: 0 } }
      })
    ).toBe(true)
    expect(
      computed.isNotifiedEmailEmpty.call({
        irSummary: { notifiedEmailResultCount: { reportedMailCount: 5 } }
      })
    ).toBe(false)
  })

  it('isInvestigationsEmpty returns false for empty keys and all-zero values', () => {
    expect(
      computed.isInvestigationsEmpty.call({
        irSummary: { investigationTypeCount: {} }
      })
    ).toBe(false)
    expect(
      computed.isInvestigationsEmpty.call({
        irSummary: {
          investigationTypeCount: { automaticInvestigationCount: 0, manualInvestigationCount: 0 }
        }
      })
    ).toBe(false)
  })

  it('isRoiSummaryEmpty returns true for default/missing roi summary', () => {
    expect(computed.isRoiSummaryEmpty.call({ irSummary: {} })).toBe(true)
    expect(
      computed.isRoiSummaryEmpty.call({
        irSummary: { roiSummary: { revenue: '0', time: '0' } }
      })
    ).toBe(true)
  })

  it('count getters fall back to zero when nested summary objects are missing', () => {
    expect(computed.getIncidentAnalysisNotifiedHarmfulCount.call({ irSummary: {} })).toBe(0)
    expect(computed.getIncidentAnalysisNotifiedReportedMailCount.call({ irSummary: {} })).toBe(0)
    expect(computed.getAutomaticInvestigationCount.call({ irSummary: {} })).toBe(0)
    expect(computed.getManuelInvestigationCount.call({ irSummary: {} })).toBe(0)
    expect(computed.getROISummaryTime.call({ irSummary: {} })).toBe(0)
    expect(computed.getROISummaryRevenue.call({ irSummary: {} })).toBe(0)
  })

  it('callForData resets loading even when store dispatch rejects', async () => {
    const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))
    const ctx = {
      incidentLoading: false,
      $store: {
        dispatch: jest.fn(() => Promise.reject(new Error('fail')))
      }
    }

    methods.callForData.call(ctx)
    expect(ctx.incidentLoading).toBe(true)
    await flushPromises()
    expect(ctx.incidentLoading).toBe(false)
  })

  it('addQuery does not throw when columns-row element is missing in else branch', () => {
    const originalInnerWidth = window.innerWidth
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === 'nav.page-nav') return { style: { width: '250px' } }
      if (selector === '.columns-row') return null
      return null
    })
    const querySelectorAllSpy = jest
      .spyOn(document, 'querySelectorAll')
      .mockReturnValue([{ style: '' }])

    window.innerWidth = 1400
    expect(() => methods.addQuery.call({})).not.toThrow()

    querySelectorSpy.mockRestore()
    querySelectorAllSpy.mockRestore()
    window.innerWidth = originalInnerWidth
  })

  it('created hook fetches data and subscribes to resize events', () => {
    const callForData = jest.fn()
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener').mockImplementation(() => {})
    const ctx = { callForData, addQuery: jest.fn() }

    created.call(ctx)

    expect(callForData).toHaveBeenCalledTimes(1)
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', ctx.addQuery)
    addEventListenerSpy.mockRestore()
  })

  it('beforeDestroy unsubscribes from resize events', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener').mockImplementation(() => {})
    const ctx = { addQuery: jest.fn() }

    IncidentResponderHeaderCards.beforeDestroy.call(ctx)

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', ctx.addQuery)
    removeEventListenerSpy.mockRestore()
  })
})
