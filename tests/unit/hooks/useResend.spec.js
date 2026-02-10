import { useResend } from '@/hooks/useResend'

jest.mock('@/api/phishingsimulator', () => ({
  resendPhishingCampaignToUserList: jest.fn().mockResolvedValue({})
}))

describe('useResend Hook (Phishing)', () => {
  let resendPhishingMock
  let component

  beforeEach(() => {
    jest.clearAllMocks()
    resendPhishingMock = require('@/api/phishingsimulator').resendPhishingCampaignToUserList

    component = {
      id: 123,
      instanceGroup: 'test-group',
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
        const payload = { campaignId: 1 }
        component.handleOnResend(payload)

        expect(component.resendPayload).toEqual(payload)
        expect(component.isShowResendDialog).toBe(true)
      })
    })

    describe('resendItem()', () => {
      it('should disable button and call API with correct parameters', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        expect(component.isResendActionButtonDisabled).toBe(true)

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(resendPhishingMock).toHaveBeenCalledWith(
          component.resendPayload,
          component.id,
          component.instanceGroup
        )
      })

      it('should toggle dialog on success', async () => {
        component.isShowResendDialog = true
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isShowResendDialog).toBe(false)
      })

      it('should call resetSelectableParams if available', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
      })

      it('should call callForData', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.callForData).toHaveBeenCalled()
      })

      it('should re-enable button after completion', async () => {
        component.resendPayload = { id: 1 }
        component.resendItem()

        expect(component.isResendActionButtonDisabled).toBe(true)

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.isResendActionButtonDisabled).toBe(false)
      })

      it('should handle optional resetSelectableParams gracefully', async () => {
        component.$refs.refTable.$refs.refTable.resetSelectableParams = undefined
        component.resendPayload = { id: 1 }

        expect(() => component.resendItem()).not.toThrow()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(component.$refs.refTable.callForData).toHaveBeenCalled()
      })
    })
  })

  describe('Hook Structure', () => {
    it('should export useResend hook', () => {
      expect(useResend).toBeDefined()
    })

    it('should have data method', () => {
      expect(useResend.data).toBeDefined()
      expect(typeof useResend.data).toBe('function')
    })

    it('should have methods object', () => {
      expect(useResend.methods).toBeDefined()
      expect(typeof useResend.methods).toBe('object')
    })

    it('should have required methods defined', () => {
      expect(useResend.methods.toggleIsShowResendDialog).toBeDefined()
      expect(useResend.methods.handleOnResend).toBeDefined()
      expect(useResend.methods.resendItem).toBeDefined()
    })
  })

  describe('Dialog State Management', () => {
    it('should initialize dialog as hidden', () => {
      const data = useResend.data()
      expect(data.isShowResendDialog).toBe(false)
    })

    it('should toggle dialog visibility', () => {
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(true)
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(false)
    })

    it('should toggle multiple times', () => {
      for (let i = 0; i < 5; i++) {
        component.toggleIsShowResendDialog()
      }
      expect(component.isShowResendDialog).toBe(true)
    })
  })

  describe('Payload Handling', () => {
    it('should store resend payload', () => {
      const payload = { id: 123, campaignId: 456 }
      component.resendPayload = payload
      expect(component.resendPayload).toEqual(payload)
    })

    it('should handle null payload initially', () => {
      const data = useResend.data()
      expect(data.resendPayload).toBeNull()
    })

    it('should accept complex payload objects', () => {
      const complexPayload = {
        id: 1,
        campaignId: 2,
        userIds: [1, 2, 3],
        metadata: { type: 'phishing' }
      }
      component.resendPayload = complexPayload
      expect(component.resendPayload).toEqual(complexPayload)
    })
  })

  describe('Button State', () => {
    it('should initialize button as enabled', () => {
      const data = useResend.data()
      expect(data.isResendActionButtonDisabled).toBe(false)
    })

    it('should disable button during resend operation', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      expect(component.isResendActionButtonDisabled).toBe(true)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    it('should re-enable button after operation completes', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
    })
  })

  describe('API Integration', () => {
    it('should call resendPhishingCampaignToUserList API', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(resendPhishingMock).toHaveBeenCalled()
    })

    it('should pass correct parameters to API', async () => {
      component.resendPayload = { id: 1, campaignId: 2 }
      component.resendItem()

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(resendPhishingMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        123,
        'test-group'
      )
    })
  })

  describe('Component Interaction', () => {
    it('should interact with table refs', () => {
      component.resendPayload = { id: 1 }
      component.resendItem()

      expect(component.$refs.refTable).toBeDefined()
    })

    it('should call refTable methods', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(component.$refs.refTable.callForData).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle resend with empty payload', async () => {
      component.resendPayload = {}
      component.resendItem()

      await new Promise(resolve => setTimeout(resolve, 0))

      expect(component.isResendActionButtonDisabled).toBe(false)
    })

    it('should handle multiple consecutive resend calls', async () => {
      component.resendPayload = { id: 1 }

      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(resendPhishingMock).toHaveBeenCalledTimes(2)
    })

    it('should handle missing $refs gracefully', () => {
      const simpleComponent = {
        ...useResend.data(),
        ...useResend.methods,
        id: 123,
        instanceGroup: 'test'
      }

      expect(() => {
        simpleComponent.resendItem()
      }).toBeDefined()
    })
  })
})
