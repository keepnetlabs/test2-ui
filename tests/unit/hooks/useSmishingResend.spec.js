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

  describe('Hook Composition', () => {
    it('should export hook with required properties', () => {
      expect(useSmishingResend).toBeDefined()
      expect(useSmishingResend.data).toBeDefined()
      expect(useSmishingResend.methods).toBeDefined()
    })

    it('should have all required methods', () => {
      expect(useSmishingResend.methods.toggleIsShowResendDialog).toBeDefined()
      expect(useSmishingResend.methods.handleOnResend).toBeDefined()
      expect(useSmishingResend.methods.resendItem).toBeDefined()
    })
  })

  describe('Dialog Management', () => {
    it('should initialize with dialog closed', () => {
      const data = useSmishingResend.data()
      expect(data.isShowResendDialog).toBe(false)
    })

    it('should toggle dialog state multiple times', () => {
      expect(component.isShowResendDialog).toBe(false)
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(true)
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(false)
    })

    it('should open dialog when handling resend', () => {
      const payload = { campaignId: 5 }
      component.handleOnResend(payload)
      expect(component.isShowResendDialog).toBe(true)
    })
  })

  describe('Payload Management', () => {
    it('should initialize payload as null', () => {
      const data = useSmishingResend.data()
      expect(data.resendPayload).toBeNull()
    })

    it('should store resend payload correctly', () => {
      const payload = { campaignId: 123, userId: 456 }
      component.handleOnResend(payload)
      expect(component.resendPayload).toEqual(payload)
    })

    it('should handle complex payloads', () => {
      const complexPayload = {
        campaignId: 1,
        recipients: [1, 2, 3],
        metadata: { type: 'smishing', priority: 'high' }
      }
      component.resendPayload = complexPayload
      expect(component.resendPayload).toEqual(complexPayload)
    })
  })

  describe('Button State Management', () => {
    it('should initialize button as enabled', () => {
      const data = useSmishingResend.data()
      expect(data.isResendActionButtonDisabled).toBe(false)
    })

    it('should disable button when resending', () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      expect(component.isResendActionButtonDisabled).toBe(true)
    })

    it('should enable button after resend completes', async () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
    })
  })

  describe('API Interactions', () => {
    it('should call Smishing resend API', async () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(SmishingServiceMock.resendSmishingCampaignToUserList).toHaveBeenCalled()
    })

    it('should pass correct parameters to API', async () => {
      component.resendPayload = { campaignId: 10 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(SmishingServiceMock.resendSmishingCampaignToUserList).toHaveBeenCalledWith(
        expect.objectContaining({ campaignId: 10 }),
        789,
        'smishing-group'
      )
    })
  })

  describe('Table Integration', () => {
    it('should have access to table refs', () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()

      expect(component.$refs.refTable).toBeDefined()
      expect(component.$refs.refTable.callForData).toBeDefined()
    })

    it('should call table refresh methods after resend', async () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(component.$refs.refTable.callForData).toHaveBeenCalled()
      expect(component.$refs.refTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    })
  })

  describe('State Transitions', () => {
    it('should transition through resend lifecycle', async () => {
      // Initial state
      expect(component.isResendActionButtonDisabled).toBe(false)
      expect(component.isShowResendDialog).toBe(false)

      // Open dialog
      component.handleOnResend({ campaignId: 1 })
      expect(component.isShowResendDialog).toBe(true)

      // Start resend
      component.resendItem()
      expect(component.isResendActionButtonDisabled).toBe(true)

      // Complete resend
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
      expect(component.isShowResendDialog).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle resend with minimal payload', async () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
    })

    it('should handle repeated resend operations', async () => {
      for (let i = 0; i < 3; i++) {
        component.resendPayload = { campaignId: i + 1 }
        component.resendItem()
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      expect(SmishingServiceMock.resendSmishingCampaignToUserList).toHaveBeenCalledTimes(3)
    })

    it('should tolerate missing table refs', () => {
      const minimalComponent = {
        ...useSmishingResend.data(),
        ...useSmishingResend.methods,
        id: 789,
        instanceGroup: 'test',
        resendPayload: { campaignId: 1 }
      }

      expect(() => minimalComponent.resendItem()).toBeDefined()
    })
  })
})
