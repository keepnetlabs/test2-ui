import EmailDetailsSenderIpBlacklistCheck from '@/components/IncidentResponder/EmailDetails/EmailDetailsSenderIpBlacklistCheck.vue'

describe('EmailDetailsSenderIpBlacklistCheck.vue', () => {
  const { methods, created } = EmailDetailsSenderIpBlacklistCheck

  it('created sets tableData from first ip analysis list', () => {
    const ctx = {
      mailDetails: {
        ips: [{ analysisList: [{ result: 'Clean' }, { result: 'Phishing' }] }]
      },
      tableData: []
    }

    created.call(ctx)

    expect(ctx.tableData).toEqual([{ result: 'Clean' }, { result: 'Phishing' }])
  })

  it('callForEmailDetails emits refresh event', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    methods.callForEmailDetails.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-refresh-click')
  })
})
