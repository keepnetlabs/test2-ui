import Settings from '@/components/PhishingReporter/Settings/Settings.vue'
import {
  createGraphAccount,
  createPhishingReporter,
  updateApplicationLevelAccount
} from '@/api/phishingReporter'

jest.mock('@/api/phishingReporter', () => ({
  __esModule: true,
  createGraphAccount: jest.fn(),
  createPhishingReporter: jest.fn(),
  updateApplicationLevelAccount: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PhishingReporter Settings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(Settings.name).toBe('Settings')
  })

  it('changeTabStatus, activateLoader and getFormDataValue behave as expected', () => {
    const ctx = {
      tab: 'x',
      $store: { dispatch: jest.fn() }
    }
    Settings.methods.changeTabStatus.call(ctx, 'phishing-reporter-settings-email-settings')
    expect(ctx.tab).toBe('phishing-reporter-settings-email-settings')

    Settings.methods.activateLoader.call(ctx, 2)
    expect(ctx.$store.dispatch).toHaveBeenCalledWith('common/activateLoader', 2)

    expect(Settings.methods.getFormDataValue.call(ctx, null)).toBe('')
    expect(Settings.methods.getFormDataValue.call(ctx, 'value')).toBe('value')
  })

  it('created handles error callback query and opens download modal', () => {
    const ctx = {
      $route: { query: { error: 'access_denied', error_description: 'denied' } },
      $store: { dispatch: jest.fn() },
      $router: { replace: jest.fn() },
      formData: {}
    }
    Settings.created.call(ctx)

    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'denied' })
    )
    expect(ctx.downloadAddInModalStatus).toBe(true)
    expect(ctx.$router.replace).not.toHaveBeenCalled()
  })

  it('created handles admin consent callback and updates app-level access', async () => {
    updateApplicationLevelAccount.mockResolvedValue({})
    const ctx = {
      $route: { query: { admin_consent: '1', scope: 'x', tenant: 'tenant-1' } },
      $store: { dispatch: jest.fn() },
      $router: { replace: jest.fn() },
      formData: { isAppPermissionAccessGranted: false }
    }

    Settings.created.call(ctx)
    await flushPromises()

    expect(updateApplicationLevelAccount).toHaveBeenCalledWith(true)
    expect(ctx.formData.isAppPermissionAccessGranted).toBe(true)
    expect(ctx.downloadAddInModalStatus).toBe(true)
    expect(ctx.$router.replace).toHaveBeenCalledWith('/phishing-reporter')
  })

  it('created handles tenant callback without admin consent', async () => {
    createGraphAccount.mockResolvedValue({})
    const ctx = {
      $route: { query: { tenant: 'tenant-2' } },
      $store: { dispatch: jest.fn() },
      $router: { replace: jest.fn() },
      formData: { isGraphAccountConnected: false }
    }

    Settings.created.call(ctx)
    await flushPromises()

    expect(createGraphAccount).toHaveBeenCalledWith({ tenantId: 'tenant-2' })
    expect(ctx.formData.isGraphAccountConnected).toBe(true)
    expect(ctx.downloadAddInModalStatus).toBe(true)
    expect(ctx.$router.replace).toHaveBeenCalledWith('/phishing-reporter')
  })

  it('callForCreatePhishingReporter merges refs and finalizes add-in flow', async () => {
    globalThis.APP_CONFIG = {}
    createPhishingReporter.mockResolvedValue({})
    const emit = jest.fn()
    const ctx = {
      saveDisable: false,
      saveButtonDisabled: false,
      downloadAddInModalStatus: false,
      formData: { dialogBoxSettings: [], file: { name: 'logo.png' } },
      $emit: emit,
      $refs: {
        refAddinSettings: { getFormValues: () => ({ addInName: 'Reporter' }) },
        refEmailSettings: { getFormValues: () => ({ enableExternalMailing: true }) },
        refOtherSettings: { getFormValues: () => ({}) },
        refDiagnosticTool: { getFormValues: () => ({}) }
      },
      activateLoader: jest.fn(),
      getFormDataValue: Settings.methods.getFormDataValue
    }

    Settings.methods.callForCreatePhishingReporter.call(ctx, { isAddIn: true })
    await flushPromises()

    expect(createPhishingReporter).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('getPhishingReport')
    expect(ctx.activateLoader).toHaveBeenCalledWith(-1)
    expect(ctx.downloadAddInModalStatus).toBe(true)
    expect(ctx.saveDisable).toBe(false)
  })
})
