import CallbackScenarios from '@/views/CallbackScenarios.vue'
import CallbackService from '@/api/callback'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackTemplateLanguages: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackScenarios.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created sets tab based on permissions and calls language API loader', () => {
    const callForLanguages = jest.fn()
    const ctxTemplates = {
      tab: 'scenarios',
      callForLanguages,
      getCallbackScenariosSearchPermissions: false,
      getCallbackTemplatesSearchPermissions: true,
      getCallbackEmailTemplatesSearchPermissions: false
    }
    CallbackScenarios.created.call(ctxTemplates)
    expect(callForLanguages).toHaveBeenCalled()
    expect(ctxTemplates.tab).toBe('emailTemplates')

    const ctxCallbackTemplates = {
      tab: 'scenarios',
      callForLanguages,
      getCallbackScenariosSearchPermissions: false,
      getCallbackTemplatesSearchPermissions: false,
      getCallbackEmailTemplatesSearchPermissions: true
    }
    CallbackScenarios.created.call(ctxCallbackTemplates)
    expect(ctxCallbackTemplates.tab).toBe('callbackTemplates')
  })

  it('callForLanguages maps response data into languages', async () => {
    CallbackService.getCallbackTemplateLanguages.mockResolvedValueOnce({ data: { data: [{ id: 'l-1' }] } })
    const ctx = { languages: [] }

    CallbackScenarios.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.languages).toEqual([{ id: 'l-1' }])
  })

  it('changeTabStatus and no-template handlers switch tabs and trigger modal openers', () => {
    const ctx = {
      tab: 'scenarios',
      $refs: {
        refTemplates: { changeNewEmailTemplateModalStatus: jest.fn() },
        refEmailTemplates: { changeNewEmailTemplateModalStatus: jest.fn() }
      },
      $nextTick: (cb) => cb()
    }

    CallbackScenarios.methods.changeTabStatus.call(ctx, 'emailTemplates')
    expect(ctx.tab).toBe('emailTemplates')

    CallbackScenarios.methods.handleNoMessageTemplate.call(ctx)
    expect(ctx.tab).toBe('callbackTemplates')
    expect(ctx.$refs.refTemplates.changeNewEmailTemplateModalStatus).toHaveBeenCalledWith(true, false)

    CallbackScenarios.methods.handleNoLandingPageTemplate.call(ctx)
    expect(ctx.tab).toBe('emailTemplates')
    expect(ctx.$refs.refEmailTemplates.changeNewEmailTemplateModalStatus).toHaveBeenCalledWith(true, false)
  })

  it('beforeRouteLeave covers blocking modal/fast-launch/grapes branches and allow branch', () => {
    const next = jest.fn()

    const scenarioModalCtx = {
      $refs: { refScenarios: { modalStatus: true, checkIfCanCLoseNewScenarioModal: jest.fn() } }
    }
    CallbackScenarios.beforeRouteLeave.call(scenarioModalCtx, {}, {}, next)
    expect(scenarioModalCtx.$refs.refScenarios.checkIfCanCLoseNewScenarioModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const fastLaunchCtx = {
      $refs: {
        refScenarios: {
          isShowFastLaunch: true,
          $refs: { fastLaunch: { isSubmitted: false } },
          checkIfCanCloseFastLaunchModal: jest.fn()
        }
      }
    }
    CallbackScenarios.beforeRouteLeave.call(fastLaunchCtx, {}, {}, next)
    expect(fastLaunchCtx.$refs.refScenarios.checkIfCanCloseFastLaunchModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const grapesCtx = {
      $refs: {
        refTemplates: {
          $refs: { newEmailTemplate: { $refs: { refEmailTemplate: { showGrapesModal: true } } } },
          checkIfCanCloseGrapesJSModal: jest.fn()
        }
      }
    }
    CallbackScenarios.beforeRouteLeave.call(grapesCtx, {}, {}, next)
    expect(grapesCtx.$refs.refTemplates.checkIfCanCloseGrapesJSModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const allowCtx = { $refs: {} }
    CallbackScenarios.beforeRouteLeave.call(allowCtx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
