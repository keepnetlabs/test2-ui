jest.mock('@/utils/functions', () => ({
  __esModule: true,
  copyToClipboard: jest.fn(() => Promise.resolve(true))
}))

import SCIMSuccessDialog from '@/components/Company Settings/SCIM/SCIMSuccessDialog.vue'
import { copyToClipboard } from '@/utils/functions'

describe('SCIMSuccessDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(SCIMSuccessDialog.name).toBe('SCIMSuccessDialog')
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    SCIMSuccessDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handleCopyToClipboard closes dialog when copied', async () => {
    const ctx = {
      apiKey: 'api-key-1',
      handleClose: jest.fn()
    }
    SCIMSuccessDialog.methods.handleCopyToClipboard.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(copyToClipboard).toHaveBeenCalledWith('api-key-1')
    expect(ctx.handleClose).toHaveBeenCalled()
  })

  it('handleCopyToClipboard does not close when copy fails', async () => {
    copyToClipboard.mockResolvedValueOnce(false)
    const ctx = {
      apiKey: 'api-key-2',
      handleClose: jest.fn()
    }
    SCIMSuccessDialog.methods.handleCopyToClipboard.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.handleClose).not.toHaveBeenCalled()
  })
})
