import EmailDetailsContentDetails from '@/components/IncidentResponder/EmailDetails/EmailDetailsContentDetails.vue'

describe('EmailDetailsContentDetails.vue', () => {
  const { methods, computed } = EmailDetailsContentDetails

  it('formats to/cc/bcc fields from arrays', () => {
    const ctx = {
      mailDetails: {
        to: ['a@x.com', 'b@x.com'],
        cc: ['c@x.com'],
        bcc: ['d@x.com']
      }
    }

    expect(computed.getMailDetailsTo.call(ctx)).toBe('a@x.com, b@x.com')
    expect(computed.getMailDetailsCc.call(ctx)).toBe('c@x.com')
    expect(computed.getMailDetailsBcc.call(ctx)).toBe('d@x.com')
  })

  it('getResourceId returns route param id', () => {
    const ctx = {
      $route: { params: { id: 'mail-11' } }
    }

    expect(computed.getResourceId.call(ctx)).toBe('mail-11')
  })

  it('isReAnalyzeDisabled follows status and permission', () => {
    expect(
      computed.isReAnalyzeDisabled.call({
        mailDetails: { status: 'BeingAnalyzed' },
        getIncidentResponderNotifiedEmailReAnalyze: true
      })
    ).toBe(true)
    expect(
      computed.isReAnalyzeDisabled.call({
        mailDetails: { status: 'Done' },
        getIncidentResponderNotifiedEmailReAnalyze: false
      })
    ).toBe(true)
    expect(
      computed.isReAnalyzeDisabled.call({
        mailDetails: { status: 'Done' },
        getIncidentResponderNotifiedEmailReAnalyze: true
      })
    ).toBe(false)
  })

  it('toggleShowReAnalyzeDialog and handleReAnalyze toggle dialog state', () => {
    const ctx = {
      showReAnalyzeIncidentDialog: false,
      toggleShowReAnalyzeDialog: methods.toggleShowReAnalyzeDialog
    }

    methods.handleReAnalyze.call(ctx)
    expect(ctx.showReAnalyzeIncidentDialog).toBe(true)

    methods.toggleShowReAnalyzeDialog.call(ctx)
    expect(ctx.showReAnalyzeIncidentDialog).toBe(false)
  })
})
