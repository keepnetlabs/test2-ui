jest.mock('@/api/awarenessEducator', () => ({
  resendTrainingToUserList: jest.fn()
}))

import AwarenessEducatorService from '@/api/awarenessEducator'
import { useResend } from '@/hooks/awareness-educator/useAwarenessResend'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useAwarenessResend', () => {
  const { data, methods } = useResend

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides default resend state', () => {
    expect(data()).toEqual({
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false
    })
  })

  it('handleOnResend sets payload and toggles dialog', () => {
    const payload = { users: ['1'] }
    const toggleIsShowResendDialog = jest.fn()
    const ctx = { resendPayload: null, toggleIsShowResendDialog }

    methods.handleOnResend.call(ctx, payload)

    expect(ctx.resendPayload).toEqual(payload)
    expect(toggleIsShowResendDialog).toHaveBeenCalledTimes(1)
  })

  it('resendItem calls api, refreshes table and resets state', async () => {
    AwarenessEducatorService.resendTrainingToUserList.mockResolvedValueOnce({})
    const callForData = jest.fn()
    const toggleIsShowResendDialog = jest.fn(function () {
      this.isShowResendDialog = !this.isShowResendDialog
    })
    const ctx = {
      id: 'training-1',
      resendPayload: { users: ['1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: false,
      toggleIsShowResendDialog,
      $refs: { refTable: { callForData } }
    }

    methods.resendItem.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.resendTrainingToUserList).toHaveBeenCalledWith(
      { users: ['1'] },
      'training-1'
    )
    expect(callForData).toHaveBeenCalledTimes(1)
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })
})
