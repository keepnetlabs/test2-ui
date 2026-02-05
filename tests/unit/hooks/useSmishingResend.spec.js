import { useSmishingResend } from '@/hooks/useSmishingResend'

jest.mock('@/api/smishing', () => ({
  resendSmishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('useSmishingResend Hook', () => {
  let SmishingServiceMock
  let component

  beforeEach(() => {
    jest.clearAllMocks()
    SmishingServiceMock = require('@/api/smishing')

    component = {
      id: 789,
      instanceGroup: 'smishing-group',
      ...useSmishingResend.data(),
      ...useSmishingResend.methods,
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
    it('should have correct initial state', () => {
      const data = useSmishingResend.data()
      expect(data).toEqual({
        isShowResendDialog: false,
        resendPayload: null,
        isResendActionButtonDisabled: false
      })
    })
  })

  describe('methods', () => {
    describe('toggleIsShowResendDialog()', () => {
      it('should toggle isShowResendDialog value', () => {
        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(true)

        component.toggleIsShowResendDialog()
        expect(component.isShowResendDialog).toBe(false)
      })
    })

    describe('handleOnResend()', () => {
      it('should set payload and open dialog', () => {
        const payload = { campaignId: 3 }
        component.handleOnResend(payload)

        expect(component.resendPayload).toBe(payload)
        expect(component.isShowResendDialog).toBe(true)
      })
    })

    describe('resendItem()', () => {
      it('should call SmishingService with correct parameters', async () => {
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(SmishingServiceMock.resendSmishingCampaignToUserList).toHaveBeenCalledWith(
          component.resendPayload,
          component.id,
          component.instanceGroup
        )
      })

      it('should disable button during resend', () => {
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        expect(component.isResendActionButtonDisabled).toBe(true)
      })

      it('should close dialog on success', async () => {
        component.isShowResendDialog = true
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isShowResendDialog).toBe(false)
      })

      it('should reset selectable params on success', async () => {
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
      })

      it('should call callForData on success', async () => {
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.callForData).toHaveBeenCalled()
      })

      it('should enable button in finally block', async () => {
        component.resendPayload = { campaignId: 1 }
        component.resendItem()

        expect(component.isResendActionButtonDisabled).toBe(true)

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isResendActionButtonDisabled).toBe(false)
      })
    })
  })
})
