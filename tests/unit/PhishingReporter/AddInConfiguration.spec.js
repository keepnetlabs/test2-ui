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
  return {
    ...actual,
    isDifferent: jest.fn(() => false)
  }
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AddInConfiguration.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.APP_CONFIG = {
      VUE_APP_API_KEY: 'api-key',
      VUE_APP_PHISHING_REPORTER_URL: 'https://example.test/api'
    }
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('company-1')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('checkIfAnyStepChanged returns true when a step differs', () => {
    isDifferent
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)

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
    expect(result).toBe(true)
  })

  it('closeOverlay resets and closes directly when no change', () => {
    const emit = jest.fn()
    const ctx = {
      checkIfAnyStepChanged: () => false,
      resetValues: jest.fn(),
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }

    AddInConfiguration.methods.closeOverlay.call(ctx)
    expect(ctx.resetValues).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('changeAddInConfigurationStatus', false)
  })

  it('closeOverlay asks leaving dialog when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      checkIfAnyStepChanged: () => true,
      resetValues: jest.fn(),
      $emit: emit,
      $store: { dispatch }
    }

    AddInConfiguration.methods.closeOverlay.call(ctx)
    expect(dispatch).toHaveBeenCalled()
    expect(ctx.resetValues).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('changeAddInConfigurationStatus', false)
  })

  it('changeStep handles step1 validation and payload update', () => {
    const ctx = {
      step: 1,
      addingSettings: {},
      emailSettings: {},
      otherSettings: {},
      diagnosticTool: {},
      $refs: {
        refAddInSettings: { submit: jest.fn(() => ({ x: 1 })) },
        refEmailSettings: { submit: jest.fn() },
        refOtherSettings: { submit: jest.fn() },
        refDiagnosticTool: { formValues: {} }
      }
    }
    AddInConfiguration.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(2)
    expect(ctx.addingSettings).toEqual({ x: 1 })

    const invalidCtx = {
      ...ctx,
      step: 1,
      $refs: { ...ctx.$refs, refAddInSettings: { submit: jest.fn(() => null) } }
    }
    AddInConfiguration.methods.changeStep.call(invalidCtx, 1)
    expect(invalidCtx.step).toBe(1)
  })

  it('changeStep on step2 negates sendUsACopy', () => {
    const ctx = {
      step: 2,
      emailSettings: {},
      $refs: {
        refAddInSettings: { submit: jest.fn() },
        refEmailSettings: { submit: jest.fn(() => ({ sendUsACopy: true, mail: 'a' })) },
        refOtherSettings: { submit: jest.fn() },
        refDiagnosticTool: { formValues: {} }
      }
    }

    AddInConfiguration.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(3)
    expect(ctx.emailSettings).toEqual({ sendUsACopy: false, mail: 'a' })
  })

  it('handleContinue and resetValues update state properly', () => {
    const emit = jest.fn()
    const ctx = {
      showModal: true,
      addingSettings: { a: 1 },
      emailSettings: { b: 1 },
      otherSettings: { c: 1 },
      $emit: emit
    }
    AddInConfiguration.methods.handleContinue.call(ctx)
    expect(ctx.showModal).toBe(false)
    expect(emit).toHaveBeenCalledWith('getPhishingReport')

    AddInConfiguration.methods.resetValues.call(ctx)
    expect(ctx.addingSettings).toEqual({})
    expect(ctx.emailSettings).toEqual({})
    expect(ctx.otherSettings).toEqual({})
  })

  it('callForCreatePhishingReporter submits form data and updates state flags', async () => {
    const ctx = {
      isActionButtonDisabled: false,
      addingSettings: { reportAddress: 'r@example.com' },
      emailSettings: { sendUsACopy: true },
      otherSettings: { enableEnterpriseVault: true },
      diagnosticTool: { diagnosticToolLanguage: 'en' },
      showModal: false
    }

    AddInConfiguration.methods.callForCreatePhishingReporter.call(ctx)
    expect(ctx.isActionButtonDisabled).toBe(true)
    await flushPromises()

    expect(createPhishingReporter).toHaveBeenCalled()
    expect(ctx.showModal).toBe(true)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
