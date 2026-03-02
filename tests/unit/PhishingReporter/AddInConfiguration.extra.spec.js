import AddInConfiguration from '@/components/PhishingReporter/AddInConfiguration.vue'
import { createPhishingReporter } from '@/api/phishingReporter'
import { isDifferent } from '@/utils/functions'

jest.mock('@/api/phishingReporter', () => ({
  createPhishingReporter: jest.fn(() => Promise.resolve()),
  downloadDiagnosticTool: jest.fn(),
  downloadOutlookAddIn: jest.fn(),
  generateDiagnosticTool: jest.fn(),
  generateOutlookAddIn: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return { ...actual, isDifferent: jest.fn(() => false) }
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AddInConfiguration.vue (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.APP_CONFIG = { VUE_APP_API_KEY: 'key', VUE_APP_PHISHING_REPORTER_URL: 'https://api.test' }
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('company-1')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('changeStep', () => {
    it('step 3 validates OtherSettings and advances on success', () => {
      const ctx = {
        step: 3,
        otherSettings: {},
        $refs: {
          refAddInSettings: { submit: jest.fn() },
          refEmailSettings: { submit: jest.fn() },
          refOtherSettings: { submit: jest.fn(() => ({ apiUrl: 'https://test.com' })) },
          refDiagnosticTool: { formValues: {} }
        }
      }
      AddInConfiguration.methods.changeStep.call(ctx, 1)
      expect(ctx.step).toBe(4)
      expect(ctx.otherSettings).toEqual({ apiUrl: 'https://test.com' })
    })

    it('step 3 does not advance when OtherSettings validation fails', () => {
      const ctx = {
        step: 3,
        otherSettings: {},
        $refs: {
          refAddInSettings: { submit: jest.fn() },
          refEmailSettings: { submit: jest.fn() },
          refOtherSettings: { submit: jest.fn(() => null) },
          refDiagnosticTool: { formValues: {} }
        }
      }
      AddInConfiguration.methods.changeStep.call(ctx, 1)
      expect(ctx.step).toBe(3)
    })

    it('step 4 gets diagnosticTool from formValues and advances', () => {
      const ctx = {
        step: 4,
        diagnosticTool: {},
        $refs: {
          refAddInSettings: { submit: jest.fn() },
          refEmailSettings: { submit: jest.fn() },
          refOtherSettings: { submit: jest.fn() },
          refDiagnosticTool: { formValues: { proxyMode: 0 } }
        }
      }
      AddInConfiguration.methods.changeStep.call(ctx, 1)
      expect(ctx.step).toBe(5)
      expect(ctx.diagnosticTool).toEqual({ proxyMode: 0 })
    })

    it('flag -1 decrements step even with validation error', () => {
      const ctx = {
        step: 2,
        $refs: {
          refAddInSettings: { submit: jest.fn() },
          refEmailSettings: { submit: jest.fn(() => null) },
          refOtherSettings: { submit: jest.fn() },
          refDiagnosticTool: { formValues: {} }
        }
      }
      AddInConfiguration.methods.changeStep.call(ctx, -1)
      expect(ctx.step).toBe(1)
    })
  })

  describe('submit', () => {
    it('does not call createPhishingReporter when OtherSettings validation fails', () => {
      const ctx = {
        $refs: {
          refOtherSettings: { submit: jest.fn(() => null) },
          refDiagnosticTool: { formValues: {} }
        }
      }
      AddInConfiguration.methods.submit.call(ctx)
      expect(createPhishingReporter).not.toHaveBeenCalled()
    })

    it('calls createPhishingReporter when OtherSettings validation passes', async () => {
      const callForCreatePhishingReporter = jest.fn()
      const ctx = {
        addingSettings: {},
        emailSettings: {},
        otherSettings: {},
        diagnosticTool: {},
        isActionButtonDisabled: false,
        showModal: false,
        callForCreatePhishingReporter,
        $refs: {
          refOtherSettings: { submit: jest.fn(() => ({})) },
          refDiagnosticTool: { formValues: { proxyMode: 0 } }
        }
      }
      AddInConfiguration.methods.submit.call(ctx)
      expect(ctx.diagnosticTool).toEqual({ proxyMode: 0 })
      expect(callForCreatePhishingReporter).toHaveBeenCalled()
    })
  })

  describe('getInitial handlers', () => {
    it('getInitialAddInSettings sets initialAddInSettings', () => {
      const ctx = { initialAddInSettings: null }
      AddInConfiguration.methods.getInitialAddInSettings.call(ctx, { addInName: 'Test' })
      expect(ctx.initialAddInSettings).toEqual({ addInName: 'Test' })
    })

    it('getInitialEmailSettings sets initialEmailSettings', () => {
      const ctx = { initialEmailSettings: null }
      AddInConfiguration.methods.getInitialEmailSettings.call(ctx, { to: 'a@b.com' })
      expect(ctx.initialEmailSettings).toEqual({ to: 'a@b.com' })
    })

    it('getInitialOtherSettings sets initialOtherSettings', () => {
      const ctx = { initialOtherSettings: null }
      AddInConfiguration.methods.getInitialOtherSettings.call(ctx, { apiUrl: 'https://x.com' })
      expect(ctx.initialOtherSettings).toEqual({ apiUrl: 'https://x.com' })
    })

    it('getInitialDiagnosticToolValues sets initialDiagnosticToolValues', () => {
      const ctx = { initialDiagnosticToolValues: null }
      AddInConfiguration.methods.getInitialDiagnosticToolValues.call(ctx, { proxyMode: 2 })
      expect(ctx.initialDiagnosticToolValues).toEqual({ proxyMode: 2 })
    })
  })

  describe('getFormValues handlers', () => {
    it('getEmailSettingsValues merges into addingSettings', () => {
      const ctx = { addingSettings: { a: 1 } }
      AddInConfiguration.methods.getEmailSettingsValues.call(ctx, { to: 'x@y.com' })
      expect(ctx.addingSettings).toEqual({ to: 'x@y.com' })
    })

    it('getAddinSettingsValues merges into emailSettings', () => {
      const ctx = { emailSettings: {} }
      AddInConfiguration.methods.getAddinSettingsValues.call(ctx, { addInName: 'Reporter' })
      expect(ctx.emailSettings).toEqual({ addInName: 'Reporter' })
    })

    it('getOtherSettingsValues merges into otherSettings', () => {
      const ctx = { otherSettings: {} }
      AddInConfiguration.methods.getOtherSettingsValues.call(ctx, { apiUrl: 'https://api.com' })
      expect(ctx.otherSettings).toEqual({ apiUrl: 'https://api.com' })
    })
  })

  describe('checkIfAnyStepChanged', () => {
    it('returns false when no step changed', () => {
      isDifferent.mockReturnValue(false)
      const ctx = {
        initialAddInSettings: { a: 1 },
        initialEmailSettings: { b: 1 },
        initialOtherSettings: { c: 1 },
        initialDiagnosticToolValues: { d: 1 },
        $refs: {
          refAddInSettings: { getCurrentValues: () => ({}) },
          refEmailSettings: { getCurrentValues: () => ({}) },
          refOtherSettings: { getCurrentValues: () => ({}) },
          refDiagnosticTool: { getCurrentValues: () => ({}) }
        }
      }
      const result = AddInConfiguration.methods.checkIfAnyStepChanged.call(ctx)
      expect(result).toBe(false)
    })

    it('returns true when AddInSettings changed', () => {
      isDifferent.mockReturnValueOnce(true)
      const ctx = {
        initialAddInSettings: {},
        $refs: {
          refAddInSettings: { getCurrentValues: () => ({}) },
          refEmailSettings: { getCurrentValues: () => ({}) },
          refOtherSettings: { getCurrentValues: () => ({}) },
          refDiagnosticTool: { getCurrentValues: () => ({}) }
        }
      }
      const result = AddInConfiguration.methods.checkIfAnyStepChanged.call(ctx)
      expect(result).toBe(true)
    })
  })

  describe('handleContinue', () => {
    it('closes modal and emits getPhishingReport', () => {
      const emit = jest.fn()
      const ctx = { showModal: true, $emit: emit }
      AddInConfiguration.methods.handleContinue.call(ctx)
      expect(ctx.showModal).toBe(false)
      expect(emit).toHaveBeenCalledWith('getPhishingReport')
    })
  })

  describe('resetValues', () => {
    it('clears addingSettings, emailSettings, otherSettings', () => {
      const ctx = {
        addingSettings: { a: 1 },
        emailSettings: { b: 1 },
        otherSettings: { c: 1 }
      }
      AddInConfiguration.methods.resetValues.call(ctx)
      expect(ctx.addingSettings).toEqual({})
      expect(ctx.emailSettings).toEqual({})
      expect(ctx.otherSettings).toEqual({})
    })
  })
})
