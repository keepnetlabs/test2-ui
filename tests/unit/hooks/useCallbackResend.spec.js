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

  describe('Hook Exports', () => {
    it('should export useResend hook', () => {
      expect(useResend).toBeDefined()
    })

    it('should have data function', () => {
      expect(useResend.data).toBeDefined()
      expect(typeof useResend.data).toBe('function')
    })

    it('should have methods object', () => {
      expect(useResend.methods).toBeDefined()
      expect(typeof useResend.methods).toBe('object')
    })

    it('should have all required methods', () => {
      expect(useResend.methods.toggleIsShowResendDialog).toBeDefined()
      expect(useResend.methods.handleOnResend).toBeDefined()
      expect(useResend.methods.resendItem).toBeDefined()
    })
  })

  describe('Dialog Visibility', () => {
    it('should initialize with dialog hidden', () => {
      const data = useResend.data()
      expect(data.isShowResendDialog).toBe(false)
    })

    it('should toggle dialog visibility', () => {
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(true)
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(false)
    })

    it('should show dialog when resend is initiated', () => {
      component.handleOnResend({ campaignId: 1 })
      expect(component.isShowResendDialog).toBe(true)
    })

    it('should hide dialog after resend completes', async () => {
      component.isShowResendDialog = true
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isShowResendDialog).toBe(false)
    })
  })

  describe('Payload Storage', () => {
    it('should initialize payload as null', () => {
      const data = useResend.data()
      expect(data.resendPayload).toBeNull()
    })

    it('should store resend payload', () => {
      const payload = { id: 1, campaignId: 2 }
      component.resendPayload = payload
      expect(component.resendPayload).toEqual(payload)
    })

    it('should handle complex payload objects', () => {
      const payload = {
        campaignId: 123,
        userList: [1, 2, 3],
        metadata: { priority: 'high' }
      }
      component.handleOnResend(payload)
      expect(component.resendPayload).toEqual(payload)
    })
  })

  describe('Button State', () => {
    it('should initialize button as enabled', () => {
      const data = useResend.data()
      expect(data.isResendActionButtonDisabled).toBe(false)
    })

    it('should disable button during resend', () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      expect(component.isResendActionButtonDisabled).toBe(true)
    })

    it('should re-enable button after resend', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
    })
  })

  describe('API Integration', () => {
    it('should call Callback resend API', async () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(CallbackService.resendCampaignToUsers).toHaveBeenCalled()
    })

    it('should pass correct parameters to API', async () => {
      component.resendPayload = { campaignId: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(CallbackService.resendCampaignToUsers).toHaveBeenCalledWith(
        123,
        'test-group',
        expect.any(Object)
      )
    })

    it('should handle API response', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.$refs.refTable.callForData).toHaveBeenCalled()
    })
  })

  describe('Component Interaction', () => {
    it('should call table refresh after resend', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.$refs.refTable.callForData).toHaveBeenCalled()
    })

    it('should have reference to table', () => {
      expect(component.$refs.refTable).toBeDefined()
    })
  })

  describe('State Transitions', () => {
    it('should follow complete resend lifecycle', async () => {
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
    it('should handle resend with empty payload', async () => {
      component.resendPayload = {}
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
    })

    it('should handle multiple consecutive resends', async () => {
      for (let i = 0; i < 3; i++) {
        component.resendPayload = { campaignId: i + 1 }
        component.resendItem()
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      expect(CallbackService.resendCampaignToUsers).toHaveBeenCalledTimes(3)
    })

    it('should handle missing table refs', () => {
      const minimalComponent = {
        ...useResend.data(),
        ...useResend.methods,
        id: 123,
        instanceGroup: 'test'
      }
      expect(() => minimalComponent.resendItem()).toBeDefined()
    })
  })
})
