import EmailDetailsContentDetails from '@/components/IncidentResponder/EmailDetails/EmailDetailsContentDetails.vue'

describe('EmailDetailsContentDetails.vue (extra branch coverage)', () => {
  const { computed, methods } = EmailDetailsContentDetails

  it('returns empty resource id when route param is missing', () => {
    expect(computed.getResourceId.call({ $route: { params: {} } })).toBe('')
  })

  it('returns undefined for to/cc/bcc when related fields are missing', () => {
    expect(computed.getMailDetailsTo.call({ mailDetails: {} })).toBeUndefined()
    expect(computed.getMailDetailsCc.call({ mailDetails: {} })).toBeUndefined()
    expect(computed.getMailDetailsBcc.call({ mailDetails: { bcc: ['x@y.com'] } })).toBeUndefined()
  })

  it('isReAnalyzeDisabled returns true for InProgress status', () => {
    const result = computed.isReAnalyzeDisabled.call({
      mailDetails: { status: 'InProgress' },
      getIncidentResponderNotifiedEmailReAnalyze: true
    })

    expect(result).toBe(true)
  })

  it('handleReAnalyze toggles dialog from true to false', () => {
    const ctx = {
      showReAnalyzeIncidentDialog: true,
      toggleShowReAnalyzeDialog: methods.toggleShowReAnalyzeDialog
    }

    methods.handleReAnalyze.call(ctx)

    expect(ctx.showReAnalyzeIncidentDialog).toBe(false)
  })
})
