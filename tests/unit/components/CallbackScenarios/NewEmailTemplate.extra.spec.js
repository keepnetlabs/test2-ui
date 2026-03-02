import NewEmailTemplate from '@/components/CallbackScenarios/NewEmailTemplate.vue'

jest.mock('@/api/callback', () => ({
  getEmailTemplate: jest.fn(),
  getMergeTags: jest.fn(),
  createEmailTemplate: jest.fn(),
  updateEmailTemplate: jest.fn()
}))

jest.mock('@/api/file', () => ({
  parseEmailOrMessageFile: jest.fn()
}))

const CallbackService = require('@/api/callback').default

describe('NewEmailTemplate.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('changeNewEmailTemplateModalStatus', () => {
    it('emits close directly when form unchanged', () => {
      const emit = jest.fn()
      const ctx = {
        formValues: { name: 'Same' },
        initialFormValues: { name: 'Same' },
        $emit: emit,
        $store: { dispatch: jest.fn() }
      }
      NewEmailTemplate.methods.changeNewEmailTemplateModalStatus.call(ctx)
      expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
      expect(ctx.$store.dispatch).not.toHaveBeenCalled()
    })

    it('dispatches leaving dialog when form changed', () => {
      const emit = jest.fn()
      const dispatch = jest.fn()
      const ctx = {
        formValues: { name: 'Changed' },
        initialFormValues: { name: 'Original' },
        $emit: emit,
        $store: { dispatch }
      }
      NewEmailTemplate.methods.changeNewEmailTemplateModalStatus.call(ctx)
      expect(dispatch).toHaveBeenCalledWith('common/setIsShowLeavingDialog', expect.any(Object))
      const callback = dispatch.mock.calls[0][1].callback
      callback()
      expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
    })
  })

  describe('nextStep', () => {
    it('increments step when form valid and refMakeAvailableFor absent', () => {
      const ctx = {
        step: 1,
        $refs: {
          refFormStep1: { validate: jest.fn().mockReturnValue(true) },
          refMakeAvailableFor: null
        },
        availableForRequests: []
      }
      NewEmailTemplate.methods.nextStep.call(ctx)
      expect(ctx.step).toBe(2)
    })

    it('calls scrollToComponent when validation fails', () => {
      const scrollIntoView = jest.fn()
      const mockEl = { scrollIntoView }
      const ctx = {
        step: 1,
        $refs: {
          refFormStep1: {
            validate: jest.fn().mockReturnValue(false),
            $el: { querySelector: jest.fn().mockReturnValue(mockEl) }
          },
          refMakeAvailableFor: null
        }
      }
      NewEmailTemplate.methods.nextStep.call(ctx)
      expect(ctx.step).toBe(1)
      expect(scrollIntoView).toHaveBeenCalled()
    })

    it('increments step when refMakeAvailableFor present and valid', () => {
      const ctx = {
        step: 1,
        $refs: {
          refFormStep1: { validate: jest.fn().mockReturnValue(true) },
          refMakeAvailableFor: {
            validateAvailableFor: jest.fn(),
            isAvailableForValid: true
          }
        },
        availableForRequests: [{ id: 1 }]
      }
      NewEmailTemplate.methods.nextStep.call(ctx)
      expect(ctx.step).toBe(2)
      expect(ctx.$refs.refMakeAvailableFor.validateAvailableFor).toHaveBeenCalledWith([
        { id: 1 }
      ])
    })

    it('does not increment when refMakeAvailableFor invalid', () => {
      const scrollIntoView = jest.fn()
      const ctx = {
        step: 1,
        $refs: {
          refFormStep1: {
            validate: jest.fn().mockReturnValue(true),
            $el: { querySelector: jest.fn().mockReturnValue({ scrollIntoView }) }
          },
          refMakeAvailableFor: {
            validateAvailableFor: jest.fn(),
            isAvailableForValid: false
          }
        },
        availableForRequests: []
      }
      NewEmailTemplate.methods.nextStep.call(ctx)
      expect(ctx.step).toBe(1)
      expect(scrollIntoView).toHaveBeenCalled()
    })
  })

  describe('backStep', () => {
    it('decrements step by 1', () => {
      const ctx = { step: 2 }
      NewEmailTemplate.methods.backStep.call(ctx)
      expect(ctx.step).toBe(1)
    })
  })

  describe('handleUploadEmailButtonClick', () => {
    it('does not throw when refInputFileUpload is missing', () => {
      const ctx = { $refs: {} }
      expect(() =>
        NewEmailTemplate.methods.handleUploadEmailButtonClick.call(ctx)
      ).not.toThrow()
    })
  })

  describe('setActiveBlockManagerComponents', () => {
    it('populates activeBlockManagerComponents from tags containing merge tags', () => {
      const ctx = {
        activeBlockManagerComponents: {},
        getTagsComponent: jest.fn((item) => `Label:${item}`)
      }
      const tags = ['{X}', '{PHISHING_CODE}', '{PHISHING_CALLBACK_PHONE}']
      NewEmailTemplate.methods.setActiveBlockManagerComponents.call(ctx, [...tags])
      expect(ctx.getTagsComponent).toHaveBeenCalled()
      expect(Object.keys(ctx.activeBlockManagerComponents).length).toBeGreaterThan(0)
    })

    it('handles empty activeComponent', () => {
      const ctx = {
        activeBlockManagerComponents: {},
        getTagsComponent: jest.fn((item) => item)
      }
      NewEmailTemplate.methods.setActiveBlockManagerComponents.call(ctx, [])
      expect(ctx.activeBlockManagerComponents).toEqual({})
    })
  })

  describe('handleAttachmentRemove', () => {
    it('splices at index when single attachment', () => {
      const ctx = {
        formValues: {
          attachmentFiles: [{ name: 'single.eml' }],
          attachmentFilesFromApi: [{ name: 'a' }],
          importedEmailAttachments: [{ name: 'a' }]
        }
      }
      NewEmailTemplate.methods.handleAttachmentRemove.call(ctx, {
        item: { fileName: 'single.eml' },
        index: 1
      })
      expect(ctx.formValues.importedEmailAttachments).toHaveLength(0)
    })

    it('splices at index when multiple attachments', () => {
      const ctx = {
        formValues: {
          attachmentFiles: [{ name: 'a' }, { name: 'b' }],
          attachmentFilesFromApi: [{ name: 'a' }, { name: 'b' }],
          importedEmailAttachments: [{ name: 'a' }, { name: 'b' }]
        }
      }
      NewEmailTemplate.methods.handleAttachmentRemove.call(ctx, {
        item: { fileName: 'b' },
        index: 1
      })
      expect(ctx.formValues.importedEmailAttachments).toHaveLength(1)
    })
  })

  describe('validateAvailableFor', () => {
    it('emits validation with true when value has length', () => {
      const emit = jest.fn()
      const ctx = { $emit: emit }
      NewEmailTemplate.methods.validateAvailableFor.call(ctx, [{ id: 1 }])
      expect(ctx.isAvailableForValidated).toBe(true)
      expect(ctx.isAvailableForValid).toBe(true)
      expect(emit).toHaveBeenCalledWith('validation', true)
    })

    it('emits validation with false when value empty', () => {
      const emit = jest.fn()
      const ctx = { $emit: emit }
      NewEmailTemplate.methods.validateAvailableFor.call(ctx, [])
      expect(ctx.isAvailableForValid).toBe(false)
      expect(emit).toHaveBeenCalledWith('validation', false)
    })

    it('handles default value param as empty object', () => {
      const emit = jest.fn()
      const ctx = { $emit: emit }
      NewEmailTemplate.methods.validateAvailableFor.call(ctx)
      expect(ctx.isAvailableForValid).toBe(false)
      expect(emit).toHaveBeenCalledWith('validation', false)
    })
  })

  describe('handleCloseWarningModal', () => {
    it('sets isWarningModalVisible to false', () => {
      const ctx = { isWarningModalVisible: true }
      NewEmailTemplate.methods.handleCloseWarningModal.call(ctx)
      expect(ctx.isWarningModalVisible).toBe(false)
    })
  })
})
