import CallbackScenarioPreview from '@/components/CallbackScenarios/CallbackScenarioPreview.vue'
import CallbackService from '@/api/callback'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackScenarioPreview: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackScenarioPreview.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title and subtitle return expected values', () => {
    expect(CallbackScenarioPreview.computed.getTitle.call({})).toBe('Callback Scenario Preview')
    expect(
      CallbackScenarioPreview.computed.getSubtitle.call({ selectedRow: { name: 'Scenario A' } })
    ).toBe('Scenario A')
  })

  it('setLoading toggles loading state', () => {
    const ctx = { isLoading: false }
    CallbackScenarioPreview.methods.setLoading.call(ctx, true)
    expect(ctx.isLoading).toBe(true)
    CallbackScenarioPreview.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    CallbackScenarioPreview.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('handlePreviousTemplate and handleNextTemplate update selected index', () => {
    const ctx = { selectedLandingPageIndex: 1 }
    CallbackScenarioPreview.methods.handlePreviousTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(0)
    CallbackScenarioPreview.methods.handleNextTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(1)
  })

  it('callForData maps api response to preview state', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((cb) => {
      cb()
      return 1
    })
    CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
      data: {
        data: {
          emailTemplate: {
            template: '<html>mail</html>',
            fromName: 'Keepnet',
            fromAddress: 'test@keepnet.com',
            name: 'Email Name',
            difficultyResourceId: 'mT0CeYGgKsVb',
            phishingFileName: 'file.pdf',
            subject: 'Subject'
          },
          callbackTemplate: {
            vishingLanguageResourceId: 'lang-1',
            steps: [
              { text: 'invalid' },
              { text: 'greeting' },
              { text: 'step-1' }
            ]
          }
        }
      }
    })
    const ctx = {
      selectedRow: { resourceId: 'scenario-1' },
      languages: [{ resourceId: 'lang-1', language: 'English', name: 'Amy', voiceProviderTypeId: 2 }],
      setLoading: CallbackScenarioPreview.methods.setLoading,
      isLoading: false,
      emailTemplateParams: {},
      callbackTemplateParams: {},
      emailTemplate: null,
      isTextToSpeechCompatible: false,
      timeoutId: ''
    }

    CallbackScenarioPreview.methods.callForData.call(ctx)
    await flushPromises()

    expect(CallbackService.getCallbackScenarioPreview).toHaveBeenCalledWith('scenario-1')
    expect(ctx.emailTemplate).toBe('<html>mail</html>')
    expect(ctx.emailTemplateParams).toEqual(
      expect.objectContaining({
        fromName: 'Keepnet',
        fromAddress: 'test@keepnet.com',
        name: 'Email Name',
        subject: 'Subject',
        attachment: { name: 'file.pdf' }
      })
    )
    expect(ctx.callbackTemplateParams.language).toBe('English')
    expect(ctx.callbackTemplateParams.voice).toBe('Amy')
    expect(ctx.callbackTemplateParams.invalidDialingNotice).toEqual({ text: 'invalid' })
    expect(ctx.callbackTemplateParams.callGreeting).toEqual({ text: 'greeting' })
    expect(ctx.isTextToSpeechCompatible).toBe(true)
    expect(ctx.isLoading).toBe(false)

    setTimeoutSpy.mockRestore()
  })
})
