import MicrosoftTeamsSettings from '@/components/Company Settings/MicrosoftTeamsSettings/MicrosoftTeamsSettings.vue'
import MicrosoftTeamsSettingsService from '@/api/microsoftTeamsSettings'
import { copyToClipboard } from '@/utils/functions'

jest.mock('@/api/microsoftTeamsSettings', () => ({
  __esModule: true,
  default: {
    getMicrosoftTeamsSettings: jest.fn(),
    getMicrosoftTeamsOboIntegrationLink: jest.fn(),
    callMicrosoftTeamsOboCallback: jest.fn(),
    callMicrosoftTeamsAppCallback: jest.fn(),
    disableMicrosoftTeamsIntegration: jest.fn(),
    uploadMicrosoftTeamsSettings: jest.fn(),
    getMicrosoftTeamsAppAuthorizeLink: jest.fn(),
    installMicrosoftTeamsAppToUsers: jest.fn(),
    sendTestMessage: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    copyToClipboard: jest.fn(() => Promise.resolve(true))
  }
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('MicrosoftTeamsSettings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(MicrosoftTeamsSettings.name).toBe('MicrosoftTeamsSettings')
  })

  it('computed button styles respect disabled and loading states', () => {
    const saveDisabledStyle = MicrosoftTeamsSettings.computed.getSaveButtonStyle.call({
      isSaveDisabled: true
    })
    expect(saveDisabledStyle.pointerEvents).toBe('none')
    expect(saveDisabledStyle.opacity).toBe(0.5)

    const updateStyle = MicrosoftTeamsSettings.computed.getUpdateButtonStyle.call({
      isLastVersion: true,
      isSaveDisabled: false
    })
    expect(updateStyle.opacity).toBe(0.5)

    const sendStyle = MicrosoftTeamsSettings.computed.getSendTestMessageButtonStyle.call({
      isTestMessageLoading: true
    })
    expect(sendStyle.maxWidth).toBe('120px')
  })

  it('computed setup texts switch by isTestError state', () => {
    expect(
      MicrosoftTeamsSettings.computed.getRequiredSetupTitleText.call({ isTestError: false })
    ).toBe('Teams Policy Test Verification')
    expect(
      MicrosoftTeamsSettings.computed.getRequiredSetupTitleText.call({ isTestError: true })
    ).toContain('Verification Failed')

    expect(
      MicrosoftTeamsSettings.computed.getRequiredSetupInstructionsText.call({ isTestError: false })
    ).toBe('Setup Instructions:')
    expect(
      MicrosoftTeamsSettings.computed.getRequiredSetupInstructionsText.call({ isTestError: true })
    ).toBe('Suggested Fixes:')
  })

  it('created calls callback methods by route query shape', () => {
    const codeCtx = {
      $route: { query: { code: 'c1', state: 's1' } },
      callMicrosoftTeamsOboCallback: jest.fn(),
      callMicrosoftTeamsAppCallback: jest.fn(),
      getMicrosoftTeamsSettings: jest.fn()
    }
    MicrosoftTeamsSettings.created.call(codeCtx)
    expect(codeCtx.callMicrosoftTeamsOboCallback).toHaveBeenCalledWith('c1', 's1')

    const appCtx = {
      $route: { query: { admin_consent: '1', tenant: 't1', scope: 'scope' } },
      callMicrosoftTeamsOboCallback: jest.fn(),
      callMicrosoftTeamsAppCallback: jest.fn(),
      getMicrosoftTeamsSettings: jest.fn()
    }
    MicrosoftTeamsSettings.created.call(appCtx)
    expect(appCtx.callMicrosoftTeamsAppCallback).toHaveBeenCalledWith('1', 't1', 'scope')
  })

  it('created handles error query by dispatching snackbar and replacing route', () => {
    const ctx = {
      $route: {
        query: {
          admin_consent: '1',
          error: 'denied',
          error_description: 'desc',
          state: 's1'
        }
      },
      $store: { dispatch: jest.fn() },
      $router: { replace: jest.fn() },
      getMicrosoftTeamsSettings: jest.fn()
    }

    MicrosoftTeamsSettings.created.call(ctx)

    expect(ctx.getMicrosoftTeamsSettings).toHaveBeenCalled()
    expect(ctx.$store.dispatch).toHaveBeenCalled()
    expect(ctx.$router.replace).toHaveBeenCalledWith('/company/company-settings?')
  })

  it('getMicrosoftTeamsSettings maps response fields and opens modal on callback', async () => {
    MicrosoftTeamsSettingsService.getMicrosoftTeamsSettings.mockResolvedValue({
      data: {
        data: {
          neededAction: 'retryAppConsent',
          isFound: true,
          displayName: 'Keepnet Bot',
          installedVersion: '1.0.0',
          latestAvailableVersion: '1.1.0'
        }
      }
    })
    const ctx = {
      loading: false,
      isStep2: false,
      isMicrosoftTeamsActive: false,
      botName: '',
      isLastVersion: false,
      isModalVisible: false
    }

    MicrosoftTeamsSettings.methods.getMicrosoftTeamsSettings.call(ctx, true)
    await flushPromises()

    expect(ctx.loading).toBe(false)
    expect(ctx.isStep2).toBe(true)
    expect(ctx.isMicrosoftTeamsActive).toBe(false)
    expect(ctx.botName).toBe('Keepnet Bot')
    expect(ctx.isLastVersion).toBe(false)
    expect(ctx.isModalVisible).toBe(true)
  })

  it('handleSubmit exits early on latest version and otherwise uploads then refreshes', async () => {
    const earlyCtx = { isLastVersion: true, isSaveDisabled: false }
    MicrosoftTeamsSettings.methods.handleSubmit.call(earlyCtx)
    expect(MicrosoftTeamsSettingsService.uploadMicrosoftTeamsSettings).not.toHaveBeenCalled()

    MicrosoftTeamsSettingsService.uploadMicrosoftTeamsSettings.mockResolvedValue({})
    MicrosoftTeamsSettingsService.installMicrosoftTeamsAppToUsers.mockResolvedValue({})
    const ctx = {
      isLastVersion: false,
      isSaveDisabled: false,
      getMicrosoftTeamsSettings: jest.fn()
    }
    MicrosoftTeamsSettings.methods.handleSubmit.call(ctx)
    await flushPromises()

    expect(MicrosoftTeamsSettingsService.uploadMicrosoftTeamsSettings).toHaveBeenCalled()
    expect(MicrosoftTeamsSettingsService.installMicrosoftTeamsAppToUsers).toHaveBeenCalled()
    expect(ctx.getMicrosoftTeamsSettings).toHaveBeenCalled()
    expect(ctx.isSaveDisabled).toBe(false)
  })

  it('handleSendTestMessage covers invalid, success, and error flows', async () => {
    const invalidCtx = {
      $refs: { refFormTestMessage: { validate: jest.fn(() => false) } }
    }
    MicrosoftTeamsSettings.methods.handleSendTestMessage.call(invalidCtx)
    expect(MicrosoftTeamsSettingsService.sendTestMessage).not.toHaveBeenCalled()

    MicrosoftTeamsSettingsService.sendTestMessage.mockResolvedValueOnce({})
    const successCtx = {
      $refs: { refFormTestMessage: { validate: jest.fn(() => true) } },
      isTestMessageLoading: false,
      isTestError: true,
      isTestEmailSent: false,
      testEmail: 'user@company.com'
    }
    MicrosoftTeamsSettings.methods.handleSendTestMessage.call(successCtx)
    await flushPromises()
    expect(successCtx.isTestError).toBe(false)
    expect(successCtx.isTestEmailSent).toBe(true)
    expect(successCtx.isTestMessageLoading).toBe(false)

    MicrosoftTeamsSettingsService.sendTestMessage.mockRejectedValueOnce({
      response: { data: { message: 'failed to send' } }
    })
    const errorCtx = {
      $refs: { refFormTestMessage: { validate: jest.fn(() => true) } },
      isTestMessageLoading: false,
      isTestError: false,
      isTestEmailSent: false,
      testErrorMessage: '',
      testEmail: 'user@company.com'
    }
    MicrosoftTeamsSettings.methods.handleSendTestMessage.call(errorCtx)
    await flushPromises()
    expect(errorCtx.isTestError).toBe(true)
    expect(errorCtx.testErrorMessage).toBe('failed to send')
    expect(errorCtx.isTestMessageLoading).toBe(false)
  })

  it('handleCopyErrorMessage copies only when message exists', () => {
    MicrosoftTeamsSettings.methods.handleCopyErrorMessage.call({ testErrorMessage: '' })
    expect(copyToClipboard).not.toHaveBeenCalled()

    MicrosoftTeamsSettings.methods.handleCopyErrorMessage.call({ testErrorMessage: 'err' })
    expect(copyToClipboard).toHaveBeenCalledWith('err')
  })
})
