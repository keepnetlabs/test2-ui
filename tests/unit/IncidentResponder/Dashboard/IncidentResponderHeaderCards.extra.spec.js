import IncidentResponderHeaderCards from '@/components/IncidentResponder/Dashboard/IncidentResponderHeaderCards.vue'

describe('IncidentResponderHeaderCards.vue (extra branch coverage)', () => {
  const { computed, methods } = IncidentResponderHeaderCards

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
})
