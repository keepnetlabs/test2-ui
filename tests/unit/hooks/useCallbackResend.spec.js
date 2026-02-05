import { useResend } from '@/hooks/useCallbackResend'

jest.mock('@/api/callback', () => ({
  resendCampaignToUsers: jest.fn().mockResolvedValue({})
}))

describe('useCallbackResend Hook (useResend)', () => {
  let CallbackService
  let component

  beforeEach(() => {
    jest.clearAllMocks()
    CallbackService = require('@/api/callback')

    component = {
      id: 123,
      instanceGroup: 'test-group',
      ...useResend.data(),
      ...useResend.methods,
      $refs: {
        refTable: {
          callForData: jest.fn()
        }
      }
    }
  })

  describe('data()', () => {
    it('should initialize with correct default values', () => {
      const data = useResend.data()
      expect(data.isShowResendDialog).toBe(false)
      expect(data.resendPayload).toBeNull()
      expect(data.isResendActionButtonDisabled).toBe(false)
    })
  })

  describe('methods', () => {
    describe('toggleIsShowResendDialog()', () => {
      it('should toggle isShowResendDialog from false to true', () => {
        expect(component.isShowResendDialog).toBe(false)
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(true)
      })

      it('should toggle isShowResendDialog from true to false', () => {
        component.isShowResendDialog = true
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(false)
      })

      it('should toggle multiple times', () => {
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(true)
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(false)
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(true)
      })
    })

    describe('handleOnResend()', () => {
      it('should set resendPayload and toggle dialog', () => {
        const payload = { campaignId: 1, message: 'test' }
        component.handleOnResend(payload)

        expect(component.resendPayload).toEqual(payload)
        expect(component.isShowResendDialog).toBe(true)
      })

      it('should handle different payload objects', () => {
        const payload1 = { id: 1 }
        component.handleOnResend(payload1)
        expect(component.resendPayload).toEqual(payload1)

        component.isShowResendDialog = false
        const payload2 = { id: 2, data: 'test' }
        component.handleOnResend(payload2)
        expect(component.resendPayload).toEqual(payload2)
        expect(component.isShowResendDialog).toBe(true)
      })
    })

    describe('resendItem()', () => {
      it('should disable button during resend', () => {
        expect(component.isResendActionButtonDisabled).toBe(false)
        component.resendItem()
        expect(component.isResendActionButtonDisabled).toBe(true)
      })

      it('should call CallbackService.resendCampaignToUsers with correct parameters', async () => {
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(CallbackService.resendCampaignToUsers).toHaveBeenCalledWith(
          component.id,
          component.instanceGroup,
          component.resendPayload
        )
      })

      it('should toggle dialog on successful resend', async () => {
        component.isShowResendDialog = true
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isShowResendDialog).toBe(false)
      })

      it('should call refTable.callForData on successful resend', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.callForData).toHaveBeenCalled()
      })

      it('should re-enable button after resend completes', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        expect(component.isResendActionButtonDisabled).toBe(true)

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isResendActionButtonDisabled).toBe(false)
      })

      it('should handle null payload gracefully', async () => {
        component.resendPayload = null
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(CallbackService.resendCampaignToUsers).toHaveBeenCalledWith(
          component.id,
          component.instanceGroup,
          null
        )
      })
    })
  })
})
