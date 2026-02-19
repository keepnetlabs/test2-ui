import GamificationReport from '@/views/GamificationReport.vue'

describe('GamificationReport.vue', () => {
  const { methods, computed } = GamificationReport

  it('getDatePayload returns current date payload fields', () => {
    const ctx = {
      axiosPayload: {
        datePeriod: 'LastMonth',
        startDate: '2026-01-01',
        endDate: '2026-01-31'
      }
    }

    expect(computed.getDatePayload.call(ctx)).toEqual({
      datePeriod: 'LastMonth',
      startDate: '2026-01-01',
      endDate: '2026-01-31'
    })
  })

  it('getDateRangeText builds range text from selectedDateRange', () => {
    const ctx = {
      selectedDateRange: ['2026-01-01 00:00', '2026-01-31 23:59']
    }

    expect(computed.getDateRangeText.call(ctx)).toBe('2026-01-01 - 2026-01-31')
  })

  it('getDateRangeText returns empty text for invalid values', () => {
    expect(computed.getDateRangeText.call({ selectedDateRange: null })).toBeUndefined()
    expect(computed.getDateRangeText.call({ selectedDateRange: ['2026-01-01'] })).toBeUndefined()
    expect(computed.getDateRangeText.call({ selectedDateRange: ['', ''] })).toBe('')
  })

  it('disabledDates blocks older than one year and future dates', () => {
    const tooOld = new Date()
    tooOld.setFullYear(tooOld.getFullYear() - 2)
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const validDate = new Date()

    expect(methods.disabledDates(tooOld)).toBe(true)
    expect(methods.disabledDates(tomorrow)).toBe(true)
    expect(methods.disabledDates(validDate)).toBe(false)
  })

  it('getBadgesForRow returns badges array or empty array', () => {
    const ctx = {
      getBadgesForUser: jest.fn((id) => (id === 'u1' ? [{ id: 1 }] : null))
    }

    expect(methods.getBadgesForRow.call(ctx, { targetUserResourceId: 'u1' })).toEqual([{ id: 1 }])
    expect(methods.getBadgesForRow.call(ctx, { targetUserResourceId: 'u2' })).toEqual([])
  })

  it('isBadgesLoadingForRow returns loading state only when no cache and loading active', () => {
    const ctx = {
      hasValidBadgesCache: jest.fn((id) => id === 'cached'),
      isBadgesCalculating: false,
      isBadgesFetching: true
    }

    expect(methods.isBadgesLoadingForRow.call(ctx, { targetUserResourceId: 'cached' })).toBe(false)
    expect(methods.isBadgesLoadingForRow.call(ctx, { targetUserResourceId: 'uncached' })).toBe(
      true
    )
    expect(methods.isBadgesLoadingForRow.call(ctx, {})).toBe(false)
  })

  it('handleSearchChange adds fullName OR filter and triggers data refresh', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { Condition: 'AND', FilterItems: [] },
            { Condition: 'OR', FilterItems: [{ FieldName: 'fullName', Value: 'old' }] }
          ]
        }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'email', Operator: 'Contains', Value: 'new-query' }]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    const orGroup = ctx.axiosPayload.filter.FilterGroups.find((g) => g.Condition === 'OR')
    expect(orGroup.FilterItems).toEqual([
      { FieldName: 'email', Operator: 'Contains', Value: 'new-query' },
      { FieldName: 'fullName', Operator: 'Contains', Value: 'new-query' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleSendWithAI and handleCloseSendWithAIDialog toggle dialog state correctly', () => {
    const ctx = {
      isSendWithAIDialogOpen: false,
      selectedRowForAI: null,
      sendWithAIOptions: { training: false, phishing: false }
    }
    const row = { targetUserResourceId: 'u-1' }

    methods.handleSendWithAI.call(ctx, row)
    expect(ctx.isSendWithAIDialogOpen).toBe(true)
    expect(ctx.selectedRowForAI).toEqual(row)
    expect(ctx.sendWithAIOptions).toEqual({ training: true, phishing: true })

    methods.handleCloseSendWithAIDialog.call(ctx)
    expect(ctx.isSendWithAIDialogOpen).toBe(false)
    expect(ctx.selectedRowForAI).toBe(null)
    expect(ctx.sendWithAIOptions).toEqual({ training: true, phishing: true })
  })
})
