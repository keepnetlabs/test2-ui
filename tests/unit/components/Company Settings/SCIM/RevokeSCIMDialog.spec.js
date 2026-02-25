jest.mock('@/api/scimSettings', () => ({
  __esModule: true,
  revokeSCIMSetting: jest.fn(() =>
    Promise.resolve({
      data: {
        data: { token: 'tok-123' }
      }
    })
  )
}))

import RevokeSCIMDialog from '@/components/Company Settings/SCIM/RevokeSCIMDialog.vue'
import { revokeSCIMSetting } from '@/api/scimSettings'

describe('RevokeSCIMDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(RevokeSCIMDialog.name).toBe('RevokeSCIMDialog')
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    RevokeSCIMDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handleRevoke revokes setting and emits token', async () => {
    const ctx = {
      selectedRow: { resourceId: 'scim-2' },
      isActionButtonDisabled: false,
      handleClose: jest.fn(),
      $emit: jest.fn()
    }

    RevokeSCIMDialog.methods.handleRevoke.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(revokeSCIMSetting).toHaveBeenCalledWith('scim-2')
    expect(ctx.handleClose).toHaveBeenCalled()
    expect(ctx.$emit).toHaveBeenCalledWith('on-success-revoke', 'tok-123')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
