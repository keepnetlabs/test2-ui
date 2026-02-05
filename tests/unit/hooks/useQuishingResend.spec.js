import { useResend } from '@/hooks/useQuishingResend'

jest.mock('@/api/quishing', () => ({
  resendQuishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('useResend Hook (Quishing)', () => {
  let QuishingServiceMock
  let component

  beforeEach(() => {
    jest.clearAllMocks()
    QuishingServiceMock = require('@/api/quishing')

    component = {
      id: 456,
      instanceGroup: 'quishing-group',
      ...useResend.data(),
      ...useResend.methods,
      $refs: {
        refTable: {
          callForData: jest.fn(),
          $refs: {
            refTable: {
              resetSelectableParams: jest.fn()
            }
          }
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
      it('should toggle dialog state', () => {
        expect(component.isShowResendDialog).toBe(false)
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(true)
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(false)
      })
    })

    describe('handleOnResend()', () => {
      it('should set payload and toggle dialog', () => {
        const payload = { campaignId: 2 }
        component.handleOnResend(payload)

        expect(component.resendPayload).toEqual(payload)
        expect(component.isShowResendDialog).toBe(true)
      })
    })

    describe('resendItem()', () => {
      it('should disable button during resend', () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        expect(component.isResendActionButtonDisabled).toBe(true)
      })

      it('should call QuishingService.resendQuishingCampaignToUserList with correct parameters', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(QuishingServiceMock.resendQuishingCampaignToUserList).toHaveBeenCalledWith(
          component.resendPayload,
          component.id,
          component.instanceGroup
        )
      })

      it('should toggle dialog on successful resend', async () => {
        component.isShowResendDialog = true
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isShowResendDialog).toBe(false)
      })

      it('should reset selectable params on success', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
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

        expect(QuishingServiceMock.resendQuishingCampaignToUserList).toHaveBeenCalledWith(
          null,
          component.id,
          component.instanceGroup
        )
      })

      it('should handle missing $refs gracefully', async () => {
        component.$refs.refTable.$refs.refTable.resetSelectableParams = undefined
        component.resendPayload = { id: 1 }

        expect(() => component.resendItem()).not.toThrow()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.callForData).toHaveBeenCalled()
      })
    })
  })
})
