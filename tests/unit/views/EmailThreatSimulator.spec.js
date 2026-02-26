import EmailThreatSimulator from '@/views/EmailThreatSimulator.vue'

describe('EmailThreatSimulator.vue', () => {
  it('has correct component name and default tab', () => {
    expect(EmailThreatSimulator.name).toBe('EMailThreatSimulator')
    expect(EmailThreatSimulator.data().tab).toBe('scans')
  })

  it('created sets attacksVectors tab when scans permission is missing', () => {
    const ctx = {
      tab: 'scans',
      getEtsQuickScanPermissionSearch: false,
      getEtsAttackVectorPermissionSearch: true
    }
    EmailThreatSimulator.created.call(ctx)
    expect(ctx.tab).toBe('attacksVectors')
  })

  it('created keeps scans tab when quick scan permission exists', () => {
    const ctx = {
      tab: 'scans',
      getEtsQuickScanPermissionSearch: true,
      getEtsAttackVectorPermissionSearch: false
    }
    EmailThreatSimulator.created.call(ctx)
    expect(ctx.tab).toBe('scans')
  })

  it('created keeps current tab when both permissions are same truthiness', () => {
    const ctxBothTrue = {
      tab: 'scans',
      getEtsQuickScanPermissionSearch: true,
      getEtsAttackVectorPermissionSearch: true
    }
    EmailThreatSimulator.created.call(ctxBothTrue)
    expect(ctxBothTrue.tab).toBe('scans')

    const ctxBothFalse = {
      tab: 'scans',
      getEtsQuickScanPermissionSearch: false,
      getEtsAttackVectorPermissionSearch: false
    }
    EmailThreatSimulator.created.call(ctxBothFalse)
    expect(ctxBothFalse.tab).toBe('scans')
  })

  it('changeTabStatus updates tab', () => {
    const ctx = { tab: 'scans' }
    EmailThreatSimulator.methods.changeTabStatus.call(ctx, 'attacksVectors')
    expect(ctx.tab).toBe('attacksVectors')
  })

  it('beforeRouteLeave blocks when scans modal open', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: { refScans: { modalStatus: true, checkIfCanCLoseNewModal: closeFn } }
    }

    EmailThreatSimulator.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave blocks when attack vectors modal open', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refScans: { modalStatus: false },
        refAttacksVectors: { modalStatus: true, checkIfCanCLoseNewModal: closeFn }
      }
    }

    EmailThreatSimulator.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave allows navigation when no modal blockers', () => {
    const next = jest.fn()
    EmailThreatSimulator.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
