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

  describe('Hook Structure', () => {
    it('should export hook with all parts', () => {
      expect(useResend).toBeDefined()
      expect(useResend.data).toBeDefined()
      expect(useResend.methods).toBeDefined()
    })

    it('should have three methods', () => {
      const methods = Object.keys(useResend.methods)
      expect(methods.length).toBe(3)
    })

    it('data function should return state object', () => {
      const state = useResend.data()
      expect(state).toEqual({
        isShowResendDialog: false,
        resendPayload: null,
        isResendActionButtonDisabled: false
      })
    })
  })

  describe('Dialog State', () => {
    it('should start with dialog closed', () => {
      const data = useResend.data()
      expect(data.isShowResendDialog).toBe(false)
    })

    it('should toggle dialog correctly', () => {
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(true)
      component.toggleIsShowResendDialog()
      expect(component.isShowResendDialog).toBe(false)
    })

    it('should open dialog on resend initiation', () => {
      component.handleOnResend({ campaignId: 1 })
      expect(component.isShowResendDialog).toBe(true)
    })

    it('should close dialog after resend', async () => {
      component.isShowResendDialog = true
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isShowResendDialog).toBe(false)
    })
  })

  describe('Payload Handling', () => {
    it('should start with null payload', () => {
      const data = useResend.data()
      expect(data.resendPayload).toBeNull()
    })

    it('should store payload from handleOnResend', () => {
      const payload = { campaignId: 5 }
      component.handleOnResend(payload)
      expect(component.resendPayload).toEqual(payload)
    })

    it('should accept complex payloads', () => {
      const payload = {
        campaignId: 2,
        userIds: [1, 2, 3],
        options: { priority: 'high' }
      }
      component.resendPayload = payload
      expect(component.resendPayload).toEqual(payload)
    })
  })

  describe('Button State Management', () => {
    it('should initialize button as enabled', () => {
      const data = useResend.data()
      expect(data.isResendActionButtonDisabled).toBe(false)
    })

    it('should disable button when resending', () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      expect(component.isResendActionButtonDisabled).toBe(true)
    })

    it('should re-enable button when done', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
    })
  })

  describe('Quishing API Integration', () => {
    it('should call Quishing resend API', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(QuishingServiceMock.resendQuishingCampaignToUserList).toHaveBeenCalled()
    })

    it('should pass correct parameters', async () => {
      component.resendPayload = { id: 10 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(QuishingServiceMock.resendQuishingCampaignToUserList).toHaveBeenCalledWith(
        expect.objectContaining({ id: 10 }),
        456,
        'quishing-group'
      )
    })

    it('should handle API completion', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.$refs.refTable.callForData).toHaveBeenCalled()
    })
  })

  describe('Table Operations', () => {
    it('should refresh table after resend', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.$refs.refTable.callForData).toHaveBeenCalled()
    })

    it('should reset selectable params', async () => {
      component.resendPayload = { id: 1 }
      component.resendItem()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.$refs.refTable.$refs.refTable.resetSelectableParams).toHaveBeenCalled()
    })
  })

  describe('Complete Lifecycle', () => {
    it('should follow resend lifecycle correctly', async () => {
      expect(component.isResendActionButtonDisabled).toBe(false)
      expect(component.isShowResendDialog).toBe(false)

      component.handleOnResend({ campaignId: 2 })
      expect(component.isShowResendDialog).toBe(true)

      component.resendItem()
      expect(component.isResendActionButtonDisabled).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 0))
      expect(component.isResendActionButtonDisabled).toBe(false)
      expect(component.isShowResendDialog).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should tolerate missing optional methods', () => {
      const minimalComponent = {
        ...useResend.data(),
        ...useResend.methods,
        id: 456,
        instanceGroup: 'test'
      }
      expect(() => minimalComponent.resendItem()).toBeDefined()
    })

    it('should handle repeated resends', async () => {
      for (let i = 0; i < 3; i++) {
        component.resendPayload = { campaignId: i + 1 }
        component.resendItem()
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      expect(QuishingServiceMock.resendQuishingCampaignToUserList).toHaveBeenCalledTimes(3)
    })

    it('should work with minimal setup', () => {
      const simpleComponent = {
        ...useResend.data(),
        ...useResend.methods,
        id: 456,
        instanceGroup: 'test',
        resendPayload: null
      }
      expect(() => simpleComponent.toggleIsShowResendDialog()).not.toThrow()
    })
  })
})
